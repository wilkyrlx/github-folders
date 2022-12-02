import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { stripeItem, stripeItemType } from "./types/StripeItem";
import { ControlPanel } from "./components/ControlPanel";
import StripeList from "./components/StripeList";
import { TypedJSON } from "typedjson";
import { pageView } from "./types/pageView";
import { Settings } from "./components/Settings";



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


//TODO: documentation
// https://stackoverflow.com/questions/34951170/save-json-to-chrome-storage-local-storage
var local = (function () {

	var setData = function (key: string, obj: any) {
		var values = JSON.stringify(obj);
		localStorage.setItem(key, values);
	
	}

	var getData = function (key: string) {
		if (localStorage.getItem(key) != null) {
			return JSON.parse(localStorage.getItem(key) as string);
		} else {
			return false;
		}
	}

	return { set: setData, get: getData }
})();


function App() {
	// for testing only
	const esgaroth = new stripeItem({ name: "esgaroth", link: "https://github.com/wilkyrlx/esgaroth", typeItem: stripeItemType.REPO, children: [] })
	const brownPoker = new stripeItem({ name: "brown-poker", link: "https://github.com/wilkyrlx/brown-poker", typeItem: stripeItemType.REPO, children: [] })
	const brownCCG = new stripeItem({ name: "brown-ccg/ccg-website", link: "https://github.com/brown-ccg/ccg-website", typeItem: stripeItemType.REPO, children: [] })
	const testFolder = new stripeItem({ name: "websites", link: "#", typeItem: stripeItemType.DIRECTORY, children: [brownPoker, brownCCG] })
	const [items, setItems] = useState<stripeItem[]>([])
	const [view, setView] = useState<pageView>(pageView.MAIN)

	//TODO: documentation
	function saveAllData() {
		var toSave = { data: items };
		local.set('repoDataKey', toSave);
	}
	//TODO: documentation
	function loadAllData() {
		var toLoad = local.get('repoDataKey')
		let newItems = items.slice();
		toLoad.data.forEach((element: stripeItem) => {
			var constructedStripeItemType: stripeItemType;
			if (element.typeItem.id == 1) {
				constructedStripeItemType = stripeItemType.REPO;
			} else {
				constructedStripeItemType = stripeItemType.DIRECTORY;
			}
			const constructedStripeItem: stripeItem = new stripeItem({name: element.name, link: element.link, typeItem: constructedStripeItemType, children:element.children})
			newItems.push(constructedStripeItem)
			console.log(constructedStripeItem)
		});
		setItems(newItems);
	}


	const itemsPack: StripeItemsProps = {setItems, items}
	const appPack: AppProps = {setItems, items, setView, view}

	return (
		<div className="app">
			<button onClick={() => saveAllData()}>save data</button>
			<button onClick={() => loadAllData()}>load data</button>
			<ControlPanel {...appPack} />
			{ view === pageView.MAIN && <StripeList {...itemsPack} /> }
			{ view === pageView.SETTINGS && <Settings /> }
		</div>
	);
}

export default App;
