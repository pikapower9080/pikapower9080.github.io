const popups = {}
popups.mserror = {
    url: "/fun/annoying/popups/error.html",
    size: "width=315, height=121"
}
popups.therock = {
    url: "/fun/annoying/popups/therock.html",
    size: "width=300, height=300"
}
popups.pointlaugh = {
    url: "/fun/annoying/popups/pointlaugh.html",
    size: "width=256, height=190"
}
popups.forgor = {
    url: "/fun/annoying/popups/forgor.html",
    size: "width=192, height=120"
}
popups.bug = {
    url: "/fun/annoying/popups/bug.html",
    size: "width=263, height=120"
}
popups.keyboard = {
    url: "/fun/annoying/popups/keyboard.html",
    size: "width=338 height=83"
}
popups.clickok = {
    url: "/fun/annoying/popups/clickok.html",
    size: "width=171, height=83"
}
popups.search = {
    url: "/fun/annoying/popups/search.html",
    size: "width=400, height=400"
}
var popuplist = [popups.mserror, popups.therock, popups.pointlaugh, popups.forgor, popups.bug, popups.keyboard, popups.search]
var windows = []

const SCREEN_WIDTH = window.screen.availWidth
const SCREEN_HEIGHT = window.screen.availHeight
const VELOCITY = 15
const MARGIN = 10
const TICK_LENGTH = 25
function moveWindowBounce () {
    let vx = VELOCITY * (Math.random() > 0.5 ? 1 : -1)
    let vy = VELOCITY * (Math.random() > 0.5 ? 1 : -1)

    setInterval(() => {
        const x = window.screenX
        const y = window.screenY
        const width = window.outerWidth
        const height = window.outerHeight

        if (x < MARGIN) vx = Math.abs(vx)
        if (x + width > SCREEN_WIDTH - MARGIN) vx = -1 * Math.abs(vx)
        if (y < MARGIN + 20) vy = Math.abs(vy)
        if (y + height > SCREEN_HEIGHT - MARGIN) vy = -1 * Math.abs(vy)

        window.moveBy(vx, vy)
    }, TICK_LENGTH)
    bindkeysdown()
}
function randomPos() {
    window.moveTo(Math.random() * SCREEN_WIDTH, Math.random() * SCREEN_HEIGHT)
    bindkeysdown()
}
function download(url){
    const a = document.createElement("a")
    a.href = url
    a.download = url
    a.click()
    setTimeout(() => {
        a.remove()
    }, 10);
}

function openpopup(url, size, sound){
    var newwindow = window.open(url, Math.random(), size + ", menubar=no, status=no, toolbar=no, resizable=no, titlebar=no, alwaysRaised=yes")
    windows.push(newwindow)
    newwindow.toolbar.visible = false
}
function bindkeysdown(){
    document.addEventListener("keydown", function(event) {
        if (event.key == "Control" || event.key == "Meta" || event.key == "w" || event.key == "F4" || event.key == "Alt") {
            openrandompopup(); openrandompopup();
        }        
    })
}

function openrandompopup(){
    var selectedpopup = popuplist[Math.floor(Math.random() * popuplist.length)]
    openpopup(selectedpopup.url, selectedpopup.size)
}