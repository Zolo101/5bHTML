import { create2DNumberArray } from "../../core/misc/other"

export class Screen {
    x: number
    y: number
    background: Phaser.GameObjects.Image
    map: Phaser.Tilemaps.Tilemap
    tiles: Phaser.Tilemaps.Tileset
    layer: Phaser.Tilemaps.TilemapLayer
    zoom: number
    scene: Phaser.Scene

    constructor(x: number, y: number, scene: Phaser.Scene) {
        this.x = x;
        this.y = y;
        this.scene = scene;
        this.zoom = 1
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
        // this.map = new Grid(this.x, this.y, this, scene, 32, 18, this.zoom);
    }

    setData(data: number[][]): void {
        this.map.putTilesAt(data, 0, 0);
    }

    getData(): number[][] {
        const indexData = this.layer.culledTiles.map((tile) => tile.index)
        const resultData: number[][] = [];
        for (let i = 0; i < indexData.length; i += this.map.width) {
            resultData.push(indexData.slice(i, i + this.map.width));
        } // chunks

        return resultData;
    }

    placeTile(tile: number, x: number, y: number): void {
        this.map.putTileAt(tile, x, y)
    }

    updateMapPos(): void {
        this.layer.setPosition(this.x, this.y);
        this.background.setPosition(this.x, this.y)
    }

    changeZoom(zoom: number): void {
        this.layer.scale += zoom;
        this.background.scale += (zoom * 0.6);
    }

    resetZoom(): void {
        this.zoom = 1;
    }
}