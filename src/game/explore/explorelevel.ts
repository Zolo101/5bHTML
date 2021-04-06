import { backStyle, BaseButton, textStyle, titleStyle } from "../core/buttons";
import { LevelData } from "../core/levelstructure";
import { s_saves, s_addSave, s_push } from "../core/misc/dataidb";
import { Screen } from "../editor/ui/screen";

class explorelevelScene extends Phaser.Scene {
    save!: LevelData
    constructor() {
        super({ key: "explorelevelScene" });
    }

    init(save: LevelData): void {
        this.save = (save as any).save as LevelData;
    }

    create(): void {
        // this.scene.start("editorScene")
        this.add.rectangle(0, 0, 960, 540, 0x334433).setOrigin(0, 0);
        this.add.text(20, 10, this.save.name, titleStyle).setFontStyle("bold")

        new BaseButton(80, 100, "Play", this, () => this.scene.start("gameScene", {
            from: this,
            levelfile: this.save,
        }))
        new BaseButton(80, 180, "Clone", this, () => {
            const newName = prompt("What name should the clone be called?") ?? "nil";
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
        this.add.text(420, 360, `By: ${this.save.author}`, titleStyle)
        this.add.text(420, 420, this.save.description, textStyle).setFontSize(24)

        console.log(this.save)
        const screen = new Screen(420, 80, this);
        screen.setData(this.save.levels[0].data)
        screen.changeZoom(-0.5);
        screen.updateMapPos();

        const backButton = this.add.text(
            800, 475, "BACK", backStyle,
        ).setInteractive();

        backButton.on("pointerdown", () => {
            document.body.style.backgroundColor = "initial";
            this.scene.start("exploreScene");
        });
    }
}

export default explorelevelScene;
