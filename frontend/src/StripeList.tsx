import React, { Dispatch, SetStateAction, useState } from "react";
import { Reorder } from "framer-motion";
import "./styles/StripeList.css"
import { stripeItem, stripeItemType } from "./components/StripeItem";
import { StripeItemsProps } from "./App";



function StripeList({setItems, items}: StripeItemsProps) {

	// this is the most disgusting code ever written
	function handleClick(item: stripeItem) {
		const isDirectory = item.typeItem == stripeItemType.DIRECTORY
		if (isDirectory) {
			let childItems = items.slice();
			const allFiltered: any[] = [];
			item.children.forEach((targetID: number) => {
				allFiltered.push(childItems.find(x => x.id === targetID));
			})
			setItems(allFiltered);
		}
	}

	// Actual list of items
	return (
		<div>
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
		</div>
	);
}

export default StripeList;
