import { BaseButton, createBackButton, textStyle, titleStyle } from "../core/buttons";
import { LevelData } from "../core/levelstructure";
import { localSaves, s_saves } from "../core/misc/dataidb";
import Alert from "../editor/ui/alert";
import { Screen } from "../editor/ui/screen";

class explorelevelScene extends Phaser.Scene {
    save!: LevelData
    constructor() {
        super({ key: "explorelevelScene" });
    }

    init(save: LevelData): void {
        this.save = save;
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
                new Alert("Name in use", "There is already a save with the same name!").render(this)
            } else {
                // Serialisation be like
                const newSave = JSON.parse(JSON.stringify(this.save)) as LevelData;
                newSave.name = newName;
                localSaves.add(newSave);
                localSaves.push();
            }
        })
        this.add.text(420, 360, `By: ${this.save.author}`, titleStyle)
        this.add.text(420, 420, this.save.description, textStyle).setFontSize(24)

        console.log(this.save)
        const screen = new Screen(420, 80, this);
        screen.setData(this.save.levels[0].data)
        screen.zoom = 0.5;
        screen.setBackground(this.save.levels[0].background)
        screen.updateMapPos();

        createBackButton(this, "exploreScene")
    }
}

export default explorelevelScene;
