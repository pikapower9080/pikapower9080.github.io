function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
function getElement(id) {
    return document.getElementById(id)
}

function checkdarkmodecookie() {
    if (getCookie("darkmode") == "") {
        console.log("Setting darkmode cookie to false")
        setCookie("darkmode", "false", 30)
    }
}
checkdarkmodecookie()
function updatedarkmode() {
    console.log("Checking for dark mode...")
    var isdarkmode = getCookie("darkmode")
    var stylesheet = getElement("stylesheet")
    if (isdarkmode == "false") {
        stylesheet.setAttribute("href", "/style.css")
    } else {
        stylesheet.setAttribute("href", "/assets/css/darkmode.css")
    }
    console.log("Updated dark mode.")
}
updatedarkmode()
function toggledarkmode() {
    // If the cookies doesn't exist, create it
    checkdarkmodecookie()
    console.log("Toggle dark mode")
    var isdarkmode = getCookie("darkmode")
    if (isdarkmode == "true") {
        setCookie("darkmode", "false", 30)
        console.log(getCookie("darkmode"))
    } else {
        setCookie("darkmode", "true", 30)
        console.log(getCookie('darkmode'))
    }
    console.log("Done")
    updatedarkmode()
}