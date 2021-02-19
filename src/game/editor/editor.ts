import { LevelData } from "../core/levelstructure";
import SaveManager from "../core/misc/dataidb";
import Key from "../core/misc/key";
import funnywords from "./funnywords";
import { brushTool, cursorTool, eraserTool, fillTool, pencilTool, selectTool, zoomTool } from "./tools";
import Alert from "./ui/alert";
import { Bar, subBar, subBarItem } from "./ui/bar";
import { Screen } from "./ui/screen";
import { ToolWidgetBar } from "./ui/toolwidget";

let eventResize: () => void;
let eventKeydown: () => void;
let eventKeyup: () => void;

class editorScene extends Phaser.Scene {
    bar: Bar
    baritem: subBarItem[]
    key!: Key
    keys!: Map<string, Key>

    bookTalk!: Phaser.GameObjects.Container
    screen!: Screen
    marker!: Phaser.GameObjects.Graphics

    tools!: ToolWidgetBar

    width!: number
    height!: number

    level: LevelData
    constructor() {
        super({ key: "editorScene" });
        this.bar = new Bar("Main");
        this.baritem = [];
        this.key = new Key("");
        this.keys = new Map();
        this.level = {
            name: "Untitled Level",
            author: "Lorem Ipsum",
            description: "Its Untitled!",
            struct_version: 7,
            level_version: "1.0",
            levels: []
        }
    }

    create(): void {
        this.scale.scaleMode = Phaser.Scale.NONE;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.game.scale.resize(this.width, this.height);

        // Add Keybind Listeners
        this.addListeners();

        this.input.on("wheel", (pointer: never, gameObject: never, deltaX: number, deltaY: number) => {
            console.log(this.key)
            if (this.key.shift) {
                this.screen.x += deltaY * 0.2;
            } else if (this.key.crtl) {
                this.screen.changeZoom(-Math.sign(deltaY) / 10);
            } else {
                this.screen.y -= deltaY * 0.2;
            }
        })

        // Init Tools
        this.tools = new ToolWidgetBar();
        this.tools.add(cursorTool);
        this.tools.add(selectTool);
        this.tools.add(pencilTool);
        this.tools.add(brushTool);
        this.tools.add(fillTool);
        this.tools.add(eraserTool);
        this.tools.add(zoomTool);
        this.tools.selected = cursorTool;

        eventResize();
        eventKeydown();
        eventKeyup();

        this.add.rectangle(0, 0, this.width, this.height, 0x333333).setOrigin(0, 0);

        this.add.rectangle(0, 0, this.width, 93, 0x444444, 64).setOrigin(0, 0);

        // Init UI
        this.screen = new Screen(150, 125, this.width, this.height - 100, this, this.tools);

        this.marker = this.add.graphics();
        this.marker.lineStyle(2, 0x000000);
        this.marker.strokeRect(0, 0, 30 * this.screen.zoom, 30 * this.screen.zoom)

        this.cameras.main.setBounds(0, 0, this.screen.map.widthInPixels, this.screen.map.heightInPixels);

        this.bar.updateItemMap();

        // Setup & Render Bar Keybinds
        this.setupBar();

        // BookTalk
        this.setupBookTalk();

        // Placeholder
        this.add.text(457, 70, "Tool selected: ");

        // Render Tools
        this.tools.render(0, 60, this)

        // Block selection background
        this.add.rectangle(0, this.height - 150, this.width, 150, 0x2b5937, 128).setOrigin(0, 0);

        // Get local saves
        SaveManager.getLocalStorage();
    }

    update(): void {
        this.updateUI()
        const activePointerBuffer = new Phaser.Math.Vector2();
        this.input.activePointer.positionToCamera(this.cameras.main, activePointerBuffer)

        const screenPos = activePointerBuffer.subtract(new Phaser.Math.Vector2(this.screen.x, this.screen.y))

        const calcZoom = 30 * this.screen.zoom;
        if (this.input.manager.activePointer.isDown) {
            this.screen.placeTile(6, Math.floor(screenPos.x / calcZoom), Math.floor(screenPos.y / calcZoom))
        }
    }

    updateUI(): void {
        this.screen.updateMapPos();
        this.bookTalk.setY(this.height);
    }

    saveLevel(): void {
        const levelname = prompt("(temp) Choose a name for your save:") || "Untitled Level"
        //SaveManager.addSave(levelname, this.screen.grid.blockData)
        SaveManager.push();
    }

    exit(): void {
        window.removeEventListener("resize", eventResize);
        window.removeEventListener("keydown", eventKeydown);
        window.removeEventListener("keyup", eventKeyup);
        this.bar.itemMap.clear()
        this.game.scale.resize(960, 540)
        this.scene.start("saveScene")
    }

    setupBar(): void {
        const file = new subBar("File", this);
        this.bar.add(file);
        file.add(
            "Save",
            new Key("S", true),
            () => this.saveLevel()
        )
        file.add(
            "Load",
            new Key("L", true),
            () => this.saveLevel()
        )
        file.add(
            "Upload",
            new Key("empty", true),
            () => console.log("Uploaded... but to where?")
        )
        file.add(
            "Exit",
            new Key("Escape"),
            () => this.exit()
        )

        const edit = new subBar("Edit", this);
        this.bar.add(edit);
        edit.add(
            "Undo",
            new Key("Z", true),
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
            new Key("=", true, true),
            () => this.screen.changeZoom(1)
        )
        view.add(
            "Zoom Out",
            new Key("-", true, true),
            () => this.screen.changeZoom(-1)
        )
        view.add(
            "100% Zoom",
            new Key("empty"),
            () => this.screen.resetZoom()
        )
        view.add(
            "lazy",
            new Key("ArrowLeft"),
            () => this.screen.x += 10
        )
        view.add(
            "lazy",
            new Key("ArrowRight"),
            () => this.screen.x -= 10
        )
        view.add(
            "lazy",
            new Key("ArrowUp"),
            () => this.screen.y += 10
        )
        view.add(
            "lazy",
            new Key("ArrowDown"),
            () => this.screen.y -= 10
        )
        const help = new subBar("Help", this);
        this.bar.add(help);
        help.add(
            "About",
            new Key("empty"),
            () => new Alert("5bHTML-edit", "Last Updated: 22/01/2021").render(this)
        )

        file.render(0, 0, this);
        edit.render(120, 0, this);
        view.render(240, 0, this);
        help.render(360, 0, this);
    }

    addListeners(): void {
        eventResize = () => window.addEventListener("resize", () => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.game.scale.resize(Math.floor(this.width), Math.floor(this.height));
            // console.log(width, height)
        })

        eventKeydown = () => window.addEventListener("keydown", (event) => {
            this.key.change(event.code, event.ctrlKey, event.shiftKey, event.altKey)
            const item = this.bar.itemMap.get(event.code);
            // console.log(this.bar.itemMap.entries(), event)
            if (item !== undefined) {
                item.onclick()
            }
        })
        eventKeyup = () => window.addEventListener("keyup", (event) => {
            this.key.change(event.code, false, event.ctrlKey)
        })
    }

    setupBookTalk(): void {
        this.bookTalk = this.add.container(10, this.height);
        this.bookTalk.add(this.add.rectangle(0, -162, this.width * 2, 25, 0xffffff, 16))
        this.bookTalk.add(this.add.image(4, -162, "book").setScale(0.075))
        this.bookTalk.add(this.add.text(18, -170, funnywords[Math.round(Math.random() * funnywords.length - 1)]).setColor("#000"))
    }
}

export default editorScene;
