// Setup background select
const bgs = [
    {
        section: "Basic",
        backgrounds: [
            { name: "None", image: "" },
            { name: "Gradient 1", image: "grad1.png" },
            { name: "Gradient 2 (Wave)", image: "grad3.jpeg" },
            { name: "Gradient 3", image: "grad4.jpeg" }
        ]
    },
    {
        section: "makebackground.io",
        backgrounds: [
            { name: "Above the Clouds", image: "abovetheclouds.png" },
            { name: "Burning", image: "burning.png" },
            { name: "Fairy Dust", image: "fairydust.png" },
            { name: "Polygons", image: "polygon.png" },
            { name: "Golden Swirl", image: "swirl.png" }
        ]
    },
    {
        section: "OperaGX",
        backgrounds: [
            { name: "Cyber Splash", image: "cyber.jpg" },
            { name: "Ultraviolet", image: "ultraviolet.jpg" }
        ]
    },
    {
        section: "Windows 11",
        backgrounds: [
            { name: "Glow - Purple & Red", image: "glow1.jpg" },
            { name: "Glow - Blue & Purple", image: "glow2.jpg" },
            { name: "Glow - Orange", image: "glow3.jpg" },
            { name: "Glow - Green & Blue", image: "glow4.jpg" },
            { name: "Abstract", image: "abstract1.jpg" }
        ]
    },
    {
        section: "Seasonal",
        backgrounds: [
            { name: "Fall Leaves", image: "seasonal/FallLeaves.jpg" },
            { name: "Floral", image: "seasonal/Floral.jpg" },
            { name: "Blades of Grass", image: "seasonal/Grass.jpg" },
            { name: "Pink Flowers", image: "seasonal/PinkFlowers.jpg" },
            { name: "Snowflakes", image: "seasonal/Snowflakes.jpg" },
            { name: "Snowy Mountain", image: "./backgrounds/seasonal/SnowyMountain.mp4", video: true }
        ]
    },
    {
        section: "NightTab",
        backgrounds: [
            { name: "Ferns", image: "ferns.jpeg" },
            { name: "Paint Strokes", image: "paint.jpeg" },
            { name: "Yellow Paint", image: "yellowpaint.jpeg" },
            { name: "City", image: "city.jpg" }
        ]
    },
    {
        section: "Video",
        backgrounds: [
            { name: "City", video: true, image: "https://github.com/zombieFox/nightTabAssets/raw/main/videos/1628152320524.mp4" },
            { name: "Clouds", video: true, /*color: "black",*/ image: "https://github.com/zombieFox/nightTabAssets/raw/main/videos/1626351606965.mp4" },
            { name: "Clouds 2", video: true, image: "https://github.com/zombieFox/nightTabAssets/raw/main/videos/1626351787997.mp4" },
            { name: "Computer Lights", video: true, image: "https://github.com/zombieFox/nightTabAssets/raw/main/videos/1626352146818.mp4" }
        ]
    }
]
const fonts = [
    { name: "Sans Serif (basic)", family: "sans-serif" },
    { name: "Monospace (equal width)", family: 'monospace' },
    { name: "Baloo 2", family: "'Baloo 2'" },
    { name: "Comfortaa", family: "'Comfortaa" },
    { name: "Righteous", family: "'Righteous'" },
    { name: "Fredoka One", family: "'Fredoka One'" },
    { name: "Balsamiq Sans", family: "'Balsamiq Sans'" }
]
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const music = [
    "n61ULEU7CO0||Lofi Girl - Best Lofi of 2021",
    "TURbeWK2wwg||Lofi Girl - 4 A.M Study Session",
    "_tV5LEBDs7w||Lofi Girl - Cozy Winter",
    "-R0UYHS8A_A||Lofi Girl - Afternoon Jazz",
    "R7Nk_KWdsA8||Deltarune - lofi/chill mix",
    "A7vMrjsBMTI||Undertale Lofi"
]
const textShadows = [
    "None|unset",    
    "Simple Shadow|2px 3px 5px rgba(0,0,0,0.5)",    
    "Hard Shadow|6px 6px 0px rgba(0,0,0,0.2)",    
    "Outline|rgb(0, 0, 0) 0px 1px 1px, rgb(0, 0, 0) 0px -1px 1px, rgb(0, 0, 0) 1px 0px 1px, rgb(0, 0, 0) -1px 0px 1px",
    "Subtle Glow|0px 0px 6px rgba(255,255,255,0.7)",
    "Neon|rgb(255, 255, 255) 0px 0px 2px, rgb(255, 255, 255) 0px 0px 4px, rgb(255, 255, 255) 0px 0px 6px, rgb(255, 119, 255) 0px 0px 8px, rgb(255, 0, 255) 0px 0px 12px, rgb(255, 0, 255) 0px 0px 16px, rgb(255, 0, 255) 0px 0px 20px, rgb(255, 0, 255) 0px 0px 24px",
    "3D|0 1px 0 #ccc,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15)"
]