import { SpriteType } from "../classes/sprite";

export default [
    {
        name: "book",
        type: "character",
        size: {
            x: 128,
            y: 128
        }
    },
    {
        name: "match",
        type: "character",
        size: {
            x: 128,
            y: 128
        }
    },
    {
        name: "icecube",
        type: "character",
        size: {
            x: 128,
            y: 128
        }
    },

    {
        name: "crate",
        type: "sprite",
        mass: 5,
        size: {
            x: 128,
            y: 128
        }
    },
    {
        name: "metalbox",
        type: "sprite",
        mass: 8,
        size: {
            x: 128,
            y: 128
        }
    },
    {
        name: "package",
        type: "sprite",
        mass: 4,
        size: {
            x: 256,
            y: 128
        }
    }
] as SpriteType[]