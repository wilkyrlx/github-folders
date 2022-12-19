import { Reorder } from "framer-motion";
import "../styles/StripeList.css"
import { stripeItem, stripeItemType } from "../types/StripeItem";
import { StripeItemsProps } from "../App";



function StripeList({ setItems, items }: StripeItemsProps) {
	// this is the most disgusting code ever written
	function handleClick(item: stripeItem) {
		console.log(item.typeItem as stripeItemType)
		const isDirectory = item.typeItem === stripeItemType.DIRECTORY
		if (isDirectory) {
			globalThis.homeItems = items;
			setItems(item.children);
			console.log(item.children)
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

	/** Gets a display name from a complex name
	 * @param rawName - a name, could be example/dummy or just dummy or even example/path/dummy
	 * @returns - a display name, for all above examples would be dummy
	 */
	function displayName(rawName: string): string {
		//const parsedName: string[] = rawName.split('/');
		//return parsedName[parsedName.length - 1];
		return rawName;
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
							{/* splits via regex on item.name to remove the directory. This could be toggled in the future? */}
							<a href={item.link} onClick={(event) => handleClick(item)} target={item.typeItem.target}>{displayName(item.name)}</a>
						</div>
						<a href="#" onClick={(event) => deleteItem(item)}><img src="/icons/trash.svg" className="stripe-img stripe-delete"></img></a>
						
					</Reorder.Item>
				))}
			</Reorder.Group>
		</div>
	);
}

export default StripeList;
