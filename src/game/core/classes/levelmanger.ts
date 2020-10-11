import {
    Sprite, Character, makeSpriteFromString, makeCharacterFromString, SpriteType,
} from "./sprite";
import { levelnameStyle, backStyle } from "../buttons";
import { Block, createSpecialBlock } from "../block";
import { checkLevel } from "../checkLevel";
import { Entity, LevelData } from "../levelstructure";
import { entities } from "../jsonmodule";

// stop player from going past certain level
const hardlimitlevel = 6;

let level = { // Structure of a level in 5bhtml.
    name: "Undefined Levelpack",
    author: "John Doe",
    description: "Description",
    version: 4,
    levelversion: "1.0",
    levels: [
        {
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
        },
    ],
} as LevelData;

export class LevelManager {
    levelnumber = 1
    blocksize = 30
    background!: Phaser.GameObjects.Image

    levels: LevelData
    blocks: Block[]
    scene: Phaser.Scene

    tilelayer!: Phaser.Tilemaps.StaticTilemapLayer
    specialblocks!: Phaser.GameObjects.Group
    // collisons!:
    camera!: Phaser.Cameras.Scene2D.Camera

    characters!: Phaser.GameObjects.Group
    sprites!: Phaser.GameObjects.Group

    currentcharacter!: Character;

    terrain: Phaser.Physics.Arcade.StaticGroup
    decorateTerrain: Phaser.Physics.Arcade.StaticGroup

    constructor(
        levels: LevelData,
        blocks: Block[],
        scene: Phaser.Scene,

        terrain: Phaser.Physics.Arcade.StaticGroup,
        decorateTerrain: Phaser.Physics.Arcade.StaticGroup,
    ) {
        this.levels = levels;
        this.blocks = blocks;
        this.scene = scene;

        this.characters = this.scene.add.group();
        this.sprites = this.scene.add.group();
        this.specialblocks = this.scene.add.group();

        this.terrain = terrain;
        this.decorateTerrain = decorateTerrain;
    }

    setLevel(levelnum: number): void {
        // Set levelnumber
        this.levelnumber = levelnum - 1;
        // inefficient
        this.sprites.clear(true, true);

        // console.log(this.levels.levels[this.levelnumber]);
        // Parse level
        this.parseLevel();

        // console.log(level);

        // console.log(level.levels[this.levelnumber].data[0].length);
        // console.log(level.levels[this.levelnumber].data.length);
        const levelWidth = level.levels[this.levelnumber].data[0].length;
        const levelHeight = level.levels[this.levelnumber].data.length;

        // Set background
        this.setBackground(
            this.levels.levels[this.levelnumber].background,
            this.blocksize * levelWidth,
            this.blocksize * levelHeight,
        );

        // Set World bounds
        this.scene.physics.world.setBounds(
            0, 0,
            this.blocksize * levelWidth, this.blocksize * levelHeight,
            true, true, true, false,
        );

        this.specialblocks.clear();

        // Generate level
        this.generateTerrain(this.levelnumber);

        this.scene.physics.add.collider(this.specialblocks, this.tilelayer);

        // Generate Sprites and start level
        this.startLevel();

        // Generate Dialogue

        // Set levelname
        this.scene.add.text(
            20, 480,
            `${(this.levelnumber + 1).toString().padStart(3, "0")}. ${level.levels[this.levelnumber].name}`,
            levelnameStyle,
        ).setScrollFactor(0, 0).setDepth(1);

        const backButton = this.scene.add.text(
            800, 475, "MENU", backStyle,
        ).setInteractive().setAlpha(0.75).setScrollFactor(0, 0);

        backButton.on("pointerdown", () => {
            this.scene.scene.start("levelselectScene");
        });
    }

    startLevel(): void {
        // 5b reset shake animation here

        this.wipeSprites();
        this.generateSprites(this.levelnumber);

        // Set Camera
        this.scene.cameras.main.startFollow(this.currentcharacter);
    }

    generateSprites(levelnum: number): void {
        level.levels[levelnum].entity.forEach((sprite: Entity) => {
            let spr: Sprite;
            const spriteProperties = entities.find((spt: SpriteType) => spt.name === sprite.name)
            if (!spriteProperties) return console.error("Couldn't find sprite!")

            switch (spriteProperties.type) {
            case "character":
                spr = makeCharacterFromString(this.scene, sprite, spriteProperties, this.tilelayer);
                spr.type = "Character";
                this.characters.add(spr as Character);
                this.currentcharacter = spr as Character;
                break;

            case "sprite":
                spr = makeSpriteFromString(this.scene, sprite, spriteProperties, this.tilelayer);
                this.sprites.add(spr);
                break;

            default:
                console.error("Unknown or unsupported sprite!");
                break;
            }
        });

        // ahh repeated code :(
        this.scene.physics.add.collider(this.characters, this.sprites, (sp1, sp2) => {
            // const b1 = sp1.body as Phaser.Physics.Arcade.Body;
            // const b2 = sp2.body as Phaser.Physics.Arcade.Body;

            // if (b1.y > b2.y) {
            // b2.y += (b1.top - b2.bottom);
            // b2.stop();
            // } else {
            // b1.y += (b2.top - b1.bottom);
            // b1.stop();
            // }
        });

        // Collide with self
        this.scene.physics.add.collider(this.sprites, this.sprites, (sp1, sp2) => {
            const b1 = sp1.body as Phaser.Physics.Arcade.Body;
            const b2 = sp2.body as Phaser.Physics.Arcade.Body;

            if (b1.y > b2.y) {
                b2.y += (b1.top - b2.bottom);
                b2.stop();
            } else {
                b1.y += (b2.top - b1.bottom);
                b1.stop();
            }
        });
    }

    generateTerrain(levelnum: number): void {
        const currentLevel = level.levels[levelnum];
        const currentLevelData: string[][] = [];
        currentLevel.data.forEach((row: string) => {
            currentLevelData.push([...row]);
        });

        const collisionIndexes: number[] = [];
        const killIndexes: number[] = [];

        const tilemapData: any[][] = JSON.parse(JSON.stringify(currentLevelData));
        // console.log(tilemapData);
        tilemapData.forEach((row: string[], i: number) => {
            row.forEach((block: string, j) => {
                if (block !== ".") {
                    const blockObject = this.blocks.find((foundblock) => foundblock.name === block);
                    const tileNumber = blockObject?.tile;

                    // do some work on this
                    if (blockObject?.special === true) {
                        const specialblock = createSpecialBlock(
                            this.scene,
                            blockObject, j, i,
                            blockObject.size.x, blockObject.size.y,
                            blockObject.offset.x, blockObject.offset.y,
                            () => {
                                if ((this.levelnumber + 1 < hardlimitlevel)
                                    && this.currentcharacter.active
                                ) {
                                    this.levelnumber += 1;
                                    this.setLevel(this.levelnumber + 1);
                                }
                            }, this.characters,
                        );
                        this.specialblocks.add(specialblock);
                    } else if (blockObject?.special === false && tileNumber !== undefined) {
                        tilemapData[i][j] = tileNumber;
                        switch (true) {
                        case blockObject?.collide:
                            collisionIndexes.push(tileNumber);
                            break;

                        case blockObject?.kill:
                            killIndexes.push(tileNumber);
                            break;

                        case blockObject?.visible:
                            // tilemapData[i][j]
                            break;

                        default:
                            break;
                        }
                    } else {
                        tilemapData[i][j] = 0;
                    }
                }
            });
        });

        const tilemap = this.scene.make.tilemap({
            data: tilemapData,
            tileWidth: this.blocksize,
            tileHeight: this.blocksize,
        });

        const tileset = tilemap.addTilesetImage(
            "core_tileset",
            "core_tileset",
            this.blocksize, this.blocksize,
        );

        this.tilelayer = tilemap.createStaticLayer(0, tileset, 0, 0);
        this.tilelayer.setCollision(collisionIndexes);

        // i'll put this somewhere else one day
        this.tilelayer.setTileIndexCallback(killIndexes, (sp: Sprite) => {
            if (sp.type === "Sprite") {
                sp.body.setVelocityY(-100);
                return;
            }

            sp.active = false;
            sp.destroy();
        }, this);

        // console.log(currentLevelData);
        // console.log(tilemapData);

        this.scene.cameras.main.setBounds(0, 0, tilemap.widthInPixels, tilemap.heightInPixels);
        this.scene.cameras.main.setRoundPixels(false);
        // const tilesetParse = currentLevel.data.map((row) => {row.})
    }

    setBackground(id: number, width: number, height: number): void {
        try {
            // there is most likely a better / efficent way to do this
            // this.background.destroy()
            this.background = this.scene.add.image(0, 0, `background_${id}`)
                .setOrigin(0, 0)
                .setDisplaySize(Math.max(height, width), height);
        } catch (error) {
            console.error(`Background Image, with the ID '${id}', does not exist.`);
        }
    }

    parseLevel(/* levelnum: number */): void {
        // Make sure the level will work
        const leveljson = this.levels;
        checkLevel(/* levelnum */);

        level = leveljson;
        // console.log(level);
    }

    wipeSprites(): void {
        this.sprites.clear(true, true);
        this.characters.clear(true, true);
    }

    // find better name
    /*
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
    } */
}

export default LevelManager;
