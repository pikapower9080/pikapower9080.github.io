const text = document.querySelector("#mainText")
const textDiv = document.querySelector("#text")
const textTitle = document.querySelector("#title")
const inventoryContainer = document.querySelector("#inventory-container")
let options = document.querySelector("#options")
const testUrl = "default.json"

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function waitForClick() {
    return new Promise((resolve) => {
      const listener = (e) => {
        if (e.type == "keydown" && e.key != "Enter") return
        textDiv.removeEventListener("keydown", listener)
        document.removeEventListener("click", listener);
        resolve();
      }
      textDiv.addEventListener("click", (e) => listener(e));
      document.addEventListener("keydown", (e) => listener(e))
    })
}

let story;
let inventory = []
let endingDurability;
let inventorySlots = 0
let maxSlots = 0
let currentRoom = {}
let lastOptionIndex = 0
let isGameOver = false

const urlParams = new URLSearchParams(window.location.search)
if (urlParams.get("story")) {
    loadGist(urlParams.get("story"))
}
if (urlParams.get("testMode") == "on") {
    loadTest()
} else {
    document.querySelector("#change-url").showModal()
}

// UTILS //
function sound(url) {
    if (story.options && story.options.sfx) {
        new Audio(`sounds/${url}`).play()
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
function addOption(optionText, onClick, classNames, tooltip, noAnimate) {
    let option = document.createElement("span")
    option.className = 'option'
    option.innerHTML = optionText
    option.addEventListener("click", (e) => {
        sound('select2.wav')
        onClick(option, e)
    })
    lastOptionIndex ++
    option.tabIndex = lastOptionIndex
    setTimeout(() => {
        // Prevent the hover and click sounds from playing at the same time
        option.addEventListener("mouseenter", () => {
            sound('click.wav')
        })
    }, 50);
    if (classNames && typeof classNames != 'string') {
        classNames.forEach((className) => {
            option.classList.add(className)
        })
    } else {
        option.classList.add(classNames)
    }
    if (tooltip) {
        option.setAttribute("aria-label", tooltip)
        option.setAttribute("data-balloon-pos", "down")
        option.setAttribute("data-balloon-length", "fit")
    }
    if (noAnimate) {
        option.classList.add("no-animate")
    }
    option.addEventListener("keydown", (e) => {
        if (e.key == "Enter" || e.key == " ") {
            option.click()
        }
    })
    options.appendChild(option)
}
function updateInventory() {
    if ('items' in story) {
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
            li.setAttribute("itemId", itemName)
            if (story.items[itemName].canDrop) {
                li.innerHTML += ` <span onclick="drop(this.parentNode.getAttribute('itemId'))" class="textButton">[Drop]</span>`
                if ('addInventorySlots' in story.items[itemName]) {
                    li.innerHTML = li.innerHTML.replace(` <span onclick="drop(this.parentNode.getAttribute('itemId'))" class="textButton">[Drop]</span>`, "")
                }
            }
            if ('tooltip' in story.items[itemName]) {
                li.setAttribute("aria-label", story.items[itemName].tooltip)
                li.setAttribute("data-balloon-pos", "right")
                if (story.items[itemName].tooltip.length > 30) {
                    li.setAttribute("data-balloon-length", "medium")
                } else {
                    li.setAttribute("data-balloon-length", "fit")
                }
            }
            newUl.appendChild(li)
        }
        inventorySlots = inventory.length
        if (inventorySlots && inventorySlots > 0) {
            document.querySelector("#inventory-container > .title").innerText = `Inventory (${inventorySlots}/${maxSlots})`
        }
    }
}
function drop(itemId) {
    if (story.items[itemId] && !isGameOver) {
        const item = story.items[itemId]
        let index = inventory.indexOf(itemId)
        console.log(index, inventory[index])
        inventory.splice(index, 1)
        sound('select2.wav')
        room(currentRoom, true)
    }
}
function getRoomOptionName(roomObject, adjRoom, k) {
    if ('modifiers' in roomObject && k in roomObject.modifiers) {
        console.log("Modifier " + roomObject.modifiers[k] + " found.")
        return roomObject.modifiers[k]
    } else {
        return adjRoom.shortName || adjRoom.name
    }
}
async function room(roomObject, fromDrop) {
    currentRoom = roomObject
    options.remove()
    options = document.createElement("div")
    options.id = "options"
    lastOptionIndex = 0
    if (endingDurability && !fromDrop) {
        endingDurability -= 1
    }
    updateInventory()
    document.querySelector('main').appendChild(options)
    if (typeof endingDurability != "undefined" && !endingDurability) {
        textTitle.innerText = ""
        text.innerHTML = `<strong>${story.options.endingItemGameOverText || "Game Over"}</strong>` || "<strong>Game Over</strong>" 
        isGameOver = true
        return
    }
    textTitle.innerText = roomObject.name
    if ('requires' in roomObject) {
        if (includesAll(inventory, roomObject.requires)) {
            if ('requiredAdjacent' in roomObject) {
                for (let i in roomObject.requiredAdjacent) {
                    let adjRoom = story.rooms[roomObject.requiredAdjacent[i]]
                    addOption(adjRoom.shortname || adjRoom.name, () => {
                        room(adjRoom)
                    }, 'green', fromDrop)
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
            addOption(getRoomOptionName(roomObject, adjRoom, adjRoom.name), () => {
                room(adjRoom)
            }, undefined, undefined, fromDrop)
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
                let itemObj = story.items[item]
                if (inventory.includes(item)) return // Don't add option if we already have the item
                function getTooltip() {
                    if (itemObj.tooltip) {
                        if (inventorySlots && 'options' in story && 'inventorySlots' in story.options) {
                            if (inventorySlots < maxSlots) {
                                return itemObj.tooltip
                            } else {
                                return "Inventory full"
                            }
                        } else {
                            return itemObj.tooltip
                        }
                    } else {
                        return undefined
                    }
                }
                addOption(('pickupText' in story.items[item]) ? story.items[item].pickupText : "Pickup " + story.items[item].name, (option) => {
                    if (inventory.includes(item)) return
                    if ('options' in story && 'inventorySlots' in story.options && inventorySlots + 1 > maxSlots) {
                        return
                    }
                    option.remove()
                    inventory.push(item)
                    if (typeof story.items[item].addInventorySlots == "number") {
                        maxSlots += story.items[item].addInventorySlots
                    }
                    updateInventory()
                }, undefined, getTooltip(), fromDrop)
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
    if ('options' in story && 'inventorySlots' in story.options) {
        maxSlots = story.options.inventorySlots
    }
    room(story.rooms[story.entrance])
}

function loadTest() {
    fetch(testUrl, {mode: 'no-cors'}).then((res) => {
        res.json().then((data) => start(data)).catch((reason) => {console.error(reason); text.innerText = "Failed to parse data, make sure it's in the correct format."})
    }).catch((reason) => {
        console.error(reason)
    })
}
function loadGist(gistId) {
    let id;
    if (!gistId) {
        let url = prompt("Enter gist id")
        if (!url || url.trim().length < 8) {
            return
        } else {
            window.location.search = new URLSearchParams({"story": url}).toString()
        }
        
    } else {
        id = gistId
    }
    if (id) {
        fetch(`https://api.github.com/gists/${id}`).then((result) => {
            result.json().then((jsonData) => {
                let fetchedContent = ""
                if (jsonData.message == "Not Found") {
                    alert("That gist couldn't be found. Make sure you're using a valid gist id, and not a gist url. Refer to the make your own guide for help.")
                    return
                }
                if ('files' in jsonData && 'game.json' in jsonData.files) {
                    if (jsonData.files['game.json'].truncated == true) {
                        alert("The file is too big to load, sorry about that.")
                        return
                    } else {
                        fetchedContent = jsonData.files['game.json'].content
                        document.getElementById("story-input").value = fetchedContent
                        startWithInput()
                    }
                } else {
                    alert("The gist successfully loaded but no game.json file was found. Please refer to the make your own guide.")
                }
            }).catch((errorM) => {
                console.error(errorM)
                alert("Failed to load gist due to an error parsing received data.")  
            })
        }).catch((errorM) => {
            alert("Failed to fetch the gist content from the github gist api. Refer to the make your own guide.")
            console.error(errorM)
        })
    }
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
document.getElementById("unload").addEventListener("click", () => {
    window.location.search = ""
})
document.getElementById("change-url").addEventListener("cancel", (e) => {
    e.preventDefault()
})