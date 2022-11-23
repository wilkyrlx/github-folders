import React, { useState } from "react";

/**
	 * This class functions as an enum with fields:
	 * path - path to the image icon
	 * target - repo opens in new tab, directory executes on page
	 * TODO: check how chrome extensions work, repo may not have to open in new tab
	 */ 
 class stripeItemType {
    static readonly REPO = new stripeItemType("/icons/command-line.svg", "_blank")
    static readonly DIRECTORY = new stripeItemType("/icons/folder.svg", "_self")

    // private to disallow creating other instances of this type
    private constructor(public readonly path: string, public readonly target: any) {
    }
}

interface stripeItemProps {
    name: string;
    link: string;
    typeItem:stripeItemType;
    id: number;
    children: number[] 
}

// TODO: consider auto-hashing ID
class stripeItem {
    public name: string;
    public link: string;
    public typeItem:stripeItemType;
    public id: number;
    public children: number[] 
    constructor(item:stripeItemProps){
        this.id = item.id;
        this.name = item.name;
        this.link = item.link;
        this.typeItem = item.typeItem;
        this.children = item.children;
    }
}

export { stripeItem, stripeItemType }