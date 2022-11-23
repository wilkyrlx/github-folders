import React, { Dispatch, SetStateAction, useState } from "react";
import { stripeItem, stripeItemType } from "./components/StripeItem";
import { ControlPanel } from "./components/ControlPanel";
import StripeList from "./components/StripeList";


export interface StripeItemsProps {
	setItems: Dispatch<SetStateAction<stripeItem[]>>,
	items: stripeItem[],
}

function App() {
	const [items, setItems] = useState<stripeItem[]>([
		new stripeItem({ name: "brown-poker", link: "https://github.com/wilkyrlx/brown-poker", typeItem: stripeItemType.REPO, children: [] }),
		new stripeItem({ name: "brown-ccg/ccg-website", link: "https://github.com/brown-ccg/ccg-website", typeItem: stripeItemType.REPO, children: [] }),
		new stripeItem({ name: "esgaroth", link: "https://github.com/wilkyrlx/esgaroth", typeItem: stripeItemType.REPO, children: [] }),
		new stripeItem({ name: "esgaroth-folder", link: "#", typeItem: stripeItemType.DIRECTORY, children: [3, 1] }),
	])
	
	return (
		<div className="app">
			<ControlPanel setItems={setItems} items={items}/>
			<StripeList setItems={setItems} items={items}/>
		</div>
	);
}

export default App;
