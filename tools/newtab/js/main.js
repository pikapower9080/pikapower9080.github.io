var emojis = ['🤡', '🤟', '👀', '👑', '🐶', '🍎', '🏈', '🏀', '🎧', '🎤', '🎹', '🎻', '🎮', '💎', '🛒', '📍', '🕓', '📖', '📝', '🌐']
var gridElements = []

function g(element){
    return document.getElementById(element)
}

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes
    strTime += ' ' + ampm;             
    return strTime;
}
var photos = {
    nature: [
        "fox.jpeg",
        "mountains-2.jpeg",
        "mountains-3.jpg",
        "mountains-4.jpeg",
        "mountains.jpeg",
        "palmtree.jpeg",
        "yosemite.jpeg",
        "flowers.jpeg",
        "field.jpeg",
        "lake.jpeg",
        "lake-2.jpeg",
        "landscape.jpeg",
        "landscape-2.jpeg",
        "tree.jpeg",
        "owl.jpeg",
        "tree-2.jpeg",
        "forest.jpeg",
        "sunset.jpeg"
    ],
    cats: [], // These are added with code
    none: [""],
    dogs: [], // These are added with code too
    flowers: [], // I think you get the idea
    colors: [
        "#E53935",
        "#C62828",
        "#EC407A",
        "#9C27B0",
        "#BA68C8",
        "#6A1B9A",
        "#673AB7",
        "#3F51B5",
        "#1E88E5",
        "#4FC3F7",
        "#00BCD4",
        "#26A69A",
        "#4CAF50",
        "#3CCC65",
        "#CDDC39",
        "#FFC107",
    ]
}
var backgroundsets = {
    "Nature": photos.nature,
    "Cats": photos.cats,
    "Dogs": photos.dogs,
    "Flowers": photos.flowers,
    "Colors": photos.colors,
    "None": photos.none
}
var backgroundset = photos.nature
if (localStorage.getItem("bgset")) {
    backgroundset = backgroundsets[localStorage.getItem("bgset")]
    g("bg-family").value = localStorage.getItem("bgset")
}
var catmax = 14
var dogmax = 23
var flowermax = 18
for (let i = 0; i < dogmax; i++) {
    photos.dogs.push("dogs/dog-" + i + ".jpeg")
}
for (let i = 0; i < catmax; i++) {
    photos.cats.push("cats/cat-" + i + ".jpeg")
}
for (let i = 0; i < flowermax; i++) {
    photos.flowers.push("flowers/flowers-" + i + ".jpeg")
}
var messages = [
    "Have a great day!",
    "Turn that frown upside down!",
    "Get stuff done today!",
    "No more procrastinating!!!!",
    "You can do it!",
    "Don't give up!",
    "You got this!"
]
document.getElementById('goal-input').addEventListener('keypress', (evt) => {
    if (evt.key === "Enter") {
        evt.preventDefault();
    }
});
if (localStorage.getItem('goal')) {
    document.getElementById("goal-input").innerHTML = localStorage.getItem("goal")
}
document.getElementById("message").innerHTML = messages[Math.floor(Math.random() * messages.length)]
function loadBackground() {
    if (backgroundset != photos.colors) {
        document.body.style.setProperty("--background", 'url("backgrounds/' + backgroundset[Math.floor(Math.random() * backgroundset.length)] + '")')
    } else {
        document.body.style.setProperty("--background-color", photos.colors[Math.floor(Math.random() * photos.colors.length)])
    }
}
if (localStorage.getItem("bg-color")) {
    document.body.style.setProperty("--background-color", localStorage.getItem("bg-color"))
    g("bg-color").value = localStorage.getItem("bg-color")
}
loadBackground()
setInterval(() => {
    document.getElementById("time").innerHTML = formatAMPM(new Date())
}, 500);
setInterval(() => {
    localStorage.setItem("goal", document.getElementById('goal-input').innerHTML)
}, 1000);
document.getElementById("time").innerHTML = formatAMPM(new Date())

document.getElementById("searchform").addEventListener("submit", function(event){
    event.preventDefault()
    window.location.href = "https://google.com/search?q=" + document.getElementById("search-input").value
})
g("emojipopup").addEventListener('cancel', (event) => {
    event.preventDefault(); // Prevent you from closing using the escape key in some browsers
});

function promptWithDefault(message, defaultvalue){
    var response = prompt(message, defaultvalue)
    if (response == null || response.trim() == ""){
        return defaultvalue
    } else {
        return response
    }
}

function setupCard(card, storageKey){
    g(card).addEventListener("contextmenu", function(event){
        event.preventDefault()
        var newurl = promptWithDefault("Enter new url. Make sure to include the whole thing including https:// or http://", "https://google.com")
        g(card).getElementsByClassName("topsite-card-label")[0].innerHTML = newurl
        localStorage.setItem(storageKey, newurl)
        var sitename = promptWithDefault("Enter a label for this site. It can be anything.", "Google")
        g(card).getElementsByClassName("topsite-card-label")[0].innerHTML = sitename
        localStorage.setItem(storageKey + "-label", sitename)
        var pickEmoji = new Promise(function(resolve, reject) {
            var pickedElement;
            try{
                const emojielements = g("emojigrid").getElementsByClassName("emojicell")
                g("emojipopup").showModal()
                for (let i = 0; i < emojielements.length; i++) {
                    var element = emojielements[i]
                    element.addEventListener("click", function(event){
                        pickedElement = i
                        g("emojipopup").close()
                        resolve(gridElements[pickedElement - 1].getElementsByClassName("emojicelllabel")[0].innerHTML)
                    }) 
                }
            } catch(err) {
                console.error(err)
                reject(err)
            }
        })
        pickEmoji.then(function(result){
            console.log(result)
            g(card).getElementsByClassName("topsite-card-emoji")[0].innerHTML = result
            localStorage.setItem(storageKey + "-emoji", result)
        }, function(error){
            console.warn(error)
        })
    })
    if(localStorage.getItem(storageKey + "-label")){
        g(card).getElementsByClassName("topsite-card-label")[0].innerHTML = localStorage.getItem(storageKey + "-label")
    }
    if(localStorage.getItem(storageKey + "-emoji")){
        g(card).getElementsByClassName("topsite-card-emoji")[0].innerHTML = localStorage.getItem(storageKey + "-emoji")
    }
    g(card).addEventListener("click", function(){
        window.location.href = localStorage.getItem(storageKey)
    })    
}
setupCard("card-1", "site-1")
setupCard("card-2", "site-2")
setupCard("card-3", "site-3")

for (let i = 0; i < emojis.length; i++) {
    var clone = g("emojitemplate").cloneNode(true)
    clone.setAttribute("id", "emoji-" + i)
    clone.setAttribute("style", "")
    clone.getElementsByTagName("label")[0].innerHTML = emojis[i]
    g("emojigrid").appendChild(clone)
    gridElements.push(clone)
}

g("bg-family").addEventListener("input", () => {
    backgroundset = backgroundsets[g("bg-family").value]
    localStorage.setItem("bgset", g("bg-family").value)
    loadBackground()
    if (g("bg-family").value == "Colors") {
        window.location.reload()
    }
    if (g("bg-family").value == "None") {
        g("bg-color-div").style.display = "unset"
    } else {
        g("bg-color-div").style.display = "none"
    }
})
if (g("bg-family").value == "None") {
    g("bg-color-div").style.display = "unset"
} else {
    g("bg-color-div").style.display = "none"
}
g("settingsicon").addEventListener("click", () => {
    g("settings").showModal()
})
g("bg-color").addEventListener("input", () => {
    document.body.style.setProperty("--background-color", g("bg-color").value)
    localStorage.setItem("bg-color", g("bg-color").value)
})
g('settings-x').addEventListener("click", () => {
    g("settings").close()
})
