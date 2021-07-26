export const font = "Helvetica, Arial, sans-serif";
export const textStyle = {
    fontFamily: font,
    // backgroundColor: "#fff",
    color: "#fff",
};

export const titleStyle = {
    fontFamily: font,
    // backgroundColor: "#fff",
    color: "#fff",
    fontSize: "42px",
};

export const levelbuttonStyle = {
    fontFamily: font,
    fontSize: "42px",
    fontStyle: "bold",
    align: "center",
    fixedWidth: 100,
    fixedHeight: 45,
    backgroundColor: "#ee0",
    color: "#000",
    padding: {
        y: -4,
        x: 4,
    },
};

export const levelnameStyle = {
    fontFamily: font,
    fontSize: "32px",
    fontStyle: "bold",
    // color: "#666",
};

export const backStyle = {
    fontFamily: font,
    fontSize: "42px",
    fontStyle: "bold",
    align: "center",
    fixedWidth: 135,
    fixedHeight: 50,
    color: "#fff",
    padding: {
        y: 4,
        x: 4,
    },
};

export const miniButtonStyle = {
    fontFamily: font,
    fontSize: "16px",
    fontStyle: "bold",
    align: "center",
    fixedWidth: 160,
    backgroundColor: "#fff",
    color: "#666",
    padding: {
        y: 4,
        x: 4,
    },
};

export const buttonStyle = {
    fontFamily: font,
    fontSize: "26px",
    fontStyle: "bold",
    align: "center",
    fixedWidth: 300,
    backgroundColor: "#fff",
    color: "#666",
    padding: {
        y: 16,
        x: 4,
    },
};

export const createBackButton = (scene: Phaser.Scene, start: string, func?: () => void): void => {
    const rect = scene.add.rectangle(0, 0, 135, 50, 0xffffff)
        .setOrigin(0, 0)
        .setAlpha(0.5);
    const text = scene.add.text(0, 0, "BACK", backStyle);

    scene.add.container(800, 475, [rect, text])
        .setInteractive(new Phaser.Geom.Rectangle(0, 0, 135, 50), Phaser.Geom.Rectangle.Contains)
        .on("pointerdown", () => {
            if (func !== undefined) func()
            scene.scene.start(start)
        });
};

export class BaseButton {
    gameObject: Phaser.GameObjects.Text
    mini: boolean
    text: string
    onClick: () => void
    constructor(
        x: number,
        y: number,
        text = "Untitled Button",
        scene: Phaser.Scene,
        onClick: () => void,
        mini = false,
    ) {
        this.mini = mini;
        this.text = text;
        this.onClick = onClick;

        const style = this.mini ? miniButtonStyle : buttonStyle;
        this.gameObject = scene.add.text(x, y, text, style);
        this.gameObject.setInteractive()
            .on("pointerover", () => this.gameObject.setBackgroundColor("#d4d4d4"))
            .on("pointerout", () => this.gameObject.setBackgroundColor("#ffffff"))
            .on("pointerdown", onClick);

        return this;
    }
}