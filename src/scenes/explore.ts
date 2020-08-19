import { textStyle, backStyle } from "../game/core/style";

class exploreScene extends Phaser.Scene {
    constructor() { super({ key: "exploreScene" }); }

    create(): void {
        this.add.rectangle(0, 0, 960, 540, 0x666666).setOrigin(0, 0);

        this.add.rectangle(480, 260, 660, 540/2, 0x333333);
        this.add.text(
            225, 250, "Exploration is currently unavailable.", textStyle,
        ).setFontSize(32);

        const backButton = this.add.text(
            800, 475, "BACK", backStyle,
        ).setInteractive();

        backButton.on('pointerdown', () => this.scene.start("menuScene"));
    }
}

export default exploreScene;
