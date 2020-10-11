Emoji | meaning
--- | ---
🟥| Latest Dev version, these versions will not be on the [github page](https://zolo101.github.io/5bHTML/dist/), and you'll have to build them yourself.
🟦| Latest *""Stable""* version

# v2 Alpha 🟦 -- 11/10/2020

## Major changes

- 5beam Explore intergration. Browse and play custom-made levels! You can upload your levels [here](http://5beam.zapto.org/). 

**Warning:** 5bHTML levels are very different to regular 5b levels, but it is easy to port one to another. Here is the [structure for the latest version](https://gist.github.com/Zolo101/36ae33e5dd15510a2cb41e942dbf7044). There *may* be a way to port them via a program in the future.

- Sprites are now in the game! They are pretty unstable though, specifically the physics.

- Terrain textures! Decoration will be done soon.

- Supports levels up to **level 6**.

## Minor changes

- Changed `WATCH BFDIA 5a` button to `WATCH BFDIA 5A.

- The Level Select screen now has a background similar to 5b.

## Dev changes

- `levels.ts` file **(no longer a json file)** updated to version 5 standards. See [this](https://gist.github.com/Zolo101/36ae33e5dd15510a2cb41e942dbf7044).

- Switched from 2d images to tilesets for the terrain.

- Typescript updated from `3.9.5` to `4.0.3`

- Eslint updated from `7.6.0` to `7.11.0`

- Webpack updated from `4.44.1` to `4.44.2`

# v0.1 Alpha -- 23/08/2020

Hotfix update, fixes some major issues

This version fixes [#6](https://github.com/Zolo101/5bHTML/issues/6) and [#4](https://github.com/Zolo101/5bHTML/issues/4).

## Minor changes

- Friction has been modified to be more accurate to 5b. **(1.15 to 1.30)**.

- Switched to PNG instead of SVG, since it was causing major issues with firefox.

- Removed the `?` from the normal missing texture.

- Made explore more... interesting...

## Dev changes

- Disabled checking levels for a bit, since it was causing strange issues with finishing levels.

- gameScene has been split up into more files to make things more easier to develop with.

- Webpack updated from `4.43.0` to `4.44.1`.

# v0 Alpha -- 19/08/2020

- First public version.