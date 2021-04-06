import { textStyle } from "../core/buttons";
import { LevelData } from "../core/levelstructure";
import { s_getLocalStorage, s_addSave, s_push, VERSION_NUMBER } from "../core/misc/dataidb";
import Key from "../core/misc/key";
import funnywords from "./funnywords";
import { brushTool, cursorTool, eraserTool, fillTool, pencilTool, selectTool, zoomTool } from "./tools";
import Alert from "./ui/alert";
import Bar from "./ui/bar";
import { MenuBar, subMenuBar, subMenuBarItem } from "./ui/menubar";
import { Screen } from "./ui/screen";
import { ToolWidgetBar } from "./ui/toolwidget";

let eventResize: () => void;
let eventKeydown: () => void;
let eventKeyup: () => void;

class editorScene extends Phaser.Scene {
    menubar: MenuBar
    bottombar: Bar
    baritem: subMenuBarItem[]
    key!: Key
    keys!: Map<string, Key>

    bookTalk!: Phaser.GameObjects.Container
    screen!: Screen
    marker!: Phaser.GameObjects.Graphics

    tools!: ToolWidgetBar

    width!: number
    height!: number

    selectedBlock!: number

    new!: boolean
    level!: LevelData
    constructor() {
        super({ key: "editorScene" });
        this.menubar = new MenuBar("Main");
        this.bottombar = new Bar("Bottom");
        this.baritem = [];
        this.key = new Key("");
        this.keys = new Map();
        this.level = {
            name: "Untitled Levelpack",
            author: "Lorem Ipsum",
            description: "Its Untitled!",
            struct_version: VERSION_NUMBER,
            level_version: "1",
            levels: [
                {
                    name: "Untitled Level",
                    width: 32,
                    height: 18,
                    data: [],
                    entities: [
                        {
                            name: "Book",
                            x: 105,
                            y: 0,
                        }
                    ],
                    background: 0
                }
            ]
        }
        this.selectedBlock = 6;
    }

    init(initLevel: { level?: LevelData, new: boolean }): void {
        this.new = initLevel.new;
        if (initLevel.level !== undefined) this.level = initLevel.level
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
        this.screen = new Screen(150, 125, this);

        this.marker = this.add.graphics();
        this.marker.lineStyle(2, 0x000000);
        this.marker.strokeRect(0, 0, 30 * this.screen.zoom, 30 * this.screen.zoom)

        this.cameras.main.setBounds(0, 0, this.screen.map.widthInPixels, this.screen.map.heightInPixels);

        this.menubar.updateItemMap();

        // Setup & Render Bar Keybinds
        this.setupMenuBar();

        // BookTalk
        this.setupBookTalk();

        // Placeholder
        this.add.text(457, 70, "Tool selected: ");

        // Render Tools
        this.tools.render(0, 60, this)

        // Block selection background
        this.add.rectangle(0, this.height - 150, this.width, 150, 0x2b5937, 128).setOrigin(0, 0);

        // Get local saves
        s_getLocalStorage();
        if (!this.new) this.screen.setData(this.level.levels[0].data)

        // this.setupBlocks();

        this.setupBottomBar();
        this.bottombar.render(10, 800, this);
    }

    update(): void {
        this.updateUI()
        const activePointerBuffer = new Phaser.Math.Vector2();
        this.input.activePointer.positionToCamera(this.cameras.main, activePointerBuffer)

        const screenPos = activePointerBuffer.subtract(new Phaser.Math.Vector2(this.screen.x, this.screen.y))

        const calcZoom = 30 * this.screen.zoom;
        if (this.input.manager.activePointer.isDown) {
            this.screen.placeTile(this.selectedBlock, Math.floor(screenPos.x / calcZoom), Math.floor(screenPos.y / calcZoom))
            this.level.levels[0].data = this.screen.getData();
        }
    }

    updateUI(): void {
        this.screen.updateMapPos();
        this.bookTalk.setY(this.height);
    }

    saveLevel(): void {
        this.level.levels[0].data = this.screen.getData();
        if (this.new) {
            this.level.name = prompt("Choose a name for your save:") ?? "Untitled Level"
        }
        s_addSave(this.level)
        s_push();
    }

    runLevel(): void {
        this.resetChanges();
        console.log(this.level)
        this.scene.start("gameScene", {
            from: this,
            levelfile: this.level,
        })
    }

