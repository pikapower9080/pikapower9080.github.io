// Load in options
music.forEach((video) => {
    const ytUrl = video.split("||")[0]
    const videoName = video.split("||")[1]
    const option = document.createElement("option")
    option.innerText = videoName
    option.setAttribute("videoId", ytUrl)
    el.musicSelect.appendChild(option)
})

// handle music
let lofiLoaded = false
let lofiHidden = false
let musicVideoUrl = ""
let player;
let canSubmitCustomVideo = false
// https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
function youtube_parser(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match && match[7].length == 11) ? match[7] : false;
}
function loadPlayer() {
    let tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}
el.musicSelect.addEventListener("change", () => {
    const selected = el.musicSelect.options[el.musicSelect.selectedIndex]
    musicVideoUrl = selected.getAttribute("videoId")
    switch (musicVideoUrl) {
        case "none":
            if (lofiLoaded) {
                player.pauseVideo()
                if (el.showLofi.innerText == "[Hide]") {
                    el.showLofi.click()
                }
            }
            break;
        case "custom":
            if (!lofiLoaded) {
                loadPlayer()
            } else {
                player.pauseVideo()
            }
            el.settings.close()
            el.customVideoDialog.showModal()
            break;
        default:
            if (!lofiLoaded) {
                loadPlayer()
            } else {
                player.loadVideoById(musicVideoUrl)
            }
            break;
    }
})
function validateCustomInput() {
    if (!youtube_parser(el.customVideoForm.querySelector("input").value)) {
        canSubmitCustomVideo = false
    } else {
        canSubmitCustomVideo = true
    }
    el.customVideoSubmit.disabled = !canSubmitCustomVideo
}
el.customVideoForm.addEventListener("submit", (e) => {
    e.preventDefault()
    el.customVideoSubmit.click()
})
el.customVideoDialog.addEventListener("cancel", () => {
    el.settings.showModal()
})
el.customVideoSubmit.addEventListener("click", () => {
    validateCustomInput()
    if (canSubmitCustomVideo) {
        el.customVideoDialog.close()
        el.settings.showModal()
        const id = youtube_parser(el.customVideoForm.querySelector("input").value)
        if (!id) {
            alert("Invalid youtube url")
            return
        }
        player.loadVideoById(id)
    }
})
el.customVideoInput.addEventListener("input", validateCustomInput)
function onYouTubeIframeAPIReady() {
    console.log("Setting up player")
    player = new YT.Player('lofi-player', {
        height: '180',
        width: '320',
        videoId: musicVideoUrl,
        playerVars: {
            'playsinline': 1,
            'controls': 1,
            'loop': 1,
            'mute': 0,
            'autoplay': 1,
            'fs': 0,
            'modestbranding': 1
        },
        events: {
            'onReady': (e) => {
                el.showLofi.innerText = "[Show]"
                lofiLoaded = true
            }
        }
    })
}
el.showLofi.addEventListener("click", () => {
    el.lofiPlayer = document.getElementById("lofi-player") // This updates!
    if (el.lofiPlayer.style.display == "none") {
        el.lofiPlayer.style.display = "block"
        el.showLofi.innerText = "[Hide]"
    } else {
        el.lofiPlayer.style.display = "none"
        el.showLofi.innerText = "[Show]"
    }
})