import { backStyle, BaseButton, textStyle, titleStyle } from "../core/buttons";
import { LevelData } from "../core/levelstructure";
import SaveManager from "../core/misc/dataidb";

class saveScene extends Phaser.Scene {
    selectedsave!: LevelData
    constructor() {
        super({ key: "saveScene" });
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

        // gets all the levels from the localstorage
        SaveManager.getLocalStorage();

        let i = 1;
        for (const savefile of SaveManager.getCacheAll()) {
            this.renderSaveFile(40, 30 + (60 * i), savefile)
            i += 1;
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
