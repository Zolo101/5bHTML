export type Entity = {
    name: string
    x: number
    y: number

    controllable?: boolean
    roleid?: number
}

export type Dialogue = {
    name: string,
    happy: boolean
    text: string
}

export type Level = {
    name: string
    width: number
    height: number
    background: number
    data: string[]
    entity: Entity[]
    dialogue: Dialogue[]
}

export type LevelData = {
    name: string
    author: string
    description: string
    version: number
    levelversion: string
    levels: Level[]
}
