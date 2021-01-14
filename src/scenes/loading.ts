const maxlines = 30;
const consolelines: Phaser.GameObjects.Text[] = [];
const consoleStyle = {
    fontFamily: "monospace",
    // backgroundColor: "#fff",
    color: "#fff",
};
const greenStyle = {
    fontFamily: "monospace",
    // backgroundColor: "#fff",
    color: "#0f0",
};

class loadingScene extends Phaser.Scene {
    constructor() { super("loadingScene"); }

    preload(): void {
        this.load.setBaseURL("./assets/core");

        this.add.text(80, 100, "Loading 5b assets...", { font: "32px Arial" });
        // var loadingText = this.add.text(100,170,"Ported by Zelo101", {font: "32px Arial"});

        // assetsjson.core.forEach(element => {
        //
        // });
        // assetsjson.forEach((entry) => {
        //    console.log(entry)
        // })
        // aj.forEach(mod => {
        //    mod.forEach(category => {
        //        console.log(Object.keys(mod)[0]);
        //    })
        // })

        this.loadAsset("5b_logo", "5b.svg", "svg");
        this.loadAsset("5b_people", "5b_people.svg", "svg");

        this.loadAsset("core_tileset", "tileset.png");

        this.loadAsset("background_0", "backgrounds/0.png");
        this.loadAsset("background_1", "backgrounds/1.png");
        this.loadAsset("background_2", "backgrounds/2.png");
        this.loadAsset("background_3", "backgrounds/3.png");
        this.loadAsset("background_4", "backgrounds/4.png");
        this.loadAsset("background_5", "backgrounds/5.png");
        this.loadAsset("background_6", "backgrounds/6.png");
        this.loadAsset("background_7", "backgrounds/7.png");
        this.loadAsset("background_8", "backgrounds/8.png");
        this.loadAsset("background_9", "backgrounds/9.png");
        this.loadAsset("background_10", "backgrounds/10.png");
        this.loadAsset("background_11", "backgrounds/11.png");

        this.loadAsset("toolwidget_example", "misc/toolwidget.png");
        this.loadAsset("cursor", "misc/cursor.png");
        this.loadAsset("select", "misc/select.png");
        this.loadAsset("pencil", "misc/pencil.png");
        this.loadAsset("brush", "misc/brush.png");
        this.loadAsset("fill", "misc/fill.png");
        this.loadAsset("eraser", "misc/eraser.png");
        this.loadAsset("zoom", "misc/zoom.png");

        this.loadAsset("missing", "misc/missing.png");
        this.loadAsset("animate_missing", "misc/animate_missing.png");
        this.loadAsset("special_missing", "misc/special_missing.png");
        this.loadAsset("deco_missing", "misc/deco_missing.png");
        this.loadAsset("special_missing", "misc/special_missing.png");
        this.loadAsset("kill_missing", "misc/kill_missing.png");

        this.loadAsset("book", "sprites/book.png");
        this.loadAsset("crate", "sprites/crate.png");
        this.loadAsset("metal", "sprites/metalbox.png");
        this.loadAsset("parcel", "sprites/package.png");
        this.loadAsset("portal", "sprites/portal.png");
        this.loadAsset("spike", "sprites/spike.png");

        this.loadAsset("finish", "sprites/finish.png");

        this.addLine("Completed Loading!", greenStyle);
        console.log("Loading completed, Starting...");
    }

    create(): void {
        this.scene.start("menuScene"); // finished
    }

    loadAsset(key: string, url: string, type?: string): void {
        switch (type) {
        case "svg":
            this.load.svg(key, url);
            this.addAssetLine(url);
            break;

        default:
        case "png":
            this.load.image(key, url);
            this.addAssetLine(url);
        }
    }

    addAssetLine(text: string): Phaser.GameObjects.Text {
        return this.addLine(`Loading asset:  ${text}`, consoleStyle);
    }

    // idk
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addLine(text: string, ts?: any): Phaser.GameObjects.Text {
        if (consolelines.length > maxlines) loadingScene.clearConsole();
        const line: Phaser.GameObjects.Text = this.add.text(
            450, 50 + (consolelines.length * 15), text, ts,
        ).setStyle(ts);
        consolelines.push(line);
        return line;
    }

    static clearConsole(): void {
        consolelines.forEach((cl) => cl.destroy());
        consolelines.length = 0;
    }
}

export default loadingScene;
