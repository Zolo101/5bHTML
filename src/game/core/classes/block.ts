import { BlockObject, BlockProps } from "../data/block_data";
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
    side: { left: boolean; right: boolean; up: boolean; down: boolean; };
    name = "placeholder_name";
    tile: number
    properties: BlockProps[];

    constructor(
        tile = 4, // unknown/unset texture
        properties: BlockProps[],
        public texturename = "special_missing", // for specialblocks
    ) {
        this.properties = properties;
        this.tile = tile;
        // Add to blockMap
        BlockObject.map.set(this.tile, this);
        this.side = {left: true, right: true, up: true, down: true}
    }

    has(blockprop: BlockProps): boolean {
        return this.properties.includes(blockprop)
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
}

export type SimpleBlock = {
    name: string
    props: BlockProps[]
    tile: number
    side: {
        left: boolean
        right: boolean
        up: boolean
        down: boolean
    }
}

export type SpecialBlock = SimpleBlock & {
    special: true
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
