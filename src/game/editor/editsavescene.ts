import { backStyle, BaseButton, textStyle, titleStyle } from "../core/buttons";
import { LevelData } from "../core/levelstructure";
import SaveManager from "../core/misc/dataidb";
import { Screen } from "./ui/screen";

class editsaveScene extends Phaser.Scene {
    save!: LevelData
    constructor() {
        super({ key: "editsaveScene" });
    }

    init(save: LevelData): void {
        this.save = save;
    }

    create(): void {
        // this.scene.start("editorScene")
        this.add.rectangle(0, 0, 960, 540, 0x334433).setOrigin(0, 0);
        this.add.text(20, 10, this.save.name, titleStyle).setFontStyle("bold")

        new BaseButton(80, 100, "Edit levelpack", this, () => this.scene.start("editorScene", {level: this.save}))
        new BaseButton(80, 180, "Clone levelpack", this, () => {
            const newName = prompt("What name should the new clone be called?") ?? "nil";
            if (newName !== "nil" && SaveManager.saves.has(newName)) {
                alert("There is already a save with the same name!")
            } else {
                // Serialisation be like
                const newSave = JSON.parse(JSON.stringify(this.save)) as LevelData;
                newSave.name = newName;
                SaveManager.addSave(newSave);
                SaveManager.push();
            }
        })
        new BaseButton(80, 260, "Upload levelpack", this, () => {
            // Upload stuff here
        })
        new BaseButton(80, 340, "Delete levelpack", this, () => {
            if (confirm("Are you sure? This WILL irreversibly delete your save.")) {
                SaveManager.removeSave(this.save.name);
                SaveManager.push();
                this.scene.start("saveScene");
            }
        })

        this.add.text(420, 360, `By: ${this.save.author}`, titleStyle)
        this.add.text(420, 420, this.save.description, textStyle).setFontSize(24)

        const screen = new Screen(420, 80, this);
        screen.setData(this.save.levels[0].data)
        screen.changeZoom(-0.5);
        screen.updateMapPos();

        const backButton = this.add.text(
            800, 475, "BACK", backStyle,
        ).setInteractive();

        backButton.on("pointerdown", () => {
            document.body.style.backgroundColor = "initial";
            this.scene.start("saveScene");
        });
    }
}

export default editsaveScene;
