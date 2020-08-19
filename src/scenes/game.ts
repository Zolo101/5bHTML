import { BlockInterface } from "../game/core/block";

import { levelnameStyle, backStyle } from "../game/core/style";
import { checkLevel } from "../game/core/checkLevel";

const levels = require("../game/core/json/levels.json");
const blocks = require("../game/core/json/blocks.json");
// const entities = require("../game/core/json/entities.json");
// Credit to shoish for the Entity/Sprite JSON File

// System Variables (Engine)

let leftKey: Phaser.Input.Keyboard.Key;
let upKey: Phaser.Input.Keyboard.Key;
let downKey: Phaser.Input.Keyboard.Key;
let rightKey: Phaser.Input.Keyboard.Key;
let spaceKey: Phaser.Input.Keyboard.Key;
let zKey: Phaser.Input.Keyboard.Key;
let rKey: Phaser.Input.Keyboard.Key;

// Game Variables (5bhtml)

//let stupidestvariableintheworld = false; // stupid

let terrain: Phaser.Physics.Arcade.StaticGroup;
let decorateTerrain: Phaser.Physics.Arcade.StaticGroup;
//let eventTerrain: Phaser.Physics.Arcade.StaticGroup;

let currentcharacter: Character;
const charlist: Character[] = []; // Character Sprites List
//const spritelist: Sprite[] = []; // Uncontrollable Sprites List
const aslist: Sprite[] = []; // All Sprites List

// rushed constants pls fix
const finishblocklist: PhaserBlock[] = [];
let killables: Phaser.Physics.Arcade.StaticGroup;

// stop player from going past certain level
const hardlimitlevel = 4;

let level = { // Structure of a level in 5bhtml.
    name: "Undefined Level",
    width: 30,
    height: 18,
    background: 0,
    data: [
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
        "................................",
    ],
    entity: [],
    dialogue: [],
};

type LevelInterface = {
    name: string
    width: number
    height: number
    background: number
    level: string[]
    entity: string[]
    dialogue: string[]
}

type SpriteInterface = {
    name: string
    x: number
    y: number
}

type PhaserBlock = Phaser.GameObjects.Sprite | Phaser.GameObjects.Image

class Sprite extends Phaser.GameObjects.Sprite {
    body!: Phaser.Physics.Arcade.Body;
    name: string;
    grabbable = false;
    grabbed = false;
    mass = 2;
    friction = 1.15;
    // TODO: Fix the "any"
    // I have no idea how to fix the "any" warning so i'll just ignore it xD
    //
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(config: any) {
        super(config.scene, config.x, config.y, config.key);
        this.scene = config.scene;
        this.name = config.key;
        config.scene.physics.world.enable(this);
        config.scene.add.existing(this);
        config.scene.physics.add.collider(this, terrain);

        this.body.setCollideWorldBounds(true);

        aslist.push(this);
    }
}

class Character extends Sprite {
    direction = true; // Direction of character, true = right, false = left
    grabbing = false; // Is the character grabbing something
    grabbable = true; // Is the character grabbable
}

function UpdatePhysics() {
    // This is more of momentum/easing than physics
    if (aslist.length === 0) return;

    aslist.forEach((sp) => {
        sp.body.velocity.x /= sp.friction;
    });
}

function checkGrab(sp: Sprite) {
    // If UP key is pressed, grab overlapped sprite
    if (!currentcharacter.grabbing && sp.grabbable && Phaser.Input.Keyboard.JustDown(upKey)) {
        currentcharacter.grabbing = true;
        sp.grabbed = true;
    }

    // Make character hold sprite while grabbing
    if (currentcharacter.grabbing && sp.grabbed) {
        if (currentcharacter.direction) {
            sp.body.position = new Phaser.Math.Vector2(
                currentcharacter.body.position.x+30,
                currentcharacter.body.position.y+5,
            );
        } else {
            sp.body.position = new Phaser.Math.Vector2(
                currentcharacter.body.position.x-10,
                currentcharacter.body.position.y+5,
            );
        }
    }

    // If grabbing and DOWN key pressed, Drop sprite
    if (currentcharacter.grabbing && sp.grabbed && Phaser.Input.Keyboard.JustDown(downKey)) {
        currentcharacter.grabbing = false;
        sp.grabbed = false;
    }

    // If grabbing and UP key pressed, Throw sprite
    if (currentcharacter.grabbing && sp.grabbed && Phaser.Input.Keyboard.JustDown(upKey)) {
        currentcharacter.grabbing = false;
        sp.grabbed = false;

        if (currentcharacter.direction) {
            sp.body.velocity = new Phaser.Math.Vector2(500, -600);
        } else {
            sp.body.velocity = new Phaser.Math.Vector2(-500, -600);
        }
    }
}

class gameScene extends Phaser.Scene {
    // Core vars, do not touch
    levelnumber = 1
    blocksize = 30
    background!: Phaser.GameObjects.Image

    //spritegroup?: Phaser.GameObjects.Group

    constructor() { super("gameScene"); }

    init(lvl: any): void {
        if (lvl.levelnumber === undefined) return;
        this.levelnumber = lvl.levelnumber;
    }

    preload(): void {
        this.load.setBaseURL("./assets/core");
    }

    create(): void {
        // ver0 only
        this.physics.world.setBounds(0, 0, 960, 540, true, true, true, false);
        //cursors = this.input.keyboard.createCursorKeys();
        leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Switch character
        zKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

        // Reset level
        rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        // What the terrain blocks will go into
        terrain = this.physics.add.staticGroup(); // Collidable
        //eventTerrain = this.physics.add.staticGroup(); // Events
        decorateTerrain = this.physics.add.staticGroup(); // Non-collidable deco

        killables = this.physics.add.staticGroup();

        // Spritegroup
        //this.spritegroup = this.add.group({
        //    maxSize: 100, // We should never really reach this limit
        //})

        this.setLevel(this.levelnumber);
    }

    update(): void {
        //console.log(aslist.map(sp => sp.grabbable));
        UpdatePhysics();

        if (spaceKey.isDown && currentcharacter.body.touching.down) {
            currentcharacter.body.setVelocityY(-700);
        }

        if (leftKey.isDown) {
            currentcharacter.direction = false;
            currentcharacter.body.setVelocityX(-250);
        }

        if (rightKey.isDown) {
            currentcharacter.direction = true;
            currentcharacter.body.setVelocityX(250);
        }

        if (Phaser.Input.Keyboard.JustDown(rKey)) {
            this.startLevel();
        }

        aslist.forEach((sp) => {
            checkGrab(sp);
            sp.grabbable = false;
        });
    }

    // 5bHTML Game Functions
    //
    //

    setLevel(levelnum: number): void {
        // Set levelnumber
        this.levelnumber = levelnum;

        aslist.forEach((sp) => { sp.destroy(); aslist.length = 0; });

        // Parse level
        gameScene.parseLevel(this.levelnumber);
        // Set background
        this.setBackground(level.background);
        // Generate level
        this.generateTerrain();
        // Generate Sprites
        this.startLevel();
        // Generate Dialogue

        // Set levelname
        this.add.text(20, 480, `${this.levelnumber.toString().padStart(3, "0")}. ${level.name}`, levelnameStyle);

        const backButton = this.add.text(
            800, 475, "MENU", backStyle,
        ).setInteractive();

        backButton.on('pointerdown', () => {
            this.scene.start("levelselectScene");
        });
    }

    startLevel(): void {
        // 5b reset shake animation here
        //charlist.forEach((ch) => {
        //
        //})
        // this is werid, aslist.length shouldnt really be called for each
        aslist.forEach((sp) => { sp.destroy(true); aslist.length = 0; });
        this.generateSprites();

        // lazy way of doing things
        // Sprite collision
        charlist.forEach((ch) => {
            aslist.forEach((sp) => {
                this.physics.add.overlap(ch, sp, () => { // Can x grab the y?
                    if (!ch.grabbing) {
                        sp.grabbable = true;
                    }
                });
            });
        });

        // Finish block collision
        aslist.forEach((sp) => {
            finishblocklist.forEach((fbl) => {
                this.physics.add.collider(sp, fbl, () => {
                    if (hardlimitlevel > this.levelnumber) {
                        this.levelnumber+=1;
                        this.setLevel(this.levelnumber);
                    }
                });
            });

            killables.getChildren().forEach((ka) => {
                this.physics.add.collider(sp, ka, () => {
                    //console.info("deez");
                    sp.setDisplaySize(0, 0);
                    sp.setPosition(1000, -100);
                    //sp.setAlpha(1);
                    //sp.disableInteractive();
                });
            });
        });
    }

    generateSprites(): void {
        level.entity.forEach((sprite: { name: string; x: number; y: number; }) => {
            let char: Character;
            // switch case?
            if (sprite.name === "book") {
                //console.log(aslist);
                    char = new Character({
                        scene: this, x: sprite.x, y: sprite.y, key: sprite.name,
                    }).setScale(0.2);
                //char.setPosition(500, 300);
                // charlist.push(char)
                currentcharacter = char;
            }
            if (sprite.name === "match") console.error("Unsupported character!");
            if (sprite.name === "ice cube") console.error("Unsupported character!");
            //currentcharacter = char;
        });
    }

    generateTerrain(): void {
        // Clear terrain
        terrain.clear(true, true);
        decorateTerrain.clear(true, true);

        const terrainarray = [];
        for (let i = 0; i < level.height; i++) {
            terrainarray[i] = [...level.data[i]]; // Split
            for (let j = 0; j < level.width; j++) {
                const block = terrainarray[i][j];
                const blocksprop: BlockInterface = blocks.find(
                    ((element: BlockInterface) => element.name === block),
                );

                if (blocksprop !== undefined) {
                    // This works but we should fix this to be better later
                    if (blocksprop.size) {
                        this.createSpecialBlock(
                            blocksprop, j, i,
                            blocksprop.size.x, blocksprop.size.y,
                            blocksprop.offset?.x, blocksprop.offset?.y,
                        );
                    } else {
                        this.createBlock(blocksprop, j, i);
                    }
                }
            }
        }
    }

    createBlock(blockinfo: BlockInterface, x: number, y: number): void {
        const bx = this.blocksize*x+(this.blocksize/2);
        const by = this.blocksize*y+(this.blocksize/2);

        const block = new Phaser.GameObjects.Image(this, x, y, "missing");
        block.setDisplaySize(this.blocksize, this.blocksize);
        block.setPosition(bx, by);

        gameScene.setTexture(block, blockinfo);
    }

    createSpecialBlock(
        blockinfo: BlockInterface,
        x: number, y: number,
        sx: number = this.blocksize, sy: number = this.blocksize,
        ox: number = 0, oy: number = 0,
        ): void {
        const bx = this.blocksize*x+(this.blocksize/2);
        const by = this.blocksize*y+(this.blocksize/2);

        const specialblock = new Phaser.GameObjects.Sprite(this, bx, by, "special_missing");
        specialblock.setY(specialblock.y-(sy/2)+(this.blocksize/2));
        specialblock.setDisplaySize(sx, sy);
        specialblock.setPosition(specialblock.x+ox, specialblock.y+oy);
        //specialblock.setY(specialblock.y-(sy-10));

        gameScene.setTexture(specialblock, blockinfo);
    }

    setBackground(id: number): void {
        try {
            // there is most likely a better / efficent way to do this
            // this.background.destroy()
            this.background = this.add.image(0, 0, `background_${id}`).setOrigin(0, 0);
        } catch (error) {
            console.error(`Background Image, with the ID '${id}', does not exist.`);
        }
    }

    static parseLevel(levelnum: number): void {
        // Make sure the level will work
        const leveljson = levels[levelnum-1];
        checkLevel(levelnum);

        level = leveljson;
        //console.log(level);
    }

    // find better name
    static setTexture(
        block: PhaserBlock,
        blockinfo: BlockInterface,
        ): void {
        if (blockinfo.collide) {
            terrain.add(block, true);
        } else {
            block.setTexture("deco_missing");
            decorateTerrain.add(block, true);
        }

        if (blockinfo.special) {
            block.setTexture("special_missing");
        }

        if (blockinfo.name === "4") {
            block.setTexture("finish_missing");
            finishblocklist.push(block);
        }

        if (blockinfo.animate) {
            block.setTexture("animate_missing");
        }

        if (blockinfo.kill) {
            block.setTexture("kill_missing");
            killables.add(block, true);
        }
    }
}

export default gameScene;
