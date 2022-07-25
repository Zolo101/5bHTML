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

type loadAssetAllowed = "svg" | "image" | "atlas"

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

        this.loadAsset("svg", "5b_logo", "5b.svg");
        this.loadAsset("svg", "5b_people", "5b_people.svg");

        this.loadAsset("image", "core_tileset", "tileset.png");
        this.loadAsset("image", "outline_tileset", "outline_tileset.png");

        this.loadAsset("image", "background_0", "backgrounds/0.png");
        this.loadAsset("image", "background_1", "backgrounds/1.png");
        this.loadAsset("image", "background_2", "backgrounds/2.png");
        this.loadAsset("image", "background_3", "backgrounds/3.png");
        this.loadAsset("image", "background_4", "backgrounds/4.png");
        this.loadAsset("image", "background_5", "backgrounds/5.png");
        this.loadAsset("image", "background_6", "backgrounds/6.png");
        this.loadAsset("image", "background_7", "backgrounds/7.png");
        this.loadAsset("image", "background_8", "backgrounds/8.png");
        this.loadAsset("image", "background_9", "backgrounds/9.png");
        this.loadAsset("image", "background_10", "backgrounds/10.png");
        this.loadAsset("image", "background_11", "backgrounds/11.png");

        this.loadAsset("image", "toolwidget_example", "misc/toolwidget.png");
        this.loadAsset("image", "cursor", "misc/cursor.png");
        this.loadAsset("image", "select", "misc/select.png");
        this.loadAsset("image", "pencil", "misc/pencil.png");
        this.loadAsset("image", "brush", "misc/brush.png");
        this.loadAsset("image", "fill", "misc/fill.png");
        this.loadAsset("image", "eraser", "misc/eraser.png");
        this.loadAsset("image", "zoom", "misc/zoom.png");

        this.loadAsset("image", "missing", "misc/missing.png");
        this.loadAsset("image", "animate_missing", "misc/animate_missing.png");
        this.loadAsset("image", "special_missing", "misc/special_missing.png");
        this.loadAsset("image", "deco_missing", "misc/deco_missing.png");
        this.loadAsset("image", "special_missing", "misc/special_missing.png");
        this.loadAsset("image", "kill_missing", "misc/kill_missing.png");

        this.loadAsset("image", "book_editor", "sprites/editor/book.png");

        this.loadAsset("image", "crate", "sprites/crate.png");
        this.loadAsset("image", "metal", "sprites/metalbox.png");
        this.loadAsset("image", "parcel", "sprites/package.png");
        this.loadAsset("image", "portal", "sprites/portal.png");
        this.loadAsset("image", "spike", "sprites/spike.png");
        this.loadAsset("image", "finish", "sprites/finish.png");

        this.loadAsset("atlas", "book_walkL", "sprites/animation/book_walkL.png", "sprites/animation/book_walkL.json")
        this.loadAsset("atlas", "book_walkR", "sprites/animation/book_walkR.png", "sprites/animation/book_walkR.json")
        this.loadAsset("atlas", "book_general", "sprites/animation/book_general.png", "sprites/animation/book_general.json")
        this.loadAsset("atlas", "legs_walk", "sprites/animation/legs_walk.png", "sprites/animation/legs_walk.json")

        this.addLine("Completed Loading!", greenStyle);
        console.log("Loading completed, Starting...");
    }

    create(): void {
        alert("This remake of 5b is outdated!\nUse coppersalt's 'HTML5b' instead. Link is down below.")
        this.scene.start("menuScene"); // finished
    }

    loadAsset<T extends keyof Pick<Phaser.Loader.LoaderPlugin, loadAssetAllowed>>(key: T, ...args: Parameters<Phaser.Loader.LoaderPlugin[T]>): void {
        // @ts-expect-error no typescript, this DOES work.
        this.load[key](...args);
        this.addAssetLine(`${args[0] as string} (${args[1] as string})`);
    }

    addAssetLine(text: string): Phaser.GameObjects.Text {
        return this.addLine(`Loading asset:  ${text}`, consoleStyle);
    }

    addLine(text: string, ts: Partial<Phaser.GameObjects.TextStyle>): Phaser.GameObjects.Text {
        if (consolelines.length > maxlines) loadingScene.clearConsole();
        const line: Phaser.GameObjects.Text = this.add.text(50, 170 + (consolelines.length * 15), text, ts)
            .setStyle(ts);
        consolelines.push(line);
        return line;
    }

    static clearConsole(): void {
        consolelines.forEach((cl) => cl.destroy());
        consolelines.length = 0;
    }
}

export default loadingScene;
