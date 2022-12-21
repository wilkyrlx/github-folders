import { Reorder } from "framer-motion";
import "../styles/StripeList.css"
import { StripeItemsProps } from "../App";
import { StripeListBar } from "./StripeListBar";
import { stripeItemType } from "../types/StripeItem";



function StripeList({ setItems, items }: StripeItemsProps) {

	// Actual list of items
	return (
		<div>
			<Reorder.Group axis="y" values={items}
				onReorder={setItems}>
				{items.map((item) => (
					<Reorder.Item key={item.id} value={item} className={borderColor(item.typeItem)} >
						<StripeListBar item={item} setItems={setItems} items={items} />
					</Reorder.Item>
				))}
			</Reorder.Group>
		</div>
	);
}

/**
 * This function helps color the border of Ad items gold
 * @param itemType - the type of item
 * @returns normal class "stripe-li" or "stripe-li-ad" if the item is an ad
 */
function borderColor(itemType: stripeItemType): string {
	let listClassOutput: string = "stripe-li";
	if(itemType === stripeItemType.AD) {
		listClassOutput += " stripe-li-ad";
	}
	return listClassOutput;
}
export default StripeList;
