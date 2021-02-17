export type Entity = {
    name: string
    type: string
    x: number
    y: number
    roleid: number
    controllable: boolean
}

export type Dialogue = {
    name: string
    happy: boolean
    text: string
}

export type Level = {
        name: string
        width: number
        height: number
        data: number[][]
        entities: Entity[]
        background: number
}

export type LevelData = {
    name: string
    author: string
    description: string
    struct_version: number
    level_version: string
    levels: Level[]
}
