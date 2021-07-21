import { create2DArray } from "./misc/other";

const outlineTileNum = 6;
const shadowTileNum = 15;

class Neighbours {
    directions: {
        up: boolean
        right: boolean
        down: boolean
        left: boolean

        upright: boolean
        rightbottom: boolean
        leftbottom: boolean
        upleft: boolean
    }

    constructor(data: Partial<Neighbours["directions"]>) {
        this.directions = {
            up: data.up ?? false,
            right: data.right ?? false,
            down: data.down ?? false,
            left:data.left ?? false,

            upright: data.upright ?? false,
            rightbottom: data.rightbottom ?? false,
            leftbottom: data.leftbottom ?? false,
            upleft: data.upleft ?? false,
        }
    }

    /**
     * Check two neighbours to see if they are both equal.
     * @param classToCheck Neighbour class to check.
     * @returns Boolean whether of not its equal.
     */
    check(classToCheck: Neighbours): boolean {
        return Object.entries(this.directions).every((direction) => direction[1] === classToCheck.directions[direction[0] as keyof Neighbours["directions"]])
    }

    /**
     * Check only one direction from both neighbours.
     * @param direction Direction from this class.
     * @param classToCheck Direction from other class.
     * @returns Boolean whether of not its equal.
     */
    checkDirection(direction: keyof Neighbours["directions"], classToCheck: Neighbours): boolean {
        return this.directions[direction] === classToCheck.directions[direction]
    }
}

function calculateOutline(data: number[][]): number[][] {
    const neighbourData = create2DArray(data[0].length, data.length, () => new Neighbours({}))
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            if (data[i - 1] === undefined && data[i +  1] === undefined) continue
            const centerNum = data[i    ][j    ];
            const upNum     = (data[i - 1] !== undefined) ? data[i - 1][j    ] : outlineTileNum;
            const rightNum  = data[i    ][j + 1] ?? outlineTileNum;
            const downNum   = (data[i + 1] !== undefined) ? data[i + 1][j    ] : outlineTileNum;
            const leftNum = data[i][j - 1] ?? outlineTileNum;

            // const upRightNum    = (data[i - 1] !== undefined && data[i + 1] !== undefined) ? data[i - 1][j + 1] : outlineTileNum;
            // const upLeftNum     = (data[i - 1] !== undefined && data[i - 1] !== undefined) ? data[i - 1][j - 1] : outlineTileNum;
            // const downRightNum  = (data[i + 1] !== undefined && data[i + 1] !== undefined) ? data[i + 1][j + 1] : outlineTileNum;
            // const downLeftNum   = (data[i + 1] !== undefined && data[i - 1] !== undefined) ? data[i + 1][j - 1] : outlineTileNum;

            if (centerNum === outlineTileNum) {
            // console.log(centerNum, upNum)
                if (centerNum === upNum) {
                    neighbourData[i][j].directions.up = true;
                }
                if (centerNum === rightNum) {
                    neighbourData[i][j].directions.right = true;
                }
                if (centerNum === downNum) {
                    neighbourData[i][j].directions.down = true;
                }
                if (centerNum === leftNum) {
                    neighbourData[i][j].directions.left = true;
                }
                if (centerNum === upNum && centerNum === rightNum) {
                    neighbourData[i][j].directions.upright = true;
                }
                if (centerNum === upNum && centerNum === leftNum) {
                    neighbourData[i][j].directions.upleft = true;
                }
                if (centerNum === downNum && centerNum === rightNum) {
                    neighbourData[i][j].directions.rightbottom = true;
                }
                if (centerNum === downNum && centerNum === leftNum) {
                    neighbourData[i][j].directions.leftbottom = true;
                }
            }
        }
    }


    // 0 = 1 right
    const right = new Neighbours({right: true})
    // 1 = 1 down
    const down = new Neighbours({down: true})
    // 2 = 1 left
    const left = new Neighbours({left: true})
    // 3 = 1 up
    const up = new Neighbours({ up: true })

    const upright = new Neighbours({ upright: true })
    const rightbottom = new Neighbours({ rightbottom: true })
    const leftbottom = new Neighbours({ leftbottom: true })
    const upleft = new Neighbours({ upleft: true })
    // 4 = 2 top-right
    // 5 = 2 right-bottom
    // 6 = 2 bottom-left
    // 7 = 2 left-top

    // 8 = 3 no right
    // 9 = 3 no down
    // 10 = 3 no left
    // 11 = 3 no up

    // 12 = 4 all

    // 13 left-right
    // 14 up-down

    // 13 = corner bottom-left
    // 14 = corner top-left
    // 15 = corner top-right
    // 16 = corner bottom-right

    // same for shadows but just +16

    const outlineData = create2DArray(data[0].length, data.length, () => -2)
    for (let i = 0; i < outlineData.length; i++) {
        for (let j = 0; j < outlineData[i].length; j++) {
            let texID = "";
            let shadowTexID = "";
            if (data[i][j] === outlineTileNum) {
                if (!neighbourData[i][j].checkDirection("right", right)) texID += "0"
                if (!neighbourData[i][j].checkDirection("down", down)) texID += "1"
                if (!neighbourData[i][j].checkDirection("left", left)) texID += "2"
                if (!neighbourData[i][j].checkDirection("up", up)) texID += "3"
                // if (!neighbourData[i][j].checkDirection("upright", upright)) texID += "4"
                // if (!neighbourData[i][j].checkDirection("rightbottom", rightbottom)) texID += "5"
                // if (!neighbourData[i][j].checkDirection("leftbottom", leftbottom)) texID += "6"
                // if (!neighbourData[i][j].checkDirection("upleft", upleft)) texID += "7"

                switch (texID) {
                    case "0":
                        outlineData[i][j] = 0
                        break;
                    case "1":
                        outlineData[i][j] = 1
                        break;
                    case "2":
                        outlineData[i][j] = 2
                        break;
                    case "3":
                        outlineData[i][j] = 3
                        break;

                    case "03":
                        outlineData[i][j] = 4
                        break;
                    case "01":
                        outlineData[i][j] = 5
                        break;
                    case "12":
                        outlineData[i][j] = 6
                        break;
                    case "23":
                        outlineData[i][j] = 7
                        break;

                    case "123":
                        outlineData[i][j] = 8
                        break;
                    case "023":
                        outlineData[i][j] = 9
                        break;
                    case "013":
                        outlineData[i][j] = 10
                        break;
                    case "012":
                        outlineData[i][j] = 11
                        break;

                    case "0123":
                        outlineData[i][j] = 12
                        break;

                    case "02":
                        outlineData[i][j] = 13
                        break;
                    case "13":
                        outlineData[i][j] = 14
                        break;

                        // case "4":
                        //     outlineData[i][j] = 15
                        //     break;
                        // case "5":
                        //     outlineData[i][j] = 16
                        //     break;
                        // case "6":
                        //     outlineData[i][j] = 17
                        //     break;
                        // case "7":
                        //     outlineData[i][j] = 18
                        //     break;

                    default:
                        break;
                }
            } else if (data[i][j] === shadowTileNum) {
                const centerNum = data[i    ][j    ];
                const upNum     = (data[i - 1] !== undefined) ? data[i - 1][j    ] : shadowTileNum;
                const rightNum  = data[i    ][j + 1] ?? shadowTileNum;
                const downNum   = (data[i + 1] !== undefined) ? data[i + 1][j    ] : shadowTileNum;
                const leftNum = data[i][j - 1] ?? shadowTileNum;
                console.log(upNum, rightNum, downNum, leftNum)
                if (!neighbourData[i][j].checkDirection("right", right) && rightNum !== centerNum && rightNum !== 99) shadowTexID += "0"
                if (!neighbourData[i][j].checkDirection("down", down) && downNum !== centerNum && downNum !== 99) shadowTexID += "1"
                if (!neighbourData[i][j].checkDirection("left", left) && leftNum !== centerNum && leftNum !== 99) shadowTexID += "2"
                if (!neighbourData[i][j].checkDirection("up", up) && upNum !== centerNum && upNum !== 99) shadowTexID += "3"

                switch (shadowTexID) {
                    case "0":
                        outlineData[i][j] = 19
                        break;
                    case "1":
                        outlineData[i][j] = 20
                        break;
                    case "2":
                        outlineData[i][j] = 21
                        break;
                    case "3":
                        outlineData[i][j] = 22
                        break;

                    case "03":
                        outlineData[i][j] = 23
                        break;
                    case "01":
                        outlineData[i][j] = 24
                        break;
                    case "12":
                        outlineData[i][j] = 25
                        break;
                    case "23":
                        outlineData[i][j] = 26
                        break;

                    case "123":
                        outlineData[i][j] = 27
                        break;
                    case "023":
                        outlineData[i][j] = 28
                        break;
                    case "013":
                        outlineData[i][j] = 29
                        break;
                    case "012":
                        outlineData[i][j] = 30
                        break;

                    case "0123":
                        outlineData[i][j] = 31
                        break;

                    case "02":
                        outlineData[i][j] = 32
                        break;

                    case "13":
                        outlineData[i][j] = 33
                        break;

                    default:
                        break;
                }
            }
        }
    }

    return outlineData
}

export default calculateOutline;