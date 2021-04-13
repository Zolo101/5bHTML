import { backStyle, BaseButton, textStyle, titleStyle } from "../core/buttons";
import { LevelData } from "../core/levelstructure";
import { s_addSave, s_push, s_removeSave, s_saves } from "../core/misc/dataidb";
import { Screen } from "./ui/screen";

class editsaveScene extends Phaser.Scene {
    save!: LevelData
    constructor() {
        super({ key: "editsaveScene" });
    }

    init(levels: LevelData): void {
        this.save = levels;
    }

    create(): void {
        // this.scene.start("editorScene")
        this.add.rectangle(0, 0, 960, 540, 0x334433).setOrigin(0, 0);
        this.add.text(20, 10, this.save.name, titleStyle).setFontStyle("bold")

        new BaseButton(80, 100, "Play", this, () => this.scene.start("gameScene", {
            from: this,
            levelfile: this.save,
        }))
        new BaseButton(80, 180, "Edit", this, () => this.scene.start("editorScene", this.save))
        new BaseButton(80, 260, "Clone", this, () => {
            const newName = prompt("What name should the new clone be called?") ?? "nil";
            if (newName !== "nil" && s_saves.has(newName)) {
                alert("There is already a save with the same name!")
            } else {
                // Serialisation be like
                const newSave = JSON.parse(JSON.stringify(this.save)) as LevelData;
                newSave.name = newName;
                s_addSave(newSave);
                s_push();
            }
        })
        new BaseButton(80, 340, "Upload", this, async () => {
            console.log(this.save)
            await fetch("https://5beam.zelo.dev/api/upload", {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(this.save)
            });
        })
        new BaseButton(80, 420, "Delete", this, () => {
            if (confirm("Are you sure? This WILL irreversibly delete your save.")) {
                s_removeSave(this.save.name);
                s_push();
                this.scene.start("saveScene");
            }
        })

        this.add.text(420, 360, `By: ${this.save.author}`, titleStyle)
        this.add.text(420, 420, this.save.description, textStyle).setFontSize(24)

        const screen = new Screen(420, 80, this);
        screen.setData(this.save.levels[0].data)
        screen.zoom = 0.5;
        screen.setBackground(this.save.levels[0].background)
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
