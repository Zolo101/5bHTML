import Key from "../../core/misc/key";

export const barTextStyle = {
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

export const barTextStyleItem = {
    fontFamily: "Helvetica, Arial, sans-serif",
    fontSize: "14px",
    backgroundColor: "#ddd",
    color: "#000",
    fixedWidth: 260,
    padding: {
        y: 4,
        x: 4,
    },
};

export class MenuBar {
    name: string
    itemMap: Map<string, subMenuBarItem>
    subMenuBars: subMenuBar[]
    selected: subMenuBar | undefined

    constructor(name: string) {
        this.name = name;
        this.itemMap = new Map();
        this.subMenuBars = [];
    }

    add(subbar: subMenuBar): subMenuBar {
        this.subMenuBars.push(subbar);
        return subbar;
    }

    allItems(): subMenuBarItem[] {
        const itemArray: subMenuBarItem[] = [];
        this.subMenuBars.forEach((subbar) => subbar.items.forEach((item) => itemArray.push(item)));
        return itemArray;
    }

    addToSubBarItem(name: string, subbaritem: subMenuBarItem): void {
        this.itemMap.set(name, subbaritem);
    }

    updateItemMap(): void {
        this.itemMap.clear();
        this.allItems().forEach((item) => this.itemMap.set(item.key.getName(), item));
    }
}

export class subMenuBar {
    private _itemsGroup: Phaser.GameObjects.Group
    parent: MenuBar
    text: string
    items: subMenuBarItem[]
    show: boolean
    open: boolean

    constructor(text: string, scene: Phaser.Scene, parent: MenuBar, show = true) {
        this.text = text;
        this.items = [];
        this._itemsGroup = scene.add.group();
        this.parent = parent;
        this.show = show;
        this.open = false;
    }

    add(text: string, key: Key, onclick: () => void): subMenuBarItem {
        const item = new subMenuBarItem(text, key, onclick)
        this.items.push(item);
        return item;
    }

    render(x: number, y: number, scene: Phaser.Scene): void {
        const button = scene.add.text(x, y, this.text, barTextStyle).setInteractive();

        button.on("pointerdown", () => {
            this.open = !this.open;
            this.open ? this.onOpen(x, y, scene) : this.onClose()
        });
        // button.on("pointerdownoutside", () => {
        // this.onClose()
        // });
        button.on("pointerover", () => {
            button.setBackgroundColor("#d4d4d4");
        });
        button.on("pointerout", () => {
            button.setBackgroundColor("#cccccc");
        });
    }

    onOpen(x: number, y: number, scene: Phaser.Scene): void {
        // close old submenu and point it to this one
        if (this.parent.selected !== undefined) {
            this.parent.selected.open = false;
            this.parent.selected.onClose();
        }
        this.parent.selected = this;

        this.items.forEach((item, i) => {
            const text = (item.key.code === "empty") ? `${item.text}` : `${item.text}   (${item.key.getName()})`
            const menuBarItem = scene.add.text(x, (24 * (i + 1)) + 4, text, barTextStyleItem)
                .setInteractive()
                .setAlpha(0.8)
                .on("pointerdown", () => {if (this.open) item.onclick()})
                .on("pointerover", () => menuBarItem.setBackgroundColor("#b7b7b7"))
                .on("pointerout", () => menuBarItem.setBackgroundColor("#dddddd"))
            this._itemsGroup.add(menuBarItem)
        })
    }

    onClose(): void {
        this._itemsGroup.clear(true);
    }
}

export class subMenuBarItem {
    text: string
    key: Key
    onclick: () => void

    constructor(text: string, key: Key, onclick: () => void) {
        this.text = text;
        this.key = key;
        this.onclick = onclick;
    }
}

export default subMenuBar;