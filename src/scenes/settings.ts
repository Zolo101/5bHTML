import { backStyle, BaseButton, titleStyle } from "../game/core/buttons";
import { BooleanOption, DropDownOption } from "../game/editor/ui/option";
import Tab from "../game/editor/ui/tab";
import Settings from "../game/settingsgame";

class settingsScene extends Phaser.Scene {
    constructor() {
        super({ key: "settingsScene" });
    }

    create(): void {
        this.add.rectangle(0, 0, 960, 540, 0x222222).setOrigin(0, 0);
        this.add.text(10, 10, "SETTINGS", titleStyle).setFontStyle("bold")

        const tab = new Tab("Settings")
        tab.add(new BooleanOption(
            "Force Debug",
            "Use at your own risk!",
            Settings.IS_DEBUG,
            (value) => Settings.IS_DEBUG = !value
        ))
        tab.add(new BooleanOption(
            "Old Menu",
            "woooowooooo",
            Settings.MENU_OLD,
            (value) => Settings.MENU_OLD = !value
        ))
        tab.add(new BooleanOption(
            "x0.75 Zoom",
            "This is an option for zelo because he uses 125% zoom on his monitor and it makes the game blurry",
            Settings.ZELO_MODE,
            (value) => Settings.ZELO_MODE = !value
        ))
        tab.render(100, 80, this);

        const backButton = this.add.text(
            800, 475, "BACK", backStyle,
        ).setInteractive();

        backButton.on("pointerdown", () => {
            document.body.style.backgroundColor = "initial";
            localStorage.setItem("settings", JSON.stringify(Settings))
            this.scene.start("menuScene");
        });
    }
}

export default settingsScene;
