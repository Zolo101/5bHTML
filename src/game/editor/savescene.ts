import { backStyle, BaseButton, titleStyle } from "../core/buttons";

class saveScene extends Phaser.Scene {
    constructor() {
        super({ key: "saveScene" });
    }

    create(): void {
        this.add.rectangle(0, 0, 960, 540, 0x334433).setOrigin(0, 0);
        this.add.text(10, 10, "LEVEL EDITOR", titleStyle).setFontStyle("bold")

        new BaseButton(80, 100, "New levelpack", this, () => this.scene.start("editorScene"))
            .gameObject.setBackgroundColor("#f")
        new BaseButton(80, 180, "Edit levelpack", this, () => this.scene.start("editorScene"))
        new BaseButton(80, 260, "Upload levelpack", this, () => this.scene.start("editorScene"))
            .gameObject.setBackgroundColor("#f")
        new BaseButton(80, 340, "Delete levelpack", this, () => this.scene.start("editorScene"))
            .gameObject.setBackgroundColor("#f")

        const backButton = this.add.text(
            800, 475, "BACK", backStyle,
        ).setInteractive();

        backButton.on("pointerdown", () => {
            document.body.style.backgroundColor = "initial";
            this.scene.start("menuScene");
        });
    }
}

export default saveScene;
