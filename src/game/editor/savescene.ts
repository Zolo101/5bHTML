import { backStyle, BaseButton, textStyle, titleStyle } from "../core/buttons";
import SaveManager, { SaveFile } from "../core/misc/dataidb";

class saveScene extends Phaser.Scene {
    selectedsave!: SaveFile
    constructor() {
        super({ key: "saveScene" });
    }

    create(): void {
        // this.scene.start("editorScene")
        this.add.rectangle(0, 0, 960, 540, 0x334433).setOrigin(0, 0);
        this.add.text(10, 10, "LEVEL EDITOR", titleStyle).setFontStyle("bold")

        new BaseButton(80, 100, "New levelpack", this, () => this.scene.start("editorScene"))
        // new BaseButton(80, 180, "Edit levelpack", this, () => this.scene.start("editorScene"))
        // new BaseButton(80, 260, "Upload levelpack", this, () => this.scene.start("editorScene"))
        // new BaseButton(80, 340, "Delete levelpack", this, () => this.scene.start("editorScene"))

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
            this.renderSaveFile(220, 45 * i, savefile)
            i += 1;
        }
    }

    renderSaveFile(x: number, y: number, savefile: SaveFile): void {
        const container = this.add.container(x, y);
        container.add([
            this.add.rectangle(x + 185, y + 45, 400, 80, 0xaaaaaa),
            this.add.text(x + 10, y + 10, savefile.name, textStyle)
                .setFontSize(18)
                .setFontStyle("bold"),
            this.add.text(x + 10, y + 30, `${new Blob([savefile.data.toString()]).size} Bytes`, textStyle),
            this.add.text(x + 10, y + 60, `Structure level: ${savefile.version}`, textStyle)
        ])
    }
}

export default saveScene;
