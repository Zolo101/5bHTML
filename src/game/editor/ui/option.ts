/* eslint-disable max-classes-per-file */
// export type BaseOptionConstructionParameter = ConstructorParameters<

import { textStyle } from "../../core/buttons"
import Settings from "../../settingsgame"

export type defaultValueTypes = number | boolean | string
export class BaseOption {
    text: string
    hoverText: string
    value: any
    event: (value: any) => void
    locked: boolean

    constructor(
        text: string,
        hoverText = "Untitled HoverText",
        value: defaultValueTypes,
        event: (value: any) => void
    ) {
        this.text = text;
        this.hoverText = hoverText;
        this.value = value;
        this.locked = false;
        this.event = event;
    }

    render(x: number, y: number, scene: Phaser.Scene): void {
        scene.add.text(x, y, this.text, textStyle).setFontSize(32)
    }

    onClick(): void {
        this.event(this.value);
    }
}

export class BooleanOption extends BaseOption {
    constructor(...args: ConstructorParameters<typeof BaseOption>) {
        super(...args)
    }

    render(x: number, y: number, scene: Phaser.Scene): void {
        super.render(x, y, scene);
        const colour = (this.value) ? 0x999999 : 0x666666
        const button = scene.add.rectangle(x + 260, y + 20, 40, 40, colour)
            .setInteractive()
            .on("pointerdown", () => {this.onClick();this.render(x, y, scene)})
            //.on("pointerover", () => {
            //    button.setFillStyle(0x444444);
            //})
            //.on("pointerout", () => {
            //    button.setFillStyle(colour);
            //});
    }

    onClick(): void {
        super.onClick()
        this.value = !this.value;
        console.log(Settings)
    }
}

export class SliderOption extends BaseOption {
    constructor(args: ConstructorParameters<typeof BaseOption>) {
        super(...args)
    }
}

export class DropDownOption extends BaseOption {
    selected: number
    values: DropDownOptionItem[]

    constructor(args: ConstructorParameters<typeof BaseOption>, defaultValue: number) {
        super(...args)
        this.values = [];
        this.selected = defaultValue;
    }

    add(optionitem: DropDownOptionItem): DropDownOptionItem {
        this.values.push(optionitem);
        return optionitem;
    }
}

class DropDownOptionItem {
    name: string
    value: number

    constructor(name: string, value: number) {
        this.name = name;
        this.value = value;
    }
}