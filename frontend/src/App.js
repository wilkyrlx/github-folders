import React,{useState} from "react";
import {Reorder} from "framer-motion";
import "./App.css"

function App() {
const [items, setItems] = useState([
	'GeeksforGeeks',
	'GFG',
	'Computer Science Portal'
])
return (
	<Reorder.Group axis="y" values={items}
		onReorder={setItems}>
	{items.map((item) => (
	<Reorder.Item key={item} value={item} >
		<div className="stripe-item">{item}</div>
	</Reorder.Item>
	))}
</Reorder.Group>
);
}

export default App;
