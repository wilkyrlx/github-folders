import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { stripeItem, stripeItemType } from "./types/StripeItem";
import { ControlPanel } from "./components/ControlPanel";
import StripeList from "./components/StripeList";
import { pageView } from "./types/pageView";
import { Settings } from "./components/Settings";
import { loadLocalData, saveLocalData } from "./scripts/saveLocalData";
import { readGithub } from "./scripts/GithubReader";



// TODO: this is a messy way of doing this - try to let react manage the state and remove all occurences of "globalThis.homeItems"
declare global {
	var homeItems: stripeItem[];
}

// TODO: rename + consider not using props
export interface StripeItemsProps {
	setItems: Dispatch<SetStateAction<stripeItem[]>>,
	items: stripeItem[],
}

export interface AppProps {
	setItems: Dispatch<SetStateAction<stripeItem[]>>,
	items: stripeItem[],
	setView: Dispatch<SetStateAction<pageView>>,
}


function App() {
	// TODO: better name for permItems and items
	const [permItems, setPermItems] = useState<stripeItem[]>([])	// items viewable user's list. modified by items
	const [items, setItems] = useState<stripeItem[]>([])			// items in user's list. this is the one that is modified
	const [view, setView] = useState<pageView>(pageView.MAIN)		// which page is being displayed

	// FIXME: component mounts twice because index.tsx has react.strictmode. see https://stackoverflow.com/questions/61254372/my-react-component-is-rendering-twice-because-of-strict-mode/61897567#61897567
	// runs when the component is mounted (only once)
	useEffect(() => {
		console.log('initializing app');
		loadLocalData({ setItems, items });
		// TODO: should this be called at start, or somewhere else? Also, need to double check for duplicates with local storage
		readGithub({setItems, items});
	}, []);


	/**
	 * every time some function modifies items, filters out duplicates, saves to local storage,
	 * and sets permItems (viewable in StripeList)
	 */
	useEffect(() => {
		// prevents saving empty items
		if (items.length === 0) return;

		// removes duplicates
		const ids = items.map(o => o.id)
		const filtered = items.filter(({id}, index) => !ids.includes(id, index + 1))

		saveLocalData(filtered);
		setPermItems(filtered);
	}, [items]);

	// TODO: format these packs better, also may want to remove some enum props. StripeItemsProps is a bad name
	const itemsPack: StripeItemsProps = { setItems, items }
	const appPack: AppProps = { setItems, items, setView }

	return (
		<div className="app">
			<p>This is {process.env.REACT_APP_BASE_URL}</p>
			<button onClick={() => saveLocalData(items)}>save data</button>
			<button onClick={() => loadLocalData({ ...itemsPack })}>load data</button>
			<button onClick={() => readGithub({ ...itemsPack })}>github API</button>
			<ControlPanel {...appPack} />
			{view === pageView.MAIN && <StripeList setPermItems={setPermItems} permItems={permItems}/>}
			{view === pageView.SETTINGS && <Settings {...itemsPack} />}
		</div>
	);
}

export default App;
