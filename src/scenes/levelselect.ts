// import { Structs } from "phaser";
import { levelbuttonStyle, backStyle } from "../game/core/buttons";
import { levels } from "../game/core/jsonmodule";
import { padStart } from "../game/core/misc/other";
// import gameScene from "./game";

const buttonlist: Phaser.GameObjects.Text[] = [];

// https://stackoverflow.com/a/57401891/8321285
function adjustHexValue(color: string, amount: number) {
    return `#${color.replace(/^#/, "").replace(/../g, (colorResult) => (`0${Math.min(255, Math.max(0, parseInt(colorResult, 16) + amount)).toString(16)}`).substr(-2))}`;
}

enum buttonType {
    locked = "#585858",
    next = "#fc7d00",
    completed = "#ede229",
    perfected = "#0ecc29"
}

class levelselectScene extends Phaser.Scene {
    constructor() { super({ key: "levelselectScene" }); }

    create(): void {
        // Background
        this.add.graphics()
            .fillGradientStyle(0xd3dcde, 0xd3dcde, 0x66828f, 0x66828f)
            .fillRect(0, 0, 960, 540)

        for (let i = 1; i < 9; i++) {
            for (let j = 0; j < 7; j++) {
                this.createButton(i, j, `${(8 * j) + i}`);
            }
        }

        const backButton = this.add.text(
            800, 475, "BACK", backStyle,
        ).setInteractive();
        buttonlist.push(backButton);

        buttonlist.forEach((btn) => {
            const btncolour = btn.style.backgroundColor;
            btn.on("pointerover", () => btn.setBackgroundColor(adjustHexValue(btn.style.backgroundColor, -0.2)));
            btn.on("pointerout", () => btn.setBackgroundColor(btncolour));
        });

        backButton.on("pointerdown", () => this.scene.start("menuScene"));
    }

    createButton(i: number, j: number, num: string): void {
        this.add.text(
            // math xD
            i * 110 - 72, j * 60 + 22, "test123",
        ).setBackgroundColor("#000").setPadding(18, 18, 18, 18)

        const levelButton = this.add.text(
            // math xD
            i * 110 - 70, j * 60 + 25, padStart(num, 3), levelbuttonStyle,
        ).setInteractive();

        // set code for buttons that have levels
        if (Number(num) <= levels.levels.length) {
            levelButton.on("pointerdown", () => this.scene.start("gameScene", {
                levelfile: levels,
                levelnumber: num,
            }));
        } else {
            levelButton.setBackgroundColor(buttonType.locked);
        }

        if (num === "1") levelButton.setBackgroundColor(buttonType.next);
        buttonlist.push(levelButton);
    }
}

export default levelselectScene;
