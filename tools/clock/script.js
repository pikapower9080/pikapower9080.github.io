let settingsOpen = false
function getSetting(settingId) {
  return document.querySelector(`[settingId='${settingId}']`)
}
function getSettingValue(setting) {
  return setting.value == "on" ? setting.checked : setting.value
}
let saveSettings = []
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
    document.documentElement.style.setProperty("background-image", `url("${"./backgrounds/" + selected.getAttribute("imageUrl")}")`)
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
  el.fontselect.appendChild(option)
})
el.bgselect.addEventListener("input", refreshBg)
el.fontselect.addEventListener("input", refreshFont)

el.opensettings.addEventListener("click", () => {
  settingsOpen = true
  el.settings.showModal()
})
el.settings.addEventListener("cancel", () => {
  settingsOpen = false
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

const settingChildren = el.settings.querySelectorAll("*")
for (let i in settingChildren) {
  const setting = settingChildren[i]
  if (setting && typeof(setting) == "object" && 'getAttribute' in setting && setting.getAttribute("settingId")) {
    saveSettings.push(setting.getAttribute("settingId"))
    setting.addEventListener("input", () => {
      saveOptions()
    })
  }
}
console.log(saveSettings)
function saveOptions() {
  let save = {}
  saveSettings.forEach((setting) => {
    setting = getSetting(setting)
    if (setting) {
      save[setting.getAttribute("settingId")] = getSettingValue(setting)
    }
  })
  localStorage.setItem("clockSettings", JSON.stringify(save))
}
function loadOptions() {
  const savedSave = localStorage.getItem("clockSettings")
  if (savedSave) {
    const saveData = JSON.parse(savedSave)
    if (saveData) {
      for (let k in saveData) {
        const settingElement = getSetting(k)
        if (settingElement) {
          if ('checked' in settingElement) {
            settingElement.checked = saveData[k]
          } else {
            settingElement.value = saveData[k]
          }
        }
        refreshBg()
        refreshFont()
        slowUpdate()
        update()
      }
    } else {
      console.warn("Failed to parse save data")
    }
  }
}
document.addEventListener("keydown", (e) => {
  if (el.customVideoDialog.open) return
  switch (e.key) {
    case "s":
      if (!settingsOpen) {
        settingsOpen = true
        el.settings.showModal()
      } else {
        el.settings.close()
        settingsOpen = false
      }
      break;
    case "f":
      if (document.fullscreenElement == document.documentElement) {
        document.exitFullscreen()
      } else {
        document.documentElement.requestFullscreen()
        el.settings.close() // prevents a weird glitch
      }
    default:
      break;
  }
})

setInterval(update, 500)
setInterval(slowUpdate, 5000)
update()
slowUpdate()
loadOptions()