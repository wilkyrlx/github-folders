import "../styles/ControlPanel.css"

import React, { Dispatch, SetStateAction, useState } from "react";
import { motion, LayoutGroup } from "framer-motion"
import { stripeItem, stripeItemType } from "../data/StripeItem";
import { StripeItemsProps } from "../App";
import { readGithub } from "../github-interface/GithubReader";
import { beginOAuth } from "../github-interface/GithubAuth";


export const BUTTON_BORDER_RADIUS = "25px"

interface ControlledInputProps {
    value: string,
    setValue: Dispatch<SetStateAction<string>>,
    placeholder: string,
    keyHandler: any,
}

interface ExpandingButtonProps {
    setItems: Dispatch<SetStateAction<stripeItem[]>>,
    items: stripeItem[],
    setExpanded: Dispatch<SetStateAction<expandedEnum>>,
    expanded: expandedEnum
}

function ControlledInput({ value, setValue, placeholder, keyHandler }: ControlledInputProps) {
    const inputVar = {
        hidden: {
            opacity: 0, transition: {
                delay: 0.2
            }
        },
        show: {
            opacity: 1, transition: {
                delay: 0.2
            }
        }
    };

    return (
        <motion.input
            layout
            autoFocus
            value={value}
            onChange={(ev) => setValue(ev.target.value)}
            placeholder={placeholder}
            onKeyDown={keyHandler}
            variants={inputVar}
            initial="hidden"
            animate="show"
            exit="hidden"
        ></motion.input>
    );
}

function AddFolderButton({ setItems, items, setExpanded, expanded }: ExpandingButtonProps) {
    const [newFolder, setNewFolder] = useState<string>('');

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            console.log(newFolder)
            setNewFolder('')
            setExpanded(expandedEnum.NONE)
            const newItems = items.slice();
            newItems.push(new stripeItem({ name: newFolder, link: "#", typeItem: stripeItemType.DIRECTORY, children: [] }));
            setItems(newItems);
        }
    }


    return (
        <motion.div
            layout
            onClick={() => setExpanded(expandedEnum.FOLDER)}
            className="add-folder-button expand-button"
            data-expanded={expanded === expandedEnum.FOLDER}
            style={{
                borderRadius: BUTTON_BORDER_RADIUS
            }}>

            {expanded !== expandedEnum.FOLDER && <motion.img layout className="button-img" src="/icons/folder-plus.svg" />}
            {expanded === expandedEnum.FOLDER && <ControlledInput value={newFolder} setValue={setNewFolder} placeholder={"Add New Folder (Beta)"} keyHandler={handleKeyDown} />}
        </motion.div>
    )

}


function AddManualRepoButton({ setItems, items, setExpanded, expanded }: ExpandingButtonProps) {
    const [newRepo, setNewRepo] = useState<string>('');

    // TODO: fix issue where user can submit a repo name that already exists. Maybe random directory? random/dummy
    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            console.log(newRepo)
            setNewRepo('')
            setExpanded(expandedEnum.NONE)
            const newItems = items.slice();
            newItems.push(new stripeItem({ name: newRepo, link: "#", typeItem: stripeItemType.REPO, children: [] }));
            setItems(newItems);
        }
    }

    return (
        <motion.div
            layout
            onClick={() => setExpanded(expandedEnum.MANUAL)}
            className="expand-button"
            data-expanded={expanded === expandedEnum.MANUAL}
            style={{
                borderRadius: BUTTON_BORDER_RADIUS
            }}>

            {expanded !== expandedEnum.MANUAL && <motion.img layout className="button-img" src="/icons/search.svg" />}
            {expanded === expandedEnum.MANUAL && <ControlledInput value={newRepo} setValue={setNewRepo} placeholder={"Paste Repository Link"} keyHandler={handleKeyDown} />}
        </motion.div>
    )
}

function SettingsButton({ setItems, items }: StripeItemsProps) {
    return (
        <motion.div
            layout
            onClick={() => readGithub({ setItems, items })}
            className="expand-button"
            style={{
                borderRadius: BUTTON_BORDER_RADIUS
            }}>
            <motion.img layout className="button-img" src="/icons/settings.svg" />
        </motion.div>
    )
}

// FIXME: not working right now
function BackButton({ setItems, items }: StripeItemsProps) {
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

class expandedEnum {
    static readonly FOLDER = new expandedEnum()
    static readonly MANUAL = new expandedEnum()
    static readonly NONE = new expandedEnum()

    // private to disallow creating other instances of this type
    private constructor() {
    }
}

function ControlPanel({ setItems, items }: StripeItemsProps) {

    const [expanded, setExpanded] = useState<expandedEnum>(expandedEnum.NONE)

    return (
        <div className="control-panel">
            <LayoutGroup>
                <BackButton setItems={setItems} items={items} />
                <AddFolderButton setItems={setItems} items={items} setExpanded={setExpanded} expanded={expanded} />
                <AddManualRepoButton setItems={setItems} items={items} setExpanded={setExpanded} expanded={expanded} />
                <SettingsButton setItems={setItems} items={items} />
            </LayoutGroup>
        </div>
    )

}

export { ControlPanel }