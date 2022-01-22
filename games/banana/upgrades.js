// Script for handling upgrades to make things easier on myself and not put them into one scipt.

var p_upgrades = []

p_upgrades = checkstorage("p_upgrades", [])

function addtoupgradeslist(upgradename) {
    p_upgrades.push(upgradename)
    localStorage.setItem("p_upgrades", p_upgrades.join())
}

class Upgrade {
    constructor(upgradename, description, price, icon, onbuy) {
        this.upgradename = upgradename
        this.description = description
        this.price = price
        this.icon = icon
        this.onbuy = new Function(onbuy)
        var origUpgrade = document.getElementsByClassName("upgradebox")[0]
        var cln = origUpgrade.cloneNode(true)
        this.element = cln
        document.getElementById("shopcontent").appendChild(cln)
        cln.getElementsByClassName("upgradelabel")[0].innerHTML = this.upgradename
        cln.getElementsByClassName("upgradedescription")[0].innerHTML = this.description
        cln.getElementsByClassName("upgradeicon")[0].setAttribute("src", this.icon)
        //cln.setAttribute("onclick", `if(points >= ${this.price}){${this.onbuy}; points -= ${this.price}; addtoupgradeslist("${this.upgradename}"); this.remove()}`)
        $(cln).click(function(){
            if (points >= price) {
                logverbose(onbuy)
                new Function(onbuy)()
                points -= price
                addtoupgradeslist(upgradename)
                cln.remove()
                saveyields()
                updatebulidingcounts()
                logverbose("Purchased " + upgradename)
            }
        })
    }
}

function newupgrade(upgradename, description, price, icon, onbuy) {
    p_upgrades = localStorage.getItem("p_upgrades").split(",")
    if (p_upgrades.includes(upgradename)) {
        if (verbose) {
            console.log(`Upgrade ${upgradename} was already purcased an was ignored.`)
        }
    } else {
        if (verbose) {
            console.log(`Upgrade ${upgradename} was not already purchased.`)
        }
        return new Upgrade(upgradename, description, price, icon, onbuy)
    }
    localStorage.setItem("p_upgrades", p_upgrades)
}

var biggercrates = newupgrade("Bigger Crates", "350 Bananas | Bigger banana crates for even better shipping. | x2 Banana crate production", 350, "assets/bananacrate.png", "yield_bananacrate = yield_bananacrate * 2")
// var stock = newupgrade("Go Public", "1000 Bananas | Your banana company is now public! Anyone can buy and sell stock shares on the market. | +10 bpc", 1000, "assets/paper.png", "addtobpc(10)") Sadly, this won't work with the new bpc system :(
var gmotrees = newupgrade("Genetically modified trees", "5000 Bananas | Your trees have been genetically modified for extra banana income | x2 Banana Tree production", 5000, "assets/bananaforest.png", "yield_bananatree = yield_bananatree * 2")
var monkeycult = newupgrade("Monkey Cult", "8000 Bananas | A cult of loyal monkeys to convice others to buy your bananas; In a perfectly legal matter of course 😊 | x2 Monkey Production", 8000, "assets/monkey.png", "yield_monkey = yield_monkey * 2")
var monkeypoop = newupgrade("Monkey Poop", "20000 Bananas | Juicy monkey poo to improve your fertilizer💩 | x2 Fertilizer Production", 20000, "assets/magikgrow.png", "yield_magikgrow = yield_magikgrow * 2")
var bettermagikgrow = newupgrade("Improved Fertilizer", "50,000 Bananas | Higher quality fertilizer that's better than magic | x3 Fertilizer Production", 50000, "assets/magikgrow.png", "yield_magikgrow = yield_magikgrow * 3")
var betterforests = newupgrade('"Responsable Foresting"', "250,000 Bananas | I'm sure you're telling the truth on your packaging... because you wouldn't lie, would you? | x2 Forest Production", 250000, "assets/bananaforest.png", "yield_forest = yield_forest * 2")
var bettermachine = newupgrade("Assembly Line", "500,000 Bananas | Just like the old days! | x2 Machine Production", 500000, "assets/bananamachine.png", "yield_machine = yield_machine * 2")

// var universe = newupgrade("Universal Expansion", "1,000,000 Bananas | Your banana brand is now not just worldwide, but loved across the galaxy! You are now in control of the FIRST GALACTIC BANANA EMPIRE!", 1000000, "assets/planet.png") // This one is coming soon ;)

var upgrades = {biggercrates, gmotrees, monkeycult, monkeypoop, bettermagikgrow, betterforests}

document.getElementsByClassName("upgradebox")[0].remove()