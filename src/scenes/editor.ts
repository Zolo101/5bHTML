import Key from "../game/core/misc/key";
import { Bar, subBar, subBarItem } from "../game/editor/bar";

class editorScene extends Phaser.Scene {
    bar: Bar
    baritem: subBarItem[]
    key!: Key
    constructor() {
        super({ key: "editorScene" });
        this.bar = new Bar("Main");
        this.baritem = [];
        this.key = new Key("");
    }

    create(): void {
        const funnywords = [
            "5beam-reddit",
            "5beam-edd-ed-and-edit",
            "5beam-edit-edit",
            "5bee buzz buzz",
            "five horizontal metal blocks with the intent of editing levels in a video game",
            "5bruh moment",
            "5b5t",
            "Join the discord server: https://discord.gg/um5KWabefm",
            "Hi, im book, and im 𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫",
            "5beam 21w02a snapshot || Removed Herobrine.",
            "when is thoughtfloat coming back smh :\\",
            "mfw 5beam still dead",
            "mfw i do crtl+w",
            "mfw levels you've made dont save yet",
            "mfw you cant upload levels yet",
            "mfw depending on your screen ratio you can't read this awfully long piece of textual infomation unless you go into the source code and see what it looks like, which if you're doing now, hello! lol",
            "\"Don't believe everything you read on the internet\" ~Cary Huang, 2021.",
            "...have cots... have nots... more like have been hotel xdd",
            "Whats up guys, book here, back for another tutorial on how to create levels in 5bHTML",
            "AAAAAAAAAAAAAAAHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH",
            "Now Playing: https://www.youtube.com/watch?v=g-Z7U77osT8",
            "Now Playing: https://www.youtube.com/watch?v=KyNVRrHkwe0",
            "The names book. James book.",
        ]
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.scale.scaleMode = Phaser.Scale.NONE;
        this.game.scale.resize(width, height)
        const eventResize = () => window.addEventListener("resize", () => {
            this.game.scale.resize(width, height);
        })

        const eventKeydown = () => window.addEventListener("keydown", (event) => {
            this.key.change(event.code, false, event.ctrlKey)
            const item = this.bar.itemMap.get(event.code);
            // console.log(this.bar.itemMap.entries(), event)
            if (item !== undefined) {
                item.onclick()
            }
            // console.log(event);
        })
        const eventKeyup = () => window.addEventListener("keyup", (event) => {
            this.key.change(event.code, false, event.ctrlKey)
            // console.log(event);
        })

        eventResize();
        eventKeydown();
        eventKeyup();

        // Init UI
        const file = new subBar("File", this);
        this.bar.add(file);
        file.add(
            "Save",
            new Key("S", false, true),
            () => console.log("Saved!")
        )
        file.add(
            "Exit",
            new Key("Escape"),
            () => {
                window.removeEventListener("resize", eventResize);
                window.removeEventListener("keydown", eventKeydown);
                window.removeEventListener("keyup", eventKeyup);
                this.bar.itemMap.clear()
                this.game.scale.resize(960, 540)
                this.scene.start("menuScene")
            }
        )

        const edit = new subBar("Edit", this);
        this.bar.add(edit);
        edit.add(
            "Undo",
            new Key("Z", false, true),
            () => console.log("Feature unfinished")
        )
        edit.add(
            "Redo",
            new Key("Y", true),
            () => console.log("Feature unfinished")
        )
        edit.add(
            "Cut",
            new Key("X", true),
            () => console.log("Feature unfinished")
        )
        edit.add(
            "Copy",
            new Key("C", true),
            () => console.log("Feature unfinished")
        )
        edit.add(
            "Paste",
            new Key("V", true),
            () => console.log("Feature unfinished")
        )

        const view = new subBar("View", this);
        this.bar.add(view);
        view.add(
            "Zoom In",
            new Key("=", true),
            () => console.log("Feature unfinished")
        )
        view.add(
            "Zoom Out",
            new Key("-", true),
            () => console.log("Feature unfinished")
        )
        view.add(
            "100% Zoom",
            new Key("empty"),
            () => console.log("Feature unfinished")
        )

        const help = new subBar("Help", this);
        this.bar.add(help);
        help.add(
            "About",
            new Key("empty"),
            () => alert("5bHTML-edit, Last Updated: 12/01/2021")
        )

        this.bar.updateItemMap();

        this.add.rectangle(0, 0, width, height, 0x333333).setOrigin(0, 0);
        file.render(0, 0, this);
        edit.render(120, 0, this);
        view.render(240, 0, this);
        help.render(360, 0, this);

        this.add.text(10, height - 50, "This is the level editor. You level editors here.");

        this.add.grid(510, 320, 960, 540, 30, 30, 0xcccccc)

        this.add.rectangle(0, height - 15, width * 2, 25, 0xffffff);
        this.add.image(12, height - 13, "book").setScale(0.075);
        this.add.text(26, height - 22, funnywords[Math.round(Math.random() * funnywords.length - 1)]).setColor("#000");
    }
}

export default editorScene;
