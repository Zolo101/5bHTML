import Sprite, { Character } from "./sprite";

class Block implements BlockType {
    // defaults
    name = "Unknown Block"
    size: { x: number; y: number; };
    offset: { x: number; y: number; };
    canCollide = true;
    visible = true;
    canKill = false;
    special = false;
    animate = false;
    tile = 13; // unknown/unset texture
    side: { left: boolean; right: boolean; up: boolean; down: boolean; };

    constructor(blockinfo: SpecialBlock) {
        this.name = blockinfo.name
        this.canCollide = blockinfo.canCollide
        this.visible = blockinfo.visible
        this.canKill = blockinfo.canKill
        this.special = blockinfo.special
        this.animate = blockinfo.animate
        this.size = blockinfo.size
        this.offset = blockinfo.offset
        this.tile = blockinfo.tile
        this.side = blockinfo.side
    }

    onCollision(sp: Sprite | Character): void {

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

export type SpecialBlock = {
    name: string
    canCollide: boolean
    visible: boolean
    canKill: boolean
    special: boolean
    animate: boolean
    size: {
        x: number
        y: number
    }
    offset: {
        x: number
        y: number
    }
    tile: number
    side: {
        left: boolean
        right: boolean
        up: boolean
        down: boolean
    }
}

//export type BlockCollisions = {
//    indexs: number | number[],
//    callback: Function,
//}

export type SpecialBlockCollisions = {

}

export type BlockType = SpecialBlock // | SimpleBlockInterface

const bcoord = (blocksize: number, x: number) => blocksize * x + (blocksize / 2);

export function createBlock(
    scene: Phaser.Scene,
    blockinfo: SimpleBlock,
    x: number, y: number,
): Phaser.GameObjects.Image {
    const block = new Phaser.GameObjects.Image(scene, x, y, "missing");

    block.setDisplaySize(this.blocksize, this.blocksize);
    block.setPosition(bcoord(this.blocksize, x), bcoord(this.blocksize, y));

    return block;

    // this.setTexture(block, blockinfo);
}

export function createSpecialBlock(
    scene: Phaser.Scene,
    blockinfo: SpecialBlock,
    x: number, y: number,
    sx: number = blockinfo.size.x, sy: number = blockinfo.size.x,
    ox: number = blockinfo.offset.x, oy: number = blockinfo.offset.y,
    collisionCallback: ArcadePhysicsCallback,
    collisionGroup: Phaser.GameObjects.Group,
): Phaser.GameObjects.Sprite {
    const specialblock = scene.physics.add.sprite(
        bcoord(30, x), bcoord(30, y - 1), "finish",
        // FOR NOW, special_missing should be used instead
    );

    // quick maths
    specialblock.setY(specialblock.y - (sy / 2) + (sy / 2));
    specialblock.setDisplaySize(sx, sy);
    specialblock.setPosition(specialblock.x + ox, specialblock.y + oy);

    scene.physics.add.collider(specialblock, collisionGroup, collisionCallback);

    specialblock.body.customSeparateX = true;

    // specialblock.setY(specialblock.y-(sy-10));

    return specialblock;

    // this.setTexture(specialblock, blockinfo);
}

// export function parseBlockType(blockinfo: SimpleBlockInterface) {
//
// }
