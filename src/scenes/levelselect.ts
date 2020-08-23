//import { Structs } from "phaser";
import { levelbuttonStyle, backStyle } from "../game/core/buttons";
//import gameScene from "./game";

const levels = require("../game/core/json/levels.json");

const buttonlist: Phaser.GameObjects.Text[] = [];

// https://stackoverflow.com/a/57401891/8321285
function adjustHexValue(color: string, amount: number) {
    return `#${color.replace(/^#/, '').replace(/../g, (colorResult) => (`0${Math.min(255, Math.max(0, parseInt(colorResult, 16) + amount)).toString(16)}`).substr(-2))}`;
}

class levelselectScene extends Phaser.Scene {
    constructor() { super({ key: "levelselectScene" }); }

    create(): void {
        // Background
        this.add.rectangle(0, 0, 960, 540, 0x999999).setOrigin(0, 0);

        for (let i = 1; i < 9; i++) {
            for (let j = 0; j < 7; j++) {
                this.CreateButton(i, j, `${(8*j)+i}`);
            }
        }

        const backButton = this.add.text(
            800, 475, "BACK", backStyle,
        ).setInteractive();
        buttonlist.push(backButton);

        buttonlist.forEach((btn) => {
            const btncolour = btn.style.backgroundColor;
            btn.on('pointerover', () => btn.setBackgroundColor(adjustHexValue(btn.style.backgroundColor, -0.2)));
            btn.on('pointerout', () => btn.setBackgroundColor(btncolour));
        });

        backButton.on('pointerdown', () => this.scene.start("menuScene"));
    }

    CreateButton(i: number, j: number, num: string): void {
        const levelButton = this.add.text(
            // math xD
            i*110-70, j*60+25, num.padStart(3, "0"), levelbuttonStyle,
        ).setInteractive();

        if (num <= levels.length) {
            levelButton.on('pointerdown', () => this.scene.start("gameScene", { levelnumber: num }));
        } else {
            levelButton.setBackgroundColor("#555");
        }

        if (num === "1") levelButton.setBackgroundColor("#f80");
        buttonlist.push(levelButton);
    }
}

export default levelselectScene;
