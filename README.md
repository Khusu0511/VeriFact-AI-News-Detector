<div align="center">

# 🛡️ VeriFact — AI-Powered Fake News Detector

<img src="frontend/public/logo.png" alt="VeriFact Logo" width="100" />

### Navigate the News with Confidence

**VeriFact** is a production-ready, full-stack web application designed to combat the spread of misinformation online. By leveraging a custom-trained **Bidirectional LSTM (BiLSTM)** deep learning model, VeriFact detects fake news headlines in real-time with high accuracy. 

Whether you're browsing social media or reading articles, VeriFact makes fact-checking effortless through instant text analysis, automated URL scraping, and a seamless **Chrome Extension**. Built with React, Node.js, and TensorFlow.js, it offers a beautifully animated UI while continuously learning from community feedback stored in MongoDB Atlas.

🌐 **Live Demo:** [https://verifact-ai-news-detector.onrender.com/](https://verifact-ai-news-detector.onrender.com/)

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white&style=for-the-badge)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white&style=for-the-badge)](https://nodejs.org)
[![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-4.x-FF6F00?logo=tensorflow&logoColor=white&style=for-the-badge)](https://www.tensorflow.org/js)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-06B6D4?logo=tailwindcss&logoColor=white&style=for-the-badge)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?logo=vite&logoColor=white&style=for-the-badge)](https://vite.dev)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[Features](#-features) · [Demo](#-quick-demo) · [Screenshots](#-screenshots) · [Getting Started](#-getting-started) · [Architecture](#-system-architecture) · [API Reference](#-api-reference) · [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Quick Demo](#-quick-demo)
- [Screenshots](#-screenshots)
- [System Architecture](#-system-architecture)
- [Model Details](#-model-details)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Tech Stack](#-tech-stack)
- [Performance](#-performance)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Core Functionality
| Feature | Description |
|---------|-------------|
| 📝 **Headline Analysis** | Paste any news headline and receive an instant Real/Fake classification |
| 🔗 **URL Scraping** | Provide an article URL — the app auto-extracts and analyzes the headline |
| 🧩 **Chrome Extension** | Analyze headlines directly on any webpage with a single click |
| 📊 **Confidence Scoring** | Animated circular gauge + progress bar visualizing prediction confidence |
| 💬 **User Feedback** | Report prediction accuracy to safely store labeled data in MongoDB Atlas |
| 📜 **Analysis History** | Timestamped, persistent history with one-click re-analysis |
| 📋 **Share Results** | Copy formatted analysis results to clipboard instantly |

### UI/UX
| Feature | Description |
|---------|-------------|
| 🌌 **Aurora Background** | Animated gradient background with floating particle effects |
| 🧊 **Glassmorphism** | Frosted glass cards with subtle blur and border effects |
| 📌 **Sticky Navbar** | Glass navbar that adapts on scroll with mobile hamburger menu |
| 🔔 **Toast Notifications** | Elegant slide-in notifications for all user actions |
| 💀 **Skeleton Loading** | Shimmer placeholders while awaiting analysis results |
| ⬆️ **Scroll to Top** | Floating button for quick navigation |
| 📱 **Fully Responsive** | Optimized for desktop, tablet, and mobile viewports |
| 🎯 **Micro-animations** | Hover effects, scroll reveals, button shimmers, and counter animations |

---

## 🎬 Quick Demo

1. **Open** the app at `http://localhost:3002`
2. **Paste** a headline like: *"Scientists discover breakthrough cure for cancer"*
3. **Click** "Analyze" and watch the AI process your input
4. **Review** the Real/Fake verdict with a confidence score
5. **Provide feedback** to help improve future predictions

---

## 📸 Screenshots

<div align="center">

### Landing Page
<img src="screenshots/hero.png" width="850"/>

### How It Works
<img src="screenshots/how-it-works.png" width="850"/>

### Analyzer — Input
<img src="screenshots/analyzer-empty.png" width="850"/>

### Analyzer — Headline Ready
<img src="screenshots/analyzer-input.png" width="850"/>

### Analysis Result
<img src="screenshots/result-verdict.png" width="850"/>

*Animated confidence gauge with a color-coded credibility badge — 93% confidence in this example.*

### Analysis History
<img src="screenshots/analysis-history.png" width="850"/>

*Timestamped entries, color-coded green/red by verdict.*

### Footer
<img src="screenshots/footer.png" width="850"/>

</div>

---

## 🏛️ System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        CLIENT (React)                        │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │  Navbar │  │   Hero   │  │ Analyzer │  │    History    │  │
│  └─────────┘  └──────────┘  └────┬─────┘  └───────────────┘  │
│                                  │                           │
│                        HTTP POST /api/predict                │
└──────────────────────────────────┼───────────────────────────┘
                                   │
                                   ▼
┌──────────────────────────────────────────────────────────────┐
│                  SERVER (Node.js + Express)                  │
│                                                              │
│  ┌────────────┐    ┌───────────────┐    ┌─────────────────┐  │
│  │ Validator  │───▶│ Predict Route │───▶│  Model Service │  │
│  │ Middleware │    └───────┬───────┘    │     (TF.js)     │  │
│  └────────────┘            │            └─────────────────┘  │
│                            │                                 │
│                  ┌─────────▼─────────┐    ┌───────────────┐  │
│                  │ Tokenizer Service │    │ MongoDB Atlas │  │
│                  │ (Text → Sequence) │◀──▶│ (Feedback DB)│  │
│                  └─────────┬─────────┘    └───────────────┘  │
│                            │                                 │
│                  ┌─────────▼─────────┐                       │
│                  │  Scraper Service  │    (URL mode only)    │
│                  │    (Puppeteer)    │                       │
│                  └───────────────────┘                       │
└──────────────────────────────────────────────────────────────┘
```

### Request Flow

1. **User Input** → User enters a headline/URL in the web app, or clicks the extension on a webpage
2. **API Request** → Client sends `POST /api/predict` with the payload
3. **URL Scraping** *(if URL mode)* → Puppeteer extracts the `<h1>` / `<title>` from the page
4. **Tokenization** → Text is lowercased, split into words, mapped to integer indices via `tokenizer.json`
5. **Padding** → Sequence is padded/truncated to 100 tokens (matching training config)
6. **Inference** → TensorFlow.js BiLSTM model predicts a probability (0 = Fake, 1 = Real)
7. **Response** → Server returns prediction label, confidence score, and analyzed text

---

## 🧠 Model Details

### Architecture

```
Input (100 tokens)
    │
    ▼
┌──────────────────────┐
│   Embedding Layer    │  vocab_size=10,000  →  16-dim vectors
│   (10,000 × 16)      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  SpatialDropout1D    │  rate=0.2 (regularization, training only)
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Bidirectional LSTM  │  64 units × 2 directions = 128 output dims
│  (forward + backward)│
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Dense Layer (1)     │  Sigmoid activation → probability [0, 1]
└──────────────────────┘
```

### Training Configuration

| Parameter | Value |
|-----------|-------|
| **Framework** | TensorFlow / Keras (Python) |
| **Architecture** | Bidirectional LSTM |
| **Embedding Dimension** | 16 |
| **Regularization** | SpatialDropout1D (0.2) + in-layer LSTM dropout (0.2 / 0.2) |
| **LSTM Units** | 64 (×2 for bidirectional) |
| **Vocabulary Learned** | 31,803 unique words (full fitted tokenizer vocabulary) |
| **Vocabulary Used at Inference** | Top 10,000 most frequent words (`num_words` cap) — anything less frequent, or unseen, maps to `<OOV>` |
| **Max Sequence Length** | 100 tokens |
| **Optimizer** | Adam |
| **Loss Function** | Binary Cross-Entropy |
| **Training Accuracy** | ~96% |
| **Validation Accuracy** | ~95% |
| **Inference Runtime** | TensorFlow.js (< 100ms per prediction) |

### Tokenization Pipeline

```
"Breaking: NASA discovers water on Mars!"
    │
    ▼  (lowercase + clean)
"breaking nasa discovers water on mars"
    │
    ▼  (split into words)
["breaking", "nasa", "discovers", "water", "on", "mars"]
    │
    ▼  (map to indices via tokenizer.json)
[1542, 3891, 2847, 1203, 5, 4521]
    │
    ▼  (pad/truncate to length 100)
[1542, 3891, 2847, 1203, 5, 4521, 0, 0, ..., 0]
    │
    ▼  (feed to BiLSTM model)
Prediction: 0.87 → "Real News" (87% confidence)
```

> **Note:** Words not found in the vocabulary (OOV) are mapped to index `1`. Headlines with many OOV words (e.g., non-English terms) may produce less reliable predictions.

---

## 🏗️ Project Structure

```
VeriFact-AI-News-Detector/
│
├── extension/                          # Chrome Browser Extension
│   ├── background.js                   # Service worker for API calls & DOM injection
│   ├── manifest.json                   # Extension configuration (Manifest V3)
│   └── icons/                          # Extension icons
│
├── backend/                            # Node.js + Express API Server
│   ├── model/
│   │   ├── tfjs_model/
│   │   │   ├── model.json              # Model topology & weight manifest
│   │   │   └── group1-shard1of1.bin    # Binary model weights (~1.2 MB)
│   │   ├── tokenizer.json              # Word → index vocabulary (31,803 entries)
│   │   └── feedback.csv                # Local fallback feedback log
│   ├── src/
│   │   ├── models/
│   │   │   └── Feedback.js             # Mongoose schema for cloud DB
│   │   ├── server.js                   # Express app + CORS + pre-initialization
│   │   ├── config.js                   # Port, model path, environment config
│   │   ├── middleware/
│   │   │   └── validator.js            # Request body validation
│   │   ├── routes/
│   │   │   ├── predict.js              # POST /api/predict — analysis endpoint
│   │   │   └── feedback.js             # POST /api/feedback — feedback endpoint
│   │   └── services/
│   │       ├── modelService.js         # TF.js model loading with weight mapping
│   │       ├── tokenizerService.js     # Text preprocessing & tokenization
│   │       └── scraperService.js       # Puppeteer-based headline extraction
│   ├── .env.example                    # Environment variables template
│   └── package.json
│
├── frontend/                           # React 19 + Vite 8 + Tailwind CSS 4
│   ├── public/
│   │   └── logo.png                    # Application logo
│   ├── src/
│   │   ├── api/
│   │   │   └── index.js                # API service with error handling
│   │   ├── components/
│   │   │   ├── analyzer/
│   │   │   │   ├── AnalyzerCard.jsx    # Input form + tabs + skeleton loading
│   │   │   │   ├── ResultCard.jsx      # Verdict display + feedback + share
│   │   │   │   └── ConfidenceBar.jsx   # Circular SVG gauge + progress bar
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx          # Sticky glassmorphism navbar + mobile
│   │   │   │   ├── Hero.jsx            # Animated gradient hero section
│   │   │   │   └── Footer.jsx          # 3-column footer with tech tags
│   │   │   ├── sections/
│   │   │   │   ├── Stats.jsx           # Scroll-triggered animated counters
│   │   │   │   ├── HowItWorks.jsx      # 3-step cards with scroll reveal
│   │   │   │   └── History.jsx         # Timestamped analysis history
│   │   │   └── ui/
│   │   │       ├── Spinner.jsx         # Configurable loading spinner
│   │   │       ├── Toast.jsx           # Context-based toast system
│   │   │       └── ScrollToTop.jsx     # Floating scroll-to-top button
│   │   ├── hooks/
│   │   │   └── useHistory.js           # LocalStorage-backed history hook
│   │   ├── styles/
│   │   │   └── index.css               # Design system (animations, glassmorphism)
│   │   ├── App.jsx                     # Root component + particle spawner
│   │   └── main.jsx                    # React DOM entry point
│   ├── vite.config.js                  # Vite + Tailwind plugin config
│   └── package.json
│
├── screenshots/                        # README preview images
├── Model_Training.ipynb                # Complete model training notebook
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version |
|-------------|---------|
| **Node.js** | v18.0 or later |
| **npm** | v9.0 or later |
| **Git** | Any recent version |

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Khusu0511/VeriFact-AI-News-Detector.git
cd VeriFact-AI-News-Detector
```

#### Start the Backend (Terminal 1)

```bash
cd backend
npm install
npm start
```

> ✅ Server starts at **http://localhost:3001**
> The model and tokenizer are loaded automatically on startup.

#### Start the Frontend (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

> ✅ App opens at **http://localhost:3002**

#### Install Chrome Extension (Optional)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** in the top right corner
3. Click **Load unpacked** and select the `extension` folder in this repository
4. Pin the extension to your toolbar. Click it on any news page to instantly analyze the headline!

### Verify Everything Works

1. Open **http://localhost:3002** in your browser
2. Paste this test headline: `"NASA confirms evidence of water on Jupiter's moon Europa"`
3. Click **Analyze** — you should see a prediction within 1-2 seconds

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

```env
PORT=3001                                                                  # API server port
CORS_ORIGINS=https://your-frontend-app.onrender.com,chrome-extension://your-extension-id
                                                                            # Comma-separated allowed origins (Optional — defaults to localhost + any chrome-extension:// origin)

# Set by Render's Puppeteer buildpack — do NOT set manually
# PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# MongoDB connection string (Optional — leave unset to fall back to local CSV storage)
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
```

### Frontend

The frontend uses Vite's environment variable system:

```env
VITE_API_URL=http://localhost:3001/api    # Backend API base URL
```

---

## 📡 API Reference

### `POST /api/predict`

Analyze a headline or article URL for misinformation.

#### Request — Text Mode

```bash
curl -X POST http://localhost:3001/api/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "Scientists discover breakthrough cure for cancer"}'
```

#### Request — URL Mode

```bash
curl -X POST http://localhost:3001/api/predict \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.bbc.com/news/some-article"}'
```

#### Success Response `200 OK`

```json
{
  "prediction": "Real News",
  "confidence": 0.8134,
  "credibilityScore": 81,
  "analyzed_headline": "Scientists discover breakthrough cure for cancer",
  "text_snippet": "Scientists discover breakthrough cure for cancer"
}
```

> `confidence` is the model's raw sigmoid output (0–1, unrounded). `credibilityScore` is `confidence` reframed as "how sure the model is in whichever verdict it returned," rounded to a whole number — e.g. a raw output of `0.13` (a Fake verdict) is shown as `87`, not `13`.

#### Error Response `400 Bad Request`

```json
{
  "error": "Please provide either a url or text to analyze."
}
```

---

### `POST /api/feedback`

Submit user feedback on a prediction to help improve model accuracy.

#### Request

```bash
curl -X POST http://localhost:3001/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "news_text": "Scientists discover breakthrough cure for cancer",
    "expected_label": "Real",
    "original_url": null
  }'
```

#### Success Response `200 OK`

```json
{
  "message": "Feedback recorded successfully!"
}
```

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|-----------|---------|
| **React 19** | Component-based UI framework |
| **Vite 8** | Lightning-fast dev server & bundler |
| **Tailwind CSS 4** | Utility-first CSS framework |
| **Custom Hooks** | `useHistory` for state management |
| **Context API** | Toast notification system |

### Backend

| Technology | Purpose |
|-----------|---------|
| **Node.js** | JavaScript runtime |
| **Express** | HTTP server framework |
| **TensorFlow.js** | Neural network inference |
| **Puppeteer** | Headless Chrome for URL scraping |
| **MongoDB / Mongoose**| Persistent cloud feedback storage |
| **Helmet** | HTTP security headers |
| **CORS** | Cross-origin request handling |

### Browser Extension

| Technology | Purpose |
|-----------|---------|
| **Manifest V3** | Chrome extension architecture |
| **Service Workers** | Background API communication |
| **Content Scripts** | DOM manipulation and UI injection |

### Machine Learning

| Technology | Purpose |
|-----------|---------|
| **TensorFlow / Keras** | Model training (Python) |
| **TensorFlow.js** | Model inference (JavaScript) |
| **BiLSTM** | Bidirectional sequence modeling |
| **Custom Tokenizer** | Text-to-sequence conversion |

---

## ⚡ Performance

| Metric | Value |
|--------|-------|
| **Text Analysis** | < 100ms |
| **URL Analysis** | 2-5s (includes page scraping) |
| **Model Load Time** | ~2s (cold start) |
| **Frontend Build** | < 5s |
| **Lighthouse Score** | 90+ (Performance) |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Ideas for Contribution

- [ ] Add multi-language support
- [ ] Implement batch analysis mode
- [ ] Integrate additional ML models for comparison
- [ ] Add data visualization dashboard

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Kushagra Gupta ( BTech IT 2027 )**

Indian Institute of Information Technology, Allahabad

[GitHub](https://github.com/Khusu0511)
[LinkedIn](https://www.linkedin.com/in/kushagra-gupta-7b49b5302/)