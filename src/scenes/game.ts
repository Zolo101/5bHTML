import { LevelManager } from "../game/core/classes/levelmanger";
import { BlockInterface } from "../game/core/block";

import { levelnameStyle, backStyle } from "../game/core/buttons";
import { checkLevel } from "../game/core/checkLevel";

import { Sprite, Character } from "../game/core/classes/sprite";

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

/*
function checkGrab(sp: Sprite) {
    // If UP key is pressed, grab overlapped sprite
    if (!this.levelmanager.currentcharacter.grabbing
        && sp.grabbable
        && Phaser.Input.Keyboard.JustDown(upKey)) {
        this.levelmanager.currentcharacter.grabbing = true;
        sp.grabbed = true;
    }

    // Make character hold sprite while grabbing
    if (this.levelmanager.currentcharacter.grabbing && sp.grabbed) {
        if (this.levelmanager.currentcharacter.direction) {
            sp.body.position = new Phaser.Math.Vector2(
                this.levelmanager.currentcharacter.body.position.x+30,
                this.levelmanager.currentcharacter.body.position.y+5,
            );
        } else {
            sp.body.position = new Phaser.Math.Vector2(
                this.levelmanager.currentcharacter.body.position.x-10,
                this.levelmanager.currentcharacter.body.position.y+5,
            );
        }
    }

    // If grabbing and DOWN key pressed, Drop sprite
    if (this.levelmanager.currentcharacter.grabbing
        && sp.grabbed
        && Phaser.Input.Keyboard.JustDown(downKey)) {
        this.levelmanager.currentcharacter.grabbing = false;
        sp.grabbed = false;
    }

    // If grabbing and UP key pressed, Throw sprite
    if (this.levelmanager.currentcharacter.grabbing
        && sp.grabbed
        && Phaser.Input.Keyboard.JustDown(upKey)) {
        this.levelmanager.currentcharacter.grabbing = false;
        sp.grabbed = false;

        if (this.levelmanager.currentcharacter.direction) {
            sp.body.velocity = new Phaser.Math.Vector2(500, -600);
        } else {
            sp.body.velocity = new Phaser.Math.Vector2(-500, -600);
        }
    }
}*/

class gameScene extends Phaser.Scene {
    // Core vars, do not touch
    levelnumber = 1
    blocksize = 30
    background!: Phaser.GameObjects.Image

    levelmanager!: LevelManager

    constructor() { super("gameScene"); }

    init(lvl: any): void {
        if (lvl.levelnumber === undefined) return;
        this.levelnumber = lvl.levelnumber;
    }

    create(): void {
        // ver0 only
        this.physics.world.setBounds(0, 0, 960, 540, true, true, true, false);

        leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Switch character
        zKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

        // Reset level
        rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        const terrain = this.physics.add.staticGroup();
        const decorateterrain = this.physics.add.staticGroup();

        this.levelmanager = new LevelManager(
            levels, blocks, this, terrain, decorateterrain,
        );

        this.levelmanager.setLevel(this.levelnumber);
    }

    update(): void {
        // console.log(aslist.map(sp => sp.grabbable));
        this.levelmanager.UpdatePhysics();
        if (spaceKey.isDown && this.levelmanager.currentcharacter.body.touching.down) {
            this.levelmanager.currentcharacter.body.setVelocityY(-700);
        }

        if (leftKey.isDown) {
            this.levelmanager.currentcharacter.direction = false;
            this.levelmanager.currentcharacter.body.setVelocityX(-250);
        }

        if (rightKey.isDown) {
            this.levelmanager.currentcharacter.direction = true;
            this.levelmanager.currentcharacter.body.setVelocityX(250);
        }

        if (Phaser.Input.Keyboard.JustDown(rKey)) {
            this.levelmanager.startLevel();
        }

        this.levelmanager.currentcharacter.setFlipX(!this.levelmanager.currentcharacter.direction);

        this.levelmanager.characters.forEach((sp) => {
            //checkGrab(sp);
            sp.grabbable = false;
        });
    }
}

export default gameScene;
