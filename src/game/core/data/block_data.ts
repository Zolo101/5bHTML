import Alert from "../../editor/ui/alert";
import { Block } from "../classes/block";

export type BlockObjectType = {
    map: Map<number, Block>,
    collisionIndexes: number[],
    killIndexes: number[],
    specialIndexes: number[],
}
export const BlockObject: BlockObjectType = {
    map: new Map(),
    collisionIndexes: [],
    killIndexes: [],
    specialIndexes: [],
}

export enum BlockProps {
    DontCollide,
    Invisible,
    Kills,
    Special,
    Animated,
    Outline
}

// in order of appearance
new Block(6, [BlockProps.Outline])
new Block(22, [BlockProps.Outline])
new Block(-1, [BlockProps.DontCollide, BlockProps.Invisible])
new Block(2, [BlockProps.DontCollide, BlockProps.Special]) // Finish block
    .setSize(60, 120)
    .setOffset(30, 0)
    .setTextureName("finish")
    .setCollisionCallback((lm) => {
        if (lm.currentcharacter.active) {
            if (lm.levelnumber + 1 === lm.hardlimitlevel && lm.backScene === "explorelevelScene" && !lm.finishedLevelpack) {
                lm.finishedLevelpack = true
                // const fade = lm.scene.add.rectangle(0, 0, 960, 540, 0xffffff, 0)
                //     .setBlendMode(Phaser.BlendModes.MULTIPLY)
                //     .setOrigin(0, 0)
                // lm.scene.tweens.add({
                //     targets: fade,
                //     duration: 2000,
                //     alpha: 1
                // })
                new Alert("Levelpack complete!", "Congrats on finishing this levelpack!").render(lm.scene)
                    .then(() => lm.scene.scene.start(lm.backScene, lm.levels))
                return
            }
            if (lm.levelnumber + 1 < lm.hardlimitlevel) {
                lm.levelnumber += 1;
                lm.setLevel(lm.levelnumber + 1);
            }
        }
    })

new Block(7, [BlockProps.DontCollide]) // Wintoken
// new Block("5", false, true, false, true, false)
// .setSize(150, 180)
// new Block(">", true, true, false, false, true)
new Block(15, [BlockProps.DontCollide])
new Block(23, [BlockProps.DontCollide])

// grey spikes
new Block(8, [BlockProps.Kills]) // center
new Block(11, [BlockProps.Kills]) // up
    .setSides(false, false, true, false)
new Block(12, [BlockProps.Kills]) // down
    .setSides(false, false, false, true)
new Block(13, [BlockProps.Kills]) // left
    .setSides(true, false, false, false)
new Block(14, [BlockProps.Kills]) // right
    .setSides(false, true, false, false)

new Block(10, [BlockProps.DontCollide])
// new Block("_", undefined, true, false, false, true)

// one-sided platforms
new Block(19, [BlockProps.DontCollide]) // right
    .setSides(false, true, false, false)
new Block(16, [BlockProps.DontCollide]) // up
    .setSides(false, false, true, false)

new Block(21, [])
new Block(20, [])

new Block(9, [BlockProps.DontCollide])

BlockObject.map.forEach((block, i) => {
    if (!block.has(BlockProps.DontCollide)) {
        BlockObject.collisionIndexes.push(i);
    } else if (block.has(BlockProps.Kills)) {
        BlockObject.killIndexes.push(i);
    } else if (block.has(BlockProps.Special)) {
        BlockObject.specialIndexes.push(i);
    }
})