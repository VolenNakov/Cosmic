import torch
import torch.nn as nn
import numpy as np
from PIL import Image
from torchvision import transforms
import matplotlib.pyplot as plt
import matplotlib.cm
import io
import base64
from ..models.ml.autoencoder import DropoutAutoencoder, enable_dropout
from ..config.settings import get_settings
from ..utils.logger import setup_logger
from ..utils.exceptions import ModelError

settings = get_settings()
logger = setup_logger("ml_service")

class MLService:
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        logger.info(f"Using device: {self.device}")
        self.model = self._load_model()
        self.transform = transforms.Compose([
            transforms.Resize((512, 512)),
            transforms.ToTensor(),
        ])
        self.to_pil = transforms.ToPILImage()
        self.num_mc_samples = 30
        logger.info("ML Service initialized")

    def _load_model(self):
        try:
            logger.info(f"Loading model from {settings.MODEL_PATH}")
            model = DropoutAutoencoder(dropout_p=0.25)
            model.load_state_dict(torch.load(settings.MODEL_PATH, map_location=self.device))
            model.to(self.device)
            model.eval()
            enable_dropout(model)
            logger.info("Model loaded")
            return model
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            raise ModelError(f"Failed to load model: {str(e)}")

    def _encode_image_to_base64(self, pil_image):
        try:
            buffered = io.BytesIO()
            pil_image.save(buffered, format="PNG")
            return base64.b64encode(buffered.getvalue()).decode("utf-8")
        except Exception as e:
            logger.error(f"Error encoding image: {str(e)}")
            raise ModelError(f"Failed to encode image: {str(e)}")

    def _create_uncertainty_heatmap(self, variance_map_tensor):
        try:
            variance_map_np = variance_map_tensor.cpu().numpy()
            min_val = np.min(variance_map_np)
            max_val = np.max(variance_map_np)
            
            if max_val > min_val:
                normalized_map = (variance_map_np - min_val) / (max_val - min_val)
            else:
                normalized_map = np.zeros_like(variance_map_np)

            cmap = matplotlib.cm.get_cmap('viridis')
            heatmap_colored = cmap(normalized_map)[:, :, :3]
            return Image.fromarray((heatmap_colored * 255).astype(np.uint8))
        except Exception as e:
            logger.error(f"Error creating uncertainty heatmap: {str(e)}")
            raise ModelError(f"Failed to create uncertainty map: {str(e)}")

    def process_image(self, image_path: str):
        try:
            logger.info(f"Processing image: {image_path}")
            
            img = Image.open(image_path).convert('RGB')
            img_tensor = self.transform(img).unsqueeze(0).to(self.device)

            reconstructions_list = []
            with torch.no_grad():
                for i in range(self.num_mc_samples):
                    reconstruction = self.model(img_tensor)
                    reconstructions_list.append(reconstruction)
                    if (i + 1) % 5 == 0:
                        logger.info(f"Processed {i + 1}/{self.num_mc_samples} samples")

            reconstructions_tensor = torch.cat(reconstructions_list, dim=0)
            mean_reconstruction = torch.mean(reconstructions_tensor, dim=0)
            variance_reconstruction = torch.var(reconstructions_tensor, dim=0, unbiased=False)

            mean_rec_tensor_cpu = mean_reconstruction.squeeze(0).cpu()
            mean_rec_pil = self.to_pil(mean_rec_tensor_cpu)
            mean_rec_b64 = self._encode_image_to_base64(mean_rec_pil)

            uncertainty_map_tensor = torch.mean(variance_reconstruction.squeeze(0), dim=0)
            uncertainty_heatmap_pil = self._create_uncertainty_heatmap(uncertainty_map_tensor)
            uncertainty_map_b64 = self._encode_image_to_base64(uncertainty_heatmap_pil)

            return {
                "mean_reconstruction_b64": mean_rec_b64,
                "uncertainty_map_b64": uncertainty_map_b64,
                "status": "success"
            }

        except Exception as e:
            logger.error(f"Error processing image: {str(e)}")
            return {
                "status": "error",
                "error_message": str(e)
            } 