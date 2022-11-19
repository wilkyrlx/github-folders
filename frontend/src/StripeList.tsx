import React, { useState } from "react";
import { Reorder } from "framer-motion";
import "./styles/StripeList.css"

function StripeList() {
	/**
	 * This class functions as an enum with fields:
	 * path - path to the image icon
	 * target - repo opens in new tab, directory executes on page
	 * TODO: check how chrome extensions work, repo may not have to open in new tab
	 */ 
	class stripeItemType {
		static readonly REPO = new stripeItemType("/icons/folder.svg", "_blank")
		static readonly DIRECTORY = new stripeItemType("/icons/command-line.svg", "_self")
	
		// private to disallow creating other instances of this type
		private constructor(public readonly path: string, public readonly target: any) {
		}
	}

	interface stripeItemProps {
		name: string;
		link: string;
		typeItem:stripeItemType;
		id: number;
		children: number[] 
	}

	class stripeItem {
		public name: string;
		public link: string;
		public typeItem:stripeItemType;
		public id: number;
		public children: number[] 
		constructor(item:stripeItemProps){
			this.id = item.id;
			this.name = item.name;
			this.link = item.link;
			this.typeItem = item.typeItem;
			this.children = item.children;
		}
	}

	const [items, setItems] = useState([
		new stripeItem({ name: "brown-poker", link:"https://github.com/wilkyrlx/brown-poker", typeItem:stripeItemType.REPO, id: 1, children: [] }),
		new stripeItem({ name: "brown-ccg/ccg-website", link:"https://github.com/brown-ccg/ccg-website",  typeItem:stripeItemType.REPO, id: 2, children: [] }),
		new stripeItem({ name: "esgaroth", link:"https://github.com/wilkyrlx/esgaroth",  typeItem:stripeItemType.REPO, id: 3, children: [] }),
		new stripeItem({ name: "esgaroth-folder", link:"#", typeItem:stripeItemType.DIRECTORY, id: 4, children: [3,1] }),
	])

	// this is the most disgusting code ever written
	function handleClick(item: any) {
		const isDirectory = item.typeItem == stripeItemType.DIRECTORY
		if(isDirectory) {
			let childItems = items.slice();
			const allFiltered:any[] = [];
			item.children.forEach((targetID: number) => {
				allFiltered.push(childItems.find(x => x.id === targetID));
			})
			setItems(allFiltered);
		}
	}

	// Actual list of items
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

export default StripeList;
