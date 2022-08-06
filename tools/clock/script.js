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
    bgVideo: document.getElementById("bgVideo")
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
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Tursday", "Friday", "Saturday"]
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

// Setup background select
const bgs = [
  {
    section: "Basic",
    backgrounds: [
      {name:"Custom Color",image:""},
      {name:"Gradient 1",image:"grad1.png"},
      {name:"Gradient 2 (Wave)",image:"grad3.jpeg"},
      {name:"Gradient 3",image:"grad4.jpeg"}
    ]
  },
  {
    section: "makebackground.io",
    backgrounds: [
      {name:"Above the Clouds",image:"abovetheclouds.png"},
      {name:"Burning",image:"burning.png"},
      {name:"Fairy Dust",image:"fairydust.png"},
      {name:"Polygons",image:"polygon.png"},
      {name:"Golden Swirl",image:"swirl.png"}
    ]
  },
  {
    section: "OperaGX",
    backgrounds: [
      {name:"Cyber Splash",image:"cyber.jpg"},
      {name:"Ultraviolet",image:"ultraviolet.jpg"}
    ]
  },
  {
    section: "Windows 11",
    backgrounds: [
      {name:"Glow - Purple & Red",image:"glow1.jpg"},
      {name:"Glow - Blue & Purple",image:"glow2.jpg"},
      {name:"Glow - Orange",image:"glow3.jpg"},
      {name:"Glow - Green & Blue",image:"glow4.jpg"},
      {name:"Abstract",image:"abstract1.jpg"}
    ]
  },
  {
    section: "NightTab",
    backgrounds: [
      {name:"Ferns",image:"ferns.jpeg"},
      {name:"Paint Strokes",image:"paint.jpeg"},
      {name:"Yellow Paint",image:"yellowpaint.jpeg"},
      {name:"City",image:"city.jpg"}
    ]
  },
  {
    section: "Animated (NightTab)",
    backgrounds: [
      {name:"City (Animated)",video:true,image:"https://github.com/zombieFox/nightTabAssets/raw/main/videos/1628152320524.mp4"},
      {name:"Clouds",video:true,color:"black",image:"https://github.com/zombieFox/nightTabAssets/raw/main/videos/1626351606965.mp4"},
      {name:"Clouds 2",video:true,image:"https://github.com/zombieFox/nightTabAssets/raw/main/videos/1626351787997.mp4"},
      {name:"Computer Lights",video:true,image:"https://github.com/zombieFox/nightTabAssets/raw/main/videos/1626352146818.mp4"}
    ]
  }
]
const fonts = [
  {name:"Sans Serif (basic)",family:"sans-serif"},
  {name:"Monospace (equal width)",family:'monospace'},
  {name:"Baloo 2",family:"'Baloo 2'"},
  {name:"Comfortaa",family:"'Comfortaa"},
  {name:"Righteous",family:"'Righteous'"},
  {name:"Fredoka One",family:"'Fredoka One'"},
]
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