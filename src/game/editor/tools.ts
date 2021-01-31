import Key from "../core/misc/key";
import { create2DNumberArray } from "../core/misc/other";
import { Grid } from "./ui/grid";
import { ToolWidget } from "./ui/toolwidget";
export type Point = { x: number, y: number }
export type PointArray = Point[]

export const cursorTool = new ToolWidget("Cursor", new Key("1", true), "cursor")
cursorTool.onClick = (pos) => {
    return [{x: pos.x, y: pos.y}]
}
cursorTool.renderHover = (pos, grid) => {
    return cursorTool.onClick(pos, grid);
}

export const selectTool = new ToolWidget("Select", new Key("2", true), "select")
selectTool.onClick = (pos) => {
    return [{x: pos.x, y: pos.y}]
}
selectTool.renderHover = (pos, grid) => {
    return selectTool.onClick(pos, grid);
}


export const pencilTool = new ToolWidget("Pencil", new Key("3", true), "pencil")
pencilTool.onClick = (pos) => {
    return [{x: pos.x, y: pos.y}]
}
pencilTool.renderHover = (pos, grid) => {
    return pencilTool.onClick(pos, grid);
}

export const brushTool = new ToolWidget("Brush", new Key("4", true), "brush")
brushTool.onClick = (pos) => {
    return [
        { x: pos.x, y: pos.y },     // center
        { x: pos.x - 1, y:pos. y }, // left
        { x: pos.x + 1, y: pos.y }, // right
        { x: pos.x, y: pos.y - 1 }, // up
        { x: pos.x, y: pos.y + 1 }, // down
    ]
}
brushTool.renderHover = (pos, grid) => {
    return brushTool.onClick(pos, grid)
}

export const fillTool = new ToolWidget("Fill", new Key("5", true), "fill")
fillTool.onClick = (pos, grid) => {
    /*
    const results: PointArray = [];
    fillGrid(results, grid.blockData, grid, grid.getBlock(pos.x, pos.y), pos.x, pos.y)
    console.log(results)
    return results
    */
    return [{x: pos.x, y: pos.y}]
}
fillTool.renderHover = (pos, grid) => {
    /*
    const results: PointArray = [];
    const tempMap = create2DNumberArray(32, 18)
    fillGrid(results, tempMap, grid, grid.getBlock(pos.x, pos.y), pos.x, pos.y)
    console.log(results)
    return results
    */
    return [{x: pos.x, y: pos.y}]
}

export const eraserTool = new ToolWidget("Eraser", new Key("6", true), "eraser")
eraserTool.onClick = (pos) => {
    return [{x: pos.x, y: pos.y}]
}
eraserTool.renderHover = (pos, grid) => {
    return eraserTool.onClick(pos, grid)
}

export const zoomTool = new ToolWidget("Zoom", new Key("7", true), "zoom")
zoomTool.onClick = (pos) => {
    return [{x: pos.x, y: pos.y}]
}
zoomTool.renderHover = (pos, grid) => {
    return zoomTool.onClick(pos, grid)
}

function fillGrid(
    results: PointArray,
    tempMap: number[][],
    grid: Grid,
    block: number,
    x: number, y: number
): void {
    // https://en.wikipedia.org/wiki/Flood_fill
    // This isnt the most efficient method but until someone
    // complains that the flood fill is too slow im going
    // to use it

    // Is the block even a thing?
    if (!grid.blockExists(x, y)) return

    // Is this the same block type?
    if (tempMap[x][y] !== block) return

    tempMap[x][y] = 1
    results.push({x, y})
    fillGrid(results, tempMap, grid, block, x - 1, y) // left
    fillGrid(results, tempMap, grid, block, x + 1, y) // right
    fillGrid(results, tempMap, grid, block, x, y - 1) // up
    fillGrid(results, tempMap, grid, block, x, y + 1) // down
}
