import { buttonStyle, textStyle } from "../buttons";
import { levels } from "../jsonmodule";
import { hexColourFromSeed } from "./other";
import Settings from "../../settingsgame";
const devdate = new Date(2021, 1, 31)

class menuOldScene extends Phaser.Scene {
    hoverText!: Phaser.GameObjects.Text
    constructor() { super("menuOldScene"); }

    create(): void {
        // Background
        this.add.rectangle(0, 0, 960, 540, 0x666666).setOrigin(0, 0);

        // 5b LOGO
        this.add.image(260, 400, "5b_logo");
        this.add.image(305, 175, "5b_people").setScale(0.9);

        const buttonlist = [];

        const newButton = this.add.text(
            640, 120, "NEW GAME", buttonStyle,
        ).setInteractive();

        const continueButton = this.add.text(
            640, 195, "LEVEL SELECT", buttonStyle,
        ).setInteractive();

        const levelButton = this.add.text(
            640, 270, "LEVEL EDITOR", buttonStyle,
        ).setInteractive();

        const exploreButton = this.add.text(
            640, 345, "EXPLORE", buttonStyle,
        ).setInteractive();

        const settingsButton = this.add.text(
            640, 420, "SETTINGS", buttonStyle,
        ).setInteractive();

        buttonlist.push(newButton, continueButton, levelButton, exploreButton, settingsButton);

        buttonlist.forEach((btn) => {
            btn.on("pointerover", () => btn.setBackgroundColor("#d4d4d4"));
            btn.on("pointerout", () => btn.setBackgroundColor("#fff"));
        });
        newButton.on("pointerdown", () => this.scene.start("gameScene", {
            levelfile: levels,
            levelnumber: 1,
        }));
        continueButton.on("pointerdown", () => this.scene.start("levelselectScene"));
        levelButton.on("pointerdown", () => this.scene.start("saveScene"));
        exploreButton.on("pointerdown", () => this.scene.start("exploreScene"));
        settingsButton.on("pointerdown", () => this.scene.start("settingsScene"));

        if (Settings.IS_DEBUG) {
            this.add.text(685, 500, "Development Build", textStyle)
                .setFontSize(32)
                .setBackgroundColor("#000")
                .setColor("#f11")
        }

        // Credits
        this.add.text(612, 10, "Original By Cary Huang", textStyle).setFontSize(32);
        this.add.text(686, 55, "Music by Michael Huang", textStyle).setFontSize(24);
        this.add.text(785, 92, "Remake by Zelo101", textStyle).setFontSize(18);

        // Version
        const versionText = this.add.text(831, 500, "v4 Alpha", textStyle)
            .setBackgroundColor(hexColourFromSeed(devdate.getTime()))
            .setFontSize(28)
            .setColor("#000");

        // Debug Version
        if (Settings.IS_DEBUG) {
            versionText.setFontFamily("cursive")
                .setText("dev-21w04a")
                .setDisplaySize(150, 30)
                .setPosition(525, 502)
        }
    }
}

export default menuOldScene;
