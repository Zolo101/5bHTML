export type BaseEntity = {
    name: string
    type: string
    x: number
    y: number
    controllable: boolean
}

export type Character = BaseEntity & {
    type: "Character"
}

export type Sprite = BaseEntity & {
    type: "Entity"
}

export type FixedSprite = BaseEntity & {
    type: "Entity"
    paths: Path[]
    alternate: boolean
}

export enum Direction {
    Left,
    Right,
    Up,
    Down
}

export type Path = {
    direction: Direction,
    amount: number,
    duration: number
}

export type Entity = Character | Sprite

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
