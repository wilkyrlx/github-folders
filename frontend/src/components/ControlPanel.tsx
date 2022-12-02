import "../styles/ControlPanel.css"

import React, { Dispatch, SetStateAction, useState } from "react";
import { motion, LayoutGroup } from "framer-motion"
import { stripeItem, stripeItemType } from "../types/StripeItem";
import { AppProps, StripeItemsProps } from "../App";
import { expandedEnum } from "../types/expandedEnum";
import { pageView } from "../types/pageView";


const BUTTON_BORDER_RADIUS = "25px"

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

interface SettingsButtonProps extends ExpandingButtonProps {
    setView: Dispatch<SetStateAction<pageView>>
}

function ControlledInput({ value, setValue, placeholder, keyHandler }: ControlledInputProps) {
    const inputVar = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { delay: 0.2 } }
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

    function repoNameFromURL(url:string):string {
        // remove / and whitespace from end of URL to avoid empty names
        const shavedURL: string = url.replace(/\/\s*$/, "");
        const parsedURL: string[] = shavedURL.split('/'); 
        // if, for some reason, URL does not have a parent, use NONE-PARENT
		var parent: string = "NONE-PARENT"
        if (parsedURL.length >= 2) {
            parent = parsedURL[parsedURL.length - 2];
        }
        const name: string = parsedURL[parsedURL.length - 1];
        const rebuiltName: string = `${parent}/${name}`
        return rebuiltName;
    }

    // TODO: fix issue where user can submit a repo name that already exists. Maybe random directory? random/dummy
    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            console.log(newRepo)
            setNewRepo('')
            setExpanded(expandedEnum.NONE)
            const newItems = items.slice();
            newItems.push(new stripeItem({ name: repoNameFromURL(newRepo), link: newRepo, typeItem: stripeItemType.REPO, children: [] }));
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

function SettingsButton({ setItems, items, setExpanded, expanded, setView }: SettingsButtonProps) {
    // toggle between settings pageview and main pageview. Expand button
    function toggleNavigateSettings() {
        if (expanded === expandedEnum.SETTINGS) {
            // shrink and go to main if already toggled to SETTINGS
            setExpanded(expandedEnum.NONE)
            setView(pageView.MAIN)
        } else {
            // expand and go to SETTINGS
            setExpanded(expandedEnum.SETTINGS)
            setView(pageView.SETTINGS)
        }
    }

    return (
        <motion.div
            layout
            onClick={() => toggleNavigateSettings()}
            className="expand-button"
            data-expanded={expanded === expandedEnum.SETTINGS}
            style={{
                borderRadius: BUTTON_BORDER_RADIUS
            }}>
            <motion.img layout className="button-img" src="/icons/settings.svg" />
        </motion.div>
    )
}

function BackButton(appPack: AppProps) {

    // TODO: really ugly, breaks often
    function determineHomeItems(): stripeItem[] {
        if (globalThis.homeItems.length  > 0) {
            return globalThis.homeItems;
        }
        return [];
    }

    // navigate to the settings pageview
    function navigateHome() {
        appPack.setView(pageView.MAIN);
        appPack.setItems(determineHomeItems());
    }

    return (
        <motion.div
            layout
            onClick={() => navigateHome() }
            className="expand-button"
            style={{
                borderRadius: BUTTON_BORDER_RADIUS
            }}>
            {/* used to be back-arrow.svg */}
            <motion.img layout className="button-img" src="/icons/home.svg" />
        </motion.div>
    )
}



function ControlPanel(appPack: AppProps) {

    const [expanded, setExpanded] = useState<expandedEnum>(expandedEnum.NONE)
    return (
        <div className="control-panel">
            <LayoutGroup>
                <BackButton {...appPack} />
                <AddFolderButton setItems={appPack.setItems} items={appPack.items} setExpanded={setExpanded} expanded={expanded} />
                <AddManualRepoButton setItems={appPack.setItems} items={appPack.items} setExpanded={setExpanded} expanded={expanded} />
                <SettingsButton setItems={appPack.setItems} items={appPack.items} setExpanded={setExpanded} expanded={expanded} setView={appPack.setView} />
            </LayoutGroup>
        </div>
    )

}

export { ControlPanel }