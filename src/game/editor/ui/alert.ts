import { textStyle } from "../../core/buttons";

class Alert {
    title: string
    text: string
    closeable: boolean

    constructor(title = "Untitled Alert", text = "Lorem Ipsum", closeable = true) {
        this.title = title;
        this.text = text;
        this.closeable = closeable;
    }

    render(scene: Phaser.Scene): void {
        const alert = scene.add.container(scene.scale.width / 2, scene.scale.height / 2);
        // Base
        const base = scene.add.rectangle(0, 0, 400, 300, 0x666666)
        const top = base.getTopCenter();
        alert.add(base)
        // Title
        alert.add(scene.add.text(top.x, top.y + 10, this.title, textStyle).setOrigin(0.5, 0))
        // Text
        alert.add(scene.add.text(base.getTopLeft().x + 10, top.y + 50, this.text, textStyle).setWordWrapWidth(350))
        // Close
        if (this.closeable) {
            alert.add(scene.add.text(base.getBottomCenter().x, base.getBottomCenter().y - 30, "Close", textStyle)
                .setInteractive()
                .setOrigin(0.5, 0)
                .setFontSize(24)
                .setBackgroundColor("#aaaaaa")
                .on("pointerdown", () => alert.removeAll(true))
            )
        }
        // alert.on("pointerdownoutside", () => console.log("e"))
        // Exit
        //alert.add(scene.add.text(base.getTopRight().x - 20, base.getTopRight().y, "X", textStyle)
        //    .setFontSize(28)
        //    .setBackgroundColor("#ff0000"))
        //    .on("pointerdown", remove)
    }
}

export default Alert;