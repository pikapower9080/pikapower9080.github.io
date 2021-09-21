function getDOTW() {
    var date = null
    switch (new Date().getDay()) {
      case 0:
        day = "Sunday";
        break;
      case 1:
        day = "Monday";
        break;
      case 2:
        day = "Tuesday";
        break;
      case 3:
        day = "Wednesday";
        break;
      case 4:
        day = "Thursday";
        break;
      case 5:
        day = "Friday";
        break;
      case 6:
        day = "Saturday";
    }
    return day
  }

  function updatebackground(newbackground) {
    switch (backgroundselect.value) {
      case "Glow 1":
        newbackground = "/assets/downloads/win11/wallpapers/Glow/img20.jpg"
        break;
      case "Glow 2":
        newbackground = "/assets/downloads/win11/wallpapers/Glow/img21.jpg"
        break;
      case "Glow 3":
        newbackground = "/assets/downloads/win11/wallpapers/Glow/img22.jpg"
        break;
      case "Glow 4":
        newbackground = "/assets/downloads/win11/wallpapers/Glow/img23.jpg"
        break;
      case "Sunrise 1":
        newbackground = "/assets/downloads/win11/wallpapers/Sunrise/img28.jpg"
        break;
      case "Sunrise 2":
        newbackground = "/assets/downloads/win11/wallpapers/Sunrise/img29.jpg"
        break;
      case "Sunrise 3":
        newbackground = "/assets/downloads/win11/wallpapers/Sunrise/img30.jpg"
        break;
      case "Abstract 1":
        newbackground = "/assets/downloads/win11/wallpapers/touchkeyboard/TouchKeyboardThemeLight003.jpg"
        break;
      case "Abstract 2":
        newbackground = "/assets/downloads/win11/wallpapers/touchkeyboard/TouchKeyboardThemeDark003.jpg"
        break;
      case "Abstract 3":
        newbackground = "/assets/downloads/win11/wallpapers/touchkeyboard/TouchKeyboardThemeLight000.jpg"
        break;
      case "Light blue":
        newbackground = "/assets/downloads/win11/wallpapers/Screen/img105.jpg"
        break;
      case "Burning":
        newbackground = "/assets/downloads/wallpapers/static/Burning.png"
        break;
      case "Polygon":
        newbackground = "/assets/downloads/wallpapers/static/Polygon.png"
        break;
      case "Gradiant Wave":
        newbackground = "/assets/downloads/wallpapers/static/GradientWave.png"
        break;
      case "Yellow Swirl":
        newbackground = "/assets/downloads/wallpapers/static/Mystery.png"
        break;
      default:
        newbackground = "/assets/clockbackground.png"
        break;
    }
    return newbackground
  }


function getseconds() {
  // Function to get seconds because adding the zero is kind of complicated-ish-not really
  const date = new Date()
  var seconds = date.getSeconds()
  if (seconds < 10) {
    return "0" + seconds   
  } else {
    return seconds
  }
}

  function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    if (document.getElementById("showseconds").checked) {
      var strTime = hours + ':' + minutes + ':' + getseconds()
    } else {
      var strTime = hours + ':' + minutes
    }
    if (document.getElementById("showampm").checked) {
      strTime += ' ' + ampm;             
    }
    return strTime;
  }

function getElement(id) {
  return document.getElementById(id)
}
