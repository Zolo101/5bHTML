import Key from "../../core/misc/key";
import { Point } from "../tools";
import { BaseOption } from "./option";
import { Screen } from "./screen";

export class ToolWidgetBar {
    selected!: ToolWidget
    tools: Map<string, ToolWidget>
    onChange!: (tool: ToolWidget) => void

    constructor() {
        this.tools = new Map();
    }

    add(tool: ToolWidget): void {
        this.tools.set(tool.name, tool)
        tool.parent = this;
    }

    select(name: string): void {
        const tool = this.tools.get(name);
        if (tool === undefined) {
            throw console.error("5bHTML-Edit Error: Tried to get an unknown ToolWidget name");
        }
        this.selected = tool;
        this.onChange(tool);
        console.log(this.selected)
    }

    render(x: number, y: number, scene: Phaser.Scene): void {
        let i = 0;
        for (const tool of this.tools.values()) {
            scene.add.image(x + (64 * (i + 1)) - 32, y, tool.iconKey)
                .setDisplaySize(64, 64)
                .setInteractive()
                .on("pointerdown", () => this.select(tool.name))
            i += 1;
        }
    }
}

export class ToolWidget {
    name: string
    iconKey: string
    key: Key
    special: boolean
    options!: BaseOption
    parent!: ToolWidgetBar | null
    getCoords!: (pos: Phaser.Math.Vector2, screen: Screen) => Point[]

    constructor(name: string, key: Key, iconKey = "toolwidget_example", special = false) {
        this.name = name;
        this.iconKey = iconKey;
        this.key = key;
        this.special = special;
    }
}

export default ToolWidgetBar;