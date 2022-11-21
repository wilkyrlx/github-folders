import React, { Dispatch, SetStateAction, useState } from "react";
import { motion, LayoutGroup } from "framer-motion"
import "./styles/ControlPanel.css"
import { stripeItem, stripeItemType } from "./components/StripeItem";


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
function AddFolderButton(props: {setItems: Dispatch<SetStateAction<stripeItem[]>>}) {
    const [expanded, setExpanded] = useState(false)
    const [newFolder, setNewFolder] = useState<string>('');


    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            console.log(newFolder)
            setNewFolder('')
            setExpanded(false)
            props.setItems([new stripeItem({ name: "brown-poker", link: "https://github.com/wilkyrlx/brown-poker", typeItem: stripeItemType.REPO, id: 1, children: [] }),
        ])
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
function AddManualRepoButton() {
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

function SettingsButton() {
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

function BackButton() {
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

function ControlPanel(props: {setItems: Dispatch<SetStateAction<stripeItem[]>>}) {
    return (
        <div className="control-panel">
            <LayoutGroup>
                <BackButton />
                <AddFolderButton setItems={props.setItems}/>
                <AddManualRepoButton />
                <SettingsButton />
            </LayoutGroup>
        </div>
    )

}

export { ControlPanel }