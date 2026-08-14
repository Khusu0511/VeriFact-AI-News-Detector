/**
 * This function is injected into the webpage to display the result banner.
 * It creates and styles a banner and adds it to the top of the page.
 * @param {string} type - The type of result ('real', 'fake', or 'error').
 * @param {string} message - The main message to display.
 */
function showResultBanner(type, message) {
  // Remove any banner that might already exist
  const existingBanner = document.getElementById('fake-news-result-banner');
  if (existingBanner) {
    existingBanner.remove();
  }

  // Create the banner element
  const banner = document.createElement('div');
  banner.id = 'fake-news-result-banner';

  let text = '';
  let backgroundGradient = '';
  let iconSvg = '';

  // Define SVG icons for different states
  const realIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
  const fakeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
  const errorIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;

  if (type === 'real') {
    text = `Likely REAL News (${message} confidence)`;
    backgroundGradient = 'linear-gradient(45deg, #10B981, #2DD4BF)'; // Green gradient
    iconSvg = realIcon;
  } else if (type === 'fake') {
    text = `Likely FAKE News (${message} confidence)`;
    backgroundGradient = 'linear-gradient(45deg, #EF4444, #F87171)'; // Red gradient
    iconSvg = fakeIcon;
  } else { // This handles error cases
    text = `Error: ${message}`;
    backgroundGradient = 'linear-gradient(45deg, #F59E0B, #FBBF24)'; // Amber/Orange gradient
    iconSvg = errorIcon;
  }

  // Apply styles to the banner
  Object.assign(banner.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    background: backgroundGradient,
    color: 'white',
    padding: '14px',
    zIndex: '999999',
    fontSize: '16px',
    fontWeight: '600',
    fontFamily: 'sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    borderBottom: '1px solid rgba(0,0,0,0.2)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
    transform: 'translateY(-100%)', // Start off-screen for animation
    animation: 'slideDown 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
  });

  // Set the inner HTML to include the icon and text
  banner.innerHTML = `
    ${iconSvg}
    <span>${text}</span>
  `;

  // Create a close button for the banner
  const closeButton = document.createElement('span');
  closeButton.textContent = '×';
  Object.assign(closeButton.style, {
    position: 'absolute',
    right: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    fontSize: '28px',
    fontWeight: '300',
    opacity: '0.7',
    transition: 'opacity 0.2s'
  });
  closeButton.onmouseover = () => closeButton.style.opacity = '1';
  closeButton.onmouseout = () => closeButton.style.opacity = '0.7';

  // Add functionality to the close button
  closeButton.onclick = (e) => {
    e.stopPropagation(); // Prevent the click from bubbling up
    banner.remove();
  };

  banner.appendChild(closeButton);

  // Add the banner to the top of the page's body
  document.body.prepend(banner);

  // Define the animation in a style tag and add to head to ensure it's available
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
    @keyframes slideDown {
      from { transform: translateY(-100%); }
      to { transform: translateY(0); }
    }
  `;
  document.head.appendChild(styleSheet);

  // Make the banner automatically disappear after 10 seconds
  setTimeout(() => {
    if (document.getElementById('fake-news-result-banner')) {
      banner.remove();
    }
    // Clean up the stylesheet from the head
    styleSheet.remove();
  }, 10000);
}

/**
 * This function is injected to get the main headline (h1) from the page.
 */
function getPageHeadline() {
  const h1 = document.querySelector('h1');
  return h1 ? h1.innerText : null;
}

// This is the main event listener that runs when you click the extension's icon.
chrome.action.onClicked.addListener(async (tab) => {
  // Ensure we can run scripts on the page
  if (!tab.url || !tab.url.startsWith("http")) {
    return;
  }

  try {
    // 1. Get the headline from the page
    const injectionResults = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: getPageHeadline,
    });

    const headline = injectionResults[0].result;

    if (headline) {
      // 2. Call the backend API if a headline was found
      const response = await fetch('https://verifact-api-oh3k.onrender.com/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: headline }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const result = await response.json();
      const predictionType = result.prediction === 'Real News' ? 'real' : 'fake';
      const confidencePercent = result.credibilityScore;

      // 3. Inject the banner with the prediction result
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: showResultBanner,
        args: [predictionType, `${confidencePercent}%`],
      });

    } else {
      // If no headline was found, show an error banner
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: showResultBanner,
        args: ['error', 'No headline (h1) found on page.'],
      });
    }
  } catch (e) {
    console.error("Fake News Detector Error:", e);
    // If the API call fails, show an error banner
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: showResultBanner,
      args: ['error', 'Could not connect to analysis server.'],
    });
  }
});
