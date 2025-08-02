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
      const data = JSON.parse(fs.readFileSync(tokenizerPath, 'utf8'));
      
      const config = JSON.parse(data.config.word_counts ? data.config : JSON.stringify(data.config)); // some tfjs versions double escape
      
      this.wordIndex = JSON.parse(data.config.word_index || "{}");
      if (Object.keys(this.wordIndex).length === 0 && data.config.word_index) {
          // Sometimes it's a string inside a string
          try {
             this.wordIndex = JSON.parse(data.config.word_index);
          } catch(e) {}
      }
      // If still empty, it might be in a different place depending on keras version
      if (Object.keys(this.wordIndex).length === 0) {
         console.warn("Could not find word_index in tokenizer.json. Tokenization might fail.");
      }

      this.numWords = data.config.num_words || 10000;
      this.oovToken = data.config.oov_token || '<OOV>';
      if (data.config.filters) {
        // basic escape
        const escapedFilters = data.config.filters.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        this.filters = new RegExp(`[${escapedFilters}\t\n]`, 'g');
      }
      console.log("Tokenizer loaded successfully.");
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
      // 2. Filter characters
      processedText = processedText.replace(this.filters, '');
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
