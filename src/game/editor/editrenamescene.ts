import { backStyle, BaseButton, textStyle, titleStyle } from "../core/buttons";
import { LevelData } from "../core/levelstructure";
import s_saves, { s_push } from "../core/misc/dataidb";

class editrenameScene extends Phaser.Scene {
    save!: LevelData
    constructor() {
        super({ key: "editrenameScene" });
    }

    init(levels: LevelData): void {
        this.save = levels;
    }

    create(): void {
        this.add.rectangle(0, 0, 960, 540, 0x334433).setOrigin(0, 0);
        const nameBuffer = this.save.name;
        const nameText = this.add.text(380, 125, this.save.name, textStyle)
            .setFontSize(24)
            .setFontStyle("BOLD")

        new BaseButton(60, 110, "Rename title", this, () => {
            this.save.name = prompt("Enter new name", this.save.name) ?? this.save.name
            nameText.setText(this.save.name)
        })

        this.add.text(20, 480, `By: ${this.save.author}`, titleStyle)
        const descriptionText = this.add.text(70, 300, this.save.description, textStyle)
            .setOrigin(0, 0)
            .setFontSize(24)
            .setWordWrapWidth(400)

        new BaseButton(60, 210, "Rename description", this, () => {
            this.save.description = prompt("Enter new description", this.save.description) ?? this.save.description
            descriptionText.setText(this.save.description)
        })

        const backButton = this.add.text(
            800, 475, "BACK", backStyle,
        ).setInteractive();

        backButton.on("pointerdown", () => {
            s_push();
            s_saves.delete(nameBuffer);
            this.scene.start("saveScene");
        });
    }
}

export default editrenameScene;
