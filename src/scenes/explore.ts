import { textStyle, backStyle, levelnameStyle } from "../game/core/buttons";
import { Level } from "../game/core/levelstructure";

const SERVER_NAME = "https://5beam.zelo.dev"; // http://localhost:3000
const levelelements: LevelItem[] = [];
let epochtimetext: Phaser.GameObjects.Text;
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

class LevelItem {
    meta: APIData
    tile!: Phaser.GameObjects.Container
    constructor(
        x: number,
        y: number,
        meta: APIData,
        scene: Phaser.Scene
    ) {
        this.meta = meta;

        this.tile = new Phaser.GameObjects.Container(scene)
        // RECTANGLE
        this.tile.add(
            new Phaser.GameObjects.Rectangle(scene, x, y, 625, 40, 0x333333).setOrigin(0, 0)
        );
        // TITLE
        this.tile.add(
            new Phaser.GameObjects.Text(scene, x + 10, y + 10, meta.name, textStyle).setFontStyle("bold")
        );
        // AUTHOR
        this.tile.add(
            new Phaser.GameObjects.Text(scene, x + 610, y + 10, `By: ${meta.author}`, textStyle).setOrigin(1, 0)
        );
    }

    render(scene: Phaser.Scene): void {
        scene.add.container(this.tile.x, this.tile.y, this.tile)
    }
}

class exploreScene extends Phaser.Scene {
    selectedlevel!: APIData

    constructor() { super({ key: "exploreScene" }); }

    create(): void {
        // Background
        this.add.rectangle(0, 0, 960, 540, 0x375342).setOrigin(0, 0);

        epochtimetext = this.add.text(10, 5, "awaiting time...", textStyle)
            .setFontSize(24)
            .setFontStyle("bold")
            .setColor("#507860");

        const backButton = this.add.text(
            800, 475, "BACK", backStyle,
        ).setInteractive();

        backButton.on("pointerdown", () => {
            document.body.style.backgroundColor = "initial";
            this.scene.start("menuScene");
        });

        this.add.text(this.scale.width - 300, this.scale.height - 35, "5beam.zelo.dev")

        /*

        const featuredbutton = this.add.text(
            30, 50, "FEATURED", exploreButtonStyle,
        );

        const newbutton = this.add.text(
            340, 50, "NEW", exploreButtonStyle,
        );

        const topbutton = this.add.text(
            580, 50, "TOP", exploreButtonStyle,
        );

        */

        //const helpbutton = this.add.text(
        //    860, 50, "?", helpButtonStyle,
        //).setFontSize(42);

        const refreshbutton = this.add.text(
            30, 475, "REFRESH", helpButtonStyle,
        ).setInteractive();

        refreshbutton.on("pointerdown", () => {
            this.refresh();
        });

        /*

        const fivebeambutton = this.add.text(
            220, 475, "WEBSITE", helpButtonStyle,
        ).setInteractive().setBackgroundColor("#476");

        fivebeambutton.on("pointerdown", () => {
            openExternalLink("https://5beam.zelo.dev/");
        });

        const tutorialbutton = this.add.text(
            460, 475, "TUTORIAL", helpButtonStyle,
        ).setInteractive().setBackgroundColor("#b64");

        tutorialbutton.on("pointerdown", () => {
            openExternalLink("https://gist.github.com/Zolo101/36ae33e5dd15510a2cb41e942dbf7044");
        }); */

        infoText = this.add.text(200, this.scale.height - 80, "", levelnameStyle);

        this.refresh();
    }

    update(): void {
        const epochtime = Date.now();
        // console.log(epochtime);
        epochtimetext.setText(`${epochtime.toString()} // custom levels`);
    }

    async refresh(): Promise<void> {
        try {
            const levels = await fetchAllLevels();
            if (await checkForStatus(levels.status)) throw levels.status;
            // const list = new List(700, 400, this);
            console.log(levels)
            levels.data.forEach((level: any, i: number) => {
                const newTile = new LevelItem(
                    30, 50 + (i * 50), level, this
                    // this, 150, (i * 50), level.name, level.author
                )
                newTile.tile.on("pointerdown", async () => {
                    const leveldata = await fetchLevelData(i)
                    console.log(leveldata)
                })
                if (i > 7) return;
                newTile.render(this);
            })
            infoText.setText("")
        } catch (err) {
            infoText.setText(`Error while fetching:\n${err}`)
            console.error(err)
            return;
        }

        /*
        fetch("http://localhost:3000/api/all" "https://5beam.zelo.dev/api/5bhtml")
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
        */
    }
}

async function getAPIRequest(url: string): Promise<any> {
    infoText.setText("Fetching data...")
    const response = await fetch(url)
    return await response.json()
}

async function fetchAllLevels(): Promise<any> {
    return await getAPIRequest(`${SERVER_NAME}/api/all`)
}

async function fetchLevel(id: number): Promise<any> {
    return await getAPIRequest(`${SERVER_NAME}/api/level/${id}`)
}

async function fetchLevelData(id: number): Promise<any> {
    return await getAPIRequest(`${SERVER_NAME}/api/level/get/${id}`)
}

async function checkForStatus(status: string): Promise<boolean> {
    return (status !== "success")
}

export default exploreScene;
