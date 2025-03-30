# COSMIC: Compressed Optimized Space Mission Imagery Codec


**COSMIC** is a project demonstrating an intelligent image compression system designed specifically for the challenges of deep space missions. It leverages a neural network approach to achieve high compression ratios while providing crucial uncertainty information, aiming to maximize scientific return from bandwidth-constrained environments.

This repository contains the backend API (built with FastAPI and PyTorch) and the frontend interface (React - *under development*) for interacting with the COSMIC model.

## The Challenge: Deep Space Data Bottleneck

Deep space missions, particularly to destinations like Mars, face severe limitations:
*   **Extreme Bandwidth Constraints:** Data transmission rates back to Earth are incredibly low (e.g., ~2 Mbps max from Mars).
*   **Significant Latency:** Signal travel time introduces delays of minutes to hours.
*   **Limited Onboard Resources:** Power and computational capabilities on spacecraft are restricted.

These factors make efficient data handling and prioritization absolutely critical. Traditional compression methods (like JPEG, ICER) offer limited ratios and lack built-in mechanisms to assess the reliability of the compressed data.

## Our Solution: COSMIC

COSMIC tackles these challenges with an intelligent compression pipeline:

*   **High Compression Ratio:** Utilizes a Convolutional Autoencoder (specifically a `DropoutAutoencoder` architecture) trained on relevant space imagery (e.g., Martian terrain) to achieve significant data reduction (targeting ~48:1 or ~0.5 bits per pixel).
*   **Built-in Uncertainty Mapping:** Leverages techniques like Monte Carlo Dropout during inference to generate confidence maps alongside the reconstructed image. These maps highlight areas where the model is less certain about the reconstruction.
*   **Enabling Autonomous Prioritization:** The uncertainty maps allow for smarter data handling, enabling autonomous systems (or ground control) to prioritize transmission of uncertain/critical regions or use high-confidence areas for tasks like navigation.
*   **Enhanced Detail Preservation:** Incorporates techniques like custom regularizers (e.g., Sobel filter-based gradient loss) during training to better preserve high-frequency details crucial for scientific analysis.

## Key Features

*   🚀 **State-of-the-Art Compression:** Neural network achieving high compression ratios tailored for space imagery.
*   🤔 **Uncertainty Quantification:** Generates confidence maps indicating reconstruction reliability.
*   🛰️ **Mission Impact:** Enables transmitting significantly more data, smarter prioritization, and potentially safer autonomous operations.
*   🖥️ **Web Interface:** FastAPI backend serving the model and a React frontend for user interaction (upload, view results).
*   🐍 **Python/PyTorch Backend:** Leverages powerful libraries for ML model serving.

## Technology Stack

*   **Backend:** Python, FastAPI, PyTorch, Uvicorn
*   **ML Model:** Convolutional Autoencoder (`DropoutAutoencoder`) with custom loss functions.
*   **Frontend:** React (TypeScript planned), CSS/HTML (*Work in Progress*)
*   **Environment:** Python Virtual Environments, Node.js/npm (for frontend)

## Project Structure
