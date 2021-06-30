import { levels } from "./jsonmodule";
import { Level, LevelData } from "./levelstructure";
// Meets version 4 level standards
// https://gist.github.com/Zolo101/36ae33e5dd15510a2cb41e942dbf7044

// const allBlocks = blocks.map((array: { name: string; }) => array.name);

// const usedBlocks: string[] = [];

export function checkLevel(): void {
    // const blockArray = [...levels[levelnum].data];
    const curlevel: LevelData = levels;
    let levelsExist = true;
    // console.log(levels);

    switch (true) {
    case curlevel.name === undefined:
        console.warn("No title!");
        // falls through

    case curlevel.author === undefined:
        console.warn("No author!");
        // falls through

    case curlevel.description === undefined:
        console.warn("No description!");
        // falls through

    case curlevel.struct_version === undefined:
        console.error("No version specficied (This is required!)");
        // falls through

    case curlevel.level_version === undefined:
        console.warn("No title!");
        // falls through

    case curlevel.levels === undefined:
        console.error("No levels...?");
        levelsExist = false;
        // falls through

    default:
        break;
    }

    // No levels
    if (levelsExist) return;

    curlevel.levels.forEach((level: Level, i: number) => {
        switch (true) {
        case level.name === undefined:
            console.error(`No level name @ level number ${i}.`);
            // falls through

        case level.width === undefined:
            console.error(`No level width @ level number ${i}.`);
            // falls through

        case level.height === undefined:
            console.error(`No level height @ level number ${i}.`);
            // falls through

        case level.background === undefined:
            console.error(`No level background @ level number ${i}.`);
            // falls through

        case level.data === undefined:
            console.error(`No level data @ level number ${i}.`);
            // falls through

            //case level[0].entity === undefined:
            //    console.warn(`No level entities @ level number ${i}.`);
            // falls through

        default:
            break;
        }
    });
    /*
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
    } */

    // No level
    // Level size does not equal width/height (not good)
    /*
    if (curlevel.data === undefined) {
        console.error("No level!");
    } else if (curlevel.height !== curlevel.data.length
            || curlevel.width !== curlevel.data[0].length) {
                console.error("The Level size is different from the width/height variable!");
        } */
    // Level size does not equal width/height (not good)
    // Unknown / Unsupported block
    // blockArray.forEach((bc) => {
    //    if (!usedBlocks.includes(bc)) {
    //        usedBlocks.push(bc);
    //    }
    // });
    // if (usedBlocks.every((ub) => allBlocks.includes(ub))) {
    //    // For now
    //    console.warn("Unknown/Unsupported block detected!");
    // }

    // No entity
    // if (curlevel.entity === undefined) {
    //    console.error("No entities!");
    // }
}

export default checkLevel;
