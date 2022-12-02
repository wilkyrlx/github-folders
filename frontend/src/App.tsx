import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { stripeItem, stripeItemType } from "./types/StripeItem";
import { ControlPanel } from "./components/ControlPanel";
import StripeList from "./components/StripeList";
import { pageView } from "./types/pageView";
import { Settings } from "./components/Settings";
import { loadAllData, saveAllData } from "./save-data/saveLocalData";



// TODO: this is a messy way of doing this - try to let react manage the state and remove all occurences of "globalThis.homeItems"
declare global {
	var homeItems: stripeItem[];
}

export interface StripeItemsProps {
	setItems: Dispatch<SetStateAction<stripeItem[]>>,
	items: stripeItem[],
}

export interface AppProps {
	setItems: Dispatch<SetStateAction<stripeItem[]>>,
	items: stripeItem[],
	setView: Dispatch<SetStateAction<pageView>>,
	view: pageView,
}


function App() {
	// for testing only
	const esgaroth = new stripeItem({ name: "esgaroth", link: "https://github.com/wilkyrlx/esgaroth", typeItem: stripeItemType.REPO, children: [] })
	const brownPoker = new stripeItem({ name: "brown-poker", link: "https://github.com/wilkyrlx/brown-poker", typeItem: stripeItemType.REPO, children: [] })
	const brownCCG = new stripeItem({ name: "brown-ccg/ccg-website", link: "https://github.com/brown-ccg/ccg-website", typeItem: stripeItemType.REPO, children: [] })
	const testFolder = new stripeItem({ name: "websites", link: "#", typeItem: stripeItemType.DIRECTORY, children: [brownPoker, brownCCG] })
	const [items, setItems] = useState<stripeItem[]>([])
	const [view, setView] = useState<pageView>(pageView.MAIN)

	const itemsPack: StripeItemsProps = {setItems, items}
	const appPack: AppProps = {setItems, items, setView, view}

	return (
		<div className="app">
			<button onClick={() => saveAllData(items)}>save data</button>
			<button onClick={() => loadAllData({...itemsPack})}>load data</button>
			<ControlPanel {...appPack} />
			{ view === pageView.MAIN && <StripeList {...itemsPack} /> }
			{ view === pageView.SETTINGS && <Settings /> }
		</div>
	);
}

export default App;
