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

//TODO: documentation
function saveLocalData(items: stripeItem[]) {
    var toSave = { data: items };
    local.set('repoDataKey', toSave);
}
//TODO: documentation
function loadLocalData({setItems, items }: StripeItemsProps) {
    var toLoad = local.get('repoDataKey')
    let newItems = items.slice();
    toLoad.data.forEach((element: stripeItem) => {
        var constructedStripeItemType: stripeItemType;
        if (element.typeItem.id == 1) {
            constructedStripeItemType = stripeItemType.REPO;
        } else if (element.typeItem.id == 2) {
            constructedStripeItemType = stripeItemType.DIRECTORY;
        } else if (element.typeItem.id == 3) {
            constructedStripeItemType = stripeItemType.ORGANIZATION;
        } else {
            throw new Error("Invalid stripeItemType id");
        }
        const constructedStripeItem: stripeItem = new stripeItem({ name: element.name, link: element.link, typeItem: constructedStripeItemType, children: element.children })
        newItems.push(constructedStripeItem)
        console.log(constructedStripeItem)
    });
    setItems(newItems);
}

export { saveLocalData, loadLocalData }