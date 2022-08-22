const text = document.querySelector("#mainText")
const textDiv = document.querySelector("#text")
const textTitle = document.querySelector("#title")
const inventoryContainer = document.querySelector("#inventory-container")
let options = document.querySelector("#options")
const defaultUrl = "default.json"

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function waitForClick() {
    return new Promise((resolve) => {
      const listener = () => {
        textDiv.removeEventListener("click", listener);
        resolve();
      }
      textDiv.addEventListener("click", listener);
    })
}

let story;
let inventory = []
let endingDurability;

if (!localStorage.getItem("story_json")) {
    document.querySelector("#change-url").showModal()
}

function sound(url) {
    if (story.options && story.options.sfx) {
        new Audio(url).play()
    }
}
function includesAll(array, includes) {
    let matches = 0
    includes.forEach((include) => {
        if (array.includes(include)) {
            matches += 1
        }
    })
    console.log(matches, includes.length)
    if (matches == includes.length) {return true} else {return false}
}
function addOption(optionText, onClick, classNames) {
    let option = document.createElement("span")
    option.className = 'option'
    option.innerHTML = optionText
    option.addEventListener("click", (e) => {
        sound('select2.wav')
        onClick(option, e)
    })
    option.addEventListener("mouseenter", () => {
        sound('click.wav')
    })
    if (classNames && typeof classNames != 'string') {
        classNames.forEach((className) => {
            option.classList.add(className)
        })
    } else {
        option.classList.add(classNames)
    }
    options.appendChild(option)
}
function updateInventory() {
    inventoryContainer.style.display = "block"
    try {
        inventoryContainer.getElementsByTagName('ul')[0].remove()
    } catch {}
    const newUl = document.createElement('ul')
    inventoryContainer.querySelector("#inventory").appendChild(newUl)
    newUl.id = "inventoryList"
    for (let i in inventory) {
        let itemName = inventory[i]
        const li = document.createElement("li")
        if (endingDurability && 'options' in story && story.options.hasEndingItem && story.options.endingItemId == itemName) {
            li.innerText = story.items[itemName].name + ` (${endingDurability}/${story.options.endingItemDurability})`
        } else {
            li.innerText = story.items[itemName].name
        }
        newUl.appendChild(li)
    }
}
async function room(roomObject) {
    options.remove()
    options = document.createElement("div")
    options.id = "options"
    if (endingDurability) {
        endingDurability -= 1
    }
    updateInventory()
    document.querySelector('main').appendChild(options)
    if (typeof endingDurability != "undefined" && !endingDurability) {
        textTitle.innerText = ""
        text.innerHTML = `<strong>${story.options.endingItemGameOverText}</strong>` || "<strong>Game Over</strong>" 
        return
    }
    textTitle.innerText = roomObject.name
    if ('requires' in roomObject) {
        console.log(roomObject.requires)
        console.log(inventory)
        if (includesAll(inventory, roomObject.requires)) {
            if ('requiredAdjacent' in roomObject) {
                for (let i in roomObject.requiredAdjacent) {
                    let adjRoom = story.rooms[roomObject.requiredAdjacent[i]]
                    addOption(adjRoom.shortname || adjRoom.name, () => {
                        room(adjRoom)
                    }, 'green')
                }
            }
            text.innerText = roomObject.description
        } else {
            text.innerText = roomObject.requiredText
        }
    } else {
        text.innerText = roomObject.description
    }
    
    if (roomObject.adjacent && roomObject.adjacent.length >= 1) {
        for (let i in roomObject.adjacent) {
            let adjRoom = story.rooms[roomObject.adjacent[i]]
            addOption(adjRoom.shortname || adjRoom.name, () => {
                room(adjRoom)
            })
        }
        function addItems() {
            if ('items' in story) {
                if (!roomObject.items || roomObject.items.length <= 0) {
                    text.innerHTML = text.innerText += "<br><br><strong>There are no items here</strong>"
                } else {
                    text.innerHTML = text.innerText += "<br><br><strong>Items:</strong>"
                    for (let i in roomObject.items) {
                        let item = roomObject.items[i]
                        let itemObject = story.items[item]
                        if (!inventory.includes(item)) {
                            text.innerHTML = text.innerHTML += "<br>- " + itemObject.name
                        } else {
                            text.innerHTML = text.innerHTML += "<br><span class=\"owned\">- " + itemObject.name + "</span>"
                        }
                    }
                }
            }
            for (let i in roomObject.items) {
                let item = roomObject.items[i]
                if (inventory.includes(item)) return // Don't add option if we already have the item
                addOption("Pickup " + story.items[item].name, (option) => {
                    option.remove()
                    inventory.push(item)
                    updateInventory()
                })
            }
        }
        if ('requires' in roomObject && !includesAll(inventory, roomObject.requires)) {
            // addItems()
        } else {
            addItems()
        }
    } else {
        text.innerHTML = text.innerHTML + "<br><br><strong>Game Over</strong>" 
    }
}

async function start(storyData) {
    story = storyData
    if (!'meta' in story) {text.innerText = "The story failed to load because it's in an invalid format."; return}
    if (story.meta.title) {
        document.querySelector("h1").innerText = story.meta.title
        document.title = story.meta.title
    }
    if (story.options && story.options.hasEndingItem) {
        endingDurability = story.options.endingItemDurability + 1 // the first room should not count
        inventory.push(story.options.endingItemId)
    }
    await waitForClick()
    if (story.intro) {
        textTitle.innerText = "Intro"
        for (let i in story.intro) {
            text.innerText = story.intro[i]
            sound('click.wav')
            await waitForClick()
        }
    }
    textDiv.classList.remove("pointer")
    if (!story.rooms || !story.entrance) return
    room(story.rooms[story.entrance])
}

function fetchDefault() {
    fetch(defaultUrl, {mode: 'no-cors'}).then((res) => {
        res.json().then((data) => start(data)).catch((reason) => {console.error(reason); text.innerText = "Failed to parse data, make sure it's in the correct format."})
    }).catch((reason) => {
        console.error(reason)
        text.innerText = "Could not load data, sorry about that."
    })
}
function startWithInput() {
    let storyData = document.getElementById("story-input").value
    try {
        storyData = JSON.parse(storyData)
        document.getElementById("change-url").close()
        start(storyData)
    } catch(error) {
        alert("Failed to parse story data because:\n" + error)
    }
}
document.getElementById("change-url").addEventListener("cancel", (e) => {
    e.preventDefault()
})