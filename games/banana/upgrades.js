// Script for handling upgrades to make things easier on myself and not put them into one scipt.

//var purchased_upgrades = []
// Upgrade class
class Upgrade {
    constructor(upgradename, description, price, icon, onbuy) {
        this.upgradename = upgradename
        this.description = description
        this.price = price
        this.icon = icon
        this.onbuy = onbuy
        var cln = document.getElementsByClassName("upgradebox")[0].cloneNode(true)
        this.element = cln
        document.getElementById("shopcontent").appendChild(cln)
        cln.getElementsByClassName("upgradelabel")[0].innerHTML = this.upgradename
        cln.getElementsByClassName("upgradedescription")[0].innerHTML = this.description
        cln.getElementsByClassName("upgradeicon")[0].setAttribute("src", this.icon)
        setInterval(() => {
            cln.setAttribute("onclick", `if(${points} >= ${this.price}){${this.onbuy}; this.remove()}`)
        }, 1000);
    }
}

// Upgrades themselves

var upgrades_biggercrates = new Upgrade("Bigger Crates", "350 Bananas | Bigger banana crates for even better shipping. | +5 bpc", 350, "assets/bananacrate.png", "alert('Test')")