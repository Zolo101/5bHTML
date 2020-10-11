export const textStyle = {
    fontFamily: "Helvetica, Arial, sans-serif",
    // backgroundColor: "#fff",
    color: "#fff",
};

export const levelbuttonStyle = {
    fontFamily: "Helvetica, Arial, sans-serif",
    fontSize: "42px",
    fontStyle: "bold",
    align: "center",
    fixedWidth: 100,
    fixedHeight: 50,
    backgroundColor: "#ee0",
    color: "#000",
    padding: {
        y: 4,
        x: 4,
    },
};

export const levelnameStyle = {
    fontFamily: "Helvetica, Arial, sans-serif",
    fontSize: "32px",
    fontStyle: "bold",
    // color: "#666",
};

export const backStyle = {
    fontFamily: "Helvetica, Arial, sans-serif",
    fontSize: "42px",
    fontStyle: "bold",
    align: "center",
    fixedWidth: 135,
    fixedHeight: 50,
    backgroundColor: "#ddd",
    color: "#fff",
    padding: {
        y: 4,
        x: 4,
    },
};

export const backButton = (scene: Phaser.Scene, start = "menuScene") => {
    new Phaser.GameObjects.Text(
        scene, 800, 475, "BACK", backStyle,
    ).setInteractive().setAlpha(0.75).on("pointerdown", () => scene.scene.start(start));
};
