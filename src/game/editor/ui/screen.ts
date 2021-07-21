import calculateOutline from "../../core/calculateoutline"
import { entityData } from "../../core/jsonmodule"
import { Entity } from "../../core/levelstructure"
import { chunkArray, create2DNumberArray } from "../../core/misc/other"
import { Point } from "../tools"

/**
 * Screens can visually show levelpack data.
 */
export class Screen {
    private _x: number
    private _y: number
    private _zoom: number
    background: Phaser.GameObjects.Image
    map: Phaser.Tilemaps.Tilemap
    layer: Phaser.Tilemaps.TilemapLayer
    outlineLayer: Phaser.Tilemaps.TilemapLayer
    entitycontainer: Phaser.GameObjects.Container
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
        this.layer.setScale(this._zoom);
        this.outlineLayer.setScale(this._zoom);
        this.background.setScale(this._zoom * 0.6);
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
        const e = this.scene.make.tilemap({
            data: create2DNumberArray(32, 18),
            tileWidth: 30,
            tileHeight: 30,
        })
        this.map.addTilesetImage("core_tileset", "core_tileset");
        this.layer = this.map.createLayer(0, "core_tileset");
        this.layer.fill(-2);

        e.addTilesetImage("outline_tileset", "outline_tileset");
        this.outlineLayer = e.createLayer(0, "outline_tileset");
        this.outlineLayer.fill(-2);

        this.entitycontainer = this.scene.add.container(x, y);
    }

    /**
     * Renders the outline layer
     */
    private updateOutlineLayer(): void {
        this.outlineLayer.putTilesAt(calculateOutline(this.getData()), 0, 0);
    }

    /**
     * Sets the screen data to the input given.
     * @param data Data to set screen to
     */
    setData(data: number[][]): void {
        this.map.putTilesAt(data, 0, 0);
        this.updateOutlineLayer()
    }

    /**
     * Changes the background to the given number.
     */
    setBackground(num: number): void {
        this.background.setTexture(`background_${num}`)
    }

    /**
     * Unfinished, do not use
     */
    setEntities(entities: Entity[], scene: Phaser.Scene): void {
        this.entitycontainer.removeAll(true)
        for (const entity of entities) {
            const spritedata = entityData.get(entity.name.toLowerCase())?.size ?? { x: 64, y: 64 };
            this.entitycontainer.add(
                scene.add.image(0, 0, entity.name.toLowerCase())
                    .setOrigin(0, 0)
                    .setPosition(entity.x, entity.y)
                    .setDisplaySize(spritedata.x, spritedata.y)
                    .setScale(entity.type === "Character" ? 0.20 : 0.45)
                    .setAlpha(0.85)
            )
        }

    }

    /**
     * Gets and returns the screen data.
     * @returns The screen data in 2D array form.
     */
    getData(): number[][] {
        const indexData = this.layer.getTilesWithin().map((tile) => tile.index)
        return chunkArray(indexData, this.map.width);
    }

    /**
     * Places a tile in the given coordinate.
     * @param tile Tile number to place
     * @param x Block Coord X
     * @param y Block Coord Y
     */
    placeTile(tile: number, x: number, y: number): void {
        this.map.putTileAt(tile, x, y)
        this.updateOutlineLayer()
    }

    /**
     * Updates the map position to the current coords.
     */
    updateMapPos(): void {
        this.layer.setPosition(this._x, this._y);
        this.outlineLayer.setPosition(this._x, this._y);
        this.background.setPosition(this._x, this._y)
        this.entitycontainer.setPosition(this._x, this._y)
    }

    /**
     * Converts block coords to screen coords.
     * @param x Block X
     * @param y Block Y
     * @returns A point in real screen position.
     */
    getRealXYFromCoord(x: number, y: number): Point {
        return {
            x: (x * 30),
            y: (y * 30),
        }
    }
}