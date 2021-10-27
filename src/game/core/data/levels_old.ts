export default {
    name: "5b levels",
    author: "Original by Cary Huang",
    description: "The OG levelpack.",

    version: 5,
    levelversion: "1.0",
    levels: [
        {
            name: "Time to explore",

            width: 32,
            height: 18,

            background: 0,

            data: [
                "................................",
                "................................",
                "................................",
                "................................",
                "................................",
                "................................",
                "................................",
                "................................",
                "................................",
                "................................",
                "................................",
                "...........................4....",
                "666......................////.:.",
                "//6666........5...../////////>>>",
                "/////6666.....//////////////////",
                "////////////////////////////////",
                "////////////////////////////////",
                "////////////////////////////////"
            ],

            entity: [
                {
                    name: "book",

                    x: 105,
                    y: 0,

                    controllable: true,
                    roleid: 10
                }
            ],

            dialogue: [
                {
                    name: "book",

                    happy: false,
                    text: "Whoa!  Hold on a second, this place doesn't look familiar.  What happened?    I don't remember anything!"
                },
                {
                    name: "book",

                    happy: false,
                    text: "Uh... well, um... uh.... gosh, I'm so confused."
                },
                {
                    name: "book",

                    happy: true,
                    text: "Oh, I know!  I'll look through my journal entries!   After all, I am a journal.  So, let's see...   five minutes ago, I..."
                },
                {
                    name: "book",

                    happy: false,
                    text: "...got eaten by Evil Leafy? WHAT?  That doesn't make any sense!"
                },
                {
                    name: "book",

                    happy: false,
                    text: "Well, I guess I'll go look for my fellow FreeSmarters to get a sense of what's going on."
                },
                {
                    name: "none",

                    happy: false,
                    text: "Use the arrow keys to move and press the space bar to jump.."
                }
            ]
        },
        {
            name: "First danger",
            width: 32,
            height: 18,
            background: 0,

            data: [
                "................................",
                "......:.........................",
                "................................",
                "................................",
                ".............6..................",
                "/............6..................",
                "/............6..................",
                "/............6..................",
                "//...........6.......//.........",
                "//........./////...........//..4",
                "//.......///////.........../////",
                "////...////////.............////",
                "///////////////..............///",
                "//////////////................//",
                "//////////////................//",
                "////77777///7.................//",
                "////777777777................///",
                "/////////////1111111111111111///"
            ],

            entity: [
                {
                    name: "book",

                    x: 105,
                    y: 198
                }
            ],

            dialogue: [
                {
                    name: "none",

                    happy: false,
                    text: "Before you make that perilous leap, remember that you can press 'R' to reset the level!"
                }
            ]
        },
        {
            name: "Pillar",
            width: 32,
            height: 18,
            background: 0,

            data: [
                "................................",
                "................................",
                "................................",
                "................................",
                "..............................4.",
                ".............................///",
                "......................../....///",
                ".......................//.....//",
                "......................../.....//",
                "................//....../....///",
                ".............../////..../.....//",
                "..............////./...//....../",
                "..............//7....../......//",
                ".......///....7/7..:.../.....///",
                "......///7...7777......//....///",
                "///....//7....777......./.....//",
                "////7..//....7///......./....../",
                "////111//11111//11111111//11111/"
            ],

            entity: [
                {
                    name: "book",

                    x: 60,
                    y: 420
                }
            ]
        },
        {
            name: "Going under",
            width: 32,
            height: 18,
            background: 0,

            data: [
                "..............................//",
                ".........................../////",
                "........................////////",
                "......................7/////////",
                ".....................777////////",
                "...................7777777//////",
                "................//7777..777/////",
                "............///////777.:777/////",
                ".........///////////7777777/////",
                "//....777////////////77777//////",
                "///7777777/////////////77///////",
                "/////777777/////////////////////",
                "//////77777777//////////7777////",
                "////////77777777///////77../////",
                "/////////7777777777777777../////",
                "///////////77777777777777../////",
                "/////////////777777777777.4/////",
                "////////////////////////////////"
            ],

            entity: [
                {
                    name: "book",

                    x: 45,
                    y: 240
                }
            ]
        },
        {
            name: "Small packages",
            width: 50,
            height: 18,
            background: 1,

            data: [
                "...//////////////////////////...............//////",
                ".....////.6....../........../..................../",
                "......///.6....../........../..................../",
                "......../.6....../........../..../////.........../",
                "///.....////....3/.4//....../..../0000.........../",
                "/////.../2......3/////.........../.............../",
                "//....../2.....///////.........../......../....../",
                "/......./2......./.://.........../.............../",
                "/.......////...../..//////////////.............../",
                "/......./......../../0000000//////....../......../",
                "/......./......../..............//.............../",
                "......11/......///..............//.............../",
                "......///......................./////............/",
                "......../.......................//////////......./",
                "........////...................................../",
                "/1.............................................../",
                "///................//.......//.............../////",
                "/////////////////////1111111//////////////////////"
            ],

            entity: [
                {
                    name: "book",

                    x: 45,
                    y: 60
                },
                {
                    name: "crate",

                    x: 315,
                    y: 80
                },
                {
                    name: "metalbox",

                    x: 1425,
                    y: 480
                }
            ]
        },
        {
            name: "Landfill (WIP)",
            width: 32,
            height: 18,
            background: 4,

            data: [
                "////////////////////////////////",
                "/............................../",
                "/............................../",
                "/............................../",
                "/............................../",
                "/...@@@@@@@@@@@@@@@@@@@@@@@@@@@/",
                "/............................../",
                "/@@............................/",
                "/............................../",
                "/@@............................/",
                "/............................4./",
                "/@@......................../////",
                "/........../.............../////",
                "/@@.......//.............../////",
                "/........///.............../////",
                "/@@.....////:............../////",
                "/....../////111111111111111/////",
                "////////////////////////////////",
            ],

            entity: [
                {
                    name: "book",

                    x: 90,
                    y: 510
                },
                {
                    name: "crate",

                    x: 405,
                    y: 150
                },
                {
                    name: "metalbox",

                    x: 472.5,
                    y: 150
                },
                {
                    name: "package",

                    x: 540,
                    y: 150
                },
                {
                    name: "metalbox",

                    x: 472.5,
                    y: 150
                },
            ]
        },
        {
            name: "Rock bottom (WIP)",
            width: 32,
            height: 50,
            background: 6,

            data: [
                "///////////////////_//////^/////",
                "..................///.../^^/....",
                "......................./^^/.....",
                "......................./^/......",
                "......................./^/../...",
                "//////................./^^//^/..",
                "/////.................../^^^/...",
                "/^^//....................///....",
                "/^^///..........................",
                "//^^//..........................",
                "///^///.1...1................../",
                "/////////////................../",
                "/.F.F.......Z................../",
                "/.F.F.......Z................../",
                "/.F.........///////////////..../",
                "/....../......................./",
                "/....../...@@................../",
                "/....../......................./",
                "/....../......///...///...//////",
                "/......//////////@@@/////////00/",
                "/....../.........:............./",
                "/....../......................./",
                "/....../......................./",
                "/....../......................./",
                "/....../`....................../",
                "/......//....................../",
                "/......///HHHHHHHH;HHH;HHH;HHH;/",
                "/......//....................../",
                "/....../......................./",
                "/....../......................./",
                "/....../......................./",
                "/....../......................./",
                "/....../......................./",
                "/....../......................./",
                "/....../......................;/",
                "/....../......................]/",
                "/....../......................./",
                "/....../......................./",
                "/....../..........[1\\........../",
                "/....../..........3X2........../",
                "/....../.....1.....F...;......./",
                "/......0.....X.....F...F......./",
                "/............F..;..F...F......./",
                "/............F..F..F...F......./",
                "/............F..F..F...F......./",
                "/`..`........F..F.`F`..F111..4./",
                "XXXXXXXXXX;XXXXXXXXXXXXXXXXXXXXX",
                "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY",
                "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY",
                "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY",
            ],

            entity: [
                {
                    name: "book",

                    x: 90,
                    y: 150
                }
            ]
        },
        {
            name: "A friend (WIP)",
            width: 32,
            height: 18,
            background: 5,

            data: [
                "////////_///////////////_///////",
                "/:....../777777777777777/....../",
                "/.......77777777777777777....../",
                "/.......77777777777777777....../",
                "/.......77777777777777777....../",
                "/......./777777777777777/....../",
                "/......@@@@@@@@@@@@@@@@@@@@@.../",
                "/............................../",
                "///............................/",
                "/............................///",
                "/.....@@@@@................../__",
                "/.......................////////",
                "/.......................M......X",
                "////....................N......Y",
                "^^^/....................M......Y",
                "^^^/.`..................N......Y",
                "XXXXXXXVXX`............`M.`..4.Y",
                "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY",
            ],

            entity: [
                {
                    name: "book",

                    x: 480,
                    y: 510
                }
            ]
        },
        {
            name: "A companion (WIP)",
            width: 32,
            height: 50,
            background: 6,

            data: [
                "////////////////////////////////",
                "///..F........................./",
                "/.F..F........................./",
                "/.F............................/",
                "/.F............................/",
                "/...........................4../",
                "/.................@@@@@@@@@@@@@/",
                "/@@@@@@......................../",
                "/........../////.............../",
                "/@@@@....../////.............../",
                "/..........00000.............../",
                "/@@............................/",
                "/............................../",
                "/.........`..............h...../",
                "/........////........../////@@@/",
                "/........///////jojoj........../",
                "/........///////............@@@/",
                "/`.;.........................../",
                "//.f`.......................nnn/",
                "///f/........................../",
                "^^^f///......................../",
                "_^^^///......................../",
                "_^^///F......................../",
                "^^//:FF......................../",
                "^//F.FF......................../",
                "///F.FF......................../",
                "//.F.FF..........11111........./",
                "//.F.FF........../////......./;/",
                "/..F.FF........../___/HHHHHHH/f/",
                "/..F.FP........../////......//f/",
                "/..F.F...........00000......//f/",
                "/..F.F.....................///f/",
                "/..F.F.....................///f/",
                "/..F.F....................////f/",
                "/..F.F....................////f/",
                "/..F.F.............../////////f/",
                "/..F.F.............../^^^^^^^^^/",
                "/..F.F.............../^^^^^^^^^/",
                "/....F.............../^^^^^^^^^/",
                "/....F..............;/^^^/W/^^^/",
                "/.................R.f/^^^^^^^^^/",
                "/...............//////^^^^^^^^^/",
                "/........dcdc......../^^^^^^^ee/",
                "/........OPOP........^^^^^^^^^^/",
                "/..cdcd..............^^^eeee^^^/",
                "/..OPOP...............^^^^^^^^^/",
                "/`.......`.`....`......^^^^^^^^/",
                "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
                "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY",
                "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY",
            ],

            entity: [
                {
                    name: "book",

                    x: 210,
                    y: 1410
                }
            ]
        },
        {
            name: "A sad goodbye (WIP)",
            width: 32,
            height: 18,
            background: 0,

            data: [
                "......................:.........",
                "//..............................",
                "////............................",
                "/////....................///....",
                "/////....................///...4",
                "//////7..................///..//",
                "///////..7................F...//",
                "/////777.................QF...//",
                "///7777777..............////////",
                "/77777777..7............////////",
                "7777777.7...............////////",
                "7777777777..............////////",
                "7777777777....../MNMNMNM////////",
                "7777777//7....///.......////////",
                "777777///.....///.......////////",
                "77///////.....///.......////////",
                "7////////.....///.......////////",
                "/////////.....///.......////////",
            ],

            entity: [
                {
                    name: "book",

                    x: 60,
                    y: 450
                }
            ]
        },
    ]
}