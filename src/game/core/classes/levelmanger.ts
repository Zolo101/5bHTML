import {
    Sprite, Character, makeSpriteFromString, makeCharacterFromString, SpriteType,
} from "./sprite";
import { levelnameStyle, backStyle } from "../buttons";
import { Block, createSpecialBlock } from "./block";
import { checkLevel } from "../checkLevel";
import { Entity, LevelData } from "../levelstructure";
import { entities } from "../jsonmodule";
import Settings from "../../settings";
import gameSceneType from "../gamestructure";
let level: LevelData

export class LevelManager {
    levelnumber = 1
    blocksize = 30
    background!: Phaser.GameObjects.Image

    levels: LevelData

    // lazy lol
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    blocks: any
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

    levelTextButton!: Phaser.GameObjects.Text

    // stop player from going past certain level
    hardlimitlevel = 10;

    constructor(
        levels: LevelData,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        blocks: any,
        scene: Phaser.Scene,

        terrain: Phaser.Physics.Arcade.StaticGroup,
        decorateTerrain: Phaser.Physics.Arcade.StaticGroup,
    ) {
        this.levels = levels;

        this.hardlimitlevel = this.levels.levels.length;

        this.blocks = blocks; // i dont like this
        this.scene = scene;

        this.characters = this.scene.add.group();
        this.sprites = this.scene.add.group();
        this.specialblocks = this.scene.add.group();

        this.terrain = terrain;
        this.decorateTerrain = decorateTerrain;

        this.levelTextButton = this.scene.add.text(
            20, 480, "", levelnameStyle,
        ).setScrollFactor(0, 0).setDepth(1)
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

        const levelWidth = level.levels[this.levelnumber][0].width;
        const levelHeight = level.levels[this.levelnumber][0].height;

        // Set background
        this.setBackground(
            this.levels.levels[this.levelnumber][0].background,
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
        this.levelTextButton.setText(
            `${(this.levelnumber + 1).toString().padStart(3, "0")}. ${level.levels[this.levelnumber][0].name}`
        );

        const backButton = this.scene.add.text(
            800, 475, "MENU", backStyle,
        ).setInteractive().setAlpha(0.75).setScrollFactor(0, 0);

        backButton.on("pointerdown", () => {
            this.scene.scene.start("levelselectScene");
        });
    }

    startLevel(): void {
        // 5b reset shake animation here
        this.scene.cameras.main.shake(400, 0.005);

        this.wipeSprites();
        this.generateSprites(this.levelnumber);

        // Set Camera
        this.scene.cameras.main.startFollow(this.currentcharacter);
    }

    generateSprites(levelnum: number): void {
        level.levels[levelnum][1].objects.forEach((sprite: Entity) => {
            if (sprite.name === "Finish") {
                const blockObject = this.blocks.map.get(2)
                const specialblock = createSpecialBlock(
                    this.scene as gameSceneType,
                    blockObject, sprite.x, sprite.y,
                    blockObject.size.x, blockObject.size.y,
                    blockObject.offset.x, blockObject.offset.y, blockObject.onCollide, this.characters,
                );
                this.specialblocks.add(specialblock);
                console.log(this.specialblocks)
            } else {

                let spr: Sprite;

                // Maybe use maps instead?
                const spriteProperties = entities.find((spt: SpriteType) => spt.name === sprite.name.toLowerCase())
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
                    // console.log(spr.mass)
                    break;

                default:
                    console.error("Unknown or unsupported sprite!");
                    break;
                }
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
        const currentLevel = level.levels[levelnum][0];
        const levelData = currentLevel.data;
        const levelDataprep: number[][] = [];

        console.log(this.blocks)

        // Clone array, dont reference it
        const levelDataMapBuffer = [...levelData];
        levelDataMapBuffer.forEach((n: number, i) => levelDataMapBuffer[i] -= 1);

        for (let i = 0; i < currentLevel.height; i++) {
            levelDataprep[i] = levelDataMapBuffer.slice(currentLevel.width * i, currentLevel.width * (i + 1))
        }

        /*
        levelDataprep.forEach((row, i) => {
            row.forEach((num, j) => {
                // if (num === )
            })
        })*/

        // Make tilemap
        const tilemap = this.scene.make.tilemap({
            data: levelDataprep,
            tileWidth: this.blocksize,
            tileHeight: this.blocksize,
        });
        console.log(levelDataprep);

        const tileset = tilemap.addTilesetImage(
            "core_tileset",
            "core_tileset",
        );

        this.tilelayer = tilemap.createStaticLayer(0, tileset, 0, 0);
        this.tilelayer.setCollision(this.blocks.collisionIndexes);

        // i'll put this somewhere else one day
        this.tilelayer.setTileIndexCallback(this.blocks.killIndexes, (sp: Sprite | Character) => {
            if (sp.type === "Sprite") {
                sp.body.setVelocityY(-100);
                return;
            }

            const chr = sp as Character
            chr.die();
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
        this.specialblocks.clear(true, true);
        this.characters.clear(true, true);
    }

    /**
     * @deprecated Don't use this
     */
    selectTileNumber(blockObject: Block, i: number, j: number): number | string {
        let numberToSelect: number | string = 4;
        const tileNumber = blockObject.tile;
        if (blockObject.special) {
            const specialblock = createSpecialBlock(
                    this.scene as gameSceneType,
                    blockObject, j, i,
                    blockObject.size.x, blockObject.size.y,
                    blockObject.offset.x, blockObject.offset.y, blockObject.onCollide, this.characters,
            );
            this.specialblocks.add(specialblock);
            numberToSelect = ".";
        } else if (tileNumber !== undefined) {
            numberToSelect = tileNumber;
        } else {
            // unknown/unset tile
            numberToSelect = 4;
        }

        return numberToSelect;
    }
}

export default LevelManager;
