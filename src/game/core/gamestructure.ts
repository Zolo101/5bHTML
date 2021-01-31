import LevelManager from "./classes/levelmanager";
import { LevelData } from "./levelstructure";

export interface gameSceneType extends Phaser.Scene {
    // Core vars, do not touch
    levelnumber: number
    blocksize: number
    levelfile: LevelData
    // block!: BlockInterface[]
    background: Phaser.GameObjects.Image

    levelmanager: LevelManager

    init(): void
    create(): void
    update(): void
}

export default gameSceneType;