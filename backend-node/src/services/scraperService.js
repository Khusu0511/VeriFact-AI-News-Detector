const puppeteer = require('puppeteer');

class ScraperService {
  constructor() {
    this.browser = null;
  }

  async init() {
    if (!this.browser) {
      console.log('Initializing Puppeteer browser...');
      this.browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process', 
          '--disable-gpu'
        ]
      });
      console.log('Puppeteer initialized.');
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  /**
   * Scrapes text from a given URL safely.
   * @param {string} url - The URL to scrape.
   * @returns {Promise<string>} The extracted text.
   */
  async scrapeText(url) {
    // 1. Basic SSRF / Security check - ensure protocol is HTTP/HTTPS
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch (e) {
      throw new Error('Invalid URL format');
    }

    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      throw new Error('Invalid URL protocol. Only HTTP and HTTPS are allowed.');
    }
    
    // Check against localhost/internal IPs to prevent basic SSRF
    const hostname = parsedUrl.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1' || hostname.startsWith('192.168.') || hostname.startsWith('10.')) {
        throw new Error('Scraping internal network addresses is forbidden.');
    }

    if (!this.browser) {
      await this.init();
    }

    const page = await this.browser.newPage();
    
    try {
      // Abort unnecessary requests to save bandwidth and prevent execution of malicious scripts/ads
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        const resourceType = req.resourceType();
        if (['image', 'stylesheet', 'font', 'media', 'script'].includes(resourceType)) {
          req.abort();
        } else {
          req.continue();
        }
      });

      // Navigate with timeout
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });

      // Extract text content from the body, removing extra whitespace
      const text = await page.evaluate(() => {
        // Strip out scripts and styles from the DOM just in case
        const elementsToRemove = document.querySelectorAll('script, style, noscript, iframe, nav, footer, header');
        elementsToRemove.forEach(el => el.remove());
        
        return document.body ? document.body.innerText.replace(/\s+/g, ' ').trim() : '';
      });

      if (!text) {
          throw new Error('No readable text found on the page.');
      }

      return text;
    } catch (error) {
      console.error(`Scraping failed for ${url}:`, error.message);
      throw error;
    } finally {
      await page.close();
    }
  }
}

module.exports = new ScraperService();
