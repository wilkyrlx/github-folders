import React, { useState } from "react";
import { Reorder } from "framer-motion";
import "./StripeList.css"

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

	class stripeItem {
		public name: string;
		public link: string;
		public typeItem:stripeItemType;
		public id: number;
		public children: number[] 
		constructor(name:string, link:string, typeItem:stripeItemType, id:number, children:number[]){
			this.id = id;
			this.name = name;
			this.link = link;
			this.typeItem = typeItem;
			this.children = children;
		}
	}

	const [items, setItems] = useState([
		new stripeItem("brown-poker", "https://github.com/wilkyrlx/brown-poker", stripeItemType.REPO, 1, [] ),

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
