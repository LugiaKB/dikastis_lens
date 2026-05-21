import { UrlParser } from "@/utils";

// On script load, detect context and log details
const currentUrl = window.location.href;
const pageType = UrlParser.detectPageType(currentUrl);
const extractedIds = UrlParser.extractIds(currentUrl);

console.log(`Page type detected: ${pageType}`);
console.log("Extracted IDs:", extractedIds);

// Export empty object to ensure ES module format
export {};
