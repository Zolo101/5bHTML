import { BlockObject } from "../data/block_data";
import gameSceneType from "../gamestructure";
import { Entity } from "../levelstructure";
import LevelManager from "./levelmanager";

export type LevelPhysicsCallback = (
    levelmanager: LevelManager,
) => void;

export class Block {
    // defaults
    size!: { x: number; y: number; };
    offset = { x: 0, y: 0 };
    onCollide!: LevelPhysicsCallback
    side!: { left: boolean; right: boolean; up: boolean; down: boolean; };
    name = "placeholder_name"

    constructor(
        public tile = 4, // unknown/unset texture
        public canCollide = true,
        public visible = true,
        public canKill = false,
        public special = false,
        public animate = false,
        public texturename = "special_missing", // for specialblocks
    ) {
        // Add to blockMap
        BlockObject.map.set(this.tile, this);
        this.side = {left: true, right: true, up: true, down: true}
    }

    setSize(x: number, y: number): this {
        this.size = {x, y}
        return this
    }

    setOffset(x: number, y: number): this {
        this.offset = {x, y}
        return this
    }

    setCollisionCallback(callback: LevelPhysicsCallback): this {
        this.onCollide = callback;
        return this
    }

    setSides(left: boolean, right: boolean, up: boolean, down: boolean): this {
        this.side = { left, right, up, down }
        return this
    }

    setVisible(visible: boolean): this {
        this.visible = visible;
        return this
    }

    setCollision(cancollide: boolean): this {
        this.canCollide = cancollide;
        return this
    }

    setSpecial(special: boolean): this {
        this.special = special;
        return this
    }

    setTile(tile: number): this {
        this.tile = tile;
        BlockObject.map.delete(tile);
        BlockObject.map.set(tile, this);
        return this
    }

    setTextureName(texturename: string): this {
        this.texturename = texturename;
        return this
    }

    setAnimate(animate: boolean): this {
        this.animate = animate;
        return this
    }
}

export type SimpleBlock = {
    name: string
    canCollide: boolean
    visible: boolean
    canKill: boolean
    tile: number
    side: {
        left: boolean
        right: boolean
        up: boolean
        down: boolean
    }
}

export type SpecialBlock = SimpleBlock & {
    special: boolean
    animate: boolean
    texturename: string
    size: {
        x: number
        y: number
    }
    offset: {
        x: number
        y: number
    }
}

export function createSpecialBlock(
    scene: gameSceneType,
    block: Block,
    sprite: Entity,
    collisionCallback: LevelPhysicsCallback,
    collisionGroup: Phaser.GameObjects.Group,
): Phaser.GameObjects.Sprite {
    // console.log(y)
    const specialblock = scene.physics.add.sprite(sprite.x, sprite.y, block.texturename)
        .setImmovable()

    // quick maths
    specialblock.setY(specialblock.y - (block.size.y / 2) + (block.size.y / 2));
    specialblock.setDisplaySize(block.size.x, block.size.y);
    specialblock.setPosition(specialblock.x + block.offset.x, specialblock.y + block.offset.y);

    if (collisionCallback !== undefined) {
        scene.physics.add.collider(specialblock, collisionGroup, () => { collisionCallback(scene.levelmanager) });
    }

    specialblock.body.customSeparateX = true;

    return specialblock;

    // this.setTexture(specialblock, blockinfo);
}
