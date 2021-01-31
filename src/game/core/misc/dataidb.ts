// Cache and Savefile handling
// Later: Change number[][]

export const VERSION_NUMBER = 1;
const SAVE_NAME = "saves"
const CACHE_NAME = "5beam-cache"

export type SaveFile = {
    name: string
    data: number[][]
    version: number
}

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace SaveManager {
    export const saves = new Map<string, SaveFile>()
    export function addSave(name: string, data: number[][]): SaveFile {
        const file = { name: name, data: data, version: VERSION_NUMBER }
        saves.set(name, file)
        return file
    }

    export function removeSave(name: string): void {
        saves.delete(name)
    }

    // NOT FROM LOCALSTORAGE
    export function getCacheSave(name: string): SaveFile | undefined {
        return saves.get(name)
    }

    // NOT FROM LOCALSTORAGE
    export function getCacheAll(): IterableIterator<SaveFile> {
        return saves.values()
    }

    // Get from localstorage
    export function getLocalStorage(): void {
        const locstore = localStorage.getItem(SAVE_NAME);

        // Skip if empty
        if (locstore === null) return;

        const locsaves: SaveFile[] = JSON.parse(locstore)
        for (const save of locsaves) {
            addSave(save.name, save.data)
        }
    }

    // Pushes to localstorage
    export function push(): void {
        console.log(saves.values())
        localStorage.setItem(SAVE_NAME, JSON.stringify([...saves.values()]));
    }
}

export default SaveManager;