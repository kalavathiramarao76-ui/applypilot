import { Storage } from "@plasmohq/storage";

const storage = new Storage();

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SET_TOKEN") {
    storage.set("token", message.token).then(() => {
      sendResponse({ success: true });
    });
    return true; // async response
  }

  if (message.type === "GET_TOKEN") {
    storage.get("token").then((token) => {
      sendResponse({ token });
    });
    return true;
  }

  if (message.type === "REMOVE_TOKEN") {
    storage.remove("token").then(() => {
      sendResponse({ success: true });
    });
    return true;
  }

  if (message.type === "OPEN_DASHBOARD") {
    chrome.tabs.create({ url: "http://localhost:3000/dashboard" });
    sendResponse({ success: true });
  }

  if (message.type === "JOB_DETECTED") {
    // Update badge to indicate a job was found
    if (sender.tab?.id) {
      chrome.action.setBadgeText({ text: "JOB", tabId: sender.tab.id });
      chrome.action.setBadgeBackgroundColor({
        color: "#6366F1",
        tabId: sender.tab.id
      });
    }
    sendResponse({ success: true });
  }

  return false;
});

// Listen for tab updates to clear badge
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "loading") {
    chrome.action.setBadgeText({ text: "", tabId });
  }
});

export {};
