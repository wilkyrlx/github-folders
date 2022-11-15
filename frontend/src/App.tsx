import React,{useState} from "react";
import {Reorder} from "framer-motion";
import "./App.css"

function App() {
const [items, setItems] = useState([
	'brown-poker',
	'brown-ccg/ccg-website',
	'esgaroth'
])
return (
	<Reorder.Group axis="y" values={items}
		onReorder={setItems}>
	{items.map((item) => (
	<Reorder.Item key={item} value={item} >
		<div className="stripe-item">
			<img src={"/icons/folder.svg"} className="stripe-img"></img>
			<a href="https://github.com/ghuser-io/github-contribs/blob/master/index.js">{item}</a>
		</div>
	</Reorder.Item>
	))}
</Reorder.Group>
);
}

export default App;
