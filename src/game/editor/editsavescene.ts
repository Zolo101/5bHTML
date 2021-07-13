import { backStyle, BaseButton, textStyle, titleStyle } from "../core/buttons";
import { LevelData } from "../core/levelstructure";
import { s_addSave, s_push, s_removeSave, s_saves } from "../core/misc/dataidb";
import validateLevelpack from "../core/misc/validate";
import { EXPLORE_SEVRER_URL } from "../settingsgame";
import Alert from "./ui/alert";
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
        const validSave = validateLevelpack(this.save)

        new BaseButton(80, 100, "Play", this, () => this.scene.start("gameScene", {
            from: this,
            levelfile: this.save,
        }))
        new BaseButton(80, 180, "Edit", this, () => this.scene.start("editorScene", { level: this.save }))
        new BaseButton(80, 260, "Clone", this, () => {
            const newName = prompt("What name should the new clone be called?") ?? "nil";
            if (newName !== "nil" && s_saves.has(newName)) {
                new Alert("Name in use", "There is already a save with that name!").render(this)
            } else {
                // Serialisation be like
                const newSave = JSON.parse(JSON.stringify(this.save)) as LevelData;
                newSave.name = newName;
                s_addSave(newSave);
                s_push();
            }
        })
        new BaseButton(80, 340, "Upload", this, async () => {
            console.log("Upload attempt:", this.save)
            if (!validSave) {
                new Alert("Disabled", "Uploading is disabled for invalid / corrupted levelpacks.").render(this)
                return
            }
            // new Alert("Uploading is temporarily disabled", "Uploading is disabled due to issues with servers.\nCheck back soon!").render(this)
            this.uploadSave().then(() => {
                new Alert("Upload Successful", "Your levelpack has been successfully uploaded!").render(this)
            }).catch((err) => {
                new Alert("Upload Failed", `Your levelpack upload has failed.\nError message: '${err}'`).render(this)
            })
        })
        new BaseButton(80, 420, "Delete", this, () => {
            new Alert("Delete save", "Are you sure? This WILL irreversibly delete your save.", "YESNO")
                .render(this).then(() => {
                    s_removeSave(this.save.name);
                    s_push();
                    this.scene.start("saveScene");
                })
        })

        new BaseButton(740, 45, "Rename", this, () => {
            this.scene.start("editrenameScene", this.save);
        }, true)

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
            this.scene.start("saveScene");
        });

        if (!validSave) {
            this.add.text(10, 500, "INVALID", textStyle)
                .setColor("#ff0000")
                .setFontSize(28)
                .setFontStyle("BOLD")
            new Alert("Invalid Levelpack", "This save is invalid / corrupted, meaning that it cannot be uploaded, and you may get crashes while playing or editing.").render(this)
        }
    }

    async uploadSave(): Promise<void> {
        await fetch(`${EXPLORE_SEVRER_URL}/api/upload`, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(this.save)
        });
    }
}

export default editsaveScene;
