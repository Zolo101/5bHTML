import editorScene from "../editor"
import { Grid } from "./grid"
import ToolWidgetBar from "./toolwidget"

export class Screen {
    x: number
    y: number
    grid: Grid
    zoom: number
    scene: Phaser.Scene

    constructor(x: number, y: number, width: number, height: number, scene: editorScene, tools: ToolWidgetBar) {
        this.x = x;
        this.y = y;
        this.scene = scene;
        this.zoom = 1
        this.grid = new Grid(this.x, this.y, this, scene, 32, 18, this.zoom);
    }

    render(): void {
        this.grid.render(this.x, this.y, this.zoom, this.scene)
    }

    changeZoom(zoom: number): void {
        this.zoom += zoom;
        this.render();
    }

    resetZoom(): void {
        this.zoom = 1;
        this.render();
    }
}