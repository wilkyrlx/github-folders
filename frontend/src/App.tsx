import React, { useState } from "react";
import { Reorder } from "framer-motion";
import "./App.css"


  

function App() {
	class stripeItem {
		static readonly REPO = new stripeItem("/icons/folder.svg", "_blank")
		static readonly DIRECTORY = new stripeItem("/icons/command-line.svg", "_self")
	
		// private to disallow creating other instances of this type
		private constructor(public readonly path: string, public readonly target: any) {
		}
	}

	const [items, setItems] = useState([
		{ name: "brown-poker", link:"https://github.com/wilkyrlx/brown-poker", typeItem:stripeItem.REPO, id: 1, children: [] },
		{ name: "brown-ccg/ccg-website", link:"https://github.com/brown-ccg/ccg-website",  typeItem:stripeItem.REPO, id: 2, children: [] },
		{ name: "esgaroth", link:"https://github.com/wilkyrlx/esgaroth",  typeItem:stripeItem.REPO, id: 3, children: [] },
		{ name: "esgaroth-folder", link:"#", typeItem:stripeItem.DIRECTORY, id: 4, children: [3,1] },

	])

	// this is the most disgusting code ever written
	function handleClick(item: any) {
		const isDirectory = item.typeItem == stripeItem.DIRECTORY
		if(isDirectory) {
			let childItems = items.slice();
			const allFiltered:any[] = [];
			item.children.forEach((targetID: number) => {
				allFiltered.push(childItems.find(x => x.id === targetID));
			})
			setItems(allFiltered);
		}
	}

	return (
		<Reorder.Group axis="y" values={items}
			onReorder={setItems}>
			{items.map((item) => (
				<Reorder.Item key={item.id} value={item} >
					<div className="stripe-item">
						<img src={item.typeItem.path} className="stripe-img"></img>
						<a href={item.link} onClick={(event) => handleClick(item)} target={item.typeItem.target}>{item.name}</a>
					</div>
				</Reorder.Item>
			))}
		</Reorder.Group>
	);
}

export default App;
