import { SpecialBlock, SimpleBlock } from "../classes/block";
export default [
    {
        name: "/",
        canCollide: true,
        visible: true,
        canKill: false,
        special: false,
        tile: 1
    },
    {
        name: "6",
        canCollide: false,
        visible: false,
        canKill: false,
        special: false
    },
    {
        name: "4",
        canCollide: false,
        visible: true,
        canKill: false,
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
        canCollide: false,
        visible: true,
        canKill: false,
        special: false
    },
    {
        name: "5",
        canCollide: false,
        visible: true,
        canKill: false,
        animate: true,
        size: {
            x: 150,
            y: 180
        }
    },
    {
        name: ">",
        canCollide: true,
        visible: true,
        canKill: false,
        animate: true,
        special: false
    },
    {
        name: "7",
        canCollide: false,
        visible: true,
        canKill: false,
        special: false,
        tile: 6
    },
    {
        name: "0",
        canCollide: false,
        visible: true,
        canKill: true,
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
        canCollide: false,
        visible: true,
        canKill: true,
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
        canCollide: false,
        visible: true,
        canKill: true,
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
        canCollide: false,
        visible: true,
        canKill: true,
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