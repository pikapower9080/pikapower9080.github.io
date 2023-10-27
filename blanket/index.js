var sounds = [
    {name: "Nature", sounds: ["Rain|rain.ogg", "Storm|storm.ogg", "Wind|wind.ogg", "Waves|waves.ogg", "Stream|stream.ogg", "Birds|birds.ogg", "Summer Night|summer-night.ogg"]},
    {name: "Travel", sounds: ["Train|train.ogg", "Boat|boat.ogg", "City|city.ogg"]},
    {name: "Interiors", sounds: ["Coffee Shop|coffee-shop.ogg", "Fireplace|fireplace.ogg"]},
    {name: "Noise", sounds: ["Pink Noise|pink-noise.ogg", "White Nose|white-noise.ogg"]}
]

Notiflix.Loading.circle("Loading Sounds...")
var soundCount = 0
var loadedCount = 0
var audioObjects = []
const main = document.querySelector("main")
const content = document.querySelector("#content")

navigator.mediaSession.setActionHandler('play', function() { 
    if (audioObjects.length == soundCount) {
        audioObjects.forEach((audio) => {
            if (audio.volume > 0) {
                audio.play()
            }
        })
    }
});
navigator.mediaSession.setActionHandler('pause', function() {
    if (audioObjects.length == soundCount) {
        audioObjects.forEach((audio) => {
            audio.pause()
        })
    }
});

sounds.forEach((category) => {
    const div = document.createElement("div")
    div.className = "category"
    const label = document.createElement("h2")
    label.innerText = category.name
    content.appendChild(label)
    content.appendChild(div)
    category.sounds.forEach((sound) => {
        soundCount ++
        const container = document.createElement("div")
        container.className = "container"
        const audio = new Audio("sounds/" + sound.split("|")[1])
        audio.loop = true
        audio.volume = 0
        var split = audio.src.split("/")
        audio.id = split[split.length-1]
        const range = document.createElement("input")
        const label = document.createElement("label")
        const icon = document.createElement("img")
        range.type = "range"
        range.id = split[split.length-1] + "-range"
        range.max = 100
        range.min = 0
        range.value = 0
        label.innerText = sound.split("|")[0]
        icon.src = "icons/" + sound.split("|")[1].split(".")[0] + "-symbolic.svg"
        icon.draggable = false
        container.appendChild(icon)
        container.appendChild(label)
        container.appendChild(range)
        div.appendChild(container)
        audio.addEventListener("loadeddata", () => {
            loadedCount ++
            audioObjects.push(audio)
            if (loadedCount >= soundCount) {
                Notiflix.Loading.remove()
            }
        })
        audio.update = function() {
            if (range.value > 0) {
                audio.play()
                icon.classList.add("active")
            } else {
                audio.pause()
                icon.classList.remove("active")
            }
            audio.volume = range.value/100
        }
        range.addEventListener("input", audio.update)
        document.body.appendChild(audio)
    })
})

document.getElementById("save").addEventListener("click", () => {
    let saveData = {}
    audioObjects.forEach((audio) => {
        var split = audio.src.split("/")
        saveData[split[split.length-1]] = audio.volume
    })
    localStorage.setItem("blanket-preset", JSON.stringify(saveData))
})

document.getElementById("load").addEventListener("click", () => {
    const savedPreset = JSON.parse(localStorage.getItem("blanket-preset"))
    if (savedPreset) {
        for (key in savedPreset) {
            console.log(key)
            document.getElementById(key).volume = savedPreset[key]
            document.getElementById(key + "-range").value = savedPreset[key] * 100
            document.getElementById(key).update()
        }
    }
})