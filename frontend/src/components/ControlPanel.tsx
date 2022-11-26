import "../styles/ControlPanel.css"

import React, { Dispatch, SetStateAction, useState } from "react";
import { motion, LayoutGroup } from "framer-motion"
import { stripeItem, stripeItemType } from "../data/StripeItem";
import { StripeItemsProps } from "../App";
import { readGithub } from "../github-interface/GithubReader";


export const BUTTON_BORDER_RADIUS = "25px"



interface ControlledInputProps {
    value: string,
    setValue: Dispatch<SetStateAction<string>>,
    placeholder: string,
    keyHandler: any
}

function ControlledInput({ value, setValue, placeholder, keyHandler }: ControlledInputProps) {
    return (
        <motion.input
            layout
            autoFocus
            value={value}
            onChange={(ev) => setValue(ev.target.value)}
            placeholder={placeholder}
            onKeyDown={keyHandler}
        ></motion.input>
    );
}

// make edits to this one first
function AddFolderButton({setItems, items}: StripeItemsProps) {
    const [expanded, setExpanded] = useState(false)
    const [newFolder, setNewFolder] = useState<string>('');

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            console.log(newFolder)
            setNewFolder('')
            setExpanded(false)
            const newItems = items.slice();
            newItems.push(new stripeItem({ name: newFolder, link: "#", typeItem: stripeItemType.DIRECTORY , children: [] }));
            setItems(newItems);
        
        }
    }


    return (
        <motion.div
            layout
            animate={expanded ? "open" : "closed"}
            onClick={() => setExpanded(true)}
            className="add-folder-button expand-button"
            data-expanded={expanded}
            style={{
                borderRadius: BUTTON_BORDER_RADIUS
            }}>

            {!expanded && <motion.img layout className="button-img" src="/icons/folder-plus.svg" />}
            {expanded && <ControlledInput value={newFolder} setValue={setNewFolder} placeholder={"Add New Folder (Beta)"} keyHandler={handleKeyDown} />}
        </motion.div>
    )

}

// make edits to this one second
function AddManualRepoButton({setItems, items}: StripeItemsProps) {
    const [expanded, setExpanded] = useState(false)
    const [newRepo, setNewRepo] = useState<string>('');


    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            console.log(newRepo)
            setNewRepo(newRepo)
            setExpanded(false)
        }
    }

    return (
        <motion.div
            layout
            onClick={() => setExpanded(!expanded)}
            className="expand-button"
            data-expanded={expanded}
            style={{
                borderRadius: BUTTON_BORDER_RADIUS
            }}>

            {!expanded && <motion.img layout className="button-img" src="/icons/search.svg" /> }
            {expanded && <ControlledInput value={newRepo} setValue={setNewRepo} placeholder={"Paste Repository Link"} keyHandler={handleKeyDown} />}

        </motion.div>
    )
}

function SettingsButton({setItems, items}: StripeItemsProps) {
    return (
        <motion.div
            layout
            onClick={() => readGithub({setItems, items})}
            className="expand-button"
            style={{
                borderRadius: BUTTON_BORDER_RADIUS
            }}>
            <motion.img layout className="button-img" src="/icons/settings.svg" />
        </motion.div>
    )
}

function BackButton({setItems, items}: StripeItemsProps) {
    return (
        <motion.div
            layout
            onClick={() => { setItems(globalThis.homeItems) }}
            className="expand-button"
            style={{
                borderRadius: BUTTON_BORDER_RADIUS
            }}>
            {/* used to be back-arrow.svg */}
            <motion.img layout className="button-img" src="/icons/home.svg" />
        </motion.div>
    )
}

function ControlPanel({setItems, items}: StripeItemsProps) {
    return (
        <div className="control-panel">
            <LayoutGroup>
                <BackButton setItems={setItems} items={items}/>
                <AddFolderButton setItems={setItems} items={items}/>
                <AddManualRepoButton setItems={setItems} items={items}/>
                <SettingsButton setItems={setItems} items={items}/>
            </LayoutGroup>
        </div>
    )

}

export { ControlPanel }