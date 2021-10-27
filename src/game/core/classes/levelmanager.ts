import { Sprite, Character, makeSpriteFromString, makeCharacterFromString, SpriteType } from "./sprite";
import { levelnameStyle, backStyle } from "../buttons";
import { createSpecialBlock } from "./block";
import { checkLevel } from "../checkLevel";
import { LevelData } from "../levelstructure";
import { entityData } from "../jsonmodule";
import Settings from "../../settingsgame";
import gameSceneType from "../gamestructure";
import { BlockObject, BlockObjectType, BlockProps } from "../data/block_data";
import { s_getCacheSave, s_getLocalStorage } from "../misc/dataidb";
import calculateOutline from "../calculateoutline";
import { create2DNumberArray } from "../misc/other";
let level: LevelData

export class LevelManager {
    levelnumber = 1
    blocksize = 30
    background!: Phaser.GameObjects.Image

    levels: LevelData

    // stop player from going past certain level
    hardlimitlevel: number;
    finishedLevelpack: boolean;

    // shouldnt need to repeat this
    blocks: BlockObjectType
    scene: Phaser.Scene
    extraData: Record<string, unknown> | undefined

    tilelayers!: {
        static: Phaser.Tilemaps.TilemapLayer
        killable: Phaser.Tilemaps.TilemapLayer
        outline: Phaser.Tilemaps.TilemapLayer
    }
    specialblocks!: Phaser.GameObjects.Group
    // collisons!:
    camera!: Phaser.Cameras.Scene2D.Camera

    characters!: Phaser.GameObjects.Group
    sprites!: Phaser.GameObjects.Group

    currentcharacter!: Character;

    terrain: Phaser.Physics.Arcade.StaticGroup
    decorateTerrain: Phaser.Physics.Arcade.StaticGroup

    levelTextButton!: Phaser.GameObjects.Text

    backScene!: string

    constructor(
        levels: LevelData,
        blocks: BlockObjectType,
        scene: Phaser.Scene,

        terrain: Phaser.Physics.Arcade.StaticGroup,
        decorateTerrain: Phaser.Physics.Arcade.StaticGroup,
        backScene: string,
        extraData?: Record<string, unknown>
    ) {
        this.levels = levels;

        this.hardlimitlevel = this.levels.levels.length;
        this.finishedLevelpack = false;

        this.blocks = blocks;
        this.scene = scene;

        this.characters = this.scene.add.group();
        this.sprites = this.scene.add.group();
        this.specialblocks = this.scene.add.group();

        this.terrain = terrain;
        this.decorateTerrain = decorateTerrain;

        this.backScene = backScene;

        this.levelTextButton = this.scene.add.text(
            15, 492, "", levelnameStyle,
        ).setScrollFactor(0, 0).setDepth(1)

        this.extraData = extraData;
    }

    setLevel(levelnum: number): void {
        // Set levelnumber
        this.levelnumber = levelnum - 1;
        // inefficient
        this.sprites.clear(true, true);

        // console.log(this.levels.levels[this.levelnumber]);
        // Parse level
        this.parseLevel();

        if (Settings.IS_DEBUG) console.log(level);

        const levelWidth = level.levels[this.levelnumber].width;
        const levelHeight = level.levels[this.levelnumber].height;

        // Set background
        this.setBackground(
            this.levels.levels[this.levelnumber].background, // ratio 16:9
            this.blocksize * (32 + (levelWidth / 32)), // 16
            this.blocksize * (18 + (levelHeight / 18)), // 9
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

        //this.scene.physics.collideTiles(this.sprites, undefined, undefined, () => {
        //})

        this.scene.physics.add.collider(this.specialblocks, this.tilelayers.static);

        // Init Sprite callbacks
        this.initSprites();

        // Generate Sprites and start level
        this.startLevelSetup(true);

        // Generate Dialogue

        // Set levelname
        this.levelTextButton.setText(
            `${(this.levelnumber + 1).toString().padStart(3, "0")}. ${level.levels[this.levelnumber].name}`
        );

        const backButton = this.scene.add.text(800, 475, "MENU", backStyle)
            .setBackgroundColor("#aaaaaa")
            .setInteractive()
            .setAlpha(0.6)
            .setScrollFactor(0)
            .setDepth(1);

        backButton.on("pointerdown", () => {
            if (this.backScene === "editorScene") {
                // console.log("levelmanager<<", this.levels)
                s_getLocalStorage();
                // console.log("levelmanager2", s_getCacheSave(this.levels.name))
                this.scene.scene.start(this.backScene, {
                    level: s_getCacheSave(this.levels.name),
                    currentLevelNumber: this.extraData!.currentLevelNumber
                });
            } else {
                this.scene.scene.start(this.backScene, this.levels);
            }
        });
    }

    startLevelSetup(firstTime = false): void {
        const shakeAmount = 16;
        const time = 500;
        if (firstTime) {
            this.scene.cameras.main.flash(400, 255, 255, 255);
            this.startLevel(shakeAmount, time)
        } else {
            this.scene.tweens.addCounter({
                from: 0,
                to: shakeAmount,
                duration: time,
                ease: "Quad.easeIn",
                onUpdate: (tween) => {
                    this.scene.cameras.main.setPosition(Phaser.Math.Between(-tween.getValue(), tween.getValue()), Phaser.Math.Between(-tween.getValue(), tween.getValue()))
                },
                onComplete: () => {
                    this.scene.cameras.main.flash(600);
                    this.startLevel(shakeAmount, time)
                }

            })
        }
    }

    startLevel(shakeAmount: number, time: number): void {
        this.wipeSprites();
        this.generateSprites(this.levelnumber);
        this.currentcharacter = this.characters.getChildren()[0] as Character;

        // Follow current character with interpolation
        this.scene.cameras.main.startFollow(this.currentcharacter, true, 0.08, 0.06);

        this.scene.tweens.addCounter({
            from: shakeAmount,
            to: 0,
            duration: time,
            ease: "Quad.easeIn",
            onUpdate: (tween) => {
                this.scene.cameras.main.setPosition(Phaser.Math.Between(-tween.getValue(), tween.getValue()), Phaser.Math.Between(-tween.getValue(), tween.getValue()))
            }
        })
    }

    initSprites(): void {
        // Character with Sprite collision
        this.scene.physics.add.collider(this.characters, this.sprites, undefined, (sp1) => {
            // console.log(sp1.body.velocity.y)
            return (sp1.body.velocity.y > 42)
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

    generateSprites(levelnum: number): void {
        for (const sprite of level.levels[levelnum].entities) {
            const spriteProperties = entityData.get(sprite.name.toLowerCase());
            if (!spriteProperties) return console.error("Couldn't find sprite!")
            let newChar: Character

            switch (sprite.type) {
                case "Character":
                    newChar = makeCharacterFromString(this.scene, sprite, spriteProperties);
                    newChar.addTilemap(this.tilelayers.static, this.tilelayers.killable)
                    newChar.type = "Character";
                    this.characters.add(newChar);
                    break;

                case "Entity":
                    if (sprite.name === "Finish") {
                        const blockObject = this.blocks.map.get(2)!
                        const specialblock = createSpecialBlock(
                            this.scene as gameSceneType,
                            blockObject, sprite, blockObject.onCollide, this.characters,
                        );
                        this.specialblocks.add(specialblock);
                    } else {
                        const newSprite = makeSpriteFromString(this.scene, sprite, spriteProperties);
                        newSprite.addTilemap(this.tilelayers.static, this.tilelayers.killable)
                        this.sprites.add(newSprite);
                    }
                    break;

                default:
                    console.error("Unknown or unsupported sprite!");
                    break;
            }
        }
    }

    generateTerrain(levelnum: number): void {
        const currentLevel = level.levels[levelnum];
        const levelData = currentLevel.data;

        const staticLevelData = create2DNumberArray(levelData[0].length, levelData.length)
        const killableLevelData = create2DNumberArray(levelData[0].length, levelData.length)
        for (let i = 0; i < levelData[0].length; i++) {
            for (let j = 0; j < levelData.length; j++) {
                if (levelData[j][i] !== -2) {
                    const block = this.blocks.map.get(levelData[j][i])!
                    // console.log(levelData[j][i])
                    if (block.has(BlockProps.Kills)) {
                        killableLevelData[j][i] = block.tile;
                    } else {
                        staticLevelData[j][i] = block.tile;
                    }
                }
            }
        }


        console.log(this.blocks)
        console.log(levelData)

        // Make tilemap
        const staticTilemap = this.scene.make.tilemap({
            data: staticLevelData,
            tileWidth: this.blocksize,
            tileHeight: this.blocksize,
        });
        const killableTilemap = this.scene.make.tilemap({
            data: killableLevelData,
            tileWidth: this.blocksize,
            tileHeight: this.blocksize,
        });

        const tileset = staticTilemap.addTilesetImage("core_tileset", "core_tileset");
        const outlineTileset = staticTilemap.addTilesetImage("outline_tileset", "outline_tileset");
        // console.log(calculateOutline(levelData))
        const outlineTilemap = this.scene.make.tilemap({
            data: calculateOutline(levelData),
            tileWidth: this.blocksize,
            tileHeight: this.blocksize,
        });
        //tilemap.forEachTile((tile) => {
        //    const prop = BlockObject.map.get(tile.index);
        //})

        this.tilelayers = {
            static: staticTilemap.createLayer(0, tileset),
            killable: killableTilemap.createLayer(0, tileset),
            outline: outlineTilemap.createLayer(0, outlineTileset)
        }

        this.tilelayers.static.setCollision(this.blocks.collisionIndexes);

        this.tilelayers.killable.setCollision(this.blocks.collisionIndexes);

        this.tilelayers.killable.tilemap.forEachTile((tile) => {
            const block = BlockObject.map.get(tile.index)
            if (block === undefined) return;

            tile.setCollisionCallback((sp: Character) => { // should be sp: Sprite | Character but causes errors
                // the new spike collision system
                // looks a bit hacky but gets the job done
                if (sp.type === "Character") {
                    if (block.side.left && sp.body.velocity.x < 0) sp.die()
                    if (block.side.right && sp.body.velocity.x > 0) sp.die()
                    if (block.side.up && sp.body.velocity.y < 0) sp.die()
                    if (block.side.down && sp.body.velocity.y > 0) sp.die()
                }
            }, this)

        })

        // console.log(currentLevelData);
        // console.log(tilemapData);

        this.scene.cameras.main.setBounds(0, 0, staticTilemap.widthInPixels, staticTilemap.heightInPixels);
        // this.scene.cameras.main.setRoundPixels(false);
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
        this.specialblocks.clear(true, true);
        this.characters.clear(true, true);
    }
}

export default LevelManager;
