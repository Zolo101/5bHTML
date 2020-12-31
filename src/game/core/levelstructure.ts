export type Entity = {
    name: string
    type: string
    id: number
    gid: number // Global ID
    width: number
    height: number
    visible: boolean
    rotation: number
    x: number
    y: number
}

export type Dialogue = {
    name: string
    happy: boolean
    text: string
}

export type Level = [
        {
            name: string
            width: number
            height: number
            data: number[]
            opacity: number
            type: string
            visible: boolean
            id: number
            x: number
            y: number
            background: number
        },
        {
            name: string
            id: number
            draworder: string
            objects: Entity[]
            opacity: number
            type: string
            visible: boolean
            x: number
            y: number
        }
]


export type LevelData = {
    name: string
    author: string
    description: string
    version: number
    levelversion: string
    levels: Level[]
}
