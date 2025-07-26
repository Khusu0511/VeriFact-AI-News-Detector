# VeriFact: Full-Stack AI Fake News Detector

VeriFact is a complete, full-stack application designed to combat misinformation by using a neural network to classify news headlines as "Real" or "Fake". It features a powerful Python backend that uses Selenium for robust web scraping, a user-friendly web interface, and a browser extension for real-world use on any news website. This project serves as a comprehensive demonstration of integrating a machine learning model into a practical, user-facing application.

## The Problem

In the modern digital age, the rapid spread of misinformation and "fake news" poses a significant threat to informed public discourse. It can be difficult for users to distinguish between credible journalism and fabricated content. VeriFact aims to provide a first line of defense by offering an instant, AI-powered analysis of news headlines, empowering users to think critically about the information they consume.

## Features

* **High-Accuracy AI Model:** At its core, VeriFact utilizes a Bidirectional LSTM (Long Short-Term Memory) neural network. This architecture is specifically chosen for its strength in understanding the context and sequence of words in a sentence. The model has been trained on a large dataset of over 40,000 news articles to recognize the linguistic patterns that often distinguish between factual and fabricated news.

* **Robust URL Analysis with Selenium:** To handle modern, JavaScript-heavy websites, the backend uses Selenium to control a headless Chrome browser. This allows it to reliably extract headlines from virtually any news article by rendering the page just as a human user would, bypassing common anti-scraping measures that block simpler tools.

* **Dual Frontend Options:** VeriFact offers two ways to interact with the service:

  1. **Web Interface:** A sleek, modern, single-page application where users can analyze headlines by either pasting the text directly or providing a URL. It includes a persistent history of recent analyses.

  2. **Browser Extension:** A simple and convenient Chrome/Edge extension that allows users to analyze the headline of any article they are currently reading with a single click, without leaving the page.

* **Dynamic & Interactive UI:** Both frontends are designed to be user-friendly. The extension injects a clean, visually appealing banner at the top of the webpage, while the main website includes features like a confidence meter and a shareable results feature.

* **Continuous Learning via Feedback Loop:** The backend is equipped with a `/feedback` endpoint to receive user corrections on the AI's predictions. This feedback is saved to a CSV file, creating a valuable dataset that can be used to periodically retrain and improve the model's accuracy over time.

## How It Works

The project's architecture separates the AI logic (backend) from the user interface (frontend).

1. **User Action:** The user either pastes a headline/URL into the VeriFact website or clicks the browser extension icon on a news article.

2. **Frontend Request:** The frontend (website or extension) sends the text or URL to the backend Flask server's `/predict` endpoint in a JSON format.

3. **Backend Analysis (Selenium):** If a URL is received, the Flask server launches a headless Selenium-controlled Chrome browser. It navigates to the URL, waits for the page to fully load, and reliably extracts the main headline text from the first `<h1>` HTML tag.

4. **AI Prediction:** The backend feeds the extracted (or directly provided) headline into the pre-trained Keras model. The text is first converted into a sequence of numbers by the tokenizer, then padded to a uniform length. The model processes this sequence and outputs a probability score between 0 (Fake) and 1 (Real).

5. **API Response:** The server packages the result (the prediction label, the confidence score, and the headline that was analyzed) into a JSON object and sends it back to the frontend.

6. **Display Result:** The frontend receives the JSON response and dynamically updates the user interface—either by displaying the result in the main web application or by injecting the visual banner into the active webpage.

## Project Structure

```
fake-news-detector/
│
├── data/
│   ├── Fake.csv
│   └── True.csv
│
├── backend/
│   ├── model/
│   │   ├── fake_news_model.h5
│   │   └── tokenizer.json
│   │
│   ├── chromedriver.exe  <-- WebDriver for Selenium
│   ├── app.py
│   └── requirements.txt
│
├── extension/
│   ├── icons/
│   │   └── icon48.png
│   ├── background.js
│   └── manifest.json
│
├── frontend/
│   ├── images/
│   │   └── logo.png
│   └── index.html
│
├── Model_Training.ipynb
└── README.md
```

## Setup and Installation

### 1. Prerequisites

* Python 3.8+
* `pip` and `venv` (standard with modern Python installations)
* Google Chrome browser (for both use and for Selenium's ChromeDriver)
* A modern web browser (Chrome or Edge) for using the application.

### 2. Download the Dataset

The model is trained on the "Fake and Real News Dataset" from Kaggle.

* **Download Link:** [Kaggle Dataset](https://www.kaggle.com/datasets/clmentbisaillon/fake-and-real-news-dataset)
* After downloading, create a `data` folder in the project root.
* Unzip the downloaded file and place `Fake.csv` and `True.csv` inside the `data` folder.

### 3. Set Up the Python Environment

Using a virtual environment is crucial for managing project dependencies without affecting your system's global Python installation.

```bash
# Navigate to the project's root directory
cd fake-news-detector

# Create a virtual environment named 'venv'
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Now that the environment is active, install all required libraries
pip install -r backend/requirements.txt
pip install jupyterlab matplotlib seaborn
```

### 4. Set Up Selenium WebDriver

Selenium requires a separate driver file to control the Chrome browser.

1. **Check Chrome Version:** In Chrome, go to `chrome://settings/help` to find your full version number (e.g., `126.0.6478.127`).
2. **Download ChromeDriver:** Go to the [Chrome for Testing availability dashboard](https://googlechromelabs.github.io/chrome-for-testing/). Find the stable version that exactly matches your browser version and download the `chromedriver-win64.zip` file.
3. **Place WebDriver:** Unzip the file and place the `chromedriver.exe` executable directly inside your `backend` folder.

## How to Run the Project

### Step 1: Train the AI Model (One-Time Step)

This step is computationally intensive and only needs to be performed once.
1. Launch Jupyter Lab from your activated terminal: `jupyter lab`
2. Open `Model_Training.ipynb` and run all cells. This will create the `fake_news_model.h5` and `tokenizer.json` files in `backend/model/`.

### Step 2: Start the Backend Server

This server makes the AI model available via an API.
1. Open a terminal, navigate to the project root, and activate the virtual environment.
2. Run the Flask application:
   ```bash
   python backend/app.py
   ```
3. Keep this terminal running. It should confirm that the model and tokenizer were loaded successfully.

### Step 3: Use the Frontend

**Option A: The Full Website**
1. Open a **new terminal**.
2. Navigate to the `frontend` folder: `cd frontend`
3. Start a simple local server: `python -m http.server`
4. Open your browser and go to `http://localhost:8000`.

**Option B: The Browser Extension**
1. Open your browser and go to `chrome://extensions` or `edge://extensions`.
2. Enable **"Developer mode"**.
3. Click **"Load unpacked"** and select the **`extension` folder**.
4. Navigate to a news article and click the extension's icon.

## Author

* **Kushagra Gupta ( IIT2023133 )** - *Initial work & Project Lead*

## Technologies Used

- **AI & Backend:** Python, Flask, TensorFlow/Keras, Pandas, Scikit-learn, Selenium
- **Frontend (Browser Extension & Web App):** JavaScript, HTML, CSS (Tailwind)
- **Development:** Jupyter Notebook
