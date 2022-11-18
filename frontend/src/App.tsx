import React, { useState } from "react";
import { Reorder } from "framer-motion";
import "./App.css"

function App() {
	const [items, setItems] = useState([
		{ name: "brown-poker", link:"https://github.com/wilkyrlx/brown-poker", id: 1 },
		{ name: "brown-ccg/ccg-website", link:"https://github.com/brown-ccg/ccg-website", id: 2 },
		{ name: "esgaroth", link:"https://github.com/wilkyrlx/esgaroth", id: 3 },
	])
	return (
		<Reorder.Group axis="y" values={items}
			onReorder={setItems}>
			{items.map((item) => (
				<Reorder.Item key={item.id} value={item} >
					<div className="stripe-item">
						<img src={"/icons/folder.svg"} className="stripe-img"></img>
						<a href={item.link} target="_blank">{item.name}</a>
					</div>
				</Reorder.Item>
			))}
		</Reorder.Group>
	);
}

export default App;
