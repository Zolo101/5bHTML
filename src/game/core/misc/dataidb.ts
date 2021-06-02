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
// LOCAL SAVE
//
// local levels
export function s_addSave(lvl: LevelData, push = true): LevelData {
    lvl.struct_version = VERSION_NUMBER;
    s_saves.set(lvl.name, lvl)
    if (push) s_push()
    return lvl;
}

export function s_removeSave(name: string, push = true): void {
    s_saves.delete(name)
    if (push) s_push()
}

// NOT FROM LOCALSTORAGE
export function s_getCacheSave(name: string): LevelData | undefined {
    return s_saves.get(name)
}

// NOT FROM LOCALSTORAGE
export function s_getCacheAll(): IterableIterator<LevelData> {
    return s_saves.values()
}

// Get from localstorage
export function s_getLocalStorage(): void {
    const locstore = localStorage.getItem(SAVE_NAME);

    // Skip if empty
    if (locstore === null) return;

    const locsaves: LevelData[] = JSON.parse(locstore)
    for (const save of locsaves) {
        s_addSave(save, false)
    }
}

// Pushes to localstorage
export function s_push(): void {
    console.log("PUSHED TO LOCALSTORAGE", s_saves.values())
    localStorage.setItem(SAVE_NAME, JSON.stringify([...s_saves.values()]));
}

//
// ONLINE LEVELPACK CACHE
//
export function c_addSaves(page: number, lvls: APIData[]): void {
    c_saves.data.set(page, lvls);
}

// Get from localstorage
export function c_getLocalStorage(): void {
    const locstore = localStorage.getItem(CACHE_NAME);

    // Skip if empty
    if (locstore === null) return;

    const parsedloc = JSON.parse(locstore);

    c_saves.data = new Map(parsedloc.data) as Map<number, APIData[]>;
    c_saves.time = parsedloc.time
}
// Pushes to localstorage
export function c_push(): void {
    localStorage.setItem(CACHE_NAME, JSON.stringify({ data: Array.from(c_saves.data.entries()), time: Date.now()}));
}
export function c_clearEverything(): void {
    c_saves.data.clear();
}
export function c_clear(page: number): void {
    c_saves.data.delete(page);
}

export default s_saves