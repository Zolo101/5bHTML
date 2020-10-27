import { Block } from "../classes/block";
export default [
    // name
    // cancollide
    // visible
    // cankill
    // special
    // animate
    // tile
    new Block("/", true, true, false, false, false, 1),
    new Block("6", false, false, false, false, false),
    new Block("4", false, true, false, true, false) // Finish block
        .setSize(60, 120)
        .setOffset(-15, 0)
        .setTextureName("finish")
        .setCollisionCallback((lm) => {
            if ((lm.levelnumber + 1 < lm.hardlimitlevel) && lm.currentcharacter.active) {
                lm.levelnumber += 1;
                lm.setLevel(lm.levelnumber + 1);
            }
        }),
    new Block(":", false, true, false, false, false), // Wintoken
    new Block("5", false, true, false, true, false)
        .setSize(150, 180),
    new Block(">", true, true, false, false, true),
    new Block("7", false, true, false, false, false, 6),
    new Block("0", false, true, true, false, false, 2)
        .setSides(true, true, true, true),
    new Block("1", false, true, true, false, false, 3)
        .setSides(true, true, true, true),
    new Block("2", false, true, true, false, false, 4)
        .setSides(true, true, true, true),
    new Block("3", false, true, true, false, false, 5)
        .setSides(true, true, true, true),
    /*
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
    */
]