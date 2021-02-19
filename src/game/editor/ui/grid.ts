import { create2DNumberArray } from "../../core/misc/other";
import editorScene from "../editor";
import { Point } from "../tools";
import { Screen } from "./screen";
import ToolWidgetBar from "./toolwidget";

/**
 * @deprecated Use Phaser's Tilemapping instead.
 */
export class Grid {
    x: number
    y: number
    width: number
    height: number
    zoom: number
    parent: Screen

    toolbar: ToolWidgetBar

    blockData: number[][]
    gameObject: Phaser.GameObjects.Container
    history!: ActionHistory

    constructor(x: number, y: number, screen: Screen, scene: editorScene, width = 32, height = 18, zoom = 1) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.zoom = zoom;
        this.blockData = create2DNumberArray(width, height);
        this.parent = screen;
        this.toolbar = scene.tools;
        this.gameObject = new Phaser.GameObjects.Container(scene, 0, 0);
        const background = new Phaser.GameObjects.Image(scene, 0, 0, "background_0").setDisplaySize(960, 540)
        const grid = new Phaser.GameObjects.Grid(scene, 0, 0, 960, 540, 30, 30, 0xcccccc, 64)
            .setInteractive({draggable: true})
            .on("drag", () => {
                const clickBlocks = scene.tools.selected.onClick(this.calcuateGridMousePos(grid, scene), this)
                for (const block of clickBlocks) {
                    this.placeBlock(block, scene)
                }
            })
            .on("pointerover", () => {
                //const hoverBlocks = scene.tools.selected.renderHover(this.calcuateGridMousePos(grid, scene), this)
                //for (const block of hoverBlocks) {
                //    //scene.add.rectangle(block.x * 30, block.y * 30, 30, 30, 0x00ff00)
                //}
            })
            .on("pointerdown", () => {
                const clickBlocks = scene.tools.selected.onClick(this.calcuateGridMousePos(grid, scene), this)
                for (const block of clickBlocks) {
                    this.placeBlock(block, scene)
                }
            })
        this.gameObject.add(background)
        this.gameObject.add(grid)
    }

    render(x: number, y: number, zoom: number, scene: Phaser.Scene): void {
        this.x = x;
        this.y = y;
        this.zoom = zoom;
        // For now just make a grid
        this.gameObject.setPosition(x, y).setScale(zoom);
        this.gameObject
        scene.add.existing(this.gameObject);
    }

    place(x: number, y: number, tile = 0): void {
        // console.log(x, y)
        if (this.blockExists(y, x)) this.blockData[y][x] = tile;
    }

    calcuateGridMousePos(gridObject: Phaser.GameObjects.Grid, scene: Phaser.Scene): Phaser.Math.Vector2 {
        const startPos = new Phaser.Math.Vector2(this.x, this.y);
        const blockSize = gridObject.cellWidth;//* ((this.zoom === 1) ? 1 : this.zoom)
        const truePos = scene.input.activePointer;
        const addVector = new Phaser.Math.Vector2(this.width / 2, this.height / 2)

        const finalPos = truePos.position.subtract(startPos);

        const blockPos = new Phaser.Math.Vector2(
            Math.floor(finalPos.x / blockSize),
            Math.floor(finalPos.y / blockSize)
        ).add(addVector);
        // console.log(blockPos)

        return blockPos
    }

    placeBlock(pos: Phaser.Math.Vector2 | Point, scene: Phaser.Scene, tile = "missing"): void {
        // skip if block already exists (temp)
        if (pos.x >= 32 || pos.y >= 18) return
        if (pos.x < 0 || pos.y < 0) return
        // if (this.blockExists(pos.x, pos.y)) return;
        this.gameObject.add(new Phaser.GameObjects.Image(
            scene,
            (pos.x - 16) * 30 + 15,
            (pos.y - 9) * 30 + 15,
            tile
        ).setDisplaySize(30, 30));
        // console.log(pos)
        // console.log(this.blockData)
        this.place(pos.x, pos.y)
    }

    getBlock(x: number, y: number): number {
        // returns -1 (air) if non existant
        return (this.blockExists(x, y)) ? this.blockData[x][y] : -1
    }

    blockExists(x: number, y: number): boolean {
        try {
            this.blockData[x][y]
        } catch {
            return false;
        }
        return true;
    }
}