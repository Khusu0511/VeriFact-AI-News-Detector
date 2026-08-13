const fs = require('fs');
const path = require('path');

class TokenizerService {
  constructor() {
    this.wordIndex = {};
    this.numWords = 10000;
    this.oovToken = '<OOV>';
    this.filters = /[!"#$%&()*+,\-./:;<=>?@[\\\]^_`{|}~\t\n]/g;
  }

  load() {
    try {
      const tokenizerPath = path.join(__dirname, '..', '..', 'model', 'tokenizer.json');
      let data = JSON.parse(fs.readFileSync(tokenizerPath, 'utf8'));
      
      // Keras tokenizer.json is often double-encoded (JSON string inside JSON)
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      
      const config = data.config || data;
      
      // word_index may be a JSON string or an object
      if (typeof config.word_index === 'string') {
        this.wordIndex = JSON.parse(config.word_index);
      } else if (typeof config.word_index === 'object' && config.word_index !== null) {
        this.wordIndex = config.word_index;
      }

      if (Object.keys(this.wordIndex).length === 0) {
        console.warn("Could not find word_index in tokenizer.json. Tokenization might fail.");
      } else {
        console.log(`Tokenizer loaded successfully. Vocabulary size: ${Object.keys(this.wordIndex).length}`);
      }

      this.numWords = config.num_words || 10000;
      this.oovToken = config.oov_token || '<OOV>';
      if (config.filters) {
        // basic escape
        const escapedFilters = config.filters.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        this.filters = new RegExp(`[${escapedFilters}\t\n]`, 'g');
      }
    } catch (error) {
      console.error("Failed to load tokenizer.json:", error.message);
    }
  }

  textsToSequences(texts) {
    if (!Array.isArray(texts)) {
      texts = [texts];
    }

    const oovIndex = this.wordIndex[this.oovToken] || 1;

    return texts.map(text => {
      // 1. Lowercase
      let processedText = text.toLowerCase();
      // 2. Replace filter characters with spaces (matches Keras behavior)
      processedText = processedText.replace(this.filters, ' ');
      // 3. Split by space
      const words = processedText.split(/\s+/).filter(w => w.length > 0);
      
      // 4. Map to integer indices
      const sequence = [];
      for (const word of words) {
        let index = this.wordIndex[word];
        if (!index || index >= this.numWords) {
          index = oovIndex;
        }
        sequence.push(index);
      }
      return sequence;
    });
  }

  padSequences(sequences, maxLen, padding = 'post', truncating = 'post') {
    return sequences.map(seq => {
      let padded = [...seq];
      
      // Truncate
      if (padded.length > maxLen) {
        if (truncating === 'pre') {
          padded = padded.slice(padded.length - maxLen);
        } else {
          padded = padded.slice(0, maxLen);
        }
      }
      
      // Pad
      if (padded.length < maxLen) {
        const padArray = new Array(maxLen - padded.length).fill(0);
        if (padding === 'pre') {
          padded = padArray.concat(padded);
        } else {
          padded = padded.concat(padArray);
        }
      }
      
      return padded;
    });
  }
}

module.exports = new TokenizerService();
