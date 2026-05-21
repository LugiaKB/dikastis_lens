// Log when background service worker is initialized
console.log("Background service worker iniciado");

// Listen for installation or update events
chrome.runtime.onInstalled.addListener((details) => {
  console.log(`Reason: ${details.reason}`);
  if (details.reason === "install") {
    console.log("Dikastis Lens instalado");
  }
});

// Export empty object to ensure the file is processed as an ES module by Vite
export {};
