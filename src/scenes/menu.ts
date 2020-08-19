function openExternalLink(url: string) {
    window.open(url, '_blank');
}

class menuScene extends Phaser.Scene {
    constructor() { super("menuScene"); }

    preload(): void {
        this.load.setBaseURL("./assets/core");

        this.load.svg("5b_logo", "img/5b.svg");
        this.load.svg("5b_people", "img/5b_people.svg");
    }

    create(): void {
        //this.scene.start("gameScene"); // go straight into gameplay
        const textStyle = {
            fontFamily: "Helvetica, Arial, sans-serif",
            // backgroundColor: "#fff",
            color: "#fff",
        };

        const buttonStyle = {
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: "26px",
            fontStyle: "bold",
            align: "center",
            fixedWidth: 300,
            backgroundColor: "#fff",
            color: "#666",
            padding: {
                y: 4,
                x: 4,
            },
        };
        // Background
        this.add.rectangle(0, 0, 960, 540, 0x666666).setOrigin(0, 0);

        // 5b LOGO
        this.add.image(260, 400, "5b_logo");
        this.add.image(305, 175, "5b_people").setScale(0.9);

        const buttonlist = [];

        const watchButton = this.add.text(
            600, 200, "WATCH BFDIA 5a", buttonStyle,
        ).setInteractive();

        const newButton = this.add.text(
            600, 250, "NEW GAME", buttonStyle,
        ).setInteractive();

        const continueButton = this.add.text(
            600, 300, "LEVEL SELECT", buttonStyle,
        ).setInteractive();

        //const levelButton = this.add.text(
        //    600, 350, "LEVEL EDITOR (old)", buttonStyle,
        //).setInteractive();
        const exploreButton = this.add.text(
            600, 400, "EXPLORE (WIP)", buttonStyle,
        ).setInteractive();
        //const settingsButton = this.add.text(
        //    600,450,"Settings",buttonStyle,
        //).setInteractive();

        buttonlist.push(watchButton, newButton, continueButton, exploreButton);
        //,settingsButton);

        buttonlist.forEach((btn) => {
            btn.on('pointerover', () => btn.setBackgroundColor("#d4d4d4"));
            btn.on('pointerout', () => btn.setBackgroundColor("#fff"));
        });

        watchButton.on('pointerdown', () => openExternalLink("https://www.youtube.com/watch?v=4q77g4xo9ic"));
        newButton.on('pointerdown', () => this.scene.start("gameScene", { levelnumber: 1 }));
        continueButton.on('pointerdown', () => this.scene.start("levelselectScene"));
       // levelButton.on('pointerdown', () => openExternalLink("https://zolo101.github.io/5beam-edit/index.html"));
        exploreButton.on('pointerdown', () => this.scene.start("exploreScene"));
        //settingsButton.on('pointerdown', () => );

        // Credits
        this.add.text(612, 10, "Original By Cary Huang", textStyle).setFontSize(32);
        this.add.text(686, 55, "Music by Michael Huang", textStyle).setFontSize(24);
        this.add.text(800, 92, "Ported by Zelo101", textStyle).setFontSize(18);

        // Not finished!
        this.add.text(720, 477, "not finished!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", textStyle);

        // Alpha ver
        this.add.text(720, 497, "Open Alpha v0", textStyle).setBackgroundColor("#ea0").setFontSize(32).setColor("#000");
    }
}

export default menuScene;
