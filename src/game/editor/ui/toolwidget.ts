import Key from "../../core/misc/key";
import { PointArray } from "../tools";
import { Grid } from "./grid";
import { BaseOption } from "./option";

export class ToolWidgetBar {
    selected!: ToolWidget
    tools: Map<string, ToolWidget>

    constructor() {
        this.tools = new Map();
    }

    add(tool: ToolWidget): void {
        this.tools.set(tool.name, tool)
        tool.parent = this;
    }

    select(name: string): void {
        if (this.tools.get(name) === undefined) {
            console.error("5bHTML-Edit Error: Tried to get an unknown ToolWidget name")
            return;
        }
        const tool = this.tools.get(name);
        this.selected = tool as ToolWidget;
        console.log(this.selected)
    }

    render(x: number, y: number, scene: Phaser.Scene): void {
        let i = 0;
        for (const tool of this.tools.values()) {
            scene.add.image(x + (64 * (i + 1)) - 32, y, tool.iconKey)
                .setDisplaySize(64, 64)
                .setInteractive()
                .on("pointerdown", () => this.select(tool.name))
            console.log(tool.name)
            console.log(this.tools.get(tool.name))
            i += 1;
        }
    }
}

export class ToolWidget {
    name: string
    iconKey: string
    key: Key
    options!: BaseOption
    parent!: ToolWidgetBar | null
    // onSelect: (parent: ToolWidgetBar) => void // on select tool
    onClick!: (pos: Phaser.Math.Vector2, grid: Grid) => PointArray // on click on a block
    renderHover!: (pos: Phaser.Math.Vector2, grid: Grid) => PointArray // hover on grid

    constructor(name: string, key: Key, iconKey = "toolwidget_example") {
        this.name = name;
        this.iconKey = iconKey;
        this.key = key;
    }
}

export default ToolWidgetBar;