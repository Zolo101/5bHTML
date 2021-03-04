import Phaser from "phaser";
import "./styles.css";

import loadingScene from "./scenes/loading";
import menuScene from "./scenes/menu";
import levelselectScene from "./scenes/levelselect";

import editorScene from "./game/editor/editor";
import saveScene from "./game/editor/savescene";

import gameScene from "./scenes/game";
import exploreScene from "./scenes/explore";
import newScene from "./scenes/new";
import Settings from "./game/settingsgame";
import settingsScene from "./scenes/settings";
import menuOldScene from "./game/core/misc/menuold";

const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 540,
    // antialias: false,
    // roundPixels: true,
    // pixelArt: true,
    // zoom: 0.8,
    physics: {
        default: "arcade",
        arcade: {
            debug: Settings.IS_DEBUG,
            gravity: { y: 2500 },
        },
    },
    parent: "game",
    scene: [
        loadingScene,
        menuScene,
        menuOldScene,
        levelselectScene,
        gameScene,

        editorScene,
        saveScene,

        settingsScene,
        exploreScene,
        newScene,
    ],
};

new Phaser.Game(config);
