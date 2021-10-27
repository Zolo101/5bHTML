import { textStyle, levelnameStyle, titleStyle, createBackButton } from "../core/buttons";
import { APIData, APIResponse, c_saves, onlineLevelpackCache } from "../core/misc/dataidb";
import { truncate } from "../core/misc/other";
import Alert from "../editor/ui/alert";
import NumInc from "../editor/ui/numinc";
import { Screen } from "../editor/ui/screen";
import { EXPLORE_SEVRER_URL } from "../settingsgame";

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
            new Phaser.GameObjects.Text(scene, x + 4, y + 125, truncate(meta.name, 26), textStyle)
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
            this.screen.zoom = 0.22;
            this.screen.setBackground(this.meta.levels[0].background)
            // this.screen.setEntities(this.meta.levels[0].entities, scene)
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
        this.page = 0;

        epochtimetext = this.add.text(10, 5, "awaiting time...", textStyle)
            .setFontSize(24)
            .setFontStyle("bold")
            .setColor("#507860");

        createBackButton(this, "menuScene")


        // const featuredbutton = this.add.text(
        //     30, 50, "FEATURED", exploreButtonStyle,
        // );

        // const newbutton = this.add.text(
        //     340, 50, "NEWEST", exploreButtonStyle,
        // );

        // const oldbutton = this.add.text(
        //     620, 50, "OLDEST", exploreButtonStyle,
        // );

        const refreshbutton = this.add.text(
            30, 475, "REFRESH", helpButtonStyle,
        ).setInteractive();

        refreshbutton.on("pointerdown", () => {
            onlineLevelpackCache.clearEverything();
            this.refreshPage();
        });


        infoText = this.add.text(30, 40, "", levelnameStyle);
        infoText.setText("Downloading...")

        new NumInc(370, 475, 0, 999, this, (value) => {
            this.page = value;
            this.renderPage();
        })

        // gets all the levels from the localstorage
        onlineLevelpackCache.getLocalStorage();

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
            infoText.setText("Downloading...")
            const pageResponse = await fetchPage(this.page);
            if (pageResponse.status !== "success") throw pageResponse.status
            for (const level of pageResponse.data) {
                level.levels = JSON.parse(level.data);
            }
            console.log(pageResponse)
            this.levels.set(this.page, pageResponse.data);

            console.log(c_saves)
            onlineLevelpackCache.clear(this.page);
            onlineLevelpackCache.addSaves(this.page, pageResponse.data);
            onlineLevelpackCache.push();
        } catch (error) {
            await new Alert("Unable to access 5beam", `Failed to download levelpacks from the 5beam database.\n\nError Info:\n${error}`).render(this)
            console.error(error)
        }
        console.log("Using API")

        this.refreshing = false;
        infoText.setText("")
        this.renderPage();
    }

    async renderPage(): Promise<void> {
        // Make sure that the page being rendered actually has levels
        if (!this.levels.has(this.page)) await this.refreshPage();

        ////////////////////////////////////////////////////////////////
        // warning to future zelo
        //
        // this masks the problem where levelitems dont get deleted
        // it is cosmetic and doesnt fully fix the issue
        ////////////////////////////////////////////////////////////////
        this.add.rectangle(30, 100, 940, 350, 0x375342).setOrigin(0, 0);

        this.levels.get(this.page)?.forEach((level, i) => {
            const newTile = new LevelItem(
                30 + (230 * (i % 4)),
                (i % 8 > 3) ? 275 : 100,
                level,
                this
            )

            newTile.tile.setInteractive(new Phaser.Geom.Rectangle(newTile.x, newTile.y, 220, 170), Phaser.Geom.Rectangle.Contains)
                .on("pointerdown", () => {
                    this.scene.start("explorelevelScene", level)
                })

            newTile.render(this);
        });
    }
}

async function getAPIRequest(url: string): Promise<APIResponse> {
    infoText.setText("Downloading...")
    const response = await fetch(url)
    infoText.setText("")
    return await response.json()
}

async function fetchAllLevels(): Promise<APIResponse> {
    return await getAPIRequest(`${EXPLORE_SEVRER_URL}/api/all`)
}

async function fetchPage(number: number): Promise<APIResponse> {
    return await getAPIRequest(`${EXPLORE_SEVRER_URL}/api/level/page/${number}`)
}

async function fetchLevel(id: number): Promise<APIResponse> {
    return await getAPIRequest(`${EXPLORE_SEVRER_URL}/api/level/${id}`)
}

async function fetchLevelData(id: number): Promise<APIResponse> {
    return await getAPIRequest(`${EXPLORE_SEVRER_URL}/api/level/get/${id}`)
}

export default exploreScene;
