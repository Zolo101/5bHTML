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
        mass: 40,
        size: {
            x: 128,
            y: 128
        }
    },
    {
        name: "metalbox",
        type: "sprite",
        mass: 80,
        size: {
            x: 128,
            y: 128
        }
    },
    {
        name: "package",
        type: "sprite",
        mass: 20,
        size: {
            x: 256,
            y: 128
        }
    }
] as SpriteType[]