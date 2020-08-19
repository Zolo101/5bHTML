//import { levels, blocks, entities } from "../../scenes/game";

const levels = require("./json/levels.json");
const blocks = require("./json/blocks.json");
const entities = require("./json/entities.json");

// Yeah I know this is a bunch of if statements but
// I think its ok since its just only going to be used once,
// and it's not in the main "loop" of the game.

const allBlocks = blocks.map((array: { name: string; }) => array.name);

const usedBlocks: string[] = [];

export function checkLevel(levelnum: number): void {
    //const blockArray = [...levels[levelnum-1].data];
    const curlevel = levels[levelnum-1];

    //console.log(levels);
    // No title
    if (curlevel.name === undefined) {
        console.warn("No title!");
    }

    // No width/height
    if ((curlevel.width || curlevel.height) === undefined) {
        console.error("No width/height variable!");
    }

    // Too small
    if (curlevel.width < 32 || curlevel.height < 18) {
        console.error("Level is too small!");
    }

    // No background
    if (curlevel.background === undefined) {
        console.warn("No background!");
    }

    // Invalid background
    if (curlevel.background > 11) {
        console.error("Invalid background!");
    }

    // No level
    // Level size does not equal width/height (not good)
    if (curlevel.data === undefined) {
        console.error("No level!");
    } else if (curlevel.height !== curlevel.data.length 
            || curlevel.width !== curlevel.data[0].length) {
                console.error("The Level size is different from the width/height variable!");
        }
        // Level size does not equal width/height (not good)
        // Unknown / Unsupported block
        //blockArray.forEach((bc) => {
        //    if (!usedBlocks.includes(bc)) {
        //        usedBlocks.push(bc);
        //    }
        //});
        //if (usedBlocks.every((ub) => allBlocks.includes(ub))) {
        //    // For now
        //    console.warn("Unknown/Unsupported block detected!");
        //}

    // No entity
    //if (curlevel.entity === undefined) {
    //    console.error("No entities!");
    //}
}

export default checkLevel;
