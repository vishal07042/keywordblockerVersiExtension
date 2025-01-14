console.log("hello from content js");

let finItems;
let websitesToRemove;
let urlToRemove;
// Send a message to the background script to get the items
chrome.runtime.sendMessage({ type: "getItems" }, (response) => {
	const items = response.items || [];
	finItems = items;
	console.log("Items retrieved from storage:", items);
	checkAndDelete();
	// Do something with the items, e.g., block keywords on the page
});


chrome.runtime.sendMessage({ type: "getUrlsToRemove" }, (response) => {
	const urls = response.urls || [];
	urlToRemove = urls;
	console.log("Urls retrieved from storage:", urls);
	urlToRemove = urls;
	console.log(urlToRemove);
	closingUrls();
});

chrome.runtime.sendMessage({ type: "getWebsitesToRemove" }, (response) => {
	const websites = response.websites || [];
	console.log("Websites retrieved from storage:", websites);
	websitesToRemove = websites;
	console.log(websitesToRemove);
	closingWebsites();
});

// function checkAndDelete(){
//     finItems.map((item) => {
//         if(window.document.body.innerText.includes(item)){
//             console.log("going in if")
//             console.log("deleting", item);
//             window.location.href = "https://www.google.com/";
//         }else{
//             console.log("going in else")
//         }
//     })
// }

function checkAndDelete() {
	finItems.map((item) => {
		if (window.document.body.innerText.includes(item)) {
			document.body.innerHTML = "";
			console.log("going in if");
			console.log("deleting", item);

			// Create a new element to display the message
			const messageNode = document.createElement("div");
			messageNode.innerText = `Keyword detected. Closing page in 5 seconds...`;
			messageNode.style.position = "fixed";
			messageNode.style.top = "50%";
			messageNode.style.left = "50%";
			messageNode.style.transform = "translate(-50%, -50%)";
			messageNode.style.backgroundColor = "red";
			messageNode.style.color = "white";
			messageNode.style.padding = "20px";
			messageNode.style.zIndex = "10000";
			document.body.appendChild(messageNode);

			// Set up the countdown
			let countdown = 5;
			const intervalId = setInterval(() => {
				countdown--;
				if (countdown > 0) {
					messageNode.innerText = `Keyword detected. Closing page in ${countdown} seconds...`;
				} else {
					clearInterval(intervalId);
					// Close the tab after 5 seconds
					chrome.runtime.sendMessage({ type: "closeTab" });
				}
			}, 1000);
		} else {
			console.log("going in else");
		}
	});
}

function closingWebsites(){
	if (websitesToRemove) {
		websitesToRemove.map((website) => {
			if (window.location.hostname == website) {
				console.log("going in if");
				chrome.runtime.sendMessage({ type: "closeTabwebsites" });
			}
		});
	}
	
}




function closingUrls(){
	if(urlToRemove){
		urlToRemove.map((url)=>{
			if(window.location.href == url){
				console.log("going in if");
				chrome.runtime.sendMessage({type: "closeTabUrls"});
			}
		})
	}
}

