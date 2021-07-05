import { BaseButton, textStyle, titleStyle } from "../core/buttons";
import { entityData } from "../core/jsonmodule";
import { Entity, Level, LevelData } from "../core/levelstructure";
import { s_getLocalStorage, s_addSave, s_push, VERSION_NUMBER, s_getCacheSave } from "../core/misc/dataidb";
import Key from "../core/misc/key";
import { chunkArray, create2DNumberArray } from "../core/misc/other";
import { brushTool, cursorTool, eraserTool, fillTool, pencilTool, Point, selectTool, zoomTool } from "./tools";
import Alert from "./ui/alert";
import Bar from "./ui/bar";
import { MenuBar, subMenuBar, subMenuBarItem } from "./ui/menubar";
import NumInc from "./ui/numinc";
import { Screen } from "./ui/screen";
import { ToolWidgetBar } from "./ui/toolwidget";

let eventResize: () => void;
let eventKeydown: () => void;

type EditorEntity = Entity & {
    ID: number,
    visible: boolean,
    locked: boolean
}

type InitData = {
    level: LevelData,
    currentLevelNumber?: number
}

class editorScene extends Phaser.Scene {
    width!: number
    height!: number
    level!: LevelData;
    currentLevel!: Level;
    currentLevelNumber!: number;

    menubar!: MenuBar;
    bottombar!: Bar;
    baritem!: subMenuBarItem[];
    key!: Key;
    keys!: Map<string, Key>;

    gameobjects!: {
        levelpackName: Phaser.GameObjects.Text
        background: Phaser.GameObjects.Rectangle
        toolbarBackground: Phaser.GameObjects.Rectangle

        screen: Screen
        entityContainer: Phaser.GameObjects.Container
        hoverContainer: Phaser.GameObjects.Container
        grid: Phaser.GameObjects.Grid

        bookTalk: {
            book: Phaser.GameObjects.Image,
            text: Phaser.GameObjects.Text
        }
        bookTalkBackground: {
            white: Phaser.GameObjects.Rectangle
            green: Phaser.GameObjects.Rectangle
            main: Phaser.GameObjects.Container
        }

        panel: {
            background: Phaser.GameObjects.Rectangle
            list: Phaser.GameObjects.Container
        },
    }

    blocktilelayer!: Phaser.Tilemaps.TilemapLayer

    marker!: Phaser.GameObjects.Graphics

    tools!: ToolWidgetBar

    screenEntities!: EditorEntity[]
    screenCamera!: Phaser.Cameras.Scene2D.Camera
    numincs!: {
        background: NumInc,
        level: NumInc
    }

    selectedBlock!: number;
    selectedEntities!: EditorEntity[]

    new!: boolean
    originalData!: Required<InitData>

    controls!: Phaser.Cameras.Controls.SmoothedKeyControl

    constructor() {
        super({ key: "editorScene" });
    }

