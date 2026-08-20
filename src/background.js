/**
 * Eizz - Background Service Worker (Manifest V3)
 */

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Eizz Extension installed successfully.');

    // Initialize default user settings in chrome storage
    chrome.storage.sync.set({
      enabled: true,
      autoHighlight: true,
      customSkills: ['React', 'Python', 'AWS', 'TypeScript', 'Docker', 'GraphQL']
    });
  }
});

// Listener for message passing between popup and content scripts if needed
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'GET_SETTINGS') {
    chrome.storage.sync.get(['enabled', 'customSkills', 'autoHighlight'], (result) => {
      sendResponse(result);
    });
    return true; // Async response
  }
});
