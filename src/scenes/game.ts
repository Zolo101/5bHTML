import { LevelManager } from "../game/core/classes/levelmanager";
import Sprite from "../game/core/classes/sprite";
import { BlockObject } from "../game/core/data/block_data";
import { LevelData } from "../game/core/levelstructure";
// System Variables (Engine)

export type GameOptions = {
    from: Phaser.Scene,
    levelfile: LevelData,
    levelnumber?: number,
    extraData: Record<string, unknown>
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
    levelfile!: GameOptions["levelfile"]
    background!: Phaser.GameObjects.Image

    levelmanager!: LevelManager

    backScene!: string
    extraData!: GameOptions["extraData"]

    constructor() { super("gameScene"); }

    init(lvl: GameOptions): void {
        this.levelnumber = lvl.levelnumber ?? 1;

        if (lvl.levelfile === undefined) throw "Levelfile needed!";
        this.levelfile = lvl.levelfile;

        this.backScene = (lvl.from === undefined) ? "levelselectScene" : lvl.from.scene.key;
        this.extraData = lvl.extraData ?? {};
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
            terrain, decorateterrain, this.backScene, this.extraData
        );

        this.levelmanager.setLevel(this.levelnumber);

        // same colour as 5b flash
        this.cameras.main.setBackgroundColor(0x8f8f5f);
    }

    update(): void {
        const alive = this.levelmanager.currentcharacter.active;
        const cc = this.levelmanager.currentcharacter;
        if (alive) {
            const isStanding = cc.body.blocked.down || cc.body.touching.down;
            const isIdle = isStanding && (!spaceKey.isDown && !leftKey.isDown && !rightKey.isDown)

            if (cc.grabbing) {
                cc.direction ? cc.visual.anims.play("grabbingR", true) : cc.visual.anims.play("grabbingL", true)
            }
            if (isIdle) {
                if (!cc.grabbing) {
                    if (cc.direction) {
                        cc.visual.anims.play("idleR", true)
                        cc.visual.setFlipX(false)
                    } else {
                        cc.visual.anims.play("idleL", true)
                        cc.visual.setFlipX(false)
                    }
                }
                cc.Lleg.anims.play("idle", true)
                cc.Rleg.anims.play("idle", true)
            }

            if (spaceKey.isDown) {
                if (cc.direction) {
                    cc.visual.anims.play("jumpR")
                    cc.visual.setFlipX(false)

                } else {
                    cc.visual.anims.play("jumpL")
                    cc.visual.setFlipX(false)
                }
                if (isStanding) {
                    cc.Lleg.anims.play("jump", true)
                    cc.Rleg.anims.play("jump", true)
                    cc.body.setVelocityY(-710 * cc.jumpPower);
                }
            }

            if (leftKey.isDown) {
                cc.direction = false;
                cc.body.setVelocityX(-270 * cc.speed);

                if (isStanding && spaceKey.isUp) {
                    cc.visual.anims.play("walkL", true)
                    cc.Lleg.anims.play("walk", true)
                    cc.Rleg.anims.play("walk", true)
                }
                cc.visual.setFlipX(false)
                if (cc.grabbing) {
                    cc.visual.anims.play("grabbingL", true)
                    cc.visual.setFlipX(false)
                }
            }

            if (rightKey.isDown) {
                cc.direction = true;
                cc.body.setVelocityX(270 * cc.speed);

                if (isStanding && spaceKey.isUp) {
                    cc.visual.anims.play("walkR", true)
                    cc.Lleg.anims.play("walk", true)
                    cc.Rleg.anims.play("walk", true)
                    cc.visual.setFlipX(true)
                }
                if (!isStanding && !spaceKey.isUp) {
                    cc.visual.setFlipX(false)
                }
                if (cc.grabbing) {
                    cc.visual.anims.play("grabbingR", true)
                    cc.visual.setFlipX(false)
                }
            }
            // console.log(cc.body.velocity.y)
        }

        // Flip the character based on direction
        // cc.visual.setFlipX(cc.direction)
        cc.Lleg.setFlipX(!cc.direction)
        cc.Rleg.setFlipX(!cc.direction)

        this.levelmanager.characters.children.entries.forEach((ch: any) => {
            ch.grabbable = false;
        });

        // TEMP, this shouldn't be in game.ts!

        // If UP key is pressed, grab overlapped sprite
        if (Phaser.Input.Keyboard.JustDown(upKey)) {
            if (cc.grabbing === null) {
                // very inefficient
                for (const entity of this.levelmanager.sprites.children.entries) {
                    cc.attemptGrab(entity as Sprite)
                }
            } else {
                cc.releaseGrab(true);
            }
        }

        // Make character hold sprite while grabbing
        if (cc.grabbing !== null && alive) {
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
            this.levelmanager.startLevelSetup();
        }

        // cc.visual.setPosition(cc.x, cc.y)
        // cc.Lleg.setPosition(cc.getBottomCenter().x - 8, cc.getBottomCenter().y - 10)
        // cc.Rleg.setPosition(cc.getBottomCenter().x + 10, cc.getBottomCenter().y - 10)
    }
}

export default gameScene;
