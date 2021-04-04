import { barTextStyle } from "./menubar";

export class Bar {
    name: string
    tabs: Tab[]
    openContainer!: Phaser.GameObjects.Container;

    constructor(name: string) {
        this.name = name;
        this.tabs = [];
    }

    add(name: string, container: Phaser.GameObjects.Container): Tab {
        const tab = new Tab(name, container);
        this.tabs.push(tab)
        return tab;
    }

    render(x: number, y: number, scene: Phaser.Scene): void {
        this.openContainer = scene.add.container(x, y)
        this.tabs.forEach((tab, i) => {
            const button = scene.add.text(x + (100 * i), y, tab.name, barTextStyle).setInteractive();

            button.on("pointerdown", () => {
                this.openContainer.removeAll();
                this.openContainer.add(tab.container);
                // this.update(x, y + 30, scene);
            });
            button.on("pointerover", () => button.setBackgroundColor("#d4d4d4"));
            button.on("pointerout", () => button.setBackgroundColor("#cccccc"));
        })
    }

    // update(x: number, y: number, scene: Phaser.Scene): void {
    // this.openContainer.render(x, y, scene)
    // }
}

export class Tab {
    name: string
    container: Phaser.GameObjects.Container

    constructor(name: string, container: Phaser.GameObjects.Container) {
        this.name = name;
        this.container = container;
    }

    render(x: number, y: number, scene: Phaser.Scene): void {
        scene.add.container(x, y, this.container);
    }
}

export default Bar;