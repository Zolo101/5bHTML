import { chunkArray, create2DNumberArray } from "../../core/misc/other"
import { Point } from "../tools"

export class Screen {
    private _x: number
    private _y: number
    private _zoom: number
    background: Phaser.GameObjects.Image
    map: Phaser.Tilemaps.Tilemap
    tiles: Phaser.Tilemaps.Tileset
    layer: Phaser.Tilemaps.TilemapLayer
    scene: Phaser.Scene

    get x(): number {return this._x}
    set x(x: number) {
        this._x = x;
        this.updateMapPos();
    }

    get y(): number {return this._y}
    set y(y: number) {
        this._y = y;
        this.updateMapPos();
    }

    get zoom(): number {return this._zoom}
    set zoom(zoom: number) {
        this._zoom = zoom;
        this.layer.scale = this._zoom;
        this.background.scale = (this._zoom * 0.6);
    }


    constructor(x: number, y: number, scene: Phaser.Scene) {
        this._x = x;
        this._y = y;
        this._zoom = 1
        this.scene = scene;
        this.background = this.scene.add.image(x, y, "background_0")
            .setOrigin(0, 0)
            .setScale(0.6, 0.6)
        this.map = this.scene.make.tilemap({
            data: create2DNumberArray(32, 18),
            tileWidth: 30,
            tileHeight: 30,
        })
        this.tiles = this.map.addTilesetImage("core_tileset", "core_tileset");
        this.layer = this.map.createLayer(0, this.tiles);
        this.layer.fill(99);
    }

    setData(data: number[][]): void {
        this.map.putTilesAt(data, 0, 0);
    }

    getData(): number[][] {
        const indexData = this.layer.culledTiles.map((tile) => tile.index)
        return chunkArray(indexData, this.map.width);
    }

    placeTile(tile: number, x: number, y: number): void {
        this.map.putTileAt(tile, x, y)
    }

    updateMapPos(): void {
        this.layer.setPosition(this._x, this._y);
        this.background.setPosition(this._x, this._y)
    }

    getRealXYFromCoord(x: number, y: number): Point {
        return {
            x: (x * 30),
            y: (y * 30),
        }
    }
}