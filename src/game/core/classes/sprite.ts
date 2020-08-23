export class Sprite extends Phaser.GameObjects.Sprite {
    body!: Phaser.Physics.Arcade.Body;
    name: string;
    grabbable = false;
    grabbed = false;
    mass = 2;
    friction = 1.3;
    // TODO: Fix the "any"
    // I have no idea how to fix the "any" warning so i'll just ignore it xD
    //
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(config: any, collisiongroup: Phaser.Physics.Arcade.StaticGroup) {
        super(config.scene, config.x, config.y, config.key);
        this.scene = config.scene;
        this.name = config.key;
        config.scene.physics.world.enable(this);
        config.scene.add.existing(this);
        config.scene.physics.add.collider(this, collisiongroup);

        this.body.setCollideWorldBounds(true);
    }
}

export class Character extends Sprite {
    direction = true; // Direction of character, true = right, false = left
    grabbing = false; // Is the character grabbing something
    grabbable = true; // Is the character grabbable
}

export type SpriteInterface = {
    name: string
    x: number
    y: number
}

export type PhaserBlock = Phaser.GameObjects.Sprite | Phaser.GameObjects.Image

export default Sprite;
