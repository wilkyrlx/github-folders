import React, { Dispatch, SetStateAction, useState } from "react";
import { motion, LayoutGroup } from "framer-motion"
import "./styles/ControlPanel.css"
import { stripeItem, stripeItemType } from "./components/StripeItem";
import { StripeItemsProps } from "./App";


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

	const cyrb53 = (str:string, seed = 0) => {
		let h1 = 0xdeadbeef ^ seed,
		  h2 = 0x41c6ce57 ^ seed;
		for (let i = 0, ch; i < str.length; i++) {
		  ch = str.charCodeAt(i);
		  h1 = Math.imul(h1 ^ ch, 2654435761);
		  h2 = Math.imul(h2 ^ ch, 1597334677);
		}
		
		h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
		h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
		
		return 4294967296 * (2097151 & h2) + (h1 >>> 0);
	};

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            console.log(newFolder)
            setNewFolder('')
            setExpanded(false)
            const newItems = items.slice();
            newItems.push(new stripeItem({ name: newFolder, link: "#", typeItem: stripeItemType.DIRECTORY, id: cyrb53(newFolder) , children: [] }));
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
            {expanded && <ControlledInput value={newFolder} setValue={setNewFolder} placeholder={"Type a command"} keyHandler={handleKeyDown} />}
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
            {expanded && <ControlledInput value={newRepo} setValue={setNewRepo} placeholder={"Type a command"} keyHandler={handleKeyDown} />}

        </motion.div>
    )
}

function SettingsButton({setItems, items}: StripeItemsProps) {
    return (
        <motion.div
            layout
            onClick={() => { }}
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
            onClick={() => { }}
            className="expand-button"
            style={{
                borderRadius: BUTTON_BORDER_RADIUS
            }}>
            <motion.img layout className="button-img" src="/icons/back-arrow.svg" />
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