import { levels } from "../game/core/jsonmodule";
import { openExternalLink } from "../game/core/misc";

class menuScene extends Phaser.Scene {
    constructor() { super("menuScene"); }

    create(): void {
        // this.scene.start("gameScene"); // go straight into gameplay
        const textStyle = {
            fontFamily: "Helvetica, Arial, sans-serif",
            // backgroundColor: "#fff",
            color: "#fff",
        };

        const buttonStyle = {
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: "26px",
            fontStyle: "bold",
            align: "center",
            fixedWidth: 300,
            backgroundColor: "#fff",
            color: "#666",
            padding: {
                y: 4,
                x: 4,
            },
        };
        // Background
        this.add.rectangle(0, 0, 960, 540, 0x666666).setOrigin(0, 0);

        // 5b LOGO
        this.add.image(260, 400, "5b_logo");
        this.add.image(305, 175, "5b_people").setScale(0.9);

        const buttonlist = [];

        const watchButton = this.add.text(
            600, 200, "WATCH BFDIA 5A", buttonStyle,
        ).setInteractive();

        const newButton = this.add.text(
            600, 250, "NEW GAME", buttonStyle,
        ).setInteractive();

        const continueButton = this.add.text(
            600, 300, "LEVEL SELECT", buttonStyle,
        ).setInteractive();

        // const levelButton = this.add.text(
        //    600, 350, "LEVEL EDITOR (old)", buttonStyle,
        // ).setInteractive();
        const exploreButton = this.add.text(
            600, 400, "EXPLORE", buttonStyle,
        ).setInteractive();
        // const settingsButton = this.add.text(
        //    600,450,"Settings",buttonStyle,
        // ).setInteractive();

        buttonlist.push(watchButton, newButton, continueButton, exploreButton);
        // ,settingsButton);

        buttonlist.forEach((btn) => {
            btn.on("pointerover", () => btn.setBackgroundColor("#d4d4d4"));
            btn.on("pointerout", () => btn.setBackgroundColor("#fff"));
        });
        watchButton.on("pointerdown", () => openExternalLink("https://www.youtube.com/watch?v=4q77g4xo9ic"));
        newButton.on("pointerdown", () => this.scene.start("gameScene", {
            levelfile: levels,
            levelnumber: 1,
        }));
        continueButton.on("pointerdown", () => this.scene.start("levelselectScene"));
        // levelButton.on('pointerdown', () => openExternalLink("https://zolo101.github.io/5beam-edit/index.html"));
        exploreButton.on("pointerdown", () => this.scene.start("exploreScene"));
        // settingsButton.on('pointerdown', () => );

        // Credits
        this.add.text(612, 10, "Original By Cary Huang", textStyle).setFontSize(32);
        this.add.text(686, 55, "Music by Michael Huang", textStyle).setFontSize(24);
        this.add.text(785, 92, "Remade by Zelo101", textStyle).setFontSize(18);

        // Alpha ver
        this.add.text(701, 450, "v2.1 Alpha", textStyle).setBackgroundColor("#2fcaff").setFontSize(42).setColor("#000");
    }
}

export default menuScene;
