import { textStyle, backStyle, levelnameStyle } from "../game/core/buttons";
import { Level } from "../game/core/levelstructure";
import { openExternalLink } from "../game/core/misc/other";

let epochtimetext: Phaser.GameObjects.Text;
const levelelements: LevelTile[] = [];
let infoText: Phaser.GameObjects.Text;

const exploreButtonStyle = {
    fontFamily: "Helvetica, Arial, sans-serif",
    fontSize: "28px",
    fontStyle: "bold",
    align: "center",
    // fixedWidth: 100,
    // fixedHeight: 50,
    backgroundColor: "#333",
    padding: {
        y: 4,
        x: 60,
    },
};

const levelnameButtonStyle = {
    fontFamily: "Helvetica, Arial, sans-serif",
    fontSize: "28px",
    backgroundColor: "#444",
    padding: {
        y: 4,
        x: 10,
    },
};

const helpButtonStyle = {
    fontFamily: "Helvetica, Arial, sans-serif",
    fontSize: "28px",
    fontStyle: "bold",
    align: "center",
    backgroundColor: "#336",
    padding: {
        y: 4,
        x: 10,
    },
};

type APIData = {
    id: number
    name: string
    author: string
    description: string
    version: number
    levelversion: string
    levels: Level[]
}


class LevelTile {
    scene!: Phaser.Scene
    // thumbnail: Phaser.GameObjects.Rectangle
    text: Phaser.GameObjects.Text
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        public name: string = "Undefined Level",
        public author: string = "John Doe",
        public views: number = 0,
    ) {
        this.name = name;
        this.author = author;
        this.views = views;

        // this.thumbnail = scene.add.rectangle(x, y, 225, 140, 0x333333);
        this.text = scene.add.text(
            x - 110, y + 80,
            `"${name}" By: ${author}`,
            levelnameButtonStyle,
        ).setInteractive();
    }
}

class exploreScene extends Phaser.Scene {
    constructor() { super({ key: "exploreScene" }); }

    create(): void {
        // Background
        this.add.rectangle(0, 0, 960, 540, 0x375342).setOrigin(0, 0);

        epochtimetext = this.add.text(0, 0, "awaiting time...", textStyle)
            .setFontSize(32)
            .setFontStyle("bold")
            .setColor("#507860");

        const backButton = this.add.text(
            800, 475, "BACK", backStyle,
        ).setInteractive();

        backButton.on("pointerdown", () => {
            document.body.style.backgroundColor = "initial";
            this.scene.start("menuScene");
        });

        const featuredbutton = this.add.text(
            30, 50, "FEATURED", exploreButtonStyle,
        );

        const newbutton = this.add.text(
            340, 50, "NEW", exploreButtonStyle,
        );

        const topbutton = this.add.text(
            580, 50, "TOP", exploreButtonStyle,
        );

        //const helpbutton = this.add.text(
        //    860, 50, "?", helpButtonStyle,
        //).setFontSize(42);

        const refreshbutton = this.add.text(
            30, 475, "REFRESH", helpButtonStyle,
        ).setInteractive();

        refreshbutton.on("pointerdown", () => {
            this.refresh();
        });

        const fivebeambutton = this.add.text(
            220, 475, "WEBSITE", helpButtonStyle,
        ).setInteractive().setBackgroundColor("#476");

        fivebeambutton.on("pointerdown", () => {
            openExternalLink("https://5beam.zelo.dev/");
        });

        /*
        const tutorialbutton = this.add.text(
            460, 475, "TUTORIAL", helpButtonStyle,
        ).setInteractive().setBackgroundColor("#b64");

        tutorialbutton.on("pointerdown", () => {
            openExternalLink("https://gist.github.com/Zolo101/36ae33e5dd15510a2cb41e942dbf7044");
        }); */

        infoText = this.add.text(118, 240, "", levelnameStyle);

        this.add.text(100, 100, "5beam (the custom level server) is currently offline\n for upgrades. Check back soon!", levelnameStyle)

        //this.refresh();
    }

    // eslint-disable-next-line class-methods-use-this
    update(): void {
        const epochtime = Date.now();
        // console.log(epochtime);
        epochtimetext.setText(`${epochtime.toString()} // custom levels`);
    }

    refresh(): void {
        fetch("https://5beam.zelo.dev/api/5bhtml")
            .then((response) => response.json().then((levels: APIData[]) => {
                infoText.setText("Fetching data...")
                levels.forEach((level, i) => {
                    const newtile = new LevelTile(
                        this, 150, (i * 40), level.name, level.author,
                    );
                    newtile.text.on("pointerdown", () => {
                        fetch(`https://5beam.zelo.dev/get/${level.id}`)
                            .then((response) => response.text().then((data: string) => {
                                let escapedData = data
                                escapedData = escapedData.substring(4, escapedData.length - 4)
                                // eslint-disable-next-line quotes
                                escapedData = escapedData.replace(/\\\\\\"/g, '"')

                                const parsedData = JSON.parse(escapedData) as Level[]
                                if ((parsedData.length) === undefined) {
                                    level.levels = [] as Level[]
                                    level.levels.push(parsedData as unknown as Level)
                                } else {
                                    level.levels = parsedData as Level[]
                                }
                                console.log(level)

                                // Start level
                                this.scene.start("gameScene", {
                                    levelfile: level,
                                    levelnumber: 1,
                                });
                            }).catch((error) => {
                                this.add.text(100, 300, "Error getting level data!");
                                return console.error(error);
                            }));
                    });
                    levelelements.push(newtile);
                });
                if (levels.length === 0) {
                    infoText.setText("Nobody's uploaded any levels yet! Be the first :)")
                } else {
                    infoText.setText("")
                }
            }))
            .catch((error) => {
                infoText
                    .setText("Error refreshing! Maybe 5beam is offline!")
                    .setColor("#f00")
                return console.error(error);
            });
        levelelements.length = 0; // empty array
    }
}

export default exploreScene;
