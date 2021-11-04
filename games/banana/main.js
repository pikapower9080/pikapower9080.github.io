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
bpc = checkstorage("bpc", bpc)
var buildings_monkies = checkstorage("bulidings_monkies", 0)
var buildings_bananatrees = checkstorage("buildings_bananatrees", 0)
var buildings_bananacrate = checkstorage("buildings_bananacrate", 0)
var buildings_magikgrow = checkstorage("buildings_magikgrow", 0)
var buildings_forest = checkstorage("buildings_forest", 0)
var price_monkies = checkstorage("price_monkies", 5000)
var price_bananatrees = checkstorage("price_bananatrees", 1000)
var price_bananacrate = checkstorage("price_bananacrate", 100)
var price_magikgrow = checkstorage("price_magikgrow", 10000)
var price_forest = checkstorage("price_forest", 50000)

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
  localStorage.setItem("buildings_monkies", buildings_monkies)
  localStorage.setItem("buildings_bananacrate", buildings_bananacrate)
  localStorage.setItem("buildings_bananatrees", buildings_bananatrees)
  localStorage.setItem("buildings_magikgrow", buildings_magikgrow)
  localStorage.setItem("buildings_forest", buildings_forest)
}
function updatepricetags() {
    document.getElementById("bananacrateprice").innerHTML = commas(price_bananacrate) + " bananas"
    document.getElementById("bananatreeprice").innerHTML = commas(price_bananatrees) + " bananas"
    document.getElementById("monkeyprice").innerHTML = commas(price_monkies) + " bananas"
    document.getElementById("magikgrowprice").innerHTML = commas(price_magikgrow) + " bananas"
    document.getElementById("forestprice").innerHTML = commas(price_forest) + " bananas"
    localStorage.setItem("price_monkies", price_monkies)
    localStorage.setItem("price_bananatrees", price_bananatrees)
    localStorage.setItem("price_bananacrate", price_bananacrate)
    localStorage.setItem("price_magikgrow", price_magikgrow)
    localStorage.setItem("price_forest", price_forest)
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
function addtobpc(amount) {
  for (let index = 0; index < amount; index++) {
    bpc ++
  }
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
      break;
    case 'monkey':
     if (points >= price_monkies) {
         document.getElementById('clicksound').play()
         buildings_monkies ++
         document.getElementById('monkeycount').innerHTML = " x" + buildings_monkies
         points -= price_monkies
         bpc ++; bpc ++; bpc++; bpc ++; bpc++; bpc ++; bpc ++; bpc++; bpc ++; bpc++;
         price_monkies = Math.floor(price_monkies * 1.2)
         updatepricetags()
     }
     break;
     case 'magikgrow':
      if (points >= price_monkies) {
          document.getElementById('clicksound').play()
          buildings_magikgrow ++
          document.getElementById('magikgrowcount').innerHTML = " x" + buildings_magikgrow
          points -= price_magikgrow
          addtobpc(20)
          price_magikgrow = Math.floor(price_magikgrow * 1.2)
          updatepricetags()
      }
      break;
      case 'forest':
        if (points >= price_forest) {
            document.getElementById('clicksound').play()
            buildings_forest ++
            document.getElementById('forestcount').innerHTML = " x" + buildings_forest
            points -= price_forest
            addtobpc(50)
            price_forest = Math.floor(price_forest * 1.2)
            updatepricetags()
        }
      break;
    default:
      break;
  }
}
function storagetest() {
  var testtext = prompt("Enter anything below:")
  try {
    localStorage.setItem("localstorage_test", testtext)
  } catch (error) {
    alert("Oh no! It looks like something's wrong. Your input couldn't be saved. Here's all I know: " + error)
  } finally {
    alert("Ok, finished doing that. Now reload the page and click on the other link to see if your value was saved.")
  }
}
function finishstoragetest() {
  var confirmlstest = confirm("If everything worked as it should have, you should see the text you entered when you click ok.")
  if (confirmlstest == true) {
    alert(localStorage.getItem("localstorage_test"))
  }
}
function wipe() {
  var wipeareyousure = confirm("Are you SURE?? THIS CAN NOT BE UNDONE AND WILL ERASE ALL OF YOUR PROGRESS!!!!!")
  if (wipeareyousure == true) {
    var totallyextraverysure = confirm("Ok this is your last warning. Don't say I didn't warn you.")
    if (totallyextraverysure == true) {
      localStorage.clear()
      points = 0
      setCookie("save", 0, 30)
      window.location.href = "https://pikapower9080.github.io/games/banana/"
    } else {
      alert("That was a close one!")
    }
  } else {
    alert("That was a close one!")
  }
}
updatepricetags()
setInterval(() => {
  updatecount()
}, 1000);
