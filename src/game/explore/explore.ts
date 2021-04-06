import { textStyle, backStyle, levelnameStyle, titleStyle } from "../core/buttons";
import { APIData, APIResponse, c_addSaves, c_clear, c_getLocalStorage, c_push, c_saves } from "../core/misc/dataidb";
import { Screen } from "../editor/ui/screen";

const SERVER_NAME = "https://5beam.zelo.dev";
// const SERVER_NAME = "http://localhost:3000";
const levelelements: LevelItem[] = [];
let epochtimetext: Phaser.GameObjects.Text;
let infoText: Phaser.GameObjects.Text;
let pageText: Phaser.GameObjects.Text;

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

class LevelItem {
    x: number
    y: number
    meta: APIData
    tile!: Phaser.GameObjects.Container
    screen!: Screen

    constructor(x: number, y: number, meta: APIData, scene: Phaser.Scene) {
        this.x = x;
        this.y = y;
        this.meta = meta;

        this.tile = new Phaser.GameObjects.Container(scene)

        // RECTANGLE
        this.tile.add(
            new Phaser.GameObjects.Rectangle(scene, x, y, 220, 170, 0x333333)
                .setOrigin(0, 0)
        );
        // TITLE
        this.tile.add(
            new Phaser.GameObjects.Text(scene, x + 4, y + 125, meta.name, textStyle)
                .setFontStyle("bold")
        );
        // AUTHOR
        this.tile.add(
            new Phaser.GameObjects.Text(scene, x + 4, y + 140, `By: ${meta.author}`, textStyle)
        );
    }

    render(scene: Phaser.Scene): void {
        scene.add.container(this.tile.x, this.tile.y, this.tile);
        try {
            this.screen = new Screen(this.x + 4, this.y + 4, scene);
            this.screen.setData(this.meta.levels[0].data);
            this.screen.changeZoom(-0.78);
            this.screen.updateMapPos();
        } catch (error) {
            console.error(error)
            this.tile.add(
                new Phaser.GameObjects.Text(scene, this.x + 40, this.y, "?", titleStyle).setFontSize(140)
            )
        }
    }
}

class exploreScene extends Phaser.Scene {
    // selectedlevel!: APIData
    levels: Map<number, APIData[]>
    page: number
    refreshing: boolean

    constructor() {
        super({ key: "exploreScene" });
        this.levels = new Map();
        this.page = 0;
        this.refreshing = false;
    }

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

        /*
        const featuredbutton = this.add.text(
            30, 50, "FEATURED", exploreButtonStyle,
        );

        const newbutton = this.add.text(
            340, 50, "NEW", exploreButtonStyle,
        );

        const topbutton = this.add.text(
            580, 50, "TOP", exploreButtonStyle,
        ); */

        //const helpbutton = this.add.text(
        //    860, 50, "?", helpButtonStyle,
        //).setFontSize(42);

        const refreshbutton = this.add.text(
            30, 475, "REFRESH", helpButtonStyle,
        ).setInteractive();

        refreshbutton.on("pointerdown", () => {
            this.refreshPage();
        });

        pageText = this.add.text(440, 475, "", levelnameStyle).setAlign("center");
        infoText = this.add.text(30, 40, "", levelnameStyle);

        this.add.text(370, 475, "◀︎", textStyle)
            .setFontSize(32)
            .setBackgroundColor("#222")
            .setInteractive()
            .on("pointerdown", () => {
                if (this.page > 0) {
                    this.page -= 1
                    this.renderPage()
                }
            });

        this.add.text(500, 475, "▶︎", textStyle)
            .setFontSize(32)
            .setBackgroundColor("#222")
            .setInteractive()
            .on("pointerdown", () => {
                this.page += 1
                this.renderPage();
            });

        // gets all the levels from the localstorage
        c_getLocalStorage();

        // has it been 30 MINUTES since the last refresh?
        if (Date.now() > c_saves.time + (1000 * 60 * 30) && c_saves.data.has(this.page)) {
            this.refreshPage();
        } else {
            console.log("Using Cache")
            this.levels = c_saves.data;
            this.renderPage()
        }

    }

    update(): void {
        const epochtime = Date.now();
        // console.log(epochtime);
        epochtimetext.setText(`${epochtime.toString()} // 5beam.zelo.dev`);
    }

    async refreshPage(): Promise<void> {
        // To avoid double refreshing and as such double API Calls
        if (this.refreshing) return;
        this.refreshing = true;

        try {
            const pageResponse = await fetchPage(this.page);
            if (pageResponse.status !== "success") throw pageResponse.status
            for (const level of pageResponse.data) {
                level.levels = JSON.parse(level.data);
            }
            console.log(pageResponse)
            this.levels.set(this.page, pageResponse.data);

            console.log(c_saves)
            c_clear(this.page);
            c_addSaves(this.page, pageResponse.data);
            c_push();
        } catch (error) {
            infoText.setText(`Error while fetching:\n${error}`)
            console.error(error)
        }
        console.log("Using API")

        this.refreshing = false;
        this.renderPage();
    }

    async renderPage(): Promise<void> {
        // Make sure that the page being rendered actually has levels
        if (!this.levels.has(this.page)) await this.refreshPage();
        pageText.setText((this.page + 1).toString())

        this.levels.get(this.page)?.forEach((level, i) => {
            const newTile = new LevelItem(
                30 + (230 * (i % 4)),
                (i % 8 > 3) ? 275 : 100,
                level,
                this
            )

            newTile.tile.setInteractive(new Phaser.Geom.Rectangle(newTile.x, newTile.y, 220, 170), Phaser.Geom.Rectangle.Contains)
                .on("pointerdown", () => {
                    this.scene.start("explorelevelScene", { save: level })
                })

            newTile.render(this);
        });
    }
}

async function getAPIRequest(url: string): Promise<APIResponse> {
    infoText.setText("Fetching data...")
    const response = await fetch(url)
    infoText.setText("")
    return await response.json()
}

async function fetchAllLevels(): Promise<APIResponse> {
    return await getAPIRequest(`${SERVER_NAME}/api/all`)
}

async function fetchPage(number: number): Promise<APIResponse> {
    return await getAPIRequest(`${SERVER_NAME}/api/level/page/${number}`)
}

async function fetchLevel(id: number): Promise<APIResponse> {
    return await getAPIRequest(`${SERVER_NAME}/api/level/${id}`)
}

async function fetchLevelData(id: number): Promise<APIResponse> {
    return await getAPIRequest(`${SERVER_NAME}/api/level/get/${id}`)
}

export default exploreScene;