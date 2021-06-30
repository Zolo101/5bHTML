import { barTextStyle } from "./menubar";

export class Bar {
    name: string
    tabs: Tab[]
    container!: Phaser.GameObjects.Container;

    constructor(name: string) {
        this.name = name;
        this.tabs = [];
    }

    add(name: string, objects: Phaser.GameObjects.GameObject[]): Tab {
        const tab = new Tab(name, objects);
        this.tabs.push(tab)
        return tab;
    }

    render(x: number, y: number, scene: Phaser.Scene): void {
        this.container = scene.add.container(x, y)
        this.tabs.forEach((tab, i) => {
            const button = scene.add.text(x + (100 * i), y, tab.name, barTextStyle).setInteractive();

            button.on("pointerdown", () => {
                // this.clear();
                this.container.add(tab.objects);
            });
            button.on("pointerover", () => button.setBackgroundColor("#d4d4d4"));
            button.on("pointerout", () => button.setBackgroundColor("#cccccc"));
        })
    }

    clear(): void {
        this.container.removeAll();
    }

    move(x: number, y: number): void {
        this.container.setPosition(x, y)
    }
}

export class Tab {
    name: string
    objects: Phaser.GameObjects.GameObject[]

    constructor(name: string, objects: Phaser.GameObjects.GameObject[]) {
        this.name = name;
        this.objects = objects;
    }

    render(x: number, y: number, scene: Phaser.Scene): void {
        scene.add.container(x, y, this.objects);
    }
}

export default Bar;