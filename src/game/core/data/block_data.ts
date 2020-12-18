import { Block } from "../classes/block";

export type BlockObjectType = {
    map: Map<number, Block>,
    collisionIndexes: number[],
    killIndexes: number[],
    specialIndexes: number[],
}
export const BlockObject: BlockObjectType = {
    map: new Map<number, Block>(),
    collisionIndexes: [] as number[],
    killIndexes: [] as number[],
    specialIndexes: [] as number[],
}

// in order of appearance
BlockObject.map.set(6, new Block(6, true, true, false, false, false))
BlockObject.map.set(-1, new Block(undefined, false, false, false, false, false))
BlockObject.map.set(2, new Block(2, false, true, false, true, false) // Finish block
    .setSize(60, 120)
    .setOffset(30, 0)
    .setTextureName("finish")
    .setCollisionCallback((lm) => {
        if ((lm.levelnumber + 1 < lm.hardlimitlevel) && lm.currentcharacter.active) {
            lm.levelnumber += 1;
            lm.setLevel(lm.levelnumber + 1);
        }
    })
)

BlockObject.map.set(7, new Block(7, false, true, false, false, false)) // Wintoken
// new Block("5", false, true, false, true, false)
// .setSize(150, 180)
// new Block(">", true, true, false, false, true)
BlockObject.map.set(15, new Block(15, false, true, false, false, false))

// grey spikes
BlockObject.map.set(11, new Block(11, false, true, true, false, false)
    .setSides(true, true, true, true))
BlockObject.map.set(12, new Block(12, false, true, true, false, false)
    .setSides(true, true, true, true))
BlockObject.map.set(13, new Block(13, false, true, true, false, false)
    .setSides(true, true, true, true))
BlockObject.map.set(14, new Block(14, false, true, true, false, false)
    .setSides(true, true, true, true))

BlockObject.map.set(10, new Block(10, false, true, false, false, false))
// new Block("_", undefined, true, false, false, true)

// one-sided platforms
BlockObject.map.set(19, new Block(19, false, true, false, false, false) // right
    .setSides(false, true, false, false))
BlockObject.map.set(16, new Block(16, false, true, false, false, false) // up
    .setSides(false, false, true, false))

BlockObject.map.set(21, new Block(21, true, true, false, false, false))
BlockObject.map.set(20, new Block(20, true, true, false, false, false))

BlockObject.map.forEach((block, i) => {
    if (block.canCollide) {
        BlockObject.collisionIndexes.push(i);
    } else if (block.canKill) {
        BlockObject.killIndexes.push(i);
    } else if (block.special) {
        BlockObject.specialIndexes.push(i);
    }
})