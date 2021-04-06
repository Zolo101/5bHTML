import { backStyle, BaseButton, levelnameStyle, textStyle, titleStyle } from "../core/buttons";
import { LevelData } from "../core/levelstructure";
import { s_getCacheAll, s_getLocalStorage } from "../core/misc/dataidb";

class saveScene extends Phaser.Scene {
    page: number
    selectedsave!: LevelData

    constructor() {
        super({ key: "saveScene" });
        this.page = 0;
    }

    create(): void {
        // this.scene.start("editorScene")
        this.add.rectangle(0, 0, 960, 540, 0x334433).setOrigin(0, 0);
        this.add.text(10, 10, "LEVEL EDITOR", titleStyle).setFontStyle("bold")

        new BaseButton(40, 465, "New levelpack", this, () => this.scene.start("editorScene", {new: true}))

        const backButton = this.add.text(
            800, 475, "BACK", backStyle,
        ).setInteractive();

        backButton.on("pointerdown", () => {
            document.body.style.backgroundColor = "initial";
            this.scene.start("menuScene");
        });

        this.add.text(180, 425, "◀︎", textStyle)
            .setFontSize(32)
            .setInteractive()
            .on("pointerdown", () => this.page -= 1);

        const pageText = this.add.text(250, 425, "1", levelnameStyle).setAlign("center");

        this.add.text(300, 425, "▶︎", textStyle)
            .setFontSize(32)
            .setInteractive()
            .on("pointerdown", () => this.page += 1);

        // gets all the levels from the localstorage
        s_getLocalStorage();
        const saves = [...s_getCacheAll()];
        const selStart = 6 * this.page;

        for (let i = 0; i < Math.min(6, saves.length - selStart); i++) {
            this.renderSaveFile(40, 30 + (60 * (i + 1)), saves[selStart + i])
        }
    }

    renderSaveFile(x: number, y: number, savefile: LevelData): void {
        const container = this.add.container(x, y);
        container.add([
            this.add.rectangle(300, 0, 600, 40, 0xaaaaaa).setInteractive().on("pointerdown", () => this.scene.start("editsaveScene", savefile)),
            this.add.text(5, -19, savefile.name, textStyle)
                .setFontSize(18)
                .setFontStyle("bold"),

            // File size
            this.add.text(4, -1, `${new Blob([JSON.stringify(savefile)]).size} Bytes`, textStyle),

            // Structure version
            this.add.text(450, -5, `Structure version: ${savefile.struct_version}`, textStyle)
        ])
    }
}

export default saveScene;
