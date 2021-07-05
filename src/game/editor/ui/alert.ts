import { font, textStyle } from "../../core/buttons";

type AlertStyle = "FATAL" | "OK" | "YESNO" | undefined

const AlertTextStyle: Phaser.Types.GameObjects.Text.TextStyle = {
    fontFamily: font,
    color: "#fff",
    backgroundColor: "#777777",
    fontSize: "24px",
    padding: {
        x: 16,
        y: 2
    },
}

class Alert {
    title: string
    text: string
    closeable: AlertStyle

    constructor(title = "Untitled Alert", text = "Lorem Ipsum", closeable?: AlertStyle) {
        this.title = title;
        this.text = text;
        this.closeable = closeable;
    }

    async render(scene: Phaser.Scene): Promise<boolean> {
        const alert = scene.add.container(scene.scale.width / 2, scene.scale.height / 2);
        // Background
        alert.add(scene.add.rectangle(0, 0, 1e4, 1e4, 0x222222, 0.7).setInteractive())
        // Base
        const base = scene.add.rectangle(0, 0, 400, 300, 0x999999)
        let top = base.getTopCenter();
        alert.add(base)
        // Title
        const title = scene.add.text(top.x, top.y + 10, this.title, textStyle)
            .setFontStyle("bold")
            .setOrigin(0.5, 0)
        // Text
        const text = scene.add.text(base.getTopLeft().x + 10, top.y + 50, this.text, textStyle).setWordWrapWidth(350)
        base.displayHeight = 100 + text.height;

        top = base.getTopCenter();
        title.setY(top.y + 10);
        text.setY(top.y + 40);

        alert.add(title)
        alert.add(text)
        // Close
        return new Promise((resolve, reject) => {
            switch (this.closeable) {
            case "FATAL":
                resolve(true);
                break;

            case "OK":
            default:
                alert.add(scene.add.text(base.getBottomCenter().x, base.getBottomCenter().y - 35, "Close", AlertTextStyle)
                    .setInteractive()
                    .setOrigin(0.5, 0)
                    .on("pointerdown", () => {
                        alert.removeAll(true)
                        resolve(true);
                    })
                )
                break;

            case "YESNO":
                alert.add([
                    scene.add.text(base.getBottomCenter().x - 65, base.getBottomCenter().y - 35, "Yes", AlertTextStyle)
                        .setInteractive()
                        .setOrigin(0.5, 0)
                        .on("pointerdown", () => {
                            alert.removeAll(true)
                            resolve(true);
                        }),
                    scene.add.text(base.getBottomCenter().x + 65, base.getBottomCenter().y - 35, "No", AlertTextStyle)
                        .setInteractive()
                        .setOrigin(0.5, 0)
                        .on("pointerdown", () => {
                            alert.removeAll(true)
                            reject(false);
                        })
                ])
                break;
            }
        })
    }
}

export default Alert;