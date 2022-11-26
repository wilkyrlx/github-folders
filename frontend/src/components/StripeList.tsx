import { Reorder } from "framer-motion";
import "../styles/StripeList.css"
import { stripeItem, stripeItemType } from "../data/StripeItem";
import { StripeItemsProps } from "../App";



function StripeList({setItems, items}: StripeItemsProps) {
	// this is the most disgusting code ever written
	function handleClick(item: stripeItem) {
		const isDirectory = item.typeItem === stripeItemType.DIRECTORY
		if (isDirectory) {
			globalThis.homeItems = items;
			setItems(item.children);
		}
	}

	function deleteItem(item: stripeItem) {
		let newItems = items.slice();
		const index = newItems.indexOf(item)
		if (index > -1) { // only splice array when item is found
			newItems.splice(index, 1);
		}
		setItems(newItems);
	}

	// Actual list of items
	return (
		<div>
			<Reorder.Group axis="y" values={items}
				onReorder={setItems}>
				{items.map((item) => (
					<Reorder.Item key={item.id} value={item} >
						{/* This is where the UI of each stripe item is generated. Might make sense to do this
						    in a new component someday, but framer-motion does not like lists of react components */}
						<div className="stripe-item">
							<img src={item.typeItem.path} className="stripe-img"></img>
							<a href={item.link} onClick={(event) => handleClick(item)} target={item.typeItem.target}>{item.name}</a>
							{/* TODO: peg this to the right side*/}
							<a href="#" onClick={(event) => deleteItem(item)}><img src="/icons/trash.svg" className="stripe-img stripe-delete"></img></a>
						</div>
					</Reorder.Item>
				))}
			</Reorder.Group>
		</div>
	);
}

export default StripeList;
