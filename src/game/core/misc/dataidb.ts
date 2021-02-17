// Cache and Savefile handling
// Later: Change number[][]

import { LevelData } from "../levelstructure";

// version history
// 1-5 = https://gist.github.com/Zolo101/36ae33e5dd15510a2cb41e942dbf7044
// 6 = Tiled
// 7 = Current structure
export const VERSION_NUMBER = 7;
const SAVE_NAME = "saves"
const CACHE_NAME = "5beam-cache"

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace SaveManager {
    export const saves = new Map<string, LevelData>()
    export function addSave(lvl: LevelData): LevelData {
        lvl.struct_version = VERSION_NUMBER;
        saves.set(lvl.name, lvl)
        return lvl;
    }

    export function removeSave(name: string): void {
        saves.delete(name)
    }

    // NOT FROM LOCALSTORAGE
    export function getCacheSave(name: string): LevelData | undefined {
        return saves.get(name)
    }

    // NOT FROM LOCALSTORAGE
    export function getCacheAll(): IterableIterator<LevelData> {
        return saves.values()
    }

    // Get from localstorage
    export function getLocalStorage(): void {
        const locstore = localStorage.getItem(SAVE_NAME);

        // Skip if empty
        if (locstore === null) return;

        const locsaves: LevelData[] = JSON.parse(locstore)
        for (const save of locsaves) {
            addSave(save)
        }
    }

    // Pushes to localstorage
    export function push(): void {
        console.log(saves.values())
        localStorage.setItem(SAVE_NAME, JSON.stringify([...saves.values()]));
    }
}

export default SaveManager;