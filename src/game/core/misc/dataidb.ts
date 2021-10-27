import { Level, LevelData } from "../levelstructure";

export type APIResponse = SuccessfulAPIResponse | FailureAPIResponse;

export type SuccessfulAPIResponse = {
    status: "success",
    data: APIData[]
}

export type FailureAPIResponse = {
    status: "fail" | "unsure" | "ratelimit"
}

export type APIData = {
    ID: number
    name: string
    author: string
    description: string
    version: number
    levelversion: string
    levels: Level[]
    data: string
}

// Cache API Object
export type C_APIOBJ = {
    data: Map<number, APIData[]>
    time: number
}

// version history
// 1-5 = https://gist.github.com/Zolo101/36ae33e5dd15510a2cb41e942dbf7044
// 6 = Tiled
// 7 = Current structure

export const VERSION_NUMBER = 7;
const SAVE_NAME = "5beam-saves"
const CACHE_NAME = "5beam-cache"

export const s_saves = new Map<string, LevelData>()
export const c_saves: C_APIOBJ = {
    data: new Map(),
    time: 0,
}

//
// LOCAL LEVELPACKS
//
export class localSaves {
    static add(lvl: LevelData, push = true) {
        lvl.struct_version = VERSION_NUMBER;
        s_saves.set(lvl.name, lvl)
        if (push) this.push()
        return lvl;
    }

    static remove(name: string, push = true) {
        s_saves.delete(name)
        if (push) this.push()
    }

    // NOT FROM LOCALSTORAGE
    static getCacheSave(name: string) {
        return s_saves.get(name)
    }

    // NOT FROM LOCALSTORAGE
    static getCacheAll() {
        return s_saves.values()
    }

    // FROM LOCALSTORAGE
    static getLocalStorage() {
        const locstore = localStorage.getItem(SAVE_NAME);

        // Skip if empty
        if (locstore === null) return;

        const locsaves: LevelData[] = JSON.parse(locstore)
        for (const save of locsaves) {
            this.add(save, false)
        }
    }

    // Pushes to localstorage
    static push() {
        console.log("PUSHED TO LOCALSTORAGE", s_saves.values())
        localStorage.setItem(SAVE_NAME, JSON.stringify([...s_saves.values()]));
    }
}

//
// ONLINE LEVELPACK CACHE
//
export class onlineLevelpackCache {
    static addSaves(page: number, lvls: APIData[]) {
        c_saves.data.set(page, lvls);
    }

    // Get from localstorage
    static getLocalStorage() {
        const locstore = localStorage.getItem(CACHE_NAME);

        // Skip if empty
        if (locstore === null) return;

        const parsedloc = JSON.parse(locstore);

        c_saves.data = new Map(parsedloc.data) as Map<number, APIData[]>;
        c_saves.time = parsedloc.time
    }

    // Pushes to localstorage
    static push() {
        localStorage.setItem(CACHE_NAME, JSON.stringify({ data: Array.from(c_saves.data.entries()), time: Date.now()}));
    }

    static clearEverything() {
        c_saves.data.clear();
    }

    static clear(page: number) {
        c_saves.data.delete(page);
    }
}

export default s_saves