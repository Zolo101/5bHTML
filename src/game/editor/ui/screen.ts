import { create2DNumberArray } from "../../core/misc/other"
import editorScene from "../editor"
import ToolWidgetBar from "./toolwidget"

export class Screen {
    x: number
    y: number
    map: Phaser.Tilemaps.Tilemap
    tiles: Phaser.Tilemaps.Tileset
    layer: Phaser.Tilemaps.TilemapLayer
    zoom: number
    scene: Phaser.Scene

    constructor(x: number, y: number, width: number, height: number, scene: editorScene, tools: ToolWidgetBar) {
        this.x = x;
        this.y = y;
        this.scene = scene;
        this.zoom = 1
        this.map = this.scene.make.tilemap({
            data: create2DNumberArray(32, 18),
            tileWidth: 30,
            tileHeight: 30,
        })
        this.tiles = this.map.addTilesetImage("core_tileset", "core_tileset");
        this.layer = this.map.createLayer(0, this.tiles);
        this.layer.fill(15)
        // this.map = new Grid(this.x, this.y, this, scene, 32, 18, this.zoom);
    }

    getData(): number[][] {
        const data = this.layer.culledTiles;
        const indexData = data.map((tile) => tile.index)
        const resultData: number[][] = [];
        const resultBuffer: number[] = [];
        indexData.forEach((tile, i) => {
            if (i % this.map.width === 0) {
                resultData.push(resultBuffer)
                resultBuffer.length = 0;
            }
            resultBuffer.push(tile);
        })

        return resultData;
    }

    placeTile(tile: number, x: number, y: number): void {
        this.map.putTileAt(tile, x, y)
    }

    updateMapPos(): void {
        this.layer.setPosition(this.x, this.y);
    }

    changeZoom(zoom: number): void {
        this.layer.scale += zoom;
    }

    resetZoom(): void {
        this.zoom = 1;
    }
}