const puppeteer = require('puppeteer');

class ScraperService {
  constructor() {
    this.browser = null;
  }

  /**
   * Pre-launch the browser so the first request doesn't pay startup cost.
   */
  async init() {
    if (!this.browser) {
      console.log('Pre-launching Puppeteer browser...');
      this.browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-extensions',
          '--disable-background-networking',
          '--disable-default-apps',
          '--disable-translate',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });
      console.log('Puppeteer browser ready.');
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
    // 1. Basic SSRF / Security check
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch (e) {
      throw new Error('Invalid URL format');
    }

    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      throw new Error('Invalid URL protocol. Only HTTP and HTTPS are allowed.');
    }
    
    const hostname = parsedUrl.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1' || hostname.startsWith('192.168.') || hostname.startsWith('10.')) {
      throw new Error('Scraping internal network addresses is forbidden.');
    }

    if (!this.browser) {
      await this.init();
    }

    const page = await this.browser.newPage();
    
    try {
      // Minimal viewport — we only need text, not rendering
      await page.setViewport({ width: 800, height: 600 });

      // Block heavy resources to speed up loading
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        const resourceType = req.resourceType();
        if (['image', 'stylesheet', 'font', 'media', 'script', 'texttrack', 'xhr', 'fetch', 'eventsource', 'websocket', 'manifest', 'other'].includes(resourceType)) {
          req.abort();
        } else {
          req.continue();
        }
      });

      // Navigate — 10 second timeout is enough for HTML
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });

      // Extract headline and article text separately
      const result = await page.evaluate(() => {
        // 1. Extract headline — this is what the model was trained on
        const headline = 
          (document.querySelector('h1') && document.querySelector('h1').innerText.trim()) ||
          (document.querySelector('[class*="headline"]') && document.querySelector('[class*="headline"]').innerText.trim()) ||
          (document.querySelector('[class*="title"]') && document.querySelector('[class*="title"]').innerText.trim()) ||
          (document.querySelector('title') && document.querySelector('title').innerText.trim()) ||
          '';

        // 2. Extract article body text for the snippet display
        const junk = document.querySelectorAll('script, style, noscript, iframe, nav, footer, header, aside, [role="banner"], [role="navigation"], .sidebar, .ad, .advertisement, .social-share');
        junk.forEach(el => el.remove());
        
        const article = document.querySelector('article') 
          || document.querySelector('[role="main"]')
          || document.querySelector('.article-body')
          || document.querySelector('.story-body')
          || document.querySelector('main');
        
        const source = article || document.body;
        const bodyText = source ? source.innerText.replace(/\s+/g, ' ').trim() : '';

        return { headline, bodyText };
      });

      if (!result.headline && !result.bodyText) {
        throw new Error('No readable text found on the page.');
      }

      return {
        headline: result.headline || result.bodyText.substring(0, 300),
        bodyText: result.bodyText
      };
    } catch (error) {
      console.error(`Scraping failed for ${url}:`, error.message);
      throw error;
    } finally {
      await page.close();
    }
  }
}

module.exports = new ScraperService();
