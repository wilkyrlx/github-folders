import { Reorder } from "framer-motion";
import "../styles/StripeList.css"
import { stripeItem, stripeItemType } from "../data/StripeItem";
import { StripeItemsProps } from "../App";



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
							<img src="/icons/trash.svg" onClick={(event) => deleteItem(item)} className="stripe-img stripe-delete"></img>
						</div>
					</Reorder.Item>
				))}
			</Reorder.Group>
		</div>
	);
}

export default StripeList;