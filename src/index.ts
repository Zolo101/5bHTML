import Phaser from "phaser";

import loadingScene from "./scenes/loading";
import menuScene from "./scenes/menu";
import levelselectScene from "./scenes/levelselect";
// import settingScene from "./scenes/settingScene";
import editorScene from "./scenes/editor";
import gameScene from "./scenes/game";
import exploreScene from "./scenes/explore";

const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 540,
    // antialias: false,
    // roundPixels: true,
    physics: {
        default: "arcade",
        arcade: {
            // debug: true,
            gravity: { y: 2500 },
        },
    },
    parent: "game",
    scene: [
        loadingScene,
        menuScene,
        levelselectScene,
        gameScene,
        editorScene,
        exploreScene,
    ],
};

const game = new Phaser.Game(config);