    init(data: InitData): void {
        this.originalData = {
            currentLevelNumber: data.currentLevelNumber ?? 0,
            level: data.level,
        }
        // console.log("saveddata", data.level)

        this.currentLevelNumber = this.originalData.currentLevelNumber;
        this.level = (this.originalData.level.name !== undefined) ? this.originalData.level : {
            name: "Untitled Levelpack",
            author: "Guest",
            description: "",
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
                            type: "Character",
                            x: 105,
                            y: 0,
                        }
                    ],
                    background: 0
                }
            ]
        };
    }

    create(): void {
        this.scale.scaleMode = Phaser.Scale.NONE;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.game.scale.resize(this.width, this.height);

        // Add Keybind Listeners
        this.addListeners();

        // this.input.on("wheel", (pointer: never, gameObject: never, deltaX: number, deltaY: number) => {
        // console.log(this.key)
        // if (this.key.shift) {
        // this.gameobjects.screen.x += deltaY * 0.2;
        // } else if (this.key.crtl) {
        // this.gameobjects.screen.zoom += -Math.sign(deltaY) / 10;
        // } else {
        // this.gameobjects.screen.y -= deltaY * 0.2;
        // }
        // })

        this.menubar = new MenuBar("Main");
        this.bottombar = new Bar("Bottom");
        this.baritem = [];
        this.key = new Key("");
        this.keys = new Map();

        console.log(this.level)
        this.currentLevel = this.level.levels[this.currentLevelNumber];
        this.selectedBlock = 6;

        // Init Tools
        this.tools = new ToolWidgetBar();
        this.tools.add(cursorTool);
        // this.tools.add(selectTool);
        this.tools.add(pencilTool);
        this.tools.add(brushTool);
        this.tools.add(fillTool);
        this.tools.add(eraserTool);
        // this.tools.add(zoomTool);
        this.tools.selected = cursorTool;

        eventResize();
        eventKeydown();

        // Init UI

        this.gameobjects = {
            background: this.add.rectangle(0, 0, this.width, this.height, 0x333333).setOrigin(0, 0),

            screen: new Screen(Math.floor((this.width / 3) - 400), 125, this),
            hoverContainer: this.add.container(0, 0),
            grid: this.add.grid(0, 0, 960, 540, 30, 30)
                .setOrigin(0, 0)
                .setBlendMode(Phaser.BlendModes.ADD)
                .setOutlineStyle(0x444444, 0.4)
                .setAlpha(0),
            entityContainer: this.add.container(0, 0),

            toolbarBackground: this.add.rectangle(0, 0, this.width, 93, 0x777777, 64).setOrigin(0, 0),

            bookTalkBackground: {
                white: this.add.rectangle(0, this.height - 234, this.width * 2, 25, 0xffffff, 16).setOrigin(0, 0),
                green: this.add.rectangle(0, this.height - 209, this.width * 2, 225, 0x2b5937, 128).setOrigin(0, 0),
                main: this.add.container(0, this.height - 209),
            },

            bookTalk: {
                book: this.add.image(14, this.height - 222, "book").setScale(0.075),
                text: this.add.text(28, this.height - 230, "Welcome to 5bHTML-edit!").setColor("#000"),
            },

            panel: {
                background: this.add.rectangle(this.width - 250, 93, 250, this.height - 250 - 77, 0xffffff, 128)
                    .setOrigin(0, 0),
                list: this.add.container(this.width - 250, 93)
            },

            levelpackName: this.add.text(5, 3, "", textStyle)
                .setFontSize(28)
        }

        this.gameobjects.screen.setBackground(this.currentLevel.background)
        this.gameobjects.screen.updateMapPos()

        this.marker = this.add.graphics();
        this.marker.lineStyle(2, 0x000000);
        this.marker.strokeRect(0, 0, 30 * this.gameobjects.screen.zoom, 30 * this.gameobjects.screen.zoom)

        this.cameras.main.ignore([
            // this.gameobjects.background,
            this.gameobjects.screen.background,
            this.gameobjects.screen.layer,
            this.gameobjects.hoverContainer,
            this.gameobjects.grid,
            this.gameobjects.entityContainer,
            // this.blocktilelayer,
            // this.gameobjects.toolbarBackground,
            // this.gameobjects.bookTalkBackground.white,
            // this.gameobjects.bookTalkBackground.green,
            // this.gameobjects.bookTalkBackground.main,
            // this.gameobjects.bookTalk.book,
            // this.gameobjects.bookTalk.text,
            // this.gameobjects.panel.background,
            // this.gameobjects.panel.list,
            // this.gameobjects.levelpackName,
        ])
        this.screenCamera = this.cameras.add(0, 93, this.gameobjects.panel.list.x, this.gameobjects.bookTalkBackground.white.y - 93)
        this.screenCamera.setBounds(this.gameobjects.screen.x, this.gameobjects.screen.y, 960, 540, true)
        this.screenCamera.ignore([
            this.gameobjects.background,
            // this.gameobjects.screen,
            // this.gameobjects.hoverContainer,
            // this.gameobjects.grid,
            // this.gameobjects.entityContainer,
            this.gameobjects.toolbarBackground,
            this.gameobjects.bookTalkBackground.white,
            this.gameobjects.bookTalkBackground.green,
            this.gameobjects.bookTalkBackground.main,
            this.gameobjects.bookTalk.book,
            this.gameobjects.bookTalk.text,
            this.gameobjects.panel.background,
            this.gameobjects.panel.list,
            this.gameobjects.levelpackName,
        ])

        const cursors = this.input.keyboard.createCursorKeys();
        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl({
            camera: this.screenCamera,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            minZoom: 1,
            maxZoom: 5,
            zoomSpeed: 0.03,
            acceleration: 0.3,
            // drag: 0.0005,
            drag: 0.05,
            maxSpeed: 5.0,
        })
        // this.cameras.main.setBounds(0, 0, this.gameobjects.screen.map.widthInPixels, this.gameobjects.screen.map.heightInPixels);

        this.menubar.updateItemMap();

        // Setup & Render Bar Keybinds
        this.setupMenuBar();

        const selectedRect = this.add.rectangle(0, 28, 64, 64, 0xeeeeee)
            .setOrigin(0, 0);
        // Render Tools
        this.tools.render(0, 60, this)
        this.tools.onChange = (tool) => {
            this.tweens.add({
                targets: selectedRect,
                ease: "Sine.easeInOut",
                duration: 200,
                x: Array.from(this.tools.tools.keys()).indexOf(tool.name) * 64
            })
            this.gameobjects.grid.setAlpha((tool.name === "Cursor") ? 0 : 1)
        }

        // Get local saves
        s_getLocalStorage();
        if (!this.new) this.gameobjects.screen.setData(this.currentLevel.data)

        // this.setupBlocks();

        this.setupBottomBar();
        this.bottombar.render(10, 800, this);


        this.screenEntities = [];
        // const book = this.level.levels[0].entities[0];
        // this.screenEntities.push({
        //     ID: this.screenEntities.length,
        //     name: book.name,
        //     type: book.type,
        //     x: book.x,
        //     y: book.y,

        //     controllable: book.controllable,
        //     visible: true,
        //     locked: false
        // })

        this.numincs.level.value = this.currentLevelNumber;

        // some werid issue about level data disappearing after running the level
        // this.currentLevel.data = this.gameobjects.screen.getData();
    }

    update(time: number, delta: number): void {
        if (this.controls !== undefined) this.controls.update(delta);
        this.updateUI()
        const activePointerBuffer = new Phaser.Math.Vector2();
        this.input.activePointer.positionToCamera(this.screenCamera, activePointerBuffer)
        const calcZoom = 30 * this.gameobjects.screen.zoom;

        const screenPos = activePointerBuffer.subtract(new Phaser.Math.Vector2(this.gameobjects.screen.x, this.gameobjects.screen.y))
        const screenPosCopy: Point = { x: screenPos.x, y: screenPos.y };

        const blockPos = screenPos.divide({ x: calcZoom, y: calcZoom });
        const insideScreen = blockPos.x >= 0 && blockPos.y >= 0 && blockPos.x < 32 && blockPos.y < 18

        screenPos.x = Math.min(screenPos.x, 31);
        screenPos.y = Math.min(screenPos.y, 17);
        const placeCoords = this.tools.selected.getCoords(screenPos, this.gameobjects.screen)

        if (insideScreen) {
            this.gameobjects.bookTalk.text.setText(`${this.tools.selected.name}: [${Math.floor(blockPos.x + 1)}, ${Math.floor(blockPos.y + 1)}] (x ${Math.floor(screenPosCopy.x)}, y ${Math.floor(screenPosCopy.y)})`)
            this.renderHover(placeCoords);

            if (this.input.manager.activePointer.isDown) {
                for (const coord of placeCoords) {
                    // console.log(coord)
                    // const apb = activePointerBuffer.subtract(coord)
                    this.gameobjects.screen.placeTile((this.tools.selected.name === "Eraser") ? -2 : this.selectedBlock, Math.floor(coord.x), Math.floor(coord.y))
                }
                this.currentLevel.data = this.gameobjects.screen.getData();
            }
        }
    }

    updateUI(): void {
        this.gameobjects.entityContainer.setPosition(this.gameobjects.screen.x, this.gameobjects.screen.y)
        this.gameobjects.hoverContainer.setPosition(this.gameobjects.screen.x, this.gameobjects.screen.y)
        this.gameobjects.grid.setPosition(this.gameobjects.screen.x, this.gameobjects.screen.y)
    }

    resizeUI(): void {
        const oldSize = {
            width: this.gameobjects.background.displayWidth,
            height: this.gameobjects.background.displayHeight
        }
        this.gameobjects.background.setDisplaySize(this.width, this.height);
        this.gameobjects.toolbarBackground.setDisplaySize(this.width, 93);

        // console.log(this.gameobjects.background.width, this.width)
        if (oldSize.width !== this.width) this.gameobjects.screen.x -= (oldSize.width - this.width) / 2;
        if (oldSize.height !== this.height) this.gameobjects.screen.y -= (oldSize.height - this.height) / 3;
        this.gameobjects.screen.updateMapPos();

        this.gameobjects.bookTalk.book.setY(this.height - 222);
        this.gameobjects.bookTalk.text.setY(this.height - 230);

        this.gameobjects.bookTalkBackground.white.setDisplaySize(this.width, 25);
        this.gameobjects.bookTalkBackground.white.setY(this.height - 234);
        this.gameobjects.bookTalkBackground.green.setDisplaySize(this.width, this.height);
        this.gameobjects.bookTalkBackground.green.setY(this.height - 209);
        this.gameobjects.bookTalkBackground.main.setY(this.height - 209);
        this.blocktilelayer.setY(this.height - 175);

        this.gameobjects.panel.list.setX(this.width - 250);
        this.gameobjects.panel.background.setX(this.width - 250);
        this.gameobjects.panel.background.height = this.height - 250 - 77;

        this.bottombar.container.setY(this.height);

        this.screenCamera.setSize(this.gameobjects.panel.list.x, this.gameobjects.bookTalkBackground.white.y - 93)
    }

    saveLevel(): void {
        this.currentLevel.entities.length = 0;
        // console.log("s1", this.gameobjects.screen.getData())
        this.currentLevel.data = this.gameobjects.screen.getData();
        this.level.levels[this.currentLevelNumber] = this.currentLevel;
        // console.log("s2", this.level.levels[this.currentLevelNumber])
        for (const entity of this.screenEntities) {
            this.currentLevel.entities.push({
                name: entity.name,
                type: entity.type,
                x: entity.x,
                y: entity.y,
                controllable: entity.controllable
            })
        }

        if (this.level.name === "Untitled Levelpack") {
            this.level.name = prompt("Choose a name for your save:") || this.level.name
        }
        s_addSave(this.level)
        s_push()
        // console.log("s3", s_getCacheSave("volume"))
    }

    runLevel(num: number): void {
        this.saveLevel();
        this.resetWindowChanges();
        const modifiedLevel = this.level;
        console.log("bruh", modifiedLevel.levels, num, modifiedLevel.levels[num])
        // Get only the current level
        modifiedLevel.levels = [modifiedLevel.levels[num]];
        this.scene.start("gameScene", {
            from: this,
            levelfile: modifiedLevel,
            extraData: {
                currentLevelNumber: this.currentLevelNumber
            }
        })
    }

    async exit(): Promise<void> {
        new Alert("Exit Editor", "Are you sure? Make sure you've saved before exiting!", "YESNO").render(this)
            .then(() => {
                this.scene.start("saveScene");
                this.resetWindowChanges();
            }, () => {return})
    }

    resetWindowChanges(): void {
        window.removeEventListener("resize", eventResize);
        window.removeEventListener("keydown", eventKeydown);
        this.menubar.itemMap.clear()
        this.game.scale.resize(960, 540)
    }

    createLevel(): Level {
        return {
            name: "Untitled Level",
            width: 32,
            height: 18,
            data: create2DNumberArray(32, 18),
            entities: [
                {
                    name: "Book",
                    type: "Character",
                    x: 105,
                    y: 0,
                }
            ],
            background: 0
        }
    }

    async changeLevels(num: number): Promise<boolean> {
        const sameLevel = (num === this.currentLevelNumber);
        const oldLevel = this.level.levels[this.currentLevelNumber];
        let newLevel = this.level.levels[num];
        let continuing = false;

        if (newLevel !== undefined) {
            this.currentLevel = newLevel;
            continuing = true;
        } else {
            await new Alert("Uncreated Level", "This level has not been created. Would you like to create it?", "YESNO")
                .render(this).then(() => {
                    newLevel = this.createLevel();
                    this.currentLevel = newLevel;
                    this.numincs.background.value = 0;
                    continuing = true;
                }, () => { return false })
        }

        if (!continuing) return false;

        // console.log("eee1", oldLevel.entities)
        // Pack entities
        if (!sameLevel) oldLevel.entities.length = 0
        for (const entity of this.screenEntities) {
            oldLevel.entities.push({
                name: entity.name,
                type: entity.type,
                x: entity.x,
                y: entity.y,
                controllable: entity.controllable
            })
        }
        this.screenEntities.length = 0;

        // console.log("eee2", this.currentLevel.entities)
        // Unpack new entities
        for (const entity of this.currentLevel.entities) {
            this.screenEntities.push({
                ID: this.screenEntities.length,
                name: entity.name,
                type: entity.type,
                x: entity.x,
                y: entity.y,

                controllable: entity.controllable,
                visible: true,
                locked: false
            })
        }


        this.currentLevelNumber = num;
        this.gameobjects.screen.setData(newLevel.data);
        this.numincs.background.value = newLevel.background;
        this.renderEntities(this.screenEntities);
        this.renderEntityPanel();
        return true;
    }

    setupMenuBar(): void {
        const file = new subMenuBar("File", this, this.menubar);
        this.menubar.add(file);
        file.add("Save", new Key("S", true), () => this.saveLevel())
        file.add("Exit", new Key("Escape"), () => this.exit())

        const select = new subMenuBar("Select", this, this.menubar);
        this.menubar.add(select)

        // toolbar hotkeys
        Array.from(this.tools.tools.values()).forEach((tool, i) => {
            select.add(`Select ${tool.name}`, new Key(`Digit${i + 1}`), () => this.tools.select(tool.name))
        })

        // const edit = new subMenuBar("Edit", this);
        // this.menubar.add(edit);
        // edit.add("Undo", new Key("Z", true), () => console.log("Feature unfinished"))
        // edit.add("Redo", new Key("Y", true), () => console.log("Feature unfinished"))
        // edit.add("Cut", new Key("X", true), () => console.log("Feature unfinished"))
        // edit.add("Copy", new Key("C", true), () => console.log("Feature unfinished"))
        // edit.add("Paste", new Key("V", true), () => console.log("Feature unfinished"))

        const view = new subMenuBar("View", this, this.menubar);
        this.menubar.add(view);
        // view.add("Zoom In", new Key("Q"), () => this.screenCamera.zoom += 0.25)
        // view.add("Zoom Out", new Key("E"), () => this.screenCamera.zoom -= 0.25)
        // view.add("100% Zoom", new Key("Numpad0", true), () => this.screenCamera.zoom = 1)
        // view.add("Move Left", new Key("ArrowLeft"), () => this.gameobjects.screen.x += 30)
        // view.add("Move Right", new Key("ArrowRight"), () => this.gameobjects.screen.x -= 30)
        // view.add("Move Up", new Key("ArrowUp"), () => this.gameobjects.screen.y += 30)
        // view.add("Move Down", new Key("ArrowDown"), () => this.gameobjects.screen.y -= 30)
        const run = new subMenuBar("Run", this, this.menubar);
        this.menubar.add(run);
        run.add("Run", new Key("Enter", true), () => this.runLevel(this.currentLevelNumber))
        // run.add("Run From Level", new Key("Enter", true), () => this.runLevel(this.currentLevelNumber))
        const help = new subMenuBar("Help", this, this.menubar);
        this.menubar.add(help);
        help.add("About", new Key("empty"), () => new Alert("5bHTML-edit", `5bHTML-edit is a complete level editor made with the sole purpose of making 5bHTML levels.

To move the level screen, use arrow keys.




Made by Zelo101. Last Updated: 30/06/2021`).render(this))

        file.render(0, 0, this);
        // edit.render(120, 0, this);
        view.render(120, 0, this);
        run.render(240, 0, this);
        help.render(360, 0, this);

        this.menubar.updateItemMap();
    }

    setupBottomBar(): void {
        const backgroundsSelect = new NumInc(10, 34, 0, 11, this, (value) => {
            this.gameobjects.screen.background.setTexture(`background_${value}`)
            this.currentLevel.background = value;
        }, this.currentLevel.background);

        const levelsSelect = new NumInc(10, 114, 0, 99, this, async (value, oldvalue) => {
            if (value === this.currentLevelNumber) return;
            // why?
            this.currentLevel.data = this.gameobjects.screen.getData();
            // this.currentLevel.entities = this.screenEntities;

            this.level.levels[this.currentLevelNumber] = this.currentLevel
            const success = this.changeLevels(value);
            success.then((res) => {
                if (!res) this.numincs.level.value = oldvalue
            })
            console.log(this.screenEntities)
        })

        this.numincs = {
            background: backgroundsSelect,
            level: levelsSelect
        }

        const createEntity = (name: string, type: Entity["type"]) => {
            this.screenEntities.push({
                ID: this.screenEntities.length,
                visible: true,
                locked: false,
                name: name,
                type: type,
                x: 0,
                y: 0,
                controllable: true
            })
            this.renderEntities(this.screenEntities);
            this.renderEntityPanel();
            if (this.tools.selected.name !== "Cursor") this.tools.select("Cursor");
        }

        const charactersContainer = this.add.container(200, 34);
        const characterImageNames = ["Book"];
        const characterImages = characterImageNames.map((name, i) => {
            return this.add.image(100 * i, 0, name.toLowerCase())
                .setDisplaySize(64, 64)
                .setOrigin(0, 0)
                .setInteractive()
                .on("pointerdown", () => createEntity(name, "Character"))
        })

        const entitiesContainer = this.add.container(200, 134);
        const entityImageNames = ["Crate", "Metal", "Parcel", "Finish"];
        const entityImages = entityImageNames.map((name, i) => {
            return this.add.image(100 * i, 0, name.toLowerCase())
                .setDisplaySize(64, 64)
                .setOrigin(0, 0)
                .setInteractive()
                .on("pointerdown", () => createEntity(name, "Entity"))
        })

        const nameContainer = this.add.container(660, 134);
        const nameLabel = this.add.text(0, 5, this.currentLevel.name, textStyle);
        nameContainer.add([
            nameLabel,
            new BaseButton(0, 35, "Change level name", this, () => {
                this.currentLevel.name = prompt("Enter new level name") || this.currentLevel.name;
                nameLabel.setText(this.currentLevel.name);
            }, true).gameObject
        ])

        charactersContainer.add(characterImages);
        entitiesContainer.add(entityImages);

        const data = chunkArray(Array.from(Array(25).keys()).flatMap((num) => [-1, num + 6]), 16);
        const map = this.make.tilemap({
            data: data,
            tileWidth: 30,
            tileHeight: 30,
        })
        const tiles = map.addTilesetImage("core_tileset", "core_tileset");
        this.blocktilelayer = map.createLayer(0, tiles);
        this.blocktilelayer.setPosition(625, this.height - 175)
        this.blocktilelayer.setScale(1.25)
        this.blocktilelayer.setInteractive()

        this.gameobjects.bookTalkBackground.main.add([
            this.add.text(10, 9, "Background", textStyle),
            this.add.text(10, 89, "Level", textStyle),
            this.add.text(200, 4, "Characters:", textStyle)
                .setFontSize(28),
            this.add.text(200, 104, "Entities:", textStyle)
                .setFontSize(28),
            this.add.text(650, 4, "Blocks:", textStyle)
                .setFontSize(28),
            this.add.text(650, 104, "Name:", textStyle)
                .setFontSize(28),
            backgroundsSelect.container,
            levelsSelect.container,
            charactersContainer,
            entitiesContainer,
            nameContainer
        ])

        this.blocktilelayer.on("pointerdown", (pointer: any) => {
            this.selectedBlock = this.blocktilelayer.getTileAtWorldXY(pointer.worldX, pointer.worldY).index
            if (this.tools.selected.name === "Cursor") this.tools.select("Pencil");
        })
    }

    renderEntityPanel(): void {
        this.gameobjects.panel.list.removeAll(true);
        const entities = this.screenEntities;
        const econtainList: Phaser.GameObjects.Container[] = []
        entities.forEach((entity, i) => {
            econtainList.push(
                this.add.container(0, (31 * i), [
                    this.add.rectangle(0, 0, 250, 30, 0xeeeeee)
                        .setOrigin(0, 0),
                    this.add.text(5, 5, entity.name, textStyle)
                        .setColor("#000")
                        .setWordWrapWidth(225),
                    this.add.text(220, 2, "✕", textStyle)
                        .setFontSize(22)
                        .setFontStyle("bold")
                        .setColor("#666666")
                        .setInteractive()
                        .on("pointerdown", () => {
                            entities.splice(i, 1)
                            this.renderEntityPanel()
                            this.renderEntities(entities)
                        })
                ])
            )
        })
        this.gameobjects.panel.list.add(econtainList)
    }

    createBlockContainer(): Phaser.GameObjects.Container {
        const container = this.add.container(0, 0)
        // const data: number[][] = [[]]
        // for (let i = 0; i < 20; i++) {
        // data[0].push(-1, i)
        // }
        // const map = this.make.tilemap({
        // data: data,
        // tileWidth: 30,
        // tileHeight: 30,
        // })
        // const tiles = map.addTilesetImage("core_tileset", "core_tileset");
        // const layer = map.createLayer(0, tiles);
        // layer.setPosition(-30, 800)

        const numbers: Phaser.GameObjects.GameObject[] = [];

        container.add(
            this.add.text(0, 0, "BRUh", titleStyle)
        )

        for (let i = 0; i < 21; i++) {
            numbers.push(this.add.text(0, 0, i.toString(), textStyle)
                .setBackgroundColor("#900")
                .setFontSize(36)
                .setInteractive()
                .on("pointerdown", () => {
                    this.selectedBlock = i;
                })
            )
        }

        // container.add(layer);
        container.add(numbers);
        return container;
    }

    renderHover(pointarr: Point[]): void {
        this.gameobjects.hoverContainer.removeAll(true);
        // console.log(pointarr)
        const rects: Phaser.GameObjects.Rectangle[] = [];
        for (const point of pointarr) {
            const coords = this.gameobjects.screen.getRealXYFromCoord(
                Math.floor(point.x) + 0.5,
                Math.floor(point.y) + 0.5
            )
            rects.push(this.add.rectangle(
                coords.x,
                coords.y,
                30, 30, 0x444488, 100
            ))
        }
        this.gameobjects.hoverContainer.add(rects)
    }

    renderEntities(entities: EditorEntity[]): void {
        this.gameobjects.entityContainer.removeAll(true);

        for (const entity of entities) {
            const spritedata = entityData.get(entity.name.toLowerCase())?.size ?? { x: 64, y: 64 };
            const container = this.add.container(entity.x,  entity.y)
            container.add([
                this.add.image(0, 0, entity.name.toLowerCase())
                    .setOrigin(0, 0)
                    .setDisplaySize(spritedata.x, spritedata.y)
                    .setScale(entity.type === "Character" ? 0.20 : 0.45)
                    .setAlpha(0.85)
                    .setInteractive({
                        pixelPerfect: true,
                        draggable: true
                    })
                    .on("drag", (pointer: any, dragX: number, dragY: number) => {
                        if (this.tools.selected.name === "Cursor") {
                            container.x = pointer.downX + dragX - this.gameobjects.screen.x;
                            container.y = pointer.downY + dragY - this.gameobjects.screen.y;
                            entities[entity.ID].x = container.x;
                            entities[entity.ID].y = container.y;
                        }
                    }),
            ])

            this.gameobjects.entityContainer.add(container);
        }
    }

    addListeners(): void {
        eventResize = () => window.addEventListener("resize", () => {
            this.resizeUI();
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.game.scale.resize(Math.floor(this.width), Math.floor(this.height));
            // console.log(width, height)
        })

        eventKeydown = () => window.addEventListener("keydown", (event) => {
            this.key.change(event.code, event.ctrlKey, event.shiftKey, event.altKey)
            const item = this.menubar.itemMap.get(this.key.getName());
            // console.log(item, this.key.getName())
            if (item?.key.getName() === this.key.getName()) {
                item.onclick()
            }
        })
    }
}

export default editorScene;
