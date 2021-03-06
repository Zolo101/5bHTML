import { levelnameStyle, textStyle } from "../../core/buttons";

// Number Increment Class. It's like a page UI.
class NumInc {
    private _textObject: Phaser.GameObjects.Text
    private _value: number;
    container: Phaser.GameObjects.Container
    min: number
    max: number
    public get value(): number {return this._value}
    public set value(v: number) {
        this._value = v;
        this.onChange(this._value);
        this._textObject.setText((this._value + 1).toString());
    }
    onChange: (newValue: number) => void

    constructor(x: number, y: number, min: number, max: number, scene: Phaser.Scene, onChange: (newValue: number) => void, value = 0) {
        this.min = min;
        this.max = max;
        this._value = value;
        this.onChange = onChange;

        this.container = scene.add.container(x, y)
        this.container.add([
            scene.add.text(0, 0, "◀︎", textStyle)
                .setFontSize(32)
                .setBackgroundColor("#222")
                .setInteractive()
                .on("pointerdown", () => {
                    if (this.value > this.min) this.value -= 1
                }),

            scene.add.text(130, 0, "▶︎", textStyle)
                .setFontSize(32)
                .setBackgroundColor("#222")
                .setInteractive()
                .on("pointerdown", () => {
                    if (this.value < this.max) this.value += 1
                })
        ])

        this._textObject = scene.add.text(70, 0, (this.value + 1).toString(), levelnameStyle)
            .setAlign("center");
        this.container.add(this._textObject)
    }
}

export default NumInc;