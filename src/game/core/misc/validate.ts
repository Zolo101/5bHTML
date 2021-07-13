import { LevelData } from "../levelstructure";

function validateLevelpack(levelpack: LevelData): boolean {
    if (typeof levelpack.author !== "string") return false;
    if (typeof levelpack.description !== "string") return false;
    if (typeof levelpack.level_version !== "string") return false;
    if (!Array.isArray(levelpack.levels)) return false;
    if (typeof levelpack.name !== "string") return false;
    if (levelpack.struct_version !== 7) return false;

    for (const level of levelpack.levels) {
        if (!Number.isInteger(level.background)) return false;
        if (!Array.isArray(level.data)) return false;
        if (!Array.isArray(level.entities)) return false;
        if (!Number.isInteger(level.height)) return false;
        if (typeof level.name !== "string") return false;
        if (!Number.isInteger(level.width)) return false;

        for (const dataLine of level.data) {
            if (!Array.isArray(dataLine)) return false;
            for (const number of dataLine) {
                if (!Number.isInteger(number)) return false;
            }
        }

        if (level.entities.length === 0) return false;
        for (const entity of level.entities) {
            if (typeof entity.name !== "string") return false;
            if (entity.type !== "Character" && entity.type !== "Entity") return false;
            if (Number.isNaN(entity.x)) return false;
            if (Number.isNaN(entity.y)) return false;
        }
    }
    return true;
}

export default validateLevelpack