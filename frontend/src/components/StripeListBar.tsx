import { stripeItem, stripeItemType } from "../types/StripeItem";

/** Gets a display name from a complex name
 * @param rawName - a name, could be example/dummy or just dummy or even example/path/dummy
 * @returns - a display name, for all above examples would be dummy
 */
function displayName(rawName: string): string {
    const parsedName: string[] = rawName.split('/');
    return parsedName[parsedName.length - 1];
}

export function StripeListBar({ item, setItems, items }: { item: stripeItem, setItems: (items: stripeItem[]) => void, items: stripeItem[]}) {


    function handleClick(item: stripeItem) {
        const isDirectory = item.typeItem === stripeItemType.DIRECTORY
        if (isDirectory) {
            globalThis.homeItems = items;
            setItems(item.children);
        }
    }
    
    function deleteItem(item: stripeItem) {
        let newItems = items.slice();
        const index = newItems.indexOf(item)
        if (index > -1) { // only splice array when item is found
            newItems.splice(index, 1);
        }
        setItems(newItems);
    }

    return (
        <div className="stripe-list-bar">
            <div className="stripe-contents">
                <img src={item.typeItem.path} className="stripe-img"></img>
                {/* splits via regex on item.name to remove the directory. This could be toggled in the future? */}
                <a href={item.link} onClick={(event) => handleClick(item)} target={item.typeItem.target}>{displayName(item.name)}</a>
            </div>
            <a href="#" onClick={(event) => deleteItem(item)}><img src="/icons/trash.svg" className="stripe-img stripe-delete"></img></a>
        </div>
    )
}