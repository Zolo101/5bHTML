import { Entity } from "../levelstructure";

export class Sprite extends Phaser.GameObjects.Sprite {
    body!: Phaser.Physics.Arcade.Body;
    name: string;
    type: string;
    grabbable = false;
    grabbed = false;
    active = true;
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        key: string,
        tilemap: Phaser.Tilemaps.StaticTilemapLayer,
        public mass = 2,
        public friction = 1.15,
        topcollide = false,
        dontmove = false,
    ) {
        super(scene, x, y, key);
        this.scene = scene;
        this.name = key;
        this.type = "Sprite";

        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);
        this.scene.physics.add.collider(this, tilemap);

        this.body.setDragX(friction * 1000);
        this.body.setMass(mass);

        if (topcollide) {
            this.body.checkCollision.left = false;
            this.body.checkCollision.right = false;
        }

        if (dontmove) this.body.immovable = true;

        this.body.setCollideWorldBounds(true);
    }
}

export class Character extends Sprite {
    speed = 1; // Speed of character
    direction = true; // Direction of character, true = right, false = left
    grabbing!: Sprite | Character | undefined; // Whats the character grabbing?
    grabbable = true; // Is the character grabbable

    attemptGrab(sp: Sprite): void {
        const characterBounds = this.getBounds();
        const grabRange = 1.5

        // debug
        /*
        this.scene.add.rectangle(
            this.body.x,
            this.body.y,
            characterBounds.width * grabRange * 2,
            (characterBounds.height * grabRange) - 10,
            0xffffff
        ) */

        characterBounds.setSize(characterBounds.width * grabRange * 1.5, (characterBounds.height * grabRange))
        if (characterBounds.contains(sp.x, sp.y)) {
            // console.log(sp.name);
            this.grabbing = sp; // a reference
            sp.grabbed = true;
            // console.log(sp.mass)
            this.speed = 1 / Math.sqrt(sp.mass / 4);
            // sp.body.enable = false;
        }
    }

    releaseGrab(throwsprite = false): void {
        if (this.grabbing === undefined) {
            console.warn("Character tried releasing nothing!");
            return;
        }

        const gsprite = this.grabbing;
        const throwpower = 500 * this.speed;
        if (throwsprite) {
            if (this.direction) {
                gsprite.body.velocity = new Phaser.Math.Vector2(
                    throwpower, -throwpower * 1.5,
                );
            } else {
                gsprite.body.velocity = new Phaser.Math.Vector2(
                    -throwpower, -throwpower * 1.5,
                );
            }
        }
        gsprite.grabbed = false;
        gsprite.body.enable = true;
        this.speed = 1;
        this.grabbing = undefined;
    }

    die(): void {
        // Drop any grabbed sprite
        if (this.grabbing !== undefined) {
            this.grabbing.grabbed = false;
            this.grabbing.body.enable = true;
            this.grabbing = undefined;
        }

        this.active = false;
        this.destroy();
    }
}

export type SpriteType = {
    name: string
    type: string
    image?: string
    mass?: number
    friction?: number
    size: {
        x: number
        y: number
    }
}

export function makeCharacterFromString(
    sceneReference: Phaser.Scene,
    entity: Entity,
    sprite: SpriteType, // property
    tilelayer: Phaser.Tilemaps.StaticTilemapLayer,
): Character {
    return new Character(
        sceneReference, entity.x, entity.y, sprite.name,
        tilelayer, sprite.mass, sprite.friction
    ).setScale(0.2);
}

export function makeSpriteFromString(
    sceneReference: Phaser.Scene,
    entity: Entity,
    sprite: SpriteType, // property
    tilelayer: Phaser.Tilemaps.StaticTilemapLayer,
): Sprite {
    const newSprite = new Sprite(
        sceneReference, entity.x, entity.y, sprite.name,
        tilelayer, sprite.mass, undefined, true, true,
    );
    newSprite.setDisplaySize(sprite.size.x, sprite.size.y);
    newSprite.setScale(0.45);
    newSprite.body.customSeparateX = true;
    return newSprite;
}

export type PhaserBlock = Phaser.GameObjects.Sprite | Phaser.GameObjects.Image

export default Sprite;
