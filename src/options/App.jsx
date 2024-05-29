


import { useEffect, useState } from "react";

export default function App() {
	const [items, setItems] = useState([]);
	const [websites, setWebsites] = useState([]);

	const  [web ,setweb] = useState([])

	useEffect(() => {
		// Fetch items from storage when the component mounts
		chrome.storage.sync.get("items", (data) => {
			setItems(data.items || []);
		});
		// Fetch items from background.js
		chrome.runtime.sendMessage({ type: "getItems" }, (response) => {
			setItems(response.items || []);
		});

		// Fetch blocked websites from storage
	const ds =	chrome.storage.sync.get("listofblokcedwebsites", (data) => {
			setWebsites(data.listofblokcedwebsites || []);
		});
		console.log(ds,"list of websites getting from storage")
	}, []);

	const onSubmitKeywords = () => {
		console.log("sending setItems");
		console.log(items);
		chrome.storage.sync.set({ items: items }, () => {
			console.log("items set");
		});
		chrome.runtime.sendMessage(
			{ type: "setItems", items: items },
			(response) => {
				console.log(response);
				console.log("runtime message sent");
			}
		);
	};

	const onRemoveItem = (itemToRemove) => {
		const newItems = items.filter((item) => item !== itemToRemove);
		setItems(newItems);
	};

	const onRemoveWebsite = (websiteToRemove) => {
		const newWebsites = websites.filter(
			(website) => website !== websiteToRemove
		);
		setWebsites(newWebsites);
		// Update Chrome storage with the new list of blocked websites
		chrome.storage.sync.set({ listofblokcedwebsites: newWebsites }, () => {
			console.log("Website removed from blocked list");
		});
	};

	const onSubmit = (event) => {
		event.preventDefault();
		const form = event.target;
		const input = form.item;
		const newItems = [...items, input.value];
		setItems(newItems);
		form.reset();
	};



useEffect(()=>{
	function getBlockedWebsites(callback) {
		chrome.storage.sync.get(["listOfBlockedWebsites"], (result) => {
			const listOfBlockedWebsites = result.listOfBlockedWebsites || [];
			console.log("Retrieved list: ", listOfBlockedWebsites);
			callback(listOfBlockedWebsites);

			let sett = [...listOfBlockedWebsites, listOfBlockedWebsites];

			setweb(sett);
			console.log(web);
		});
	}

	// Example usage:
	getBlockedWebsites((listOfBlockedWebsites) => {
		console.log("List of blocked websites: ", listOfBlockedWebsites);
		// You can perform further actions with the retrieved list here
	});
	
},[])

	



	

	return (
		<>
			<h2 className='font-bold text-2xl bg-red-500 text-center justify-center'>
				Keyword to block
			</h2>
			<form onSubmit={onSubmit} className='flex justify-center mt-4 mb-4'>
				<input
					type='text'
					name='item'
					placeholder='Add a new item'
					required
					className='border-2 border-black text-4xl'
				/>
				<button className='bg-red-500 text-white p-2 rounded-md text-4xl mx-4'>
					Add
				</button>
			</form>
			<ul>
				{items.map((item, index) => (
					<Item
						onRemoveItem={onRemoveItem}
						key={item + index}
						item={item}
						className='text-4xl'
					/>
				))}
			</ul>
			<button
				onClick={onSubmitKeywords}
				className='bg-red-500 text-white p-2 rounded-md text-4xl my-3 mx-5'
			>
				Submit
			</button>

		{web && web.map((website,index)=>(
			<Item item={website}  onRemoveItem={} 	 key={website+index}></Item>
		))}

		</>
	);
}

function Item({ item, onRemoveItem, onRemoveWebsite }) {
	return (
		<li className='text-4xl my-3'>
			{item}
			<button
				className='delete text-6xl'
				onClick={() => onRemoveItem(item)}
			>
				<span className='text-4xl mx-4'>x</span>
			</button>
			
		</li>
	);
}
