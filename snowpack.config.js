// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
    mount: {
        dist: { url: "/", static: true, resolve: false },
        src: "/"
    },
    plugins: [
        "@snowpack/plugin-typescript",
    ],
    packageOptions: {
    /* ... */
    },
    devOptions: {
        port: 8080
    },
    buildOptions: {
    /* ... */
    },
    optimize: {
        bundle: true,
    }
};
