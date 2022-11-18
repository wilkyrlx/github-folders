import React, { useState } from "react";
import { motion } from "framer-motion"
import "./ControlPanel.css"


function HomeButton() {


    const [expanded, setExpanded] = useState(false)

    return (
        <motion.div
            layout
            animate={expanded ? "open" : "closed"}
            onClick={() => setExpanded(!expanded)}
            className="control-panel"
            data-expanded={expanded}
            style={{
                borderRadius: '20px'
            }}
        ></motion.div>
    )
}

function AddFolderButton() {

}

function AddManualRepoButton() {

}

function LinkAccountButton() {

}

function ControlPanel() {
    return (
        <div className="control-panel">
            <HomeButton />
        </div>
    )

}

export { ControlPanel }