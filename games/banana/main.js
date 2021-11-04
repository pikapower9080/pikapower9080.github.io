var points = 0
let bpc = 1
var bulidings = {
  "bananacrate": 0,
  "bananatree": 0,
  "monkey": 0
}

// Localstorage checks
function checkstorage(key, defaultvalue) {
    if (localStorage.getItem(key) == null) {
        localStorage.setItem(key, defaultvalue)
        console.log("Saved new value " + defaultvalue + " for " + key)
        return defaultvalue
    } else {
        console.log("Value for " + key + " already exists: " + localStorage.getItem(key))
        return localStorage.getItem(key)
    }
}
buildings = checkstorage("buildings", bulidings)
bpc = checkstorage("bpc", bpc)
var buildings_monkies = checkstorage("bulidings_monkies", 0)
var buildings_bananatrees = checkstorage("buildings_bananatrees", 0)
var buildings_bananacrate = checkstorage("buildings_bananacrate", 0)
var price_monkies = checkstorage("price_monkies", 5000)
var price_bananatrees = checkstorage("price_bananatrees", 1000)
var price_bananacrate = checkstorage("price_bananacrate", 100)

ToggleFloatingLayer('FloatingLayer', 0)

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/games/banana";
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
if (getCookie("save") == null) {
  setCookie("save", 0, 30)
} else {
  points = getCookie("save")
}
function commas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Insert commas to a number
}
function updatecount() {
  document.getElementById("count").innerHTML = `Bananas: ${commas(points)}`
  document.getElementById("bpscount").innerHTML = `+${commas(bpc)} per click`
  setCookie("save", points, 30)
  localStorage.setItem("bpc", bpc)
  localStorage.setItem("bulidings", bulidings)
  localStorage.setItem("buildings_monkies", buildings_monkies)
  localStorage.setItem("buildings_bananacrate", buildings_bananacrate)
  localStorage.setItem("buildings_banannatrees", buildings_bananatrees)
}
function updatepricetags() {
    document.getElementById("bananacrateprice").innerHTML = commas(price_bananacrateP) + " bananas"
    document.getElementById("bananatreeprice").innerHTML = commas(price_bananatrees) + " bananas"
    document.getElementById("monkeyprice").innerHTML = commas(price_monkies) + " bananas"
    localStorage.setItem("price_monkies", price_monkies)
    localStorage.setItem("price_bananatrees", price_bananatrees)
    localStorage.setItem("price_bananacrate", price_bananacrate)
}
function bananaclick() {
    console.log("Click!")
    for (let index = 0; index < bpc; index++) {
      points ++
    }
    // document.getElementById("count").innerHTML = `Bananas: ${points}`
    document.getElementById('clicksound').play()
    updatecount()
}
function purchase(item) {
  console.log("Purchacing " + item)
  switch (item) {
    case 'bananacrate':
      if (points >= price_bananacrate) {
        document.getElementById('clicksound').play()
        buildings_bananacrate ++
        document.getElementById('cratecount').innerHTML = " x" + buildings_bananacrate
        points -= price_bananacrate
        bpc ++
        price_bananacrate = Math.floor(price_bananacrate * 1.2)
        updatepricetags()
      }
      break;
    case 'bananatree':
      if (points >= price_bananatrees) {
        document.getElementById('clicksound').play()
        buildings_bananatrees ++
        document.getElementById('bananatreecount').innerHTML = " x" + buildings_bananatrees
        points -= price_bananatrees
        bpc ++; bpc ++
        price_bananatrees = Math.floor(price_bananatrees * 1.2)
        updatepricetags()
      }
    case 'monkey':
     if (points >= price_monkies) {
         document.getElementById('clicksound').play()
         buildings_monkies ++
         document.getElementById('monkeycount').innerHTML = " x" + buildings_monkies
         points -= price_monkies
         bpc ++; bpc ++; bpc++; bpc ++; bpc++
         price_monkies = Math.floor(price_monkies * 1.2)
         updatepricetags()
     }
    default:
      break;
  }
}
updatepricetags()
setInterval(() => {
  updatecount()
}, 1000);
