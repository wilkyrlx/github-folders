import React, { Dispatch, SetStateAction, useState } from "react";
import { stripeItem, stripeItemType } from "./data/StripeItem";
import { ControlPanel } from "./components/ControlPanel";
import StripeList from "./components/StripeList";


// TODO: this is a messy way of doing this - try to let react manage the state and remove all occurences of "globalThis.homeItems"
declare global {
	var homeItems: stripeItem[];
}

export interface StripeItemsProps {
	setItems: Dispatch<SetStateAction<stripeItem[]>>,
	items: stripeItem[],
}

function App() {
	// for testing only
	const esgaroth = new stripeItem({ name: "esgaroth", link: "https://github.com/wilkyrlx/esgaroth", typeItem: stripeItemType.REPO, children: [] })
	const brownPoker = new stripeItem({ name: "brown-poker", link: "https://github.com/wilkyrlx/brown-poker", typeItem: stripeItemType.REPO, children: [] })
	const brownCCG = new stripeItem({ name: "brown-ccg/ccg-website", link: "https://github.com/brown-ccg/ccg-website", typeItem: stripeItemType.REPO, children: [] })
	const testFolder = new stripeItem({ name: "websites", link: "#", typeItem: stripeItemType.DIRECTORY, children: [brownPoker, brownCCG] })
	const [items, setItems] = useState<stripeItem[]>([])

	
	return (
		<div className="app">
			<ControlPanel setItems={setItems} items={items}/>
			<StripeList setItems={setItems} items={items} />
		</div>
	);
}

export default App;
