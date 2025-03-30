# backend/app/models/ml/autoencoder.py
import torch
import torch.nn as nn

class DropoutAutoencoder(nn.Module):
    # Using the architecture from your initial prompt
    def __init__(self, dropout_p=0.25): # Default dropout, can be adjusted if needed
        super(DropoutAutoencoder, self).__init__()
        self.dropout_p = dropout_p

        # --- Encoder ---
        # Input: (B, 3, 512, 512)
        self.encoder = nn.Sequential(
            # Block 1
            nn.Conv2d(3, 64, kernel_size=3, stride=2, padding=1), # (B, 64, 256, 256)
            nn.ReLU(inplace=True),
            nn.Dropout(self.dropout_p),

            # Block 2
            nn.Conv2d(64, 128, kernel_size=3, stride=2, padding=1), # (B, 128, 128, 128)
            nn.ReLU(inplace=True),
            nn.Dropout(self.dropout_p),

            # Block 3
            nn.Conv2d(128, 256, kernel_size=3, stride=2, padding=1), # (B, 256, 64, 64)
            nn.ReLU(inplace=True),
            nn.Dropout(self.dropout_p),

            # Block 4
            nn.Conv2d(256, 512, kernel_size=3, stride=2, padding=1), # (B, 512, 32, 32)
            nn.ReLU(inplace=True),
            nn.Dropout(self.dropout_p),

            # Block 5
            nn.Conv2d(512, 512, kernel_size=3, stride=2, padding=1), # (B, 512, 16, 16)
            nn.ReLU(inplace=True),
            nn.Dropout(self.dropout_p),

            # Block 6 - Bottleneck Layer
            nn.Conv2d(512, 512, kernel_size=3, stride=2, padding=1), # (B, 512, 8, 8) <- Make sure this matches your trained model
            nn.ReLU(inplace=True),
            # Optional: Dropout right at the bottleneck too
            # nn.Dropout(self.dropout_p),
        )

        # --- Decoder ---
        # Input: (B, 512, 8, 8)
        self.decoder = nn.Sequential(
            # Block 1
            nn.ConvTranspose2d(512, 512, kernel_size=3, stride=2, padding=1, output_padding=1), # (B, 512, 16, 16)
            nn.ReLU(inplace=True),
            nn.Dropout(self.dropout_p),

            # Block 2
            nn.ConvTranspose2d(512, 512, kernel_size=3, stride=2, padding=1, output_padding=1), # (B, 512, 32, 32)
            nn.ReLU(inplace=True),
            nn.Dropout(self.dropout_p),

            # Block 3
            nn.ConvTranspose2d(512, 256, kernel_size=3, stride=2, padding=1, output_padding=1), # (B, 256, 64, 64)
            nn.ReLU(inplace=True),
            nn.Dropout(self.dropout_p),

            # Block 4
            nn.ConvTranspose2d(256, 128, kernel_size=3, stride=2, padding=1, output_padding=1), # (B, 128, 128, 128)
            nn.ReLU(inplace=True),
            nn.Dropout(self.dropout_p),

            # Block 5
            nn.ConvTranspose2d(128, 64, kernel_size=3, stride=2, padding=1, output_padding=1), # (B, 64, 256, 256)
            nn.ReLU(inplace=True),
            nn.Dropout(self.dropout_p),

            # Block 6 - Output Layer
            nn.ConvTranspose2d(64, 3, kernel_size=3, stride=2, padding=1, output_padding=1), # (B, 3, 512, 512)
            nn.Sigmoid() # Output activation to constrain pixels to [0, 1]
        )

    def forward(self, x):
        encoded = self.encoder(x)
        decoded = self.decoder(encoded)
        return decoded

def enable_dropout(model):
    """Sets dropout layers to train mode (needed for Monte Carlo Dropout)."""
    logger.info("Enabling dropout layers for Monte Carlo inference.")
    for m in model.modules():
        if isinstance(m, nn.Dropout) or isinstance(m, nn.Dropout2d):
            # print(f"Setting {m} to train mode") # Debug print
            m.train()
        # else: # Debug print
            # print(f"Layer {m} is not dropout, keeping eval mode")

# Add logger for the enable_dropout function if needed
from app.utils.logger import setup_logger
logger = setup_logger("autoencoder_model")
