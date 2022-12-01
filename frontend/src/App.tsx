import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
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

	var updateDate = function (key: string, newData: { [x: string]: any; }) {
		if (localStorage.getItem(key) != null) {
			var oldData = JSON.parse(localStorage.getItem(key) as string);
			for (const keyObj in newData) {
				oldData[keyObj] = newData[keyObj];
			}
			var values = JSON.stringify(oldData);
			localStorage.setItem(key, values);
		} else {
			return false;
		}
	}

	return { set: setData, get: getData, update: updateDate }
})();

function setTest() {
	var a = { 'test': 113 };
	local.set('valueA', a);
}

function loadTest() {
	var a = local.get('valueA')
	console.log(a)
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
			<button onClick={() => setTest()}>save data</button>
			<button onClick={() => loadTest()}>load data</button>
			<ControlPanel setItems={setItems} items={items} />
			<StripeList setItems={setItems} items={items} />
		</div>
	);
}

export default App;
