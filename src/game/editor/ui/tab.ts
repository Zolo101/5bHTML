import { BaseOption } from "./option";

export class Tab {
    name: string
    options: BaseOption[]

    constructor(name: string) {
        this.name = name;
        this.options = [];
    }

    add(option: BaseOption): BaseOption {
        this.options.push(option)
        return option;
    }

    render(x: number, y: number, scene: Phaser.Scene): void {
        this.options.forEach((option, i) => option.render(x, y + (50 * (i + 1)), scene))
    }
}

export default Tab;