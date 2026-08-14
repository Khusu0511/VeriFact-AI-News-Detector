const tf = require('@tensorflow/tfjs');
const path = require('path');
const fs = require('fs');

class ModelService {
  constructor() {
    this.model = null;
  }

  async load() {
    try {
      const modelPath = path.resolve(__dirname, '../../model/tfjs_model/model.json');
      console.log(`Loading TensorFlow.js model from ${modelPath}...`);

      const modelJson = JSON.parse(fs.readFileSync(modelPath, 'utf8'));

      // Fix Keras 3 -> TFJS InputLayer 'batch_shape' naming mismatch
      const topology = modelJson.topology || modelJson.modelTopology;
      if (topology && topology.model_config && topology.model_config.config && topology.model_config.config.layers) {
        for (const layer of topology.model_config.config.layers) {
          if (layer.class_name === 'InputLayer' && layer.config.batch_shape && !layer.config.batchInputShape) {
            layer.config.batchInputShape = layer.config.batch_shape;
          }
        }
      }

      const weightManifest = modelJson.weightsManifest[0];

      // Fix Keras 3 -> TFJS weight naming mismatch
      // Keras 3 exports names like 'forward_lstm/lstm_cell/kernel' but
      // TFJS Bidirectional creates 'bidirectional/forward_{innerLayerName}/kernel'.
      // With strict:false, unmatched names silently get random initialization!
      if (weightManifest && weightManifest.weights) {
        for (const w of weightManifest.weights) {
          // LSTM weights: forward_lstm/lstm_cell/X -> bidirectional/forward_forward_lstm/X
          w.name = w.name
            .replace('forward_lstm/lstm_cell/', 'bidirectional/forward_forward_lstm/')
            .replace('backward_lstm/lstm_cell/', 'bidirectional/backward_forward_lstm/')
            .replace('sequential/', '');  // Remove 'sequential/' prefix from dense/embedding
        }
      }

      const weightPath = path.join(path.dirname(modelPath), weightManifest.paths[0]);

      const weightData = new Uint8Array(fs.readFileSync(weightPath)).buffer;

      this.model = await tf.loadLayersModel(tf.io.fromMemory({
        modelTopology: topology,
        weightSpecs: weightManifest.weights,
        weightData: weightData
      }), { strict: true });  // strict:true to FAIL if names still don't match

      console.log('Model loaded successfully.');
    } catch (error) {
      console.error('Failed to load the model:', error);
      throw error;
    }
  }

  /**
   * Predicts whether the given sequence is fake or real news.
   * @param {number[][]} sequences - 2D array of padded sequences
   * @returns {Promise<Object>} The prediction result
   */
  async predict(sequences) {
    if (!this.model) {
      throw new Error('Model is not loaded yet');
    }

    try {
      // The sequence is expected to be [batchSize, maxLen]
      const inputTensor = tf.tensor2d(sequences);

      const predictionTensor = this.model.predict(inputTensor);
      const predictionValue = await predictionTensor.data();

      // Clean up tensors to prevent memory leaks
      inputTensor.dispose();
      predictionTensor.dispose();

      // The model outputs a probability (0 to 1). We'll assume > 0.5 is real, < 0.5 is fake (or vice versa depending on training).
      // We'll return the raw probability so the caller can format it.
      const confidence = predictionValue[0];

      return {
        confidence,
        isFake: confidence < 0.5 // Adjust threshold based on original Flask logic
      };
    } catch (error) {
      console.error('Prediction failed:', error);
      throw error;
    }
  }
}

module.exports = new ModelService();
