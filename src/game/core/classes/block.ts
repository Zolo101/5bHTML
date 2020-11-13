import gameSceneType from "../gamestructure";
import LevelManager from "./levelmanger";

export class Block implements BlockType {
    // defaults
    size!: { x: number; y: number; };
    offset = { x: 0, y: 0 };
    onCollide!: LevelPhysicsCallback
    //onCollide!: (scene: Phaser.Scene, sp: Sprite | Character) => void;
    side!: { left: boolean; right: boolean; up: boolean; down: boolean; };

    constructor(
        public name = "Unknown Block",
        public canCollide = true,
        public visible = true,
        public canKill = false,
        public special = false,
        public animate = false,
        public tile = 4, // unknown/unset texture
        public texturename = "special_missing", // for specialblocks
    ) {
        // Not sure if i need to do this
        this.name = name
        this.canCollide = canCollide
        this.visible = visible
        this.canKill = canKill
        this.special = special
        this.animate = animate
        this.tile = tile
        this.texturename = texturename
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

export type SpecialBlock = {
    name: string
    canCollide: boolean
    visible: boolean
    canKill: boolean
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
    tile: number
    side: {
        left: boolean
        right: boolean
        up: boolean
        down: boolean
    }
}

export type LevelPhysicsCallback = (
    levelmanager: LevelManager,
) => void;

//export type BlockCollisions = {
//    indexs: number | number[],
//    callback: Function,
//}

export type SpecialBlockCollisions = {

}

export type BlockType = SpecialBlock // | SimpleBlockInterface

const bcoord = (blocksize: number, x: number) => blocksize * x + (blocksize / 2);

/**
 * @deprecated Not needed, do not use.
*/
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
    scene: gameSceneType,
    blockinfo: SpecialBlock,
    x: number, y: number,
    sx: number = blockinfo.size.x, sy: number = blockinfo.size.x,
    ox: number = blockinfo.offset.x, oy: number = blockinfo.offset.y,
    collisionCallback: LevelPhysicsCallback,
    collisionGroup: Phaser.GameObjects.Group,
): Phaser.GameObjects.Sprite {
    const specialblock = scene.physics.add.sprite(
        bcoord(30, x), bcoord(30, y - 1), blockinfo.texturename,
        // FOR NOW, special_missing should be used instead
    );

    // quick maths
    specialblock.setY(specialblock.y - (sy / 2) + (sy / 2));
    specialblock.setDisplaySize(sx, sy);
    specialblock.setPosition(specialblock.x + ox, specialblock.y + oy);

    if (collisionCallback !== undefined) {
        scene.physics.add.collider(specialblock, collisionGroup, () => { collisionCallback(scene.levelmanager) });
    }

    specialblock.body.customSeparateX = true;

    return specialblock;

    // this.setTexture(specialblock, blockinfo);
}

// export function parseBlockType(blockinfo: SimpleBlockInterface) {
//
// }
