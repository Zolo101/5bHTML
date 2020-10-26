import { LevelManager } from "../game/core/classes/levelmanger";

import { block } from "../game/core/jsonmodule";
import { LevelData } from "../game/core/levelstructure";

// System Variables (Engine)

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
    // block!: BlockInterface[]
    background!: Phaser.GameObjects.Image

    levelmanager!: LevelManager

    constructor() { super("gameScene"); }

    init(lvl: { levelnumber: number, levelfile: LevelData }): void {
        if (lvl.levelnumber === undefined) return;
        this.levelnumber = lvl.levelnumber;

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
            block, this,
            terrain, decorateterrain,
        );

        this.levelmanager.setLevel(this.levelnumber);
    }

    update(): void {
        // console.log(aslist.map(sp => sp.grabbable));
        const alive = this.levelmanager.currentcharacter.active;
        const cc = this.levelmanager.currentcharacter;
        // this.levelmanager.UpdatePhysics();

        if (alive) {
            // TODO: Change once multiple characters become a thing
            if (spaceKey.isDown && (cc.body.blocked.down || cc.body.touching.down)) {
                cc.body.setVelocityY(-700 * cc.speed);
            }

            if (leftKey.isDown) {
                cc.direction = false;
                cc.body.setVelocityX(-250 * cc.speed);
            }

            if (rightKey.isDown) {
                cc.direction = true;
                cc.body.setVelocityX(250 * cc.speed);
            }
        }

        if (Phaser.Input.Keyboard.JustDown(rKey)) {
            this.levelmanager.startLevel();
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
                    cc.body.position.x + 30,
                    cc.body.position.y + 5,
                );
            } else {
                cc.grabbing.body.position.set(
                    cc.body.position.x - 10,
                    cc.body.position.y + 5,
                );
            }

            if (Phaser.Input.Keyboard.JustDown(downKey)) {
                cc.releaseGrab(false);
            }
        }
    }
}

export default gameScene;
