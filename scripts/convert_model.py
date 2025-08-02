import os
import shutil
import tensorflow as tf
import tensorflowjs as tfjs

def convert_model():
    print("Loading Keras model...")
    # Path to original model
    model_path = os.path.join('backend', 'model', 'fake_news_model.h5')
    
    # Target directory for the new TF.js model
    output_dir = os.path.join('backend-node', 'model', 'tfjs_model')
    os.makedirs(output_dir, exist_ok=True)

    # Load model
    model = tf.keras.models.load_model(model_path)
    
    print(f"Converting model and saving to {output_dir}...")
    # Convert and save
    tfjs.converters.save_keras_model(model, output_dir)
    
    # Copy tokenizer
    print("Copying tokenizer...")
    tokenizer_src = os.path.join('backend', 'model', 'tokenizer.json')
    tokenizer_dst = os.path.join('backend-node', 'model', 'tokenizer.json')
    shutil.copy2(tokenizer_src, tokenizer_dst)

    # Copy feedback.csv
    print("Copying feedback.csv...")
    feedback_src = os.path.join('backend', 'model', 'feedback.csv')
    feedback_dst = os.path.join('backend-node', 'model', 'feedback.csv')
    if os.path.exists(feedback_src):
        shutil.copy2(feedback_src, feedback_dst)

    print("Done! Model successfully converted for Node.js usage.")

if __name__ == "__main__":
    convert_model()
