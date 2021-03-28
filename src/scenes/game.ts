import { LevelManager } from "../game/core/classes/levelmanager";
import { BlockObject } from "../game/core/data/block_data";
import { LevelData } from "../game/core/levelstructure";
// System Variables (Engine)

export type GameOptions = {
    from: Phaser.Scene,
    levelfile: LevelData,
    levelnumber?: number,
}

let leftKey: Phaser.Input.Keyboard.Key;
let upKey: Phaser.Input.Keyboard.Key;
let downKey: Phaser.Input.Keyboard.Key;
let rightKey: Phaser.Input.Keyboard.Key;
let spaceKey: Phaser.Input.Keyboard.Key;
// let zKey: Phaser.Input.Keyboard.Key;
let rKey: Phaser.Input.Keyboard.Key;

class gameScene extends Phaser.Scene {
    // Core vars, do not touch
    levelnumber = 0
    blocksize = 30
    levelfile!: LevelData
    background!: Phaser.GameObjects.Image

    levelmanager!: LevelManager

    constructor() { super("gameScene"); }

    init(lvl: GameOptions): void {
        this.levelnumber = lvl.levelnumber ?? 1;

        if (lvl.levelfile === undefined) return;
        this.levelfile = lvl.levelfile;
    }

    create(): void {
        leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        // Switch character
        // zKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

        // Reset level
        rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        const terrain = this.physics.add.staticGroup();
        const decorateterrain = this.physics.add.staticGroup();

        if ((this.levelfile) === undefined) console.error("levels and/or blocks seem to have not been specified.");

        this.physics.world.TILE_BIAS = 64;

        this.levelmanager = new LevelManager(
            this.levelfile,
            BlockObject, this,
            terrain, decorateterrain,
        );

        this.levelmanager.setLevel(this.levelnumber);
    }

    update(): void {
        const alive = this.levelmanager.currentcharacter.active;
        const cc = this.levelmanager.currentcharacter;

        if (alive) {
            // TODO: Change once multiple characters become a thing
            if (spaceKey.isDown && (cc.body.blocked.down || cc.body.touching.down)) {
                cc.body.setVelocityY(-710 * cc.speed);
            }

            if (leftKey.isDown) {
                cc.direction = false;
                cc.body.setVelocityX(-250 * cc.speed);
            }

            if (rightKey.isDown) {
                cc.direction = true;
                cc.body.setVelocityX(250 * cc.speed);
            }
            // console.log(cc.body.velocity.y)
        }

        // Flip the character based on direction
        cc.setFlipX(!cc.direction);

        this.levelmanager.characters.children.entries.forEach((ch: any) => {
            ch.grabbable = false;
        });

        // TEMP, this shouldn't be in game.ts!

        // If UP key is pressed, grab overlapped sprite
        if (Phaser.Input.Keyboard.JustDown(upKey)) {
            if (cc.grabbing === undefined) {
                this.levelmanager.sprites.children.entries.forEach((ch: any) => {
                    // This is bad!
                    cc.attemptGrab(ch);
                });
            } else {
                cc.releaseGrab(true);
            }
        }

        // Make character hold sprite while grabbing
        if (cc.grabbing !== undefined && alive) {
            cc.grabbing.body.velocity.set(cc.body.velocity.x, 0);
            if (cc.direction) {
                cc.grabbing.body.position.set(
                    cc.body.position.x + 25,
                    cc.body.position.y - 10,
                );
            } else {
                cc.grabbing.body.position.set(
                    cc.body.position.x - 15,
                    cc.body.position.y - 10,
                );
            }

            if (Phaser.Input.Keyboard.JustDown(downKey)) {
                cc.releaseGrab(false);
            }
        }

        if (Phaser.Input.Keyboard.JustDown(rKey)) { // RESET
            this.levelmanager.scene.cameras.main.flash(400, 255, 255, 255);
            this.levelmanager.startLevel();
        }
    }
}

export default gameScene;
