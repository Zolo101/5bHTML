import { levelbuttonStyle, backStyle, textStyle } from "../game/core/buttons";
import { levels } from "../game/core/jsonmodule";
import { padStart } from "../game/core/misc/other";

const buttonlist: Phaser.GameObjects.Rectangle[] = [];

enum buttonType {
    locked = 0x585858,
    next = 0xfc7d00,
    completed = 0xede229,
    perfected = 0x0ecc29,
}

class levelselectScene extends Phaser.Scene {
    constructor() { super({ key: "levelselectScene" }); }

    create(): void {
        // Background
        this.add.graphics()
            .fillGradientStyle(0xd3dcde, 0xd3dcde, 0x66828f, 0x66828f)
            .fillRect(0, 0, 960, 540)

        // too much? :)
        const textNums = Array(8).fill(0).map((num, i) => Array.from(Array(7).keys()).map((num) => padStart(1 + (num * 7) + i, 3)))
        console.log(textNums)

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 7; j++) {
                this.createButton(1 + i, j, `${(8 * j) + i}`);
            }
            this.add.text(50 + i * 110, 22, textNums[i], textStyle)
                .setColor("#000")
                .setFontSize(48)
                .setFontStyle("bold")
        }

        const backButton = this.add.text(
            800, 475, "BACK", backStyle,
        ).setInteractive();
        backButton.on("pointerdown", () => this.scene.start("menuScene"));

        buttonlist.forEach((btn) => {
            const btncolour = btn.fillColor;
            // const btnhexcolour = "#" + btn.fillColor.toString().slice(1);
            // btn.on("pointerover", () => btn.setFillStyle(Number(adjustHexValue(btnhexcolour, -0.2))));
            btn.on("pointerout", () => btn.setFillStyle(btncolour));
        });

    }

    createButton(i: number, j: number, num: string): void {
        // black rectangle
        this.add.rectangle(i * 110 - 20, j * 54 + 47.5, 105, 50, 0x000000)

        // main rectangle
        const levelButton = this.add.rectangle(i * 110 - 20, j * 54 + 47.5, 100, 45).setInteractive();

        // set code for buttons that have levels
        if (Number(num) <= levels.levels.length) {
            levelButton.on("pointerdown", () => this.scene.start("gameScene", {
                levelfile: levels,
                levelnumber: `${num + 1}`,
            }));
        } else {
            levelButton.setFillStyle(buttonType.locked);
        }

        if (num === "1") levelButton.setFillStyle(buttonType.next);
        buttonlist.push(levelButton);
    }
}

export default levelselectScene;
