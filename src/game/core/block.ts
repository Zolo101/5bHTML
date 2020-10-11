/*
class Block {
    name: string;
    collidable = true;

    constructor(name: string, collidable: boolean) {
        this.name = c
    }
} */

export type SimpleBlock = {
    name: string
    collide: boolean
    visible: boolean
    kill: boolean
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
    collide: boolean
    visible: boolean
    kill: boolean
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

export type Block = SpecialBlock // | SimpleBlockInterface

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