    exit(): void {
        if (confirm("Are you sure? Make sure you've saved before exiting!")) {
            this.scene.start("saveScene");
            this.resetChanges();
        }
    }

    resetChanges(): void {
        window.removeEventListener("resize", eventResize);
        window.removeEventListener("keydown", eventKeydown);
        window.removeEventListener("keyup", eventKeyup);
        this.menubar.itemMap.clear()
        this.game.scale.resize(960, 540)
    }

    setupMenuBar(): void {
        const file = new subMenuBar("File", this);
        this.menubar.add(file);
        file.add("Save", new Key("S", true), () => this.saveLevel())
        file.add("Load", new Key("L", true), () => this.saveLevel())
        file.add("Upload", new Key("empty", true), () => console.log("Uploaded... but to where?"))
        file.add("Exit", new Key("Escape"), () => this.exit())

        const edit = new subMenuBar("Edit", this);
        this.menubar.add(edit);
        edit.add("Undo", new Key("Z", true), () => console.log("Feature unfinished"))
        edit.add("Redo", new Key("Y", true), () => console.log("Feature unfinished"))
        edit.add("Cut", new Key("X", true), () => console.log("Feature unfinished"))
        edit.add("Copy", new Key("C", true), () => console.log("Feature unfinished"))
        edit.add("Paste", new Key("V", true), () => console.log("Feature unfinished"))

        const view = new subMenuBar("View", this);
        this.menubar.add(view);
        view.add("Zoom In", new Key("=", true, true), () => this.screen.changeZoom(1))
        view.add("Zoom Out", new Key("-", true, true), () => this.screen.changeZoom(-1))
        view.add("100% Zoom", new Key("empty"), () => this.screen.resetZoom())
        view.add("lazy", new Key("ArrowLeft"), () => this.screen.x += 10)
        view.add("lazy", new Key("ArrowRight"), () => this.screen.x -= 10)
        view.add("lazy", new Key("ArrowUp"), () => this.screen.y += 10)
        view.add("lazy", new Key("ArrowDown"), () => this.screen.y -= 10)
        const run = new subMenuBar("Run", this);
        this.menubar.add(run);
        run.add("Run", new Key("Enter", true), () => this.runLevel())
        const help = new subMenuBar("Help", this);
        this.menubar.add(help);
        help.add("About", new Key("empty"), () => new Alert("5bHTML-edit", "Last Updated: 29/03/2021").render(this))

        file.render(0, 0, this);
        edit.render(120, 0, this);
        view.render(240, 0, this);
        run.render(360, 0, this);
        help.render(480, 0, this);
    }

    setupBottomBar(): void {
        const blocksTab = this.make.container({}, false).add([
            this.createBlockContainer()
        ])
        this.bottombar.add("Blocks", blocksTab);

        //const entityTab = this.make.container({}, false).add([
        //])
        //this.bottombar.add("Entity", entityTab);

        //const levelScreen = new Screen(0, 0, this)
        //levelScreen.setData(this.level.levels[0].data)
        //levelScreen.changeZoom(-0.8)
        //levelScreen.y = 800;
        //levelScreen.x = 20;
        //levelScreen.updateMapPos()

        //const levelsTab = this.make.container({}, false).add([
        //    this.make.text({ text: "Level 001", y: 10 }),
        //    // levelScreen.layer
        //])
        //this.bottombar.add("Levels", levelsTab);
    }

    createBlockContainer(): Phaser.GameObjects.Container {
        const container = this.add.container(60, 850)
        const data: number[][] = [[]]
        for (let i = 0; i < 20; i++) {
            data[0].push(-1, i)
        }
        const map = this.make.tilemap({
            data: data,
            tileWidth: 30,
            tileHeight: 30,
        })
        const tiles = map.addTilesetImage("core_tileset", "core_tileset");
        const layer = map.createLayer(0, tiles);
        layer.setPosition(-30, 800)
        for (let i = 0; i < 21; i++) {
            container.add(this.add.text(-60 + (60 * i), 0, i.toString(), textStyle)
                .setBackgroundColor("#900")
                .setFontSize(36)
                .setInteractive()
                .on("pointerdown", () => {
                    this.selectedBlock = i;
                })
            )
        }
        container.add(layer);
        return container;
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
            const item = this.menubar.itemMap.get(event.code);
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
