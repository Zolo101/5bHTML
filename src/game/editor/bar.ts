import Key from "../core/misc/key";

const barTextStyle = {
    fontFamily: "Helvetica, Arial, sans-serif",
    fontSize: "18px",
    backgroundColor: "#ccc",
    color: "#000",
    fixedWidth: 120,
    padding: {
        y: 4,
        x: 4,
    },
};

const barTextStyleItem = {
    fontFamily: "Helvetica, Arial, sans-serif",
    fontSize: "14px",
    backgroundColor: "#ddd",
    color: "#000",
    fixedWidth: 120,
    padding: {
        y: 4,
        x: 4,
    },
};

export class Bar {
    name: string
    itemMap: Map<string, subBarItem>
    subBars: subBar[]

    constructor(name: string) {
        this.name = name;
        this.itemMap = new Map();
        this.subBars = [];
    }

    add(subbar: subBar): subBar {
        this.subBars.push(subbar);
        return subbar;
    }

    allItems(): subBarItem[] {
        const itemArray: subBarItem[] = [];
        this.subBars.forEach((subbar) => subbar.items.forEach((item) => itemArray.push(item)));
        return itemArray;
    }

    addToSubBarItem(name: string, subbaritem: subBarItem): void {
        this.itemMap.set(name, subbaritem);
    }

    updateItemMap(): void {
        this.itemMap.clear();
        this.allItems().forEach((item) => this.itemMap.set(item.key.getName(), item));
    }
}

export class subBar {
    text: string
    items: subBarItem[]
    scene: Phaser.Scene
    itemsGroup: Phaser.GameObjects.Group
    show: boolean
    open: boolean

    constructor(text: string, scene: Phaser.Scene, show = true) {
        this.text = text;
        this.items = [];
        this.scene = scene;
        this.itemsGroup = scene.add.group()
        this.show = show;
        this.open = false;
    }

    add(text: string, key: Key, onclick: () => void): subBarItem {
        const item = new subBarItem(text, key, onclick)
        this.items.push(item);
        return item;
    }

    render(x: number, y: number, scene: Phaser.Scene): void {
        const button = scene.add.text(x, y, this.text, barTextStyle).setInteractive();

        button.on("pointerdown", () => {
            this.open = !this.open;
            this.open ? this.onOpen(x, y, scene) : this.onClose()
        });
        button.on("pointerover", () => {
            button.setBackgroundColor("#d4d4d4");
        });
        button.on("pointerout", () => {
            button.setBackgroundColor("#cccccc");
        });
    }

    onOpen(x: number, y: number, scene: Phaser.Scene): void {
        this.items.forEach((item, i) => {
            const text = (item.key.code === "empty") ? `${item.text}` : `${item.text}   (${item.key.getName()})`
            const barItem = scene.add.text(x, (24 * (i + 1)) + 4, text, barTextStyleItem)
                .setInteractive()
                .on("pointerdown", () => item.onclick())
                .on("pointerover", () => barItem.setBackgroundColor("#b7b7b7"))
                .on("pointerout", () => barItem.setBackgroundColor("#d4d4d4"))
            this.itemsGroup.add(barItem)
        })
    }

    onClose(): void {
        this.itemsGroup.clear(true);
    }
}

export class subBarItem {
    text: string
    key: Key
    onclick: () => void

    constructor(text: string, key: Key, onclick: () => void) {
        this.text = text;
        this.key = key;
        this.onclick = onclick;
    }
}

export default subBar;