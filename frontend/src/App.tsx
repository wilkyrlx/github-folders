import React, { useState } from "react";
import { ControlPanel } from "./ControlPanel";
import StripeList from "./StripeList";


  

function App() {
	return (
		<div className="app">
			<ControlPanel/>
			<StripeList/>
		</div>
	);
}

export default App;
