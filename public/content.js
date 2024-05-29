console.log("hello from content js");

let finItems;
// Send a message to the background script to get the items
chrome.runtime.sendMessage({ type: "getItems" }, (response) => {
	const items = response.items || [];
	finItems = items;
	console.log("Items retrieved from storage:", items);
	checkAndDelete();
	// Do something with the items, e.g., block keywords on the page
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
