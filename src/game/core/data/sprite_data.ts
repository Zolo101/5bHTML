import { SpriteType } from "../classes/sprite";

const spritedata: Map<string, SpriteType> = new Map();
spritedata.set("book", {
    name: "book",
    type: "character",
    friction: 2.8,
    size: {
        x: 47,
        y: 49
    }
})

spritedata.set("match", {
    name: "match",
    type: "character",
    size: {
        x: 128,
        y: 128
    }
})

spritedata.set("icecube", {
    name: "icecube",
    type: "character",
    size: {
        x: 128,
        y: 128
    }
})

spritedata.set("crate", {
    name: "crate",
    type: "sprite",
    mass: 5,
    size: {
        x: 42,
        y: 42
    }
})

spritedata.set("metal", {
    name: "metal",
    type: "sprite",
    mass: 6.5,
    size: {
        x: 53,
        y: 53
    }
})

spritedata.set("parcel", {
    name: "parcel",
    type: "sprite",
    mass: 4,
    size: {
        x: 56,
        y: 33
    }
})

spritedata.set("finish", {
    name: "finish",
    type: "sprite",
    mass: -1,
    size: {
        x: 62,
        y: 121
    }
})

export default spritedata;