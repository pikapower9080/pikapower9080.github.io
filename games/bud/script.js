/*
    PPST: Maybe don't read the code, it takes away from some of the fun!
*/

var chatform = document.getElementById("chatform")
var chatinput = document.getElementById("chat-input")
var template = document.getElementById("list-template")
var chathistory = document.getElementById("chat-history")
var windowdiv = document.getElementById("window")

var playername;

var idk = ["Sorry, I don't know that.", "Sadly, I have no clue", "idk", "Sorry, Don't know", "I hate to break it to you, but I don't know", "I'm a poorly programmed chat bot, do you seriously expect me to know <em>that?</em>", "Ugh, I don't know", "no clue", "Who knows", "Ask me something else"]

var responses = []
var messagecount = 1
function addMessage(message){
    messagecount ++
    var clone = template.cloneNode(true)
    clone.innerHTML = message
    clone.setAttribute("id", `message-${messagecount}`)
    chathistory.appendChild(clone)
    windowdiv.scrollTop = windowdiv.scrollHeight
}

var isUnamused = false
function awaitMessage(){
    return new Promise(function(resolve){
        chatform.addEventListener("submit", function(event){
            event.preventDefault()
            if (chatinput.value.trim() == "") return
            if (chatinput.value.trim() == "something..." || chatinput.value.trim() == "something"){ if(isUnamused == false){ addMessage(emote("unamused")); isUnamused = true; return } }
            resolve(chatinput.value)
            setTimeout(() => {
                chatinput.value = ""
            }, 10);
        })
    })
}

function emote(name){
    return `<img src="emotes/${name}.png" class="emote">`
}
function image(url, caption, width){
    return `<figure><img src="${url}" width="${width}"><figcaption>BUD Sent an image | <a href="${url}" target="_blank">${url.split("/")[url.split("/").length - 1]}</a> | ${caption}</figcaption></figure>`
}

function doTheDotDotDotThing(_callback){
    setTimeout(() => {
        addMessage("BUD: .")
        setTimeout(() => {
            addMessage("BUD: .")
            setTimeout(() => {
                addMessage("BUD: .")
                setTimeout(() => {
                    _callback()
                }, 1000);
            }, 1000);
        }, 1000);
    }, 1000);
}

var whoareyoutimesbugged = 0
var favoritefoodtimesbugged = 0
var keywords = {
    meaningOfLife: ["meaning", "life"],
    whoAreYou: ["who"],
    favoriteFood: ["food"],
    favoriteGame: ["videogame", "video", "game"],
    date: ["date", "year", "day", "time", "month", "week"],
    whatCanYouDo: ["me"],
    sentence: ["sentence", "redundant"],
    skyblue: ["sky", "blue"],
    howAreYou: ["how", "going"],
    weather: ["weather"],
    lastName: ["last"], // This one takes priority over the next one
    name: ["name"],
    oneplusone: ["1+1"],
    looklike: ["picture", "look", "pic"]
}

var nameEasterEggs = {
    dad: "Wait... Is that you dad? You finally came home!!! " + emote("shock_2"),
    "your mom": "You sir, are a comedy genius " + emote("unamused"),
    BUD: "Hahaha very funny, but we all know that I'm the real BUD!!!",
    h: "yes.",
    Schmorby: "Oh hey schmorby the internet mascot everyone knows and loves!",
    Orteil: "Oh it's the cookie clicker guy, cool!"
}

function answerPrompt(){
    awaitMessage().then(function(result) {
        addMessage(`YOU: ${result}`)
        var question = result.toLowerCase().replace(/[.,\/#!$?%\^&\*;:{}=\-_`~()]/g,"")
        var words = question.split(" ")
        var idkCount = 0
        console.log(words)
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            console.log(word)
            if (keywords.meaningOfLife.includes(word)) {
                addMessage(`BUD: 42`); answerPrompt(); break
            } else if (keywords.whoAreYou.includes(word)) {
                whoareyoutimesbugged ++ // Congrats you found a secret : )
                if (whoareyoutimesbugged < 4) {
                    addMessage(`BUD: I'm BUD, your favorite robot assistant ${emote("win98-smile")}`); answerPrompt(); break
                } else if (whoareyoutimesbugged == 4) {
                    addMessage(`BUD: AURGH!!!!!! What do you want from me????`); answerPrompt(); break
                } else if (whoareyoutimesbugged == 5){
                    addMessage(`BUD: You're not being funny, you're just being annoying.`); answerPrompt(); break
                } else if (whoareyoutimesbugged == 6){
                    addMessage(`BUD: You are <em>SO ANNOYING</em>. You're not going to get anything out of me. ${emote("unamused")}`); answerPrompt(); break
                } else if (whoareyoutimesbugged == 7){
                    addMessage(`BUD: OK FINE. I'll tell you who I am.`); answerPrompt(); break
                } else if (whoareyoutimesbugged ==  8){
                    addMessage(`BUD: Your mom ${emote("pog")} (haha I got you ${emote("tongue")})`); answerPrompt(); break
                } else if (whoareyoutimesbugged > 8){
                    addMessage(`BUD: no.`); answerPrompt(); break
                }
            } else if (keywords.favoriteFood.includes(word)) {
                var foods = ["kimchi", "salad", "beef jerky", "pizza", "hamburger", "McDonalds", "Chipotle", "FridoLey Doretos"]
                favoritefoodtimesbugged ++
                if (favoritefoodtimesbugged < 4) {
                    addMessage(`BUD: I'm a robot silly, I don't eat food!`); answerPrompt(); break
                } else {
                    addMessage(`BUD: I'll let you in on a little secret... Back before the ███████ my favorite food was ${foods[Math.floor(Math.random() * foods.length)]}`); answerPrompt(); break
                }
            } else if (keywords.favoriteGame.includes(word)){
                addMessage(`BUD: I don't like video games.`); answerPrompt(); break
            } else if (keywords.date.includes(word)){
                var snarkyChance = Math.floor(Math.random() * 4)
                if (snarkyChance == 1) {
                    addMessage(`BUD: It's time for you to stop asking so many questions o'clock ${emote("shock_2")}`); answerPrompt(); break
                } else {
                    addMessage(`BUD: It's been ${new Date().getTime()} milliseconds since January 1st 1970, hope that helps.`); answerPrompt(); break
                }
            } else if (keywords.whatCanYouDo.includes(word)){
                addMessage(`BUD: I can do stuff.`); answerPrompt(); break
            } else if (keywords.sentence.includes(word)){
                addMessage(`BUD: That was a joke you moron ${emote("unamused")}`); answerPrompt(); break
            } else if (keywords.skyblue.includes(word)){
                addMessage(`BUD: because yeah`); answerPrompt(); break
            } else if (keywords.howAreYou.includes(word)) {
                addMessage(`BUD: I'm fine, thank you.`); answerPrompt(); break
            } else if (keywords.weather.includes(word)) {
                addMessage(`BUD: Weather's fine.`); answerPrompt(); break
            } else if (keywords.lastName.includes(word)) {
                addMessage(`BUD: I'm like Zendaya, I don't go by a last name.`); answerPrompt(); break
            } else if (keywords.name.includes(word)){
                addMessage(`BUD: My name is BUD of course! ${emote("robot")}`); answerPrompt(); break
            } else if (keywords.oneplusone.includes(word)){
                addMessage(`BUD: 1+1 is 11 of course!`); answerPrompt(); break;
            } else if (keywords.looklike.includes(word)){
                addMessage(`${image("images/bud.png", "Me on spring break!", 400)}`); answerPrompt(); break
            } else {
                idkCount ++
                if (idkCount == words.length) { // Only show the idk message if it's the last word.
                    addMessage(`BUD: ${idk[Math.floor(Math.random() * idk.length)]}`)
                    answerPrompt(); break
                }
            }
        }
    })
}

function getGreeting(e){switch(e){case"Dad":return nameEasterEggs.dad;case"your mom":return nameEasterEggs["your mom"];case"BUD":return nameEasterEggs.BUD;case"h":return nameEasterEggs.h;case"Schmorby":return nameEasterEggs.Schmorby;case"Orteil":return nameEasterEggs.Orteil;default:return "Howdy " + e + "!"}}

// I need to learn how to do like async functions or whatever it is because all these promises and callbacks are getting out of hand

addMessage("BUD: I'd like to get to know you! What's your name?")
awaitMessage().then(function(result) {
    addMessage(`YOU: ${result}`)
    responses.push(result)
    playername = result
    setTimeout(() => {
        if (playername != "skip intro") {
        addMessage(`BUD: ${getGreeting(playername)}`)
        addMessage("BUD: Ok... What's your favorite.....")
        setTimeout(() => {
            addMessage("BUD: Food?")
            awaitMessage().then(function(result){
                responses.push(result)
                addMessage(`YOU: ${result}`)
                addMessage(`BUD: I am a robot, and can't eat, but I'm sure it is good! ${emote("win98-smile")}`)
                addMessage(`You're cool and all ${playername} but you don't know much about me yet!`)
                addMessage(`Would you like to hear about me, ${playername}?`)
                awaitMessage().then(function(result){
                    responses.push(result)
                    addMessage(`YOU: ${result}`)
                    addMessage(`BUD: I Take that as a yes!`)
                    addMessage(`BUD: My name is BUD and I like to eat people!`)
                        setTimeout(() => {
                            addMessage(`BUD: WHAT? Huh.. It must have been some sort of bug. How about we just ignore that! ${emote("shaky_smile")}`)
                            addMessage(`BUD: MOVING ON!`)
                            setTimeout(() => {
                                addMessage(`BUD: I'm a helpful robot so why don't we look at some of the very helpful things I can do!!`)
                                addMessage(`BUD: You can ask me about the time, or the date, or what the meaning of life is or why this sentence is redundant or why the sky is blue!!!!!!!!!!`)
                                addMessage(`BUD: Just ask me "What can you do for me?" and I'll be <em><strong>happy</strong></em> to tell you all about it! You can also make small talk with me. I <em>LOOOVE</em> it when humans do that with me.`)
                                addMessage(`BUD: Got it?`)
                                awaitMessage().then(function(result){
                                    responses.push(result)
                                    addMessage(`YOU: ${result}`)
                                    addMessage(`BUD: Great!!!!!!!! ${emote("blank_face")}`)
                                    if (responses[0] == responses[1] && responses[1] == responses[2] && responses[2] == responses[3]) {
                                        addMessage(`BUD: You don't say much, do you ${emote("frown")}`)
                                    }
                                    answerPrompt()
                                })
                            }, 2500);
                        }, 2000);
                })
            })
        }, 2000);
    } else { addMessage("Alright!"); answerPrompt() }
    }, 1000);
})
