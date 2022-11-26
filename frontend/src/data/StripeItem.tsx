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
        this.id = cyrb53(item.name);
        this.name = item.name;
        this.link = item.link;
        this.typeItem = item.typeItem;
        this.children = item.children;
    }
}

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

export { stripeItem, stripeItemType }