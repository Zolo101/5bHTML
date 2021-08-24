import Settings from "../../settingsgame";
import { Entity } from "../levelstructure";

export class Sprite extends Phaser.GameObjects.Container {
    declare body: Phaser.Physics.Arcade.Body
    visual: Phaser.GameObjects.Sprite

    name: string
    type: "Character" | "Sprite"
    mass: number
    friction: number

    grabbable: boolean
    grabbed: boolean
    active: boolean
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        key: string,
        frame: number,
        sprite: SpriteType,
        options: Pick<Partial<Sprite>, "type" | "mass" | "friction" | "grabbable" | "grabbed" | "active">
    ) {
        super(scene, x, y);
        this.scene = scene;
        this.name = key;
        this.type = options.type ?? "Sprite";
        this.mass = options.mass ?? 2;
        this.friction = options.friction ?? 1.15;

        this.grabbable = options.grabbable ?? false
        this.grabbed = options.grabbed ?? false
        this.active = options.active ?? true

        if (this.type === "Sprite") {
            this.setSize(sprite.size.x, sprite.size.y)
        }

        this.visual = this.scene.add.sprite(0, 0, key, frame)
            .setDisplaySize(sprite.size.x, sprite.size.y)

        this.add(this.visual)

        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);

        // WARNING THIS BLANKS THE GAME
        // this.setDisplaySize(sprite.size.x, sprite.size.y);

        this.body.setDragX(this.friction * 700);
        this.body.setMass(this.mass);
        this.body.setCollideWorldBounds(true);

        // for some reason this doesnt work here?
        // this.body.pushable = false;
    }

    addTilemap(...tilemap: Phaser.Tilemaps.TilemapLayer[]): void {
        this.scene.physics.add.collider(this, tilemap);
    }
}

export class Character extends Sprite {
    Lleg: Phaser.GameObjects.Sprite
    Rleg: Phaser.GameObjects.Sprite

    speed = 1; // Speed of character
    jumpPower = 1; // Power of characters jump
    direction = true; // Direction of character, true = right, false = left

    grabbing: Sprite | Character | null; // Whats the character grabbing?
    grabbable = true; // Is the character grabbable?

    constructor(scene: Phaser.Scene, x: number, y: number, frame: number, sprite: SpriteType,
        options: Pick<Partial<Sprite>, "type" | "mass" | "friction" | "grabbable" | "grabbed" | "active">,
    ) {
        super(scene, x, y, "book_general", frame, sprite, options)
        // this.setVisible(false)
        this.visual.setTexture("book_general")
            .setOrigin(0, 0)
            .setScale(0.45)
        // this.setDisplaySize(sprite.size.x, sprite.size.y + 10).;//setOrigin(0.5, 0.4);
        this.body.setOffset(12, 1)
        this.body.setSize(sprite.size.x, sprite.size.y + 10);
        this.Lleg = this.scene.add.sprite(28, 53, "legs_walk", 1)
            .setScale(0.22)
        this.Rleg = this.scene.add.sprite(42, 53, "legs_walk", 1)
            .setScale(0.22)

        this.add([this.Lleg, this.Rleg])

        this.setupAnimations()

        this.visual.anims.play("idle")
        this.bringToTop(this.visual)

        this.grabbing = null;
    }

    attemptGrab(sp: Sprite): boolean {
        // Stop if sprite is dead, or if sprite is already grabbing
        if (!this.active) return false;

        const characterBounds = this.getBounds()
        const cbWidth = characterBounds.width * 1.5
        const cbHeight = characterBounds.height
        const spriteCoord = sp.body.center;

        characterBounds.setSize(cbWidth, cbHeight);

        if (this.direction) { // right
            characterBounds.setPosition(this.x + cbWidth - (this.body.width * 2), this.y)
        } else { // left
            // warning: the 10 is a hardcode for a werid hitbox glitch, zelo pls fix
            characterBounds.setPosition(this.x - cbWidth + this.body.width + 10, this.y)
        }

        if (Settings.IS_DEBUG) {
            this.scene.add.rectangle(
                characterBounds.centerX,
                characterBounds.centerY,
                cbWidth,
                cbHeight
            ).setStrokeStyle(2, 0xa2ff00, 0.2)

            this.scene.add.rectangle(
                spriteCoord.x,
                spriteCoord.y,
                5,
                5
            ).setStrokeStyle(2, 0xffffff, 1)
        }

        const spriteInBounds = characterBounds.contains(spriteCoord.x, spriteCoord.y);

        if (spriteInBounds) {
            // console.log(sp.name);
            this.grabbing = sp; // a reference
            sp.grabbed = true;
            // this.grabbing.body.moves = false;
            this.jumpPower = 1 / Math.sqrt(sp.mass / 4);
            // sp.setPosition(25, -10)
            // this.add(sp)
            // console.log(sp.mass)
            // sp.body.enable = false;
        }
        return spriteInBounds;
    }

    releaseGrab(throwsprite = false): void {
        if (this.grabbing === null) {
            console.warn("Character tried releasing nothing!");
            return;
        }

        const gsprite = this.grabbing;
        const throwpower = 300 * this.speed;
        const resultVelocityX = (Math.abs(this.body.velocity.x) > 140)
            ? this.body.velocity.x * 1.7 : (this.direction)
                ? throwpower : -throwpower

        if (throwsprite) {
            gsprite.body.velocity = new Phaser.Math.Vector2(
                resultVelocityX, -throwpower * 1.7,
            );
        }
        gsprite.grabbed = false;
        gsprite.body.enable = true;
        this.speed = 1;
        this.jumpPower = 1;
        // this.remove(this.grabbing)
        // this.grabbing.body.moves = true;

        this.grabbing = null;
    }

    die(): void {
        if (this.active) {
            this.visual.anims.play("die")
            this.body.moves = false
            this.body.setImmovable(true)
            this.Lleg.anims.stop()
            this.Rleg.anims.stop()
            this.scene.tweens.addCounter({
                from: 0,
                to: 8,
                ease: "linear",
                duration: 300,
                onUpdate: (tween) => {this.setVisible(Math.floor(tween.getValue() % 2) === 0)},
                onComplete: () => {
                    // Drop any grabbed sprite
                    if (this.grabbing !== null) {
                        this.grabbing.grabbed = false;
                        this.grabbing.body.enable = true;
                        this.grabbing = null;
                    }

                    this.active = false;
                    this.destroy();
                }
            })
        }
    }

    setupAnimations(): void {
        this.visual.anims.create({ key: "idleL", frames: this.visual.anims.generateFrameNames("book_general", { start: 2, end: 2, suffix: ".png" }) })
        this.visual.anims.create({ key: "idleR", frames: this.visual.anims.generateFrameNames("book_general", { start: 4, end: 4, suffix: ".png" }) })
        this.visual.anims.create({ key: "walkL", frames: this.visual.anims.generateFrameNames("book_walkL", { start: 1, end: 27, suffix: ".png" }), frameRate: 60, repeat: -1 })
        this.visual.anims.create({ key: "walkR", frames: this.visual.anims.generateFrameNames("book_walkR", { start: 1, end: 27, suffix: ".png" }), frameRate: 60, repeat: -1 })
        this.visual.anims.create({ key: "grabbingL", frames: this.visual.anims.generateFrameNames("book_general", { start: 7, end: 7, suffix: ".png" }) })
        this.visual.anims.create({ key: "grabbingR", frames: this.visual.anims.generateFrameNames("book_general", { start: 8, end: 8, suffix: ".png" }) })
        this.visual.anims.create({ key: "jumpL", frames: this.visual.anims.generateFrameNames("book_general", { start: 5, end: 5, suffix: ".png" }) })
        this.visual.anims.create({ key: "jumpR", frames: this.visual.anims.generateFrameNames("book_general", { start: 6, end: 6, suffix: ".png" }) })
        this.visual.anims.create({ key: "die", frames: this.visual.anims.generateFrameNames("book_general", { start: 9, end: 9, suffix: ".png" }) })

        this.Lleg.anims.create({ key: "jump", frames: this.visual.anims.generateFrameNames("legs_walk", { start: 11, end: 11, suffix: ".png" }) })
        this.Rleg.anims.create({ key: "jump", frames: this.visual.anims.generateFrameNames("legs_walk", { start: 11, end: 11, suffix: ".png" }) })
        this.Lleg.anims.create({ key: "idle", frames: this.visual.anims.generateFrameNames("legs_walk", { start: 1, end: 1, suffix: ".png" }) })
        this.Rleg.anims.create({ key: "idle", frames: this.visual.anims.generateFrameNames("legs_walk", { start: 1, end: 1, suffix: ".png" }) })
        this.Lleg.anims.create({ key: "walk", frames: this.visual.anims.generateFrameNames("legs_walk", { start: 1, end: 27, suffix: ".png" }), frameRate: 60, repeat: -1 })
        this.Rleg.anims.create({ key: "walk", frames: this.visual.anims.generateFrameNames("legs_walk", { frames: Array.from(Array(28).keys()).map((num) => (num + 13) % 27), suffix: ".png" }), frameRate: 60, repeat: -1 })

        // walkR sticks out for some reason so this is a temporary hacky fix
        this.visual.on("animationstart", (animation: Phaser.Animations.Animation) => {
            this.visual.setOrigin((animation.key === "walkR") ? -0.125 : 0, 0)
        })
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
    scene: Phaser.Scene,
    entity: Entity,
    sprite: SpriteType, // property
): Character {
    const newChar = new Character(
        scene, entity.x, entity.y, 3, sprite,
        { mass: sprite.mass, friction: sprite.friction, type: "Character" }
    );
    return newChar
}

export function makeSpriteFromString(
    scene: Phaser.Scene,
    entity: Entity,
    sprite: SpriteType, // property
): Sprite {
    const newSprite = new Sprite(
        scene, entity.x, entity.y, sprite.name, 3,
        sprite, { mass: sprite.mass },
    );
    newSprite.body.pushable = false;
    return newSprite
}

export default Sprite;
