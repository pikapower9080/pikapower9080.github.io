// Script for handling upgrades to make things easier on myself and not put them into one scipt.

/*
=============================================
This is a work in progress, so it's not published yet
=============================================
*/

// Upgrade class
// class Upgrade {
//     constructor(upgradename, description, price, icon, onbuy) {
//         this.upgradename = upgradename
//         this.description = description
//         this.price = price
//         this.icon = icon
//         this.onbuy = onbuy
//         var origUpgrade = document.getElementsByClassName("upgradebox")[0]
//         var cln = origUpgrade.cloneNode(true)
//         this.element = cln
//         document.getElementById("shopcontent").appendChild(cln)
//         cln.getElementsByClassName("upgradelabel")[0].innerHTML = this.upgradename
//         cln.getElementsByClassName("upgradedescription")[0].innerHTML = this.description
//         cln.getElementsByClassName("upgradeicon")[0].setAttribute("src", this.icon)
//         cln.setAttribute("onclick", `if(points >= ${this.price}){${this.onbuy}; points -= ${this.price}; this.remove()}`)
//     }
// }
// setInterval(() => {
//     localStorage.setItem("upgradespurchased", purchased_upgrades)
// }, 1000);

// var biggercrates = new Upgrade("Bigger Crates", "350 Bananas | Bigger banana crates for even better shipping. | +5 bpc", 350, "assets/bananacrate.png", "addtobpc(5)")
// var stock = new Upgrade("Go Public", "1000 Bananas | Your banana company is now public! Anyone can buy and sell stock shares on the market. | +10 bpc", 1000, "assets/paper.png", "addtobpc(10)")
// var gmotrees = new Upgrade("Genetically modified trees", "5000 Bananas | Your trees have been genetically modified for extra banana income | +20 bpc", 5000, "assets/bananaforest.png", "addtobpc(20)")
// var monkeycult = new Upgrade("Monkey Cult", "8000 Bananas | A cult of loyal monkeys to convice others to buy your bananas; In a perfectly legal matter of course 😊 | +35 bpc", 8000, "assets/monkey.png", "addtobpc(35)")

// var upgrades = {biggercrates, stock, gmotrees}

// document.getElementsByClassName("upgradebox")[0].remove()