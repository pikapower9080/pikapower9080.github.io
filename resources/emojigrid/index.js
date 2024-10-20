const groups = {}
Notiflix.Loading.circle('Fetching emojis...')
const copyBtn = document.getElementById("copy-btn")
const mainContent = document.getElementById("Content")
const searchInput = document.querySelector('input[type="search"]')
let emojiIndex = 0

function emojiTooltipContent(emojiObject) {
    return `
    <label class="emoji-name">${emojiObject.unicodeName}</label>
    <span class="subtext">${emojiObject.subGroup}</span>
    `.trim()
}

function copyText(text) {
    const tmpelement = document.createElement("textarea")
    document.body.appendChild(tmpelement)
    tmpelement.textContent = text
    tmpelement.select()
    document.execCommand("copy")
    tmpelement.remove()
}

function copyemoji(emoji, gridelement) {
    copyText(emoji)
    gridelement.innerHTML = "✅"
    setTimeout(() => {
        gridelement.innerHTML = `<div class='text'>${emoji}</div>`
    }, 1500);
}

let ignoreRegex = /E[0-9]+\.\d/i;
function addEmoji(emoji, grid) {
    if (ignoreRegex.test(emoji.unicodeName)) return // remove weird duplicates (band-aid fix)
    var cln = document.getElementById("template").cloneNode(true)
    cln.removeAttribute("id")
    cln.getElementsByClassName("text")[0].innerHTML = emoji.character
    cln.setAttribute("onclick", `copyemoji('${emoji.character}', this)`)
    cln.style.visibility = "visible"
    cln.id = "e-" + emojiIndex
    tippy(cln, {
        content: emojiTooltipContent(emoji),
        arrow: true,
        placement: 'bottom-start',
        interactive: true,
        allowHTML: true,
        theme: 'light-border',
        animation: 'shift-away-subtle'
        // followCursor: 'horizontal'
    })
    emojiIndex ++
    grid.appendChild(cln)
}
let openMojiAccess = "61469af37ec8c49afe41789fe28867e1d5942302" // Oh no what are you going to do with my access token to a free api with no account!!!!!!11!
let queryParams = new URLSearchParams(window.location.search)
console.log(queryParams)

let fetchUrl = "emojis.json"
if (queryParams.get("q")) {
    fetchUrl = `https://emoji-api.com/emojis?search=${queryParams.get('q')}&access_key=${openMojiAccess}`
    searchInput.value = queryParams.get("q")
}

fetch(fetchUrl).then((res) => {
   Notiflix.Loading.change('Parsing data...')
   res.json().then((data) => {
        Notiflix.Loading.change('Creating groups...')
        for (let i in data) {
            const emoji = data[i]
            if (!groups[emoji.group]) {
                groups[emoji.group] = []
            }
            groups[emoji.group].push(emoji)
        }
        Notiflix.Loading.change('Creating elements...')
        for (let key in groups) {
            const heading = document.createElement("h2")
            heading.innerHTML = key.replaceAll("-", " - ")
            const gridElement = document.createElement("div")
            gridElement.className = "grid"
            mainContent.appendChild(heading)
            mainContent.appendChild(gridElement)
            groups[key].forEach((emojiObject) => {
                addEmoji(emojiObject, gridElement)
            })
        }
        Notiflix.Loading.remove()
        document.getElementById("template").remove()
   })
}).catch((errorM) => {
    console.error(errorM)
   Notiflix.Loading.change('Failed to fetch data')
})

copyBtn.addEventListener('click', () => {
    let emojiString = ""
    for (let key in groups) {
        groups[key].forEach((emojiObject) => {
            if (ignoreRegex.test(emojiObject.unicodeName)) return
            emojiString += emojiObject.character
        })
    }
    copyText(emojiString)
    copyBtn.innerHTML = "✅ Copied"
    setTimeout(() => {
        copyBtn.innerHTML = `✂ Copy All`
    }, 1500);
})

document.addEventListener("keydown", (e) => {
    if (e.key == "/") {
        e.preventDefault()
        searchInput.scrollIntoView()
        searchInput.select()
    }
    if (e.key == "Escape") {
        searchInput.blur()
    }
})