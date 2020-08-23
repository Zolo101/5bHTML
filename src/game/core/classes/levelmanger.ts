import {
    Sprite, Character, SpriteInterface, PhaserBlock,
} from "./sprite";
import { levelnameStyle, backStyle } from "../buttons";
import { BlockInterface } from "../block";
import { checkLevel } from "../checkLevel";

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

export type EntityInterface = {
    name: string
    x: number
    y: number

    controllable?: boolean
    roleid?: number
}

export type DialogueInterface = {
    name: string,
    happy: boolean
    text: string
}

export type LevelInterface = {
    name: string
    width: number
    height: number
    background: number
    data: string[]
    entity: EntityInterface[]
    dialogue: DialogueInterface[]
}

export class LevelManager {
    levelnumber = 1
    blocksize = 30
    background!: Phaser.GameObjects.Image

    levels: LevelInterface[]
    blocks: BlockInterface[]
    scene: Phaser.Scene

    characters: Character[] = []
    sprites: Sprite[] = []

    currentcharacter!: Character;

    terrain: Phaser.Physics.Arcade.StaticGroup
    decorateTerrain: Phaser.Physics.Arcade.StaticGroup

    constructor(
        levels: LevelInterface[],
        blocks: BlockInterface[],
        scene: Phaser.Scene,

        terrain: Phaser.Physics.Arcade.StaticGroup,
        decorateTerrain: Phaser.Physics.Arcade.StaticGroup,
    ) {
        this.levels = levels;
        this.blocks = blocks;
        this.scene = scene;

        this.terrain = terrain;
        this.decorateTerrain = decorateTerrain;

        killables = scene.physics.add.staticGroup();
    }

    setLevel(levelnum: number): void {
        // Set levelnumber
        this.levelnumber = levelnum;

        this.sprites.forEach((sp: Sprite) => { sp.destroy(); this.sprites.length = 0; });

        // Parse level
        this.parseLevel(this.levelnumber);
        // Set background
        this.setBackground(level.background);
        // Generate level
        this.generateTerrain();
        // Generate Sprites
        this.startLevel();
        // Generate Dialogue

        // Set levelname
        this.scene.add.text(20, 480, `${this.levelnumber.toString().padStart(3, "0")}. ${level.name}`, levelnameStyle);

        const backButton = this.scene.add.text(
            800, 475, "MENU", backStyle,
        ).setInteractive();

        backButton.on('pointerdown', () => {
            this.scene.scene.start("levelselectScene");
        });
    }

    startLevel(): void {
        // 5b reset shake animation here
        //this.characters.forEach((ch) => {
        //
        //})
        // this is werid, this.sprites.length shouldnt really be called for each
        this.sprites.forEach((sp) => { sp.destroy(true); this.sprites.length = 0; });
        this.generateSprites();

        // lazy way of doing things
        // Sprite collision
        this.characters.forEach((ch) => {
            this.sprites.forEach((sp) => {
                this.scene.physics.add.overlap(ch, sp, () => { // Can x grab the y?
                    if (!ch.grabbing) {
                        sp.grabbable = true;
                    }
                });
            });
        });

        // Finish block collision
        this.sprites.forEach((sp) => {
            finishblocklist.forEach((fbl) => {
                this.scene.physics.add.collider(sp, fbl, () => {
                    if (this.levelnumber < hardlimitlevel) { // temp if statement
                        this.levelnumber+=1;
                        this.setLevel(this.levelnumber);
                    }
                });
            });

            killables.getChildren().forEach((ka) => {
                this.scene.physics.add.collider(sp, ka, () => {
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
                //console.log(this.sprites);
                    char = new Character({
                        scene: this.scene, x: sprite.x, y: sprite.y, key: sprite.name,
                    }, this.terrain).setScale(0.2);
                    this.sprites.push(char);
                //char.setPosition(500, 300);
                // this.characters.push(char)
                this.currentcharacter = char;
            }
            if (sprite.name === "match") console.error("Unsupported character!");
            if (sprite.name === "ice cube") console.error("Unsupported character!");
            //currentcharacter = char;
        });
    }

    generateTerrain(): void {
        // Clear terrain
        this.terrain.clear(true, true);
        this.decorateTerrain.clear(true, true);

        const terrainarray = [];
        for (let i = 0; i < level.height; i++) {
            terrainarray[i] = [...level.data[i]]; // Split
            for (let j = 0; j < level.width; j++) {
                const block = terrainarray[i][j];
                const blocksprop: BlockInterface | undefined = this.blocks.find(
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

        const block = new Phaser.GameObjects.Image(this.scene, x, y, "missing");
        block.setDisplaySize(this.blocksize, this.blocksize);
        block.setPosition(bx, by);

        this.setTexture(block, blockinfo);
    }

    createSpecialBlock(
        blockinfo: BlockInterface,
        x: number, y: number,
        sx: number = this.blocksize, sy: number = this.blocksize,
        ox: number = 0, oy: number = 0,
        ): void {
        const bx = this.blocksize*x+(this.blocksize/2);
        const by = this.blocksize*y+(this.blocksize/2);

        const specialblock = new Phaser.GameObjects.Sprite(this.scene, bx, by, "special_missing");
        specialblock.setY(specialblock.y-(sy/2)+(this.blocksize/2));
        specialblock.setDisplaySize(sx, sy);
        specialblock.setPosition(specialblock.x+ox, specialblock.y+oy);
        //specialblock.setY(specialblock.y-(sy-10));

        this.setTexture(specialblock, blockinfo);
    }

    setBackground(id: number): void {
        try {
            // there is most likely a better / efficent way to do this
            // this.background.destroy()
            this.background = this.scene.add.image(0, 0, `background_${id}`).setOrigin(0, 0);
        } catch (error) {
            console.error(`Background Image, with the ID '${id}', does not exist.`);
        }
    }

    parseLevel(levelnum: number): void {
        // Make sure the level will work
        // asserting as any isn't good pratice...
        const leveljson = this.levels[levelnum-1] as any;
        checkLevel(levelnum);

        level = leveljson;
        //console.log(level);
    }

    // find better name
    setTexture(
        block: PhaserBlock,
        blockinfo: BlockInterface,
        ): void {
        if (blockinfo.collide) {
            this.terrain.add(block, true);
        } else {
            block.setTexture("deco_missing");
            this.decorateTerrain.add(block, true);
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

    UpdatePhysics() {
        // This is more of momentum/easing than physics
        if (this.sprites.length === 0) return;

        this.sprites.forEach((sp) => {
            sp.body.velocity.x /= sp.friction;
        });
    }
}

export default LevelManager;
