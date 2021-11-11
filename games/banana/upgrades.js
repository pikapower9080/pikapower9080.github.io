// Script for handling upgrades to make things easier on myself and not put them into one scipt.

/*
=============================================
This is a work in progress, so it's not published yet
=============================================
*/

var p_upgrades = []

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
        this.onbuy = onbuy
        var origUpgrade = document.getElementsByClassName("upgradebox")[0]
        var cln = origUpgrade.cloneNode(true)
        this.element = cln
        document.getElementById("shopcontent").appendChild(cln)
        cln.getElementsByClassName("upgradelabel")[0].innerHTML = this.upgradename
        cln.getElementsByClassName("upgradedescription")[0].innerHTML = this.description
        cln.getElementsByClassName("upgradeicon")[0].setAttribute("src", this.icon)
        cln.setAttribute("onclick", `if(points >= ${this.price}){${this.onbuy}; points -= ${this.price}; addtoupgradeslist("${this.upgradename}"); this.remove()}`)
    }
    
}

function newupgrade(upgradename, description, price, icon, onbuy) {
    p_upgrades = localStorage.getItem("p_upgrades").split(",")
    if (p_upgrades.includes(upgradename)) {
        console.log(`Upgrade ${upgradename} was already purcased an was ignored.`)
    } else {
        console.log(`Upgrade ${upgradename} was not already purchased.`)
        return new Upgrade(upgradename, description, price, icon, onbuy)
    }
    localStorage.setItem("p_upgrades", p_upgrades)
}

var biggercrates = newupgrade("Bigger Crates", "350 Bananas | Bigger banana crates for even better shipping. | x2 Banana crate production", 350, "assets/bananacrate.png", "addtobpc(5)")
var stock = newupgrade("Go Public", "1000 Bananas | Your banana company is now public! Anyone can buy and sell stock shares on the market. | +10 bpc", 1000, "assets/paper.png", "addtobpc(10)")
var gmotrees = newupgrade("Genetically modified trees", "5000 Bananas | Your trees have been genetically modified for extra banana income | x2 Banana Tree production", 5000, "assets/bananaforest.png", "addtobpc(20)")
var monkeycult = newupgrade("Monkey Cult", "8000 Bananas | A cult of loyal monkeys to convice others to buy your bananas; In a perfectly legal matter of course 😊 | +35 bpc, x2 Monkey Production", 8000, "assets/monkey.png", "addtobpc(35)")
var monkeypoop = newupgrade("Monkey Poop", "20000 | Juicy monkey poo to improve your fertilizer💩 | x2 Fertilizer Production", 20000, "assets/magikgrow.png")

var upgrades = {biggercrates, stock, gmotrees}

document.getElementsByClassName("upgradebox")[0].remove()