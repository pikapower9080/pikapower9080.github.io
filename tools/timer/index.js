const el = {
  timer: document.getElementById("timer"),
  main: document.querySelector("main"),
  form: document.getElementById("settingsForm"),
  bgselect: document.getElementById("bgselect"),
  fontselect: document.getElementById("fontselect"),
  buttons: document.getElementById("buttons"),
  openfullscreen: document.getElementById("fullscreen"),
  settings: document.getElementById("settings"),
  hideInFullscreen: document.getElementById("hideInFullscreen"),
  bgVideo: document.getElementById("bgVideo"),
  doTitle: document.getElementById("doTitle"),
  lofiMusic: document.getElementById("playlofi"),
  showLofi: document.getElementById("show-lofi"),
  lofiPlayer: document.getElementById("lofi-player"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
  playPause: document.getElementById("playpause"),
  stopButton: document.getElementById("stop")
}

let timerObject = null

el.settings.showModal()
el.settings.addEventListener("cancel", (e) => {
  e.preventDefault()
})
el.hours.max = 99
el.hours.min = 0
el.minutes.max = 59
el.minutes.min = 0
el.seconds.max = 59
el.seconds.min = 0

// Modified from https://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss
function formatSeconds(sec_num) {
  let h = Math.floor(sec_num / 3600)
  let m = Math.floor((sec_num - (h * 3600)) / 60)
  let s = sec_num - (h * 3600) - (m * 60)
  
  h > 10 ? h = "0" + h : h
  m > 10 ? m = "0" + m : m
  s > 10 ? s = "0" + s : s
  return `${h}:${m}:${s}`
}
function onEnd() {
  alert("Done!")
}

function updateTimer(sec) {
  sec = Math.round(sec/1000)
  var h = Math.floor(sec / 3600)
  var m = Math.floor(sec % 3600 / 60)
  var s = Math.floor(sec % 3600 % 60)
  m < 10 ? m = '0' + m : m
  s < 10 ? s = '0' + s : s
  el.timer.innerText = `${h}:${m}:${s}`
  if (el.doTitle.checked) {
    document.title = `${h}:${m}:${s} - Timer`
  }
}

function onPause() {
  if (timerObject) {
    el.playPause.querySelector("img").src = "icons/play.png"
  }
}
function onStart() {
  if (timerObject) {
    el.playPause.querySelector("img").src = "icons/pause.png"
  }
}

el.form.addEventListener("submit", (e) => {
  e.preventDefault()

  let h = el.hours.value
  let m = el.minutes.value
  let s = el.seconds.value

  let totalSeconds = (h * 3600) + (m * 60) + s
  totalSeconds = totalSeconds / 10 // This is a band-aid fix and I have no idea why the bug was happening
  
  if (totalSeconds < 60) {
    alert("Minimum time is one minute")
  } else {
    el.settings.close()
    timerObject = new Timer({
      tick: 1,
      ontick: updateTimer,
      onend: onEnd,
      onpause: onPause,
      onstart: onStart
    })
    timerObject.start(totalSeconds)
  }
})

// Refresh Functions

function refreshBg() {
  const selected = el.bgselect.options[el.bgselect.selectedIndex]
  if (selected.getAttribute("isVideo") == "true") {
    el.bgVideo.style.display = "unset"
    el.bgVideo.querySelector("source").src = selected.getAttribute("imageUrl")
    el.bgVideo.load()
    el.bgVideo.play()
  } else {
    el.bgVideo.pause()
    el.bgVideo.style.display = "none"
    document.documentElement.style.setProperty("background-image", `url("${"../clock/backgrounds/" + selected.getAttribute("imageUrl")}")`)
  }
  if (selected.getAttribute("textColor")) {
    document.documentElement.style.setProperty("--font-color", selected.getAttribute("textColor"))
  } else {
    document.documentElement.style.setProperty("--font-color", "#ffffff")
  }
}
function refreshFont() {
  document.documentElement.style.setProperty("--font", el.fontselect.options[el.fontselect.selectedIndex].getAttribute("family"))
}
function refreshColor() {
  document.documentElement.style.setProperty("--custom-color", el.bgcolor.value)
}

bgs.forEach((section) => {
  const optgroup = document.createElement("optgroup")
  optgroup.label = section.section
  section.backgrounds.forEach((bg) => {
    const option = document.createElement("option")
    option.innerText = bg.name
    option.setAttribute("imageUrl",bg.image)
    if ('video' in bg && bg.video == true) {
      option.setAttribute("isVideo",true)
    }
    if ('color' in bg) {
      option.setAttribute("textColor", bg.color)
    }
    optgroup.appendChild(option)
  })
  el.bgselect.appendChild(optgroup)
})
fonts.forEach((family) => {
  const option = document.createElement("option")
  option.innerText = family.name
  option.setAttribute("family", family.family)
  option.style.setProperty("font-family", `${family.family}, sans-serif`)
  el.fontselect.appendChild(option)
})
el.bgselect.addEventListener("input", refreshBg)
el.fontselect.addEventListener("input", refreshFont)

// handle lofi
let lofiLoaded = false
let lofiHidden = false
let player;
el.lofiMusic.addEventListener("click", () => {
  if (!lofiLoaded) {
    console.log("Loading youtube iframe api")
    let tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  } else if (lofiHidden == false) {
    player.pauseVideo()
    // player.getIframe().style.display = "none"
    lofiHidden = true
  } else if (lofiHidden == true) {
    // player.getIframe().style.display = "block"
    player.playVideo()
    lofiHidden = false
  }
})
function onYouTubeIframeAPIReady() {
  console.log("Setting up player")
  player = new YT.Player('lofi-player', {
    height: '180',
    width: '320',
    videoId: 'n61ULEU7CO0',
    playerVars: {
      'playsinline': 1,
      'controls': 1,
      'loop': 1,
      'mute': 0,
      'autoplay': 1,
      'start': Math.floor(Math.random() * 14000),
      'fs': 0,
      'modestbranding': 1
    },
    events: {
      'onReady': (e) => {console.log("Ready!"); el.showLofi.innerText = "[Show]"; lofiLoaded = true;}
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
// Change the fullscreen icon when entering or exiting fullscreen
function onFullscreenChange() {
  if (document.fullscreenElement == document.documentElement) {
    if (hideInFullscreen.checked) {
      document.documentElement.style.cursor = "none"
      el.buttons.style.visibility = "hidden"
    }
    el.openfullscreen.querySelector("img").src = "/assets/icons/fullscreen/exitfullscreen2.svg"
  } else {
    if (hideInFullscreen.checked) {
      document.documentElement.style.cursor = "unset"
      el.buttons.style.visibility = "visible"
    }
    el.openfullscreen.querySelector("img").src = "/assets/icons/fullscreen/fullscreen2.svg"
  }
}
document.addEventListener("fullscreenchange", onFullscreenChange)
el.openfullscreen.addEventListener("click", () => {
  if (document.fullscreenElement == document.documentElement) {
    document.exitFullscreen()
  } else {
    document.documentElement.requestFullscreen()
  }
})
el.playPause.addEventListener("click", () => {
  if (timerObject) {
    if (timerObject.getStatus() == "paused") {
      timerObject.start(timerObject._.lastDuratoin)
    } else {
      timerObject.pause()
    }
  }
})
el.stopButton.addEventListener("click", () => {
  if (timerObject) {
    timerObject.stop()
    el.settings.showModal()
  }
})
bgVideo.addEventListener("contextmenu", (e) => {
  e.preventDefault()
})

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "f":
      if (document.fullscreenElement == document.documentElement) {
        document.exitFullscreen()
      } else {
        document.documentElement.requestFullscreen()
      }
    default:
      break;
  }
})