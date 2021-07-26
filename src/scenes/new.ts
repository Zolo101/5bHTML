import { createBackButton, textStyle } from "../game/core/buttons";

class newScene extends Phaser.Scene {
    constructor() { super({ key: "newScene" }); }

    create(): void {
        this.add.rectangle(0, 0, 960, 540, 0x333333).setOrigin(0, 0);

        this.add.text(
            120, 150,
            `Welcome to 5bHTML!
This is a complete remake of the HTwins game you all know and
love, with some extra cool things like custom levels.

Things you should know:
- This is a work in progress. Not all levels have been completed yet.
- There are some minor differences.
- Please report any bugs in the discord and github repo!
- have fun :)`,
            textStyle
        ).setFontSize(24)

        createBackButton(this, "menuScene")
    }
}

export default newScene;
