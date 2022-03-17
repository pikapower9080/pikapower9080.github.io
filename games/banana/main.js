/*
  Fun fact: This is the ungliest source code ever.
  I don't want to rewrite the whole thing just so that I can make this more efficent so deal with it.
  By the way I had trouble saving arrays or json or whatever in localstorage so there's a key for every single upgrade :(
*/
var points = 0
let bpc = 1
var bulidings = {
  "bananacrate": 0,
  "bananatree": 0,
  "monkey": 0
}
console.log("=0 z0mg a hecker!!1!1")
console.log("Remember that cheating isn't fun!")
const verbose = false // Used for testing and debugging. Maybe there will be an option for this soon?

function logverbose(logtext){
  if(verbose) {
    console.log(logtext)
  }
}
// Localstorage checks
function checkstorage(key, defaultvalue) {
    if (localStorage.getItem(key) == null) {
        localStorage.setItem(key, defaultvalue)
        logverbose("Saved new value " + defaultvalue + " for " + key)
        return defaultvalue
    } else {
        logverbose("Value for " + key + " already exists: " + localStorage.getItem(key))
        return localStorage.getItem(key)
    }
}
function calcprice(defaultprice, amount){
  let n = defaultprice
  for (let index = 0; index < amount; index++) {
      n = Math.floor(n * 1.2)
  }
  return n
}
//bpc = checkstorage("bpc", bpc) // Bpc is now calculated instead of stored. Same goes with any similar code i comment out
bpc = calcbpc()
var username = checkstorage("username", makeUsername())
var buildings_monkeys = checkstorage("buildings_monkeys", 0)
var buildings_bananatrees = checkstorage("buildings_bananatrees", 0)
var buildings_bananacrate = checkstorage("buildings_bananacrate", 0)
var buildings_magikgrow = checkstorage("buildings_magikgrow", 0)
var buildings_forest = checkstorage("buildings_forest", 0)
var buildings_machine = checkstorage("buildings_machine", 0)
var buildings_box = checkstorage("buildings_box", 0)
var buildings_wizard = checkstorage("buildings_wizard", 0)
var price_monkeys = calcprice(7500, buildings_monkeys)
var price_bananatrees = calcprice(1000, buildings_bananatrees)
var price_bananacrate = calcprice(100, buildings_bananacrate)
var price_magikgrow = calcprice(10000, buildings_magikgrow)
var price_forest = calcprice(50000, buildings_forest)
var price_machine = calcprice(100000, buildings_machine)
var price_box = calcprice(200000, buildings_box)
var price_wizard = calcprice(350000, buildings_wizard)
var yield_bananacrate = checkstorage("yield_bananacrate", 1)
var yield_bananatree = checkstorage("yield_bananatree", 2)
var yield_monkey = checkstorage("yield_monkey", 10)
var yield_magikgrow = checkstorage("yield_magikgrow", 20)
var yield_forest = checkstorage("yield_forest", 50)
var yield_machine = checkstorage("yield_machine", 75)
var yield_box = checkstorage("yield_box", 125)
var yield_wizard = checkstorage("yield_wizard", 250)

function calcbpc(){
  let newbpc = 1
  var buildingsl = [buildings_bananacrate, buildings_bananatrees, buildings_monkeys, buildings_magikgrow, buildings_forest, buildings_machine, buildings_box, buildings_wizard]
  var yieldl = [yield_bananacrate, yield_bananatree, yield_monkey, yield_magikgrow, yield_forest, yield_machine, yield_box, yield_wizard]
  for (let index = 0; index < buildingsl.length; index++) {
    const element = yieldl[index];
    newbpc += buildingsl[index] * yieldl[index]
  }
  return newbpc
}

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
function resetusername() {
  username = makeUsername()
  localStorage.setItem("username", username)
}
function updatecount() {
  document.getElementById("count").innerHTML = `Bananas: ${commas(points)}`
  bpc = calcbpc()
  document.getElementById("bpscount").innerHTML = `+${commas(bpc)} per click` // Fun fact: It used to be called bps for bananas per second!
  document.getElementById("yourname").innerHTML = username + "'s Banana " + getstandlevel() 
  setCookie("save", points, 30)
  localStorage.setItem("buildings_monkeys", buildings_monkeys)
  localStorage.setItem("buildings_bananacrate", buildings_bananacrate)
  localStorage.setItem("buildings_bananatrees", buildings_bananatrees)
  localStorage.setItem("buildings_magikgrow", buildings_magikgrow)
  localStorage.setItem("buildings_forest", buildings_forest)
  localStorage.setItem("buildings_machine", buildings_machine)
  localStorage.setItem("buildings_box", buildings_box)
  localStorage.setItem("buildings_wizard", buildings_wizard)
}
function updatepricetags() {
    document.getElementById("bananacrateprice").innerHTML = commas(price_bananacrate) + " bananas"
    document.getElementById("bananatreeprice").innerHTML = commas(price_bananatrees) + " bananas"
    document.getElementById("monkeyprice").innerHTML = commas(price_monkeys) + " bananas"
    document.getElementById("magikgrowprice").innerHTML = commas(price_magikgrow) + " bananas"
    document.getElementById("forestprice").innerHTML = commas(price_forest) + " bananas"
    document.getElementById("machineprice").innerHTML = commas(price_machine) + " bananas"
    document.getElementById("boxprice").innerHTML = commas(price_box) + " bananas"
    document.getElementById("wizardprice").innerHTML = commas(price_wizard) + " bananas"
}
function updatebulidingcounts() {
  document.getElementById('cratecount').innerHTML = " x" + buildings_bananacrate
  document.getElementById('bananatreecount').innerHTML = " x" + buildings_bananatrees
  document.getElementById('monkeycount').innerHTML = " x" + buildings_monkeys
  document.getElementById('magikgrowcount').innerHTML = " x" + buildings_magikgrow
  document.getElementById('forestcount').innerHTML = " x" + buildings_forest
  document.getElementById('machinecount').innerHTML = " x" + buildings_machine
  document.getElementById('boxcount').innerHTML = " x" + buildings_box
  document.getElementById('wizardcount').innerHTML = " x" + buildings_wizard
  document.getElementById('yield_bananacrate').innerHTML = `+${yield_bananacrate} Banana(s) per click`
  document.getElementById('yield_bananatree').innerHTML = `+${yield_bananatree} Bananas per click`
  document.getElementById('yield_monkey').innerHTML = `+${yield_monkey} Bananas per click`
  document.getElementById('yield_magikgrow').innerHTML = `+${yield_monkey} Bananas per click`
  document.getElementById('yield_forest').innerHTML = `+${yield_forest} Bananas per click`
  document.getElementById('yield_machine').innerHTML = `+${yield_machine} Bananas per click`
  document.getElementById('yield_box').innerHTML = `+${yield_machine} Bananas per click`
  document.getElementById('yield_wizard').innerHTML = `+${yield_wizard} Bananas per click`
}
function saveyields(){
  localStorage.setItem("yield_bananacrate", yield_bananacrate)
  localStorage.setItem("yield_bananatree", yield_bananatree)
  localStorage.setItem("yield_monkey", yield_monkey)
  localStorage.setItem("yield_magikgrow", yield_magikgrow)
  localStorage.setItem("yield_forest", yield_forest)
  localStorage.setItem("yield_machine", yield_machine)
  localStorage.setItem("yield_box", yield_box)
  localStorage.setItem("yield_wizard", yield_wizard)
}
function bananaclick() {
    // console.log("Click!")
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
function processpurchase(price, bpcamount){
  if (points >= price) {
    points -= price
    addtobpc(bpcamount)
    updatepricetags(); updatebulidingcounts()
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
      points = 0
      bpc = 1
      setCookie("save", 0, 30)
      window.location.href = "https://pikapower9080.github.io/games/banana/"
    } else {
      alert("That was a close one!")
    }
  } else {
    alert("That was a close one!")
  }
}
// Show the changelog popup
document.getElementById("changelog").showModal()
var clbbdb = false // Stands for changelog big banana debounce
$("#changelogbigbanana").click(function(){
  if (clbbdb == false) {
    clbbdb = true
    document.getElementById("changelogbigbanana").classList.add("rotateanim")
    document.getElementById("changelogbigbanana").classList.remove("shakeanim")
    setTimeout(() => {
      document.getElementById("changelogbigbanana").classList.remove("rotateanim")
      document.getElementById("changelogbigbanana").classList.add("shakeanim")
      clbbdb = false
    }, 500);
  }
})
function onupdate(){
  updatepricetags()
  updatebulidingcounts()
  updatecount()
  bpc = calcbpc()
}
onupdate()
setInterval(() => {
  updatecount()
}, 1000);
