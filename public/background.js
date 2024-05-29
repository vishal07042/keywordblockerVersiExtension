console.log("hello from background.js");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type === "getItems") {
		console.log("Received getItems");
		chrome.storage.sync.get("items", (data) => {
			sendResponse({ items: data.items || [] });
		});
		return true; // Keeps the message channel open for sendResponse
	}

	if (message.type === "setItems") {
		console.log("Received setItems");
		chrome.storage.sync.set({ items: message.items }, () => {
			console.log("Items set in storage");
			sendResponse({ status: "success" });
		});
		return true; // Keeps the message channel open for sendResponse
	}


	
		if (message.type === "closeTab" && sender.tab) {
			chrome.tabs.remove(sender.tab.id);
		}
	});




