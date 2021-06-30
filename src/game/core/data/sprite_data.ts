import { SpriteType } from "../classes/sprite";

const spritedata: Map<string, SpriteType> = new Map();
spritedata.set("book", {
    name: "book",
    type: "character",
    friction: 2.8,
    size: {
        x: 128,
        y: 128
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
        x: 128,
        y: 128
    }
})

spritedata.set("metal", {
    name: "metal",
    type: "sprite",
    mass: 6.5,
    size: {
        x: 128,
        y: 128
    }
})

spritedata.set("parcel", {
    name: "parcel",
    type: "sprite",
    mass: 4,
    size: {
        x: 256,
        y: 128
    }
})

export default spritedata;