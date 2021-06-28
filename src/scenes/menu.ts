import { BaseButton, textStyle } from "../game/core/buttons";
import { levels } from "../game/core/jsonmodule";
import { hexColourFromSeed, openExternalLink } from "../game/core/misc/other";
import Settings, { LAST_UPDATE, VERSION_NAME } from "../game/settingsgame";

class menuScene extends Phaser.Scene {
    hoverText!: Phaser.GameObjects.Text
    constructor() { super("menuScene"); }

    create(): void {
        // this.scene.start("editorScene", {level: {name: undefined}}); // go straight into gameplay
        // this.scene.start("exploreScene", {level: {name: undefined}}); // go straight into gameplay
        // Background
        this.add.rectangle(0, 0, 960, 540, 0x6a7773).setOrigin(0, 0);
        this.add.image(480, 270, `background_${Math.round(Math.random() * 11)}`)
            .setScale(0.6)
            .setAlpha(0.35)

        this.add.text(175, 175, "5bHTML", textStyle)
            .setFontSize(48)
            .setFontStyle("bold")

        this.hoverText = this.add.text(480, 420, "", textStyle)
            .setFontSize(24)
            .setOrigin(0.5)

        // this.add.image(260, 400, "5b_logo").setScale(0.4);
        this.add.image(205, 173, "5b_people").setScale(0.1);

        // const settingsButton = new MenuButton(10, 500, "Settings", "Change things!", this, () => this.scene.start("settingsScene"), true)
        const newnewButton = new MenuButton(10, 10, "New to 5bHTML?", "Tells you all about this project.", this, () => this.scene.start("newScene"), true)
        const watchButton = new MenuButton(180, 10, "WATCH BFDIA 5a", "WATCH IT OR ELSE!!!!", this, () => openExternalLink("https://www.youtube.com/watch?v=4q77g4xo9ic"), true)
        const discordButton = new MenuButton(350, 10, "Discord", "Go join! :)", this, () => openExternalLink("https://discord.gg/um5KWabefm"), true)
            .gameObject.setBackgroundColor("#7289da").setColor("#ffffff")
            .on("pointerover", () => {
                discordButton.setBackgroundColor("#5465a1");
                this.hoverText.setText("Go join! :)");
            })
            .on("pointerout", () => {
                discordButton.setBackgroundColor("#7289da");
                this.hoverText.setText("");
            });

        const newButton = new MenuButton(175, 225, "NEW GAME", "Start a new game!", this, () => {
            this.scene.start("gameScene", {
                levelfile: levels,
                levelnumber: 1,
            })
        })

        const continueButton = new MenuButton(175, 300, "LEVEL SELECT", "Choose from an extremely wide selection of levels!", this, () => this.scene.start("levelselectScene"))
        const levelButton = new MenuButton(500, 225, "LEVEL EDITOR", "Here you can level editors.", this, () => this.scene.start("saveScene"))
        const exploreButton = new MenuButton(500, 300, "EXPLORE", "Explore custom-made levels made by the community!", this, () => this.scene.start("exploreScene"))
        // const settingsButton = this.add.text(
        // 640, 425, "SETTINGS", buttonStyle,
        // ).setInteractive();
        // settingsButton.on("pointerdown", () => this.scene.start("settingScene"));

        // Credits
        this.add.text(698, 10, "Original By Cary Huang", textStyle).setFontSize(24);
        this.add.text(753, 38, "Music by Michael Huang", textStyle).setFontSize(18);
        this.add.text(824, 62, "Remake by Zelo101", textStyle).setFontSize(14);

        // Version
        const versionText = this.add.text(831, 499, VERSION_NAME, textStyle)
            .setBlendMode(Phaser.BlendModes.ADD)
            .setColor(hexColourFromSeed(LAST_UPDATE.getTime()))
            .setFontSize(28)
            .setFontStyle("bold");

        // Debug Version
        if (Settings.IS_DEBUG) {
            versionText.setText(VERSION_NAME)
                // .setFontFamily("cursive")
                .setFontStyle("bold")
                .setDisplaySize(150, 30)
                .setPosition(795, 466)
        }

        if (Settings.IS_DEBUG) {
            this.add.text(685, 499, "Development Build", textStyle)
                .setFontSize(32)
                .setBackgroundColor("#000")
                .setColor("#f11")
        }
    }
}

class MenuButton extends BaseButton {
    hoverText: string
    constructor(
        x: number,
        y: number,
        text = "Untitled Button",
        hoverText = "Untitled Hover Text",
        scene: menuScene,
        onClick: () => void,
        mini = false,
    ) {
        const basebutton = super(x, y, text, scene, onClick, mini) as unknown as BaseButton;
        this.hoverText = hoverText;
        basebutton.gameObject
            .on("pointerover", () => {
                this.gameObject.setBackgroundColor("#d4d4d4");
                scene.hoverText.setText(this.hoverText);
            })
            .on("pointerout", () => {
                this.gameObject.setBackgroundColor("#fff");
                scene.hoverText.setText("");
            })
            .on("pointerdown", onClick);
    }
}

export default menuScene;
