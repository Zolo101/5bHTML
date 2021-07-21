Emoji | meaning
--- | ---
🟦| Latest *"Stable"* version
🟥| Latest Dev version, these versions are hosted on [the dev site](https://5bdev.zelo.dev/).

# v5 Alpha 🟦 -- 21/07/2021

## Main changes

- Character animations!

- Edge and shadow textures!

## Other changes

- Character jump power is now relative to the mass of the grabbed sprite, instead of the speed.

- (@meisels) Fixed an oversight where buttons that opened a url would open twice.

# v4.1 Alpha -- 13/07/2021

## Main changes

- Re-enabled online levelpacks.

- 5bHTML is on MIT License.

- You can now export and import your levelpack library.

- "Invalid" Levelpacks. If 5bHTML thinks a levelpack is invalid or corrupted, it will warn you about it, and you wont be able to upload the levelpack to the 5beam database.

## Editor changes

- You can now zoom and move around in the level editor.

- The editor will now show you what entities are what.

- The editor will tell you when a levelpack has been saved.

- The `Run` tab has been renamed to `Test`.

## Other changes

- The game will congratulate you upon beating an online levelpack.

- The game restarts are more 5b-like.

- Fixed issues [#26](https://github.com/Zolo101/5bHTML/issues/26), [#27](https://github.com/Zolo101/5bHTML/issues/27), [#28](https://github.com/Zolo101/5bHTML/issues/28)

# v4 Alpha -- 30/06/2021
### Note: This version had online levels disabled due to issues with servers. This is no longer the case in v4.1 Alpha.
## Major changes

- **Level Editor! Create, Test, Share and Play your own custom levels!**

- Menu redesign!

- Character speed is now **8%** faster.

- Fixed issues [#14](https://github.com/Zolo101/5bHTML/issues/14), [#20](https://github.com/Zolo101/5bHTML/issues/20), [#21](https://github.com/Zolo101/5bHTML/issues/21), [#22](https://github.com/Zolo101/5bHTML/issues/22) and [#24](https://github.com/Zolo101/5bHTML/issues/24)

## Dev changes

- The level structure is now on version 7

- Changed bundler from Webpack to Snowpack

- Phaser updated from `3.50.0` to `3.55.2`

- Typescript updated from `4.1.3` to `4.3.2`

# v3 Alpha -- 31/12/2020
## Major changes

- Transitions.

- The character now moves accordingly to the mass of the sprite grabbed. This also affects throwing power.

- Book now jumps slightly higher, and stops slightly faster.

- UI Improvements.

- Added favicon (the picture on the website tab).

- Fixed issues [#7](https://github.com/Zolo101/5bHTML/issues/7), [#8](https://github.com/Zolo101/5bHTML/issues/8), [#9](https://github.com/Zolo101/5bHTML/issues/9), [#10]((https://github.com/Zolo101/5bHTML/issues/10)) and [#11](https://github.com/Zolo101/5bHTML/issues/11)

## Dev changes

- Revamped how blocks are made in levels. Most blocks *should* have their respected properties now.

- Revamped how levels are made. Levels are now made in [Tiled](https://www.mapeditor.org/).

- Added a dev mode for better debug info. This is enabled if you build using `build-dev` instead of `build-prod`, or if you use `watch`.

- Webpack updated from `4.44.2` to `5.11.0`

- Typescript updated from `4.0.3` to `4.1.3`

- Eslint updated from `7.11.0` to `7.15.0`

- Phaser updated from `3.24.1` to `3.50.0`

# v2.1 Alpha -- 11/10/2020

- Fixed 5beam Explore intergration. Github was blocking the fetch requests because it was fetching a http url, which is unsecure. This has now been fixed as 5beam now uses https.

- Also added a 5beam-explore tutorial button.

- The bug with the ghost finish blocks has been fixed.

- The levelname text has been given its correct depth (It used to be behind the sprites).

# v2 Alpha -- 11/10/2020
## Major changes

- 5beam Explore intergration. Browse and play custom-made levels! You can upload your levels [here](http://5beam.zapto.org/). 

**Warning:** 5bHTML levels are very different to regular 5b levels, but it is easy to port one to another. Here is the [structure for the latest version](https://gist.github.com/Zolo101/36ae33e5dd15510a2cb41e942dbf7044). There *may* be a way to port them via a program in the future.

- Sprites are now in the game! They are pretty unstable though, specifically the physics.

- Terrain textures! Decoration will be done soon.

- Supports levels up to **level 6**.

## Minor changes

- Changed `WATCH BFDIA 5a` button to `WATCH BFDIA 5A`.

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