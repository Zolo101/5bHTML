import { SpecialBlock, SimpleBlock } from "../block";
export default [
    {
        name: "/",
        collide: true,
        visible: true,
        kill: false,
        special: false,
        tile: 1
    },
    {
        name: "6",
        collide: false,
        visible: false,
        kill: false,
        special: false
    },
    {
        name: "4",
        collide: false,
        visible: true,
        kill: false,
        special: true,
        size: {
            x: 60,
            y: 120
        },
        offset: {
            x: -15,
            y: 0
        }
    },
    {
        name: ":",
        collide: false,
        visible: true,
        kill: false,
        special: false
    },
    {
        name: "5",
        collide: false,
        visible: true,
        kill: false,
        animate: true,
        size: {
            x: 150,
            y: 180
        }
    },
    {
        name: ">",
        collide: true,
        visible: true,
        kill: false,
        animate: true,
        special: false
    },
    {
        name: "7",
        collide: false,
        visible: true,
        kill: false,
        special: false,
        tile: 6
    },
    {
        name: "0",
        collide: false,
        visible: true,
        kill: true,
        special: false,
        tile: 2,
        sides: {
            left: true,
            right: true,
            up: true,
            down: true
        }
    },
    {
        name: "1",
        collide: false,
        visible: true,
        kill: true,
        special: false,
        tile: 3,
        sides: {
            left: true,
            right: true,
            up: true,
            down: true
        }
    },
    {
        name: "2",
        collide: false,
        visible: true,
        kill: true,
        special: false,
        tile: 4,
        sides: {
            left: true,
            right: true,
            up: true,
            down: true
        }
    },
    {
        name: "3",
        collide: false,
        visible: true,
        kill: true,
        special: false,
        tile: 5,
        sides: {
            left: true,
            right: true,
            up: true,
            down: true
        }
    }
] as unknown as SimpleBlock | SpecialBlock