import { textStyle, backStyle } from "../game/core/buttons";

let epochtimetext: Phaser.GameObjects.Text;
let epochtimetoget: Phaser.GameObjects.Text;

class exploreScene extends Phaser.Scene {
    constructor() { super({ key: "exploreScene" }); }

    create(): void {
        document.body.style.backgroundColor = "#533";
        this.add.rectangle(0, 0, 960, 540, 0x996666).setOrigin(0, 0);

        this.add.rectangle(480, 260, 660, 540/2, 0x553333);
        // stop looking at this code smh

        epochtimetext = this.add.text(240, 175, "awaiting time...", textStyle).setFontSize(64);
        epochtimetoget = this.add.text(240, 275, "1598356800000", textStyle).setFontSize(64);

        const backButton = this.add.text(
            800, 475, "BACK", backStyle,
        ).setInteractive();

        backButton.on('pointerdown', () => {
            document.body.style.backgroundColor = "initial";
            this.scene.start("menuScene");
        });
    }

    // eslint-disable-next-line class-methods-use-this
    update(): void {
        const epochtime = Date.now();
        //console.log(epochtime);
        epochtimetext.setText(epochtime.toString());
        if (Number(epochtime > 1598356800000)) {
            epochtimetoget.alpha = 0;
            epochtimetext.setText("if you see this\nping @Zelo101\nin the 5b discord").setFontSize(48);
        }
    }
}

export default exploreScene;
