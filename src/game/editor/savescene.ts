import { backStyle, BaseButton, textStyle, titleStyle } from "../core/buttons";
import { LevelData } from "../core/levelstructure";
import s_saves, { s_addSave, s_getCacheAll, s_getLocalStorage, s_push } from "../core/misc/dataidb";
import { downloadFile, uploadFile } from "../core/misc/other";
import validateLevelpack from "../core/misc/validate";
import Alert from "./ui/alert";
import NumInc from "./ui/numinc";
import { Screen } from "./ui/screen";

class saveScene extends Phaser.Scene {
    page: number
    screen!: Screen
    pagecontainer!: Phaser.GameObjects.Container

    constructor() {
        super({ key: "saveScene" });
        this.page = 0;
    }

    create(): void {
        this.add.rectangle(0, 0, 960, 540, 0x334433).setOrigin(0, 0);
        this.page = 0;
        this.add.text(10, 10, "LEVEL EDITOR", titleStyle).setFontStyle("bold")

        new BaseButton(40, 465, "New levelpack", this, () => this.scene.start("editorScene", {level: {name: undefined}}))
        new BaseButton(350, 20, "Export all", this, () => downloadFile(localStorage.getItem("5beam-saves")), true);
        new BaseButton(525, 20, "Import", this, async () => {
            const uploadResult = await uploadFile()
            if (uploadResult === null) {
                new Alert("Empty Import", "").render(this)
                return
            }
            const resultantFile = uploadResult.item(0)
            if (resultantFile === null) {
                new Alert("Empty Import", "").render(this)
                return
            }

            let importFilesJSON: LevelData[];
            try {
                importFilesJSON = JSON.parse(JSON.parse(await resultantFile.text()))
            } catch (err) {
                new Alert("Error while parsing JSON", err).render(this)
                return
            }

            let valid = true
            for (const levelpack of importFilesJSON) {
                // once the function returns false, valid will always be false
                valid &&= validateLevelpack(levelpack)
            }
            if (valid) {
                const levelpacksNames = importFilesJSON.map((levelpack) => levelpack.name).join("\n")
                for (const levelpack of importFilesJSON) {
                    s_addSave(levelpack, false)
                }
                s_push()
                this.renderPage(saves)

                new Alert("Imported levelpacks", `Successfully imported levelpacks:\n${levelpacksNames}`).render(this)
            } else {
                new Alert("Levelpacks Invalid", "One or more levelpacks in this file are invalid.").render(this)
            }
            return
        }, true);

        const backButton = this.add.text(
            800, 475, "BACK", backStyle,
        ).setInteractive();

        backButton.on("pointerdown", () => {
            document.body.style.backgroundColor = "initial";
            this.scene.start("menuScene");
        });

        this.screen = new Screen(655, 70, this);
        this.screen.zoom = 0.3;
        this.screen.updateMapPos();

        // gets all the levels from the localstorage
        s_getLocalStorage();
        console.log(s_saves)
        const saves = [...s_getCacheAll()];

        new NumInc(370, 475, 0, Math.ceil(saves.length / 6) - 1, this, (value) => {
            this.page = value;
            this.renderPage(saves);
        })
        this.pagecontainer = this.add.container(40, 30);
        this.renderPage(saves);
    }

    renderPage(saves: LevelData[]): void {
        this.pagecontainer.removeAll(true);

        const offset = 6 * this.page;
        for (let i = 0; i < Math.min(6, saves.length - offset); i++) {
            const save = saves[offset + i];
            const valid = validateLevelpack(save);

            this.pagecontainer.add(this.add.container(0, 60 * (i + 1), [
                this.add.rectangle(300, 0, 600, 40, valid ? 0xaaaaaa : 0xff7621)
                    .setInteractive()
                    .on("pointerdown", () => this.scene.start("editsaveScene", save))
                    .on("pointerover", () => {
                        this.screen.setData(save.levels[0].data)
                        this.screen.setBackground(save.levels[0].background)
                        this.screen.y = -50 + 60 * (i + 1);
                    }),
                this.add.text(5, -19, save.name, textStyle)
                    .setFontSize(18)
                    .setFontStyle("bold"),

                // File size
                this.add.text(4, -1, `${new Blob([JSON.stringify(save)]).size} Bytes`, textStyle),

                // Structure version
                this.add.text(450, -5, `Structure version: ${save.struct_version}`, textStyle)
            ]));

            if (!valid) {
                this.pagecontainer.add([
                    this.add.text(325, (60 * (i + 1)) - 15, "Invalid", textStyle)
                        .setColor("#ffcccc")
                        .setFontSize(28)
                        .setFontStyle("BOLD")
                ])
            }
        }
    }
}

export default saveScene;
