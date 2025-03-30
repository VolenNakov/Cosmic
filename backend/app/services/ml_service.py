# backend/app/services/ml_service.py
import torch
import numpy as np
from PIL import Image
import torchvision.transforms as transforms # Correct import
import matplotlib.pyplot as plt
import matplotlib.cm
import io
import base64
import os # For checking file existence

# Import model and enable_dropout function
from app.models.ml.autoencoder import DropoutAutoencoder, enable_dropout
from app.config.settings import get_settings
from app.utils.logger import setup_logger
from app.utils.exceptions import ModelError, FileProcessingError

settings = get_settings()
logger = setup_logger("ml_service")

class MLService:
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        logger.info(f"Using device: {self.device}")
        self.model = self._load_model()
        # Define the transformations based on settings
        self.transform = transforms.Compose([
            transforms.Resize(settings.MODEL_INPUT_SIZE),
            transforms.ToTensor(),
            # Add normalization if your model was trained with it
            # transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        self.to_pil = transforms.ToPILImage()
        self.num_mc_samples = settings.NUM_MC_SAMPLES
        logger.info(f"ML Service initialized with {self.num_mc_samples} MC samples.")

    def _load_model(self):
        model_path = settings.MODEL_PATH
        logger.info(f"Attempting to load model from {model_path}")
        if not os.path.exists(model_path):
             logger.error(f"Model file not found at {model_path}")
             raise ModelError(f"Model file not found at {model_path}")
        try:
            # Instantiate the model architecture
            # Pass dropout_p if your saved state_dict doesn't include it implicitly
            # or if you want to ensure it matches the class definition
            model = DropoutAutoencoder(dropout_p=0.25) # Ensure dropout_p matches training if needed

            # Load the state dictionary
            model.load_state_dict(torch.load(model_path, map_location=self.device))
            model.to(self.device)

            # Set to evaluation mode initially (important for batchnorm, etc.)
            model.eval()
            # Explicitly enable dropout layers for MC inference AFTER setting eval mode
            enable_dropout(model)

            logger.info("Model loaded successfully and dropout enabled for inference.")
            return model
        except FileNotFoundError:
            logger.error(f"Model file not found at {model_path}")
            raise ModelError(f"Model file not found at {model_path}")
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}", exc_info=True)
            raise ModelError(f"Failed to load model: {str(e)}")

    def _encode_image_to_base64(self, pil_image):
        logger.debug("Encoding PIL image to base64 PNG string.")
        try:
            buffered = io.BytesIO()
            pil_image.save(buffered, format="PNG")
            img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
            logger.debug("Image successfully encoded.")
            return img_str
        except Exception as e:
            logger.error(f"Error encoding image to base64: {str(e)}", exc_info=True)
            # Don't raise ModelError here, let process_image handle it
            raise FileProcessingError(f"Failed to encode image result: {str(e)}")

    def _create_uncertainty_heatmap(self, variance_map_tensor):
        logger.debug("Creating uncertainty heatmap from variance tensor.")
        try:
            # Ensure tensor is on CPU and convert to numpy
            variance_map_np = variance_map_tensor.detach().cpu().numpy()

            # Normalize the variance map to [0, 1] for colormap
            min_val = np.min(variance_map_np)
            max_val = np.max(variance_map_np)
            if max_val > min_val:
                normalized_map = (variance_map_np - min_val) / (max_val - min_val)
            else:
                normalized_map = np.zeros_like(variance_map_np) # Handle case of zero variance

            # Apply colormap (e.g., 'viridis', 'plasma', 'magma')
            cmap = matplotlib.cm.get_cmap('viridis')
            heatmap_colored = cmap(normalized_map)[:, :, :3] # Get RGB, discard alpha

            # Convert to PIL Image
            heatmap_pil = Image.fromarray((heatmap_colored * 255).astype(np.uint8))
            logger.debug("Uncertainty heatmap PIL image created.")
            return heatmap_pil
        except Exception as e:
            logger.error(f"Error creating uncertainty heatmap: {str(e)}", exc_info=True)
            # Don't raise ModelError here, let process_image handle it
            raise FileProcessingError(f"Failed to create uncertainty map: {str(e)}")

    def process_image(self, image_path: str):
        logger.info(f"Starting ML processing for image: {image_path}")
        if not os.path.exists(image_path):
            logger.error(f"Image file not found for processing: {image_path}")
            return {"status": "error", "error_message": f"Image file not found: {image_path}"}

        try:
            # Load and transform the image
            img = Image.open(image_path).convert('RGB')
            img_tensor = self.transform(img).unsqueeze(0).to(self.device)
            logger.info(f"Image loaded and transformed to tensor shape: {img_tensor.shape}")

            reconstructions_list = []
            # Perform Monte Carlo Dropout inference
            # Ensure model is in eval mode BUT dropout layers are active (done in _load_model)
            with torch.no_grad(): # Disable gradient calculations for inference
                for i in range(self.num_mc_samples):
                    reconstruction = self.model(img_tensor)
                    reconstructions_list.append(reconstruction)
                    if (i + 1) % 5 == 0 or i == self.num_mc_samples - 1:
                         logger.info(f"Processed MC sample {i + 1}/{self.num_mc_samples}")

            # Stack results and calculate mean and variance
            reconstructions_tensor = torch.cat(reconstructions_list, dim=0) # Shape: (num_samples, C, H, W)
            logger.info(f"Stacked reconstructions tensor shape: {reconstructions_tensor.shape}")

            mean_reconstruction = torch.mean(reconstructions_tensor, dim=0) # Shape: (C, H, W)
            variance_reconstruction = torch.var(reconstructions_tensor, dim=0, unbiased=False) # Shape: (C, H, W)
            logger.info("Calculated mean and variance of reconstructions.")

            # --- Post-processing ---
            # Convert mean reconstruction to PIL and then base64
            mean_rec_tensor_cpu = mean_reconstruction.squeeze(0).cpu() # Remove batch dim if present, move to CPU
            mean_rec_pil = self.to_pil(mean_rec_tensor_cpu)
            mean_rec_b64 = self._encode_image_to_base64(mean_rec_pil)
            logger.info("Mean reconstruction converted to base64.")

            # Calculate uncertainty map (e.g., mean variance across channels) and convert
            uncertainty_map_tensor = torch.mean(variance_reconstruction.squeeze(0), dim=0) # Mean variance across channels -> (H, W)
            uncertainty_heatmap_pil = self._create_uncertainty_heatmap(uncertainty_map_tensor)
            uncertainty_map_b64 = self._encode_image_to_base64(uncertainty_heatmap_pil)
            logger.info("Uncertainty map created and converted to base64.")

            logger.info(f"Successfully processed image: {image_path}")
            return {
                "mean_reconstruction_b64": mean_rec_b64,
                "uncertainty_map_b64": uncertainty_map_b64,
                "status": "success"
            }

        except FileNotFoundError:
             logger.error(f"Image file disappeared during processing: {image_path}")
             return {"status": "error", "error_message": f"Image file not found during processing: {image_path}"}
        except Exception as e:
            logger.error(f"Critical error during ML processing for {image_path}: {str(e)}", exc_info=True)
            # Return error status for the service caller to handle
            return {
                "status": "error",
                "error_message": f"ML processing failed: {str(e)}"
            }
