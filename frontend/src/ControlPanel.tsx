import React, { useState } from "react";
import { motion } from "framer-motion"
import "./styles/ControlPanel.css"


function HomeButton() {


    
}

function AddFolderButton() {
    const [expanded, setExpanded] = useState(false)

    return (
        <motion.div
            layout
            animate={expanded ? "open" : "closed"}
            onClick={() => setExpanded(!expanded)}
            className="add-folder-button expand-button"
            data-expanded={expanded}
            style={{
                borderRadius: '20px'
            }}
        >
            
        </motion.div>
    )

}

function AddManualRepoButton() {

}

function LinkAccountButton() {

}

function ControlPanel() {
    return (
        <div className="control-panel">
            <AddFolderButton />
            <AddFolderButton />
        </div>
    )

}

export { ControlPanel }