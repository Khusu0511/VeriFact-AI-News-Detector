# VeriFact AI News Detector

VeriFact is an AI-powered system designed to detect and flag fake news articles using deep learning (BiLSTM) linguistic pattern analysis. It provides both a web application interface and a Chrome extension for real-time verification of news articles directly in your browser.

## Tech Stack
* **Frontend Web App**: React.js, Vite, Tailwind CSS (Glassmorphism UI)
* **Backend API**: Node.js, Express.js
* **Scraper**: Puppeteer (Headless Browser)
* **AI Model**: TensorFlow.js (converted from Keras BiLSTM)
* **Browser Extension**: Chrome Extension API (Manifest V3)

## Features
* **AI Fake News Detection**: Uses a trained BiLSTM neural network.
* **Web Scraper**: Extracts full article text directly from URLs using Puppeteer, bypassing basic bot protections.
* **Chrome Extension**: Injects a clean glassmorphism banner into news websites with an instant credibility score.
* **Feedback Loop**: Allows users to submit corrections to improve the model.

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/Khusu0511/VeriFact-AI-News-Detector.git
cd VeriFact-AI-News-Detector
```

### 2. Run the Backend API (Node.js)
```bash
cd backend-node
npm install
node src/server.js
```
The API will run on `http://localhost:3001`.

### 3. Run the Frontend (React.js)
Open a new terminal window:
```bash
cd frontend-react
npm install
npm run dev
```
The web app will run on `http://localhost:5173`.

### 4. Install the Chrome Extension
1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** in the top right corner.
3. Click **Load unpacked** and select the `extension` folder from this repository.
4. Pin the extension. When you visit a news article, click the extension icon to verify its credibility!

## Project Structure
- `backend/` - Legacy Python model training scripts and Jupyter notebooks.
- `backend-node/` - The Node.js Express server containing the TF.js model and Puppeteer scraper.
- `frontend-react/` - The React web application.
- `extension/` - The Chrome Extension source code.
