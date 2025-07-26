import os
import json
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.preprocessing.text import tokenizer_from_json

# --- Selenium Imports for advanced web scraping ---
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import WebDriverException

# --- Initialization ---
app = Flask(__name__)
CORS(app)

# --- Build absolute paths relative to this file ---
basedir = os.path.abspath(os.path.dirname(__file__))
MODEL_PATH = os.path.join(basedir, 'model', 'fake_news_model.h5')
TOKENIZER_PATH = os.path.join(basedir, 'model', 'tokenizer.json')
FEEDBACK_FILE = os.path.join(basedir, 'model', 'feedback.csv')
# --- Path to your ChromeDriver ---
CHROMEDRIVER_PATH = os.path.join(basedir, 'chromedriver.exe')


# --- Load Model and Tokenizer ---
model = load_model(MODEL_PATH)
with open(TOKENIZER_PATH) as f:
    data = json.load(f)
    tokenizer = tokenizer_from_json(data)
print("Model and Tokenizer loaded successfully.")


# --- API Endpoints ---

@app.route('/predict', methods=['POST'])
def predict():
    """
    Receives either a headline or a URL, processes it, and returns a prediction.
    Now uses Selenium for reliable URL scraping.
    """
    try:
        data = request.get_json()
        headline = ""

        # Check if the request contains a URL to scrape
        if 'url' in data and data['url']:
            try:
                # --- Selenium Setup ---
                chrome_options = Options()
                chrome_options.add_argument("--headless")  # Run Chrome in the background
                chrome_options.add_argument("--disable-gpu")
                chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")

                service = Service(executable_path=CHROMEDRIVER_PATH)
                driver = webdriver.Chrome(service=service, options=chrome_options)
                
                # --- Fetch and Extract ---
                driver.get(data['url'])
                # Wait up to 10 seconds for the h1 element to be present
                driver.implicitly_wait(10) 
                
                h1_element = driver.find_element(By.TAG_NAME, 'h1')
                headline = h1_element.text.strip()
                
                driver.quit() # Close the browser

                if not headline:
                    return jsonify({'error': 'Found a headline tag, but it was empty.'}), 400

            except WebDriverException as e:
                print(f"Selenium/WebDriver Error: {e}")
                return jsonify({'error': 'Failed to fetch or process the URL with Selenium. Ensure ChromeDriver is correctly set up.'}), 400
            except Exception as e:
                print(f"Error during scraping: {e}")
                # This will catch cases where the h1 tag is not found
                return jsonify({'error': 'Could not find a headline (h1 tag) on the provided URL.'}), 400

        # Check if the request contains a headline directly
        elif 'headline' in data and data['headline']:
            headline = data['headline']
        
        # If neither is provided, return an error
        else:
            return jsonify({'error': 'Request must contain either a headline or a URL.'}), 400

        # --- Preprocess and Predict ---
        sequence = tokenizer.texts_to_sequences([headline])
        max_length = 100 
        padded_sequence = pad_sequences(sequence, maxlen=max_length, padding='post')
        
        prediction = model.predict(padded_sequence)
        confidence = prediction[0][0]
        label = 'real' if confidence > 0.5 else 'fake'
        
        return jsonify({
            'prediction': label,
            'confidence': float(confidence),
            'headline': headline 
        })

    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({'error': 'An error occurred during prediction.'}), 500

# (The feedback endpoint and other code remains the same)
@app.route('/feedback', methods=['POST'])
def feedback():
    try:
        data = request.get_json()
        headline = data.get('headline')
        user_feedback = data.get('feedback')
        model_prediction = data.get('prediction')

        if not all([headline, user_feedback, model_prediction]):
            return jsonify({'error': 'Missing data in feedback request.'}), 400

        actual_label = model_prediction if user_feedback == 'correct' else ('fake' if model_prediction == 'real' else 'real')
        
        new_feedback = pd.DataFrame({'headline': [headline], 'label': [actual_label]})
        
        if not os.path.exists(FEEDBACK_FILE):
            new_feedback.to_csv(FEEDBACK_FILE, index=False)
        else:
            new_feedback.to_csv(FEEDBACK_FILE, mode='a', header=False, index=False)
        
        return jsonify({'status': 'success', 'message': 'Feedback received. Thank you!'})

    except Exception as e:
        print(f"Error saving feedback: {e}")
        return jsonify({'error': 'An error occurred while saving feedback.'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
