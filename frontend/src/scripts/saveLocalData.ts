//TODO: documentation

import { SetStateAction } from "react";
import { StripeItemsProps } from "../App";
import { stripeItem, stripeItemType } from "../types/StripeItem";

// https://stackoverflow.com/questions/34951170/save-json-to-chrome-storage-local-storage
var local = (function () {

    var setData = function (key: string, obj: any) {
        var values = JSON.stringify(obj);
        localStorage.setItem(key, values);

    }

    var getData = function (key: string) {
        if (localStorage.getItem(key) != null) {
            return JSON.parse(localStorage.getItem(key) as string);
        } else {
            return false;
        }
    }

    return { set: setData, get: getData }
})();

/**
 * Save data to local storage
 * @param items - stripeItems to save
 */
function saveLocalData(items: stripeItem[]) {
    var toSave = { data: items };
    local.set('repoDataKey', toSave);
}

/**
 * Loads data from local storage
 * Since stripeItemType is an enum, we need to convert the id to the enum before
 * constructing the stripeItem
 */
function loadLocalData({setItems, items }: StripeItemsProps) {
    let newItems = items.slice();

    var toLoad = local.get('repoDataKey')
    if (!toLoad) {
        return;
    }
    toLoad.data.forEach((element: stripeItem) => {
        var constructedStripeItemType: stripeItemType;
        if (element.typeItem.id == 1) {
            constructedStripeItemType = stripeItemType.REPO;
        } else if (element.typeItem.id == 2) {
            constructedStripeItemType = stripeItemType.DIRECTORY;
        } else if (element.typeItem.id == 3) {
            constructedStripeItemType = stripeItemType.ORGANIZATION;
        } else if (element.typeItem.id == 4) {
            constructedStripeItemType = stripeItemType.AD;
        } else {
            throw new Error("Invalid stripeItemType id");
        }
        const constructedStripeItem: stripeItem = new stripeItem({ name: element.name, link: element.link, typeItem: constructedStripeItemType, children: element.children })
        newItems.push(constructedStripeItem)
    });
    setItems(newItems);
}

export { saveLocalData, loadLocalData }