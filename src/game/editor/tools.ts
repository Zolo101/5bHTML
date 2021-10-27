import Key from "../core/misc/key";
import { Screen } from "./ui/screen";
import { ToolWidget } from "./ui/toolwidget";
export type Point = { x: number, y: number }

export const cursorTool = new ToolWidget("Cursor", new Key("1", true), "cursor")
cursorTool.getCoords = (pos) => {
    return []
}

export const selectTool = new ToolWidget("Select", new Key("2", true), "select")
selectTool.getCoords = (pos) => {
    return []
}

export const pencilTool = new ToolWidget("Pencil", new Key("3", true), "pencil")
pencilTool.getCoords = (pos) => {
    return [{x: pos.x, y: pos.y}]
}

export const brushTool = new ToolWidget("Brush", new Key("4", true), "brush")
brushTool.getCoords = (pos) => {
    return [
        { x: pos.x, y: pos.y },     // center
        { x: pos.x - 1, y:pos. y }, // left
        { x: pos.x + 1, y: pos.y }, // right
        { x: pos.x, y: pos.y - 1 }, // up
        { x: pos.x, y: pos.y + 1 }, // down
    ]
}

export const fillTool = new ToolWidget("Fill", new Key("5", true), "fill")
fillTool.getCoords = (pos, screen) => {
    const screenPos = { x: Math.abs(Math.floor(pos.x)), y: Math.abs(Math.floor(pos.y)) };
    return fill(screen, screen.layer.getTileAt(screenPos.x, screenPos.y, false).index, Math.floor(pos.x), Math.floor(pos.y));
}

export const eraserTool = new ToolWidget("Eraser", new Key("6", true), "eraser")
eraserTool.getCoords = (pos) => {
    return [{x: pos.x, y: pos.y}]
}

export const zoomTool = new ToolWidget("Zoom", new Key("7", true), "zoom")
zoomTool.getCoords = (pos) => {
    return [{x: pos.x, y: pos.y}]
}

const insideScreen = (p: Point) => p.x >= 0 && p.y >= 0 && p.x < 32 && p.y < 18;
function fill(screen: Screen, block: number, x: number, y: number): Point[] {
    // https://en.wikipedia.org/wiki/Flood_fill
    // This isnt the most efficient method but until someone
    // complains that the flood fill is too slow im going
    // to use it

    // Queue array
    const arr: Point[] = []

    // Result array
    const result: Set<Point> = new Set();
    arr.push({x, y});

    // Get a snapshot of the map
    const tempMap = screen.getData();

    // N
    let n: Point

    // While the queue is not empty
    while (arr.length > 0) {
        n = arr[0]
        arr.shift();

        if (insideScreen(n) && tempMap[n.y][n.x] === block) {
            result.add({x: n.x, y: n.y});
            tempMap[n.y][n.x] = -1;
            arr.push(
                {x: n.x + 1, y: n.y},
                {x: n.x - 1, y: n.y},
                {x: n.x, y: n.y + 1},
                {x: n.x, y: n.y - 1},
            )
        }
    }

    return Array.from(result.values());
}
