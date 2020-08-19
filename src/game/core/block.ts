/*
class Block {
    name: string;
    collidable = true;

    constructor(name: string, collidable: boolean) {
        this.name = c
    }
}*/

export type StaticBlockInterface = {
    readonly name: string
    readonly collide: boolean
    readonly visible: boolean
    readonly kill: boolean
    readonly special: boolean
    readonly animate: boolean
    readonly size: {
        readonly x: number
        readonly y: number
    }
    readonly offset: {
        readonly x: number
        readonly y: number
    }
}

// TODO: fix the size property, as it's currently seen
// as "needed", when it shouldn't be.

export interface DynamicBlockInterface {
    name: string
    collide: boolean
    visible: boolean
    kill: boolean
    special: boolean
    animate: boolean
    size: {
        x: number
        y: number
    }
    offset: {
        x: number
        y: number
    }
}

export type BlockInterface = StaticBlockInterface | DynamicBlockInterface

//interface SpecialBlockInterface extends DynamicBlockInterface {
//    sx: number // width
//    sy: number // height
//}
