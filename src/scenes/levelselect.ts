import { createBackButton, textStyle } from "../game/core/buttons";
import { levels } from "../game/core/jsonmodule";

const buttonlist: Phaser.GameObjects.Rectangle[] = [];

enum ButtonType {
    Locked = 0x585858,
    Next = 0xfc7d00,
    Completed = 0xede229,
    Perfected = 0x0ecc29,
}

class levelselectScene extends Phaser.Scene {
    constructor() { super({ key: "levelselectScene" }); }

    create(): void {
        // Background
        this.add.graphics()
            .fillGradientStyle(0xd3dcde, 0xd3dcde, 0x66828f, 0x66828f)
            .fillRect(0, 0, 960, 540)

        // too much? :)
        const textNums = Array(8).fill(0).map((num, i) => Array.from(Array(7).keys()).map((num) => (1 + (num * 8) + i).toString().padStart(3, "0")))
        console.log(textNums)

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 7; j++) {
                this.createButton(1 + i, j, (8 * j) + i + 1);
            }
            this.add.text(50 + i * 110, 22, textNums[i], textStyle)
                .setColor("#000")
                .setFontSize(48)
                .setFontStyle("bold")
        }

        createBackButton(this, "menuScene")

        buttonlist.forEach((btn) => {
            const btncolour = btn.fillColor;
            // const btnhexcolour = "#" + btn.fillColor.toString().slice(1);
            // btn.on("pointerover", () => btn.setFillStyle(Number(adjustHexValue(btnhexcolour, -0.2))));
            btn.on("pointerout", () => btn.setFillStyle(btncolour));
        });

    }

    createButton(i: number, j: number, num: number): void {
        // black rectangle
        this.add.rectangle(i * 110 - 20, j * 54 + 47.5, 105, 50, 0x000000)

        // main rectangle
        const levelButton = this.add.rectangle(i * 110 - 20, j * 54 + 47.5, 100, 45).setInteractive();

        // set code for buttons that have levels
        if (num <= levels.levels.length && levels.levels[num - 1]?.name !== "nil") {
            levelButton.setFillStyle(ButtonType.Completed)
            levelButton.on("pointerdown", () => this.scene.start("gameScene", {
                levelfile: levels,
                levelnumber: num,
            }));
        } else {
            levelButton.setFillStyle(ButtonType.Locked);
        }

        if (num === levels.levels.length) levelButton.setFillStyle(ButtonType.Next);
        buttonlist.push(levelButton);
    }
}

export default levelselectScene;
