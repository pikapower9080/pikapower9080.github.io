const el = {
  time: document.getElementById("time"),
  date: document.getElementById("date"),
  main: document.querySelector("main"),
  bgselect: document.getElementById("bgselect"),
  fontselect: document.getElementById("fontselect"),
  bgcolor: document.getElementById("bgcolor"),
  opensettings: document.getElementById("settings-open"),
  buttons: document.getElementById("buttons"),
  openfullscreen: document.getElementById("fullscreen"),
  settings: document.getElementById("settings"),
  hideInFullscreen: document.getElementById("hideInFullscreen"),
  showSeconds: document.getElementById("showSeconds"),
  militaryTime: document.getElementById("24hourtime"),
  bgVideo: document.getElementById("bgVideo"),
  doTitle: document.getElementById("doTitle"),
  showDate: document.getElementById("showDate"),
  bgVideo: document.getElementById("bgVideo"),
  lofiMusic: document.getElementById("playlofi"),
  showLofi: document.getElementById("show-lofi"),
  lofiPlayer: document.getElementById("lofi-player")
}

const toast = function(message, lifetime, useDefaultStyle, classNames){
  if (!lifetime) lifetime = 5000
  var toast = document.createElement("span")
  document.body.appendChild(toast)
  toast.classList.add("toast")
  toast.innerHTML = message
  setTimeout(() => {
      toast.remove()
  }, lifetime);
  return toast
}
function getDOTW(day) {
    return days[day] || "???"
}
function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    if (!el.militaryTime.checked) {
      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0'+minutes : minutes;
      var strTime = hours + ':' + minutes + getseconds(date.getSeconds())
      strTime += ' ' + ampm;             
      return strTime;
    } else {
      minutes = minutes < 10 ? '0'+minutes : minutes;
      var strTime = hours + ':' + minutes + getseconds(date.getSeconds())
      return strTime
    }
}
function getseconds(seconds) {
  if (el.showSeconds.checked) {
    if (seconds < 10) {
      return ":" +  "0" + seconds   
    } else {
      return ":" +  seconds
    }
  } else {
    return ""
  }
}
function getdate() {
  if (el.showDate.checked) {
    const d = new Date()
    return `${getDOTW(d.getDay())} ${d.getUTCMonth() + 1}/${d.getUTCDate()}/${d.getUTCFullYear()}`
  } else {
    return ''
  }    
}
function formatTitle(){
  const date = new Date();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  if (!el.militaryTime.checked) {
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes
    strTime += ' ' + ampm;             
    return strTime;
  } else {
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes
    return strTime
  }
}
function update() {
  el.time.innerText = formatAMPM(new Date())
}
function slowUpdate() {
  el.date.innerText = getdate()
  if (el.doTitle.checked) {
    document.title = formatTitle()
  } else {
    document.title = "Clock"
  }
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
  el.fontselect.appendChild(option)
})
el.bgselect.addEventListener("input", () => {
  const selected = el.bgselect.options[el.bgselect.selectedIndex]
  if (selected.getAttribute("isVideo") == "true") {
    el.bgVideo.style.display = "unset"
    el.bgVideo.querySelector("source").src = selected.getAttribute("imageUrl")
    el.bgVideo.load()
    el.bgVideo.play()
  } else {
    el.bgVideo.pause()
    el.bgVideo.style.display = "none"
    document.documentElement.style.setProperty("background-image", `url("${"./backgrounds/" + selected.getAttribute("imageUrl")}")`)
  }
  if (selected.getAttribute("textColor")) {
    document.documentElement.style.setProperty("--font-color", selected.getAttribute("textColor"))
  } else {
    document.documentElement.style.setProperty("--font-color", "#ffffff")
  }
})
el.fontselect.addEventListener("input", () => {
  document.documentElement.style.setProperty("--font", el.fontselect.options[el.fontselect.selectedIndex].getAttribute("family"))
})
el.opensettings.addEventListener("click", () => {
  el.settings.showModal()
})
el.doTitle.addEventListener("input", slowUpdate)
el.showDate.addEventListener("input", slowUpdate)
el.openfullscreen.addEventListener("click", () => {
  if (document.fullscreenElement == document.documentElement) {
    document.exitFullscreen()
  } else {
    document.documentElement.requestFullscreen()
  }
})
el.bgcolor.addEventListener("input", () => {
  document.documentElement.style.setProperty("--custom-color", el.bgcolor.value)
})
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
document.addEventListener("fullscreenchange", () => {
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
})
bgVideo.addEventListener("contextmenu", (e) => {
  e.preventDefault()
})

setInterval(update, 500)
setInterval(slowUpdate, 5000)
update()
slowUpdate()