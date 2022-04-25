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

var activitydb = false
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

var whoareyoutimesbugged = 0
var favoritefoodtimesbugged = 0
var keywords = {
    meaningOfLife: ["meaning", "life"],
    whoAreYou: ["who"],
    favoriteFood: ["food"],
    favoriteGame: ["videogame", "video", "game"],
    date: ["date", "year", "day", "time", "month", "week"],
    whatCanYouDo: ["me", "do", "for"], // All of these are required
    sentence: ["sentence", "redundant"],
    skyblue: ["sky", "blue"],
    howAreYou: ["how", "going"],
    weather: ["weather"],
    lastName: ["last"], // This one takes priority over the next one
    name: ["name"],
    oneplusone: ["1+1"],
    looklike: ["picture", "look", "pic"],
    peptalk: ["peptalk", "pep", "talk", "encourage"],
    dadjoke: ["joke", "dadjoke"],
    howDoYouWork: ["work"],
    favoriteShow: ["favorite", "show", "tv", "movie"],
    whereDoYouLive: ["live", "you", "where"],
    favBook: ["book"],
    favSong: ["song", "music"],
    likeMe: ["you", "me"], // Special code is added here to detect love OR like
    favMovie: ["movie"],
    someFun: ["fun"],
    helpful: ["you", "helpful"],
    canYouDie: ["you", "die"],
    playGame: ["play", "game"]
}

var nameEasterEggs = {
    dad: "Wait... Is that you dad? You finally came home!!! " + emote("shock_2"),
    "your mom": "You sir, are a comedy genius " + emote("unamused"),
    BUD: "Hahaha very funny, but we all know that I'm the real BUD!!!",
    h: "yes.",
    Schmorby: "Oh hey schmorby the internet mascot everyone knows and loves!",
    Orteil: "Oh it's the cookie clicker guy, cool!"
}

function includesAll(str, words){
    var included = 0
    for (let i = 0; i < words.length; i++) {
        if (str.includes(words[i])) {
            included ++
        }
    }
    if (included == words.length) {
        return true
    } else {
        return false
    }
}

var backgroundChance = Math.floor(Math.random() * 45)
var backgrounds = ["wallpapers/Clouds.jpeg", "wallpapers/Gold%20Weave.jpeg"]
if (backgroundChance == 1) {
    console.log("Looks like YOU got lucky!")
    addMessage(`SYSTEM: Looks like you got lucky! Check out that sick background of yours!`)
    document.body.style.setProperty("background-image", `url("${backgrounds[Math.floor(Math.random()*backgrounds.length)]}")`)
    document.body.style.backgroundRepeat = "repeat"
    document.body.style.backgroundSize = "unset"
    document.body.style.backgroundPositionX = "unset"
    document.body.style.backgroundPositionY = "unset"
}
var closebtn = document.getElementById("closebtn")
closebtn.addEventListener("click", () => {
    windowdiv.style.visibility = "hidden"
})
var budicon = document.getElementById("budicon")
budicon.addEventListener("dblclick", () => {
    windowdiv.style.visibility = "visible"
})
var interneticon = document.getElementById("internet-icon")
interneticon.addEventListener("dblclick", () => {
    putils.element.show("ie-window")
})
document.getElementById("ie-window").addEventListener("dblclick", () => {
    window.open("images/article.png", "Full screen article")
})
document.getElementById("ie-closebtn").addEventListener("click", () => {
    putils.element.hide(document.getElementById("ie-window"))
})
// Easter egg I disabled
// var ieurlbar = document.getElementById("ie-urlbar")
// var ieurlbardone = false
// ieurlbar.addEventListener("input", (event) => {
//     if (ieurlbar.value.includes("pikapower9080.github.io") && !ieurlbardone) {
//         putils.toast(":)", 1000, true)
//         ieurlbardone = true
//     }
// })

function answerPrompt(){
    awaitMessage().then(function(result) {
        addMessage(`YOU: ${result}`)
        var question = result.toLowerCase().replace(/[.,\/#!$?%\^&\*;:{}=\-_`~()]/g,"")
        var words = question.split(" ")
        var idkCount = 0
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
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
            } else if (question.includes("for") && question.includes("do") && question.includes("me")){
                addMessage(`BUD: You can make small talk with me, have some fun with me, ask for a pep talk or even a dad joke. You can also ask me about the time and date, or who I am.`); answerPrompt(); break
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
            } else if (keywords.peptalk.includes(word)){
                function random(array) {
                    return array[Math.floor(Math.random()*array.length)]
                }
                var postmiddle = random(postmiddles);
                var middle = random(middles);      
                var starter = random(starts);
                var ending = random(ends);
                var peptalk = starter + " " + middle + " " + postmiddle + ", " + ending
                addMessage(`BUD: Here's a good one: ${peptalk}`); answerPrompt(); break
            } else if (keywords.dadjoke.includes(word)){
                var dadjokes = ["Why are elevator jokes so good? They work on many different levels", "After a bad harvest, why did the farmer decide to try a career in music? Because he had a ton of sick beets.", "What's the most groundbreaking invention? The shovel.", "What did the tree say to the other tree? Nothing, trees can't talk.", "Why can't a leopard hide? He's always spotted.", "Why can't peter pan ever stop flying? Because he neverlands.", "3 men walk into a bar... Ouch", "How did the pirate get his ship so cheap? It was on sail..", "Did you hear the rumor about butter? Well, I'm not going to spread it!", "Why do Dads take an extra pair of socks when they go golfing? In case they get a hole in one.", "The other day I couldn't get a reservation at the library, they were fully booked", "What's the best thing about Switzerland? I don't know, but the flag is a big plus", "I asked my dad for a fruit and he gave me a peach. I told him I'd rather have a pear so he gave me another peach.", "As I handed my Dad is 50th birthday card, he looked at me with tears in his eyes and said \"Ya know son, 1 would have been enough\""]
                addMessage(`BUD: ${dadjokes[Math.floor(Math.random() * dadjokes.length)]}`); answerPrompt(); break
            } else if (keywords.howDoYouWork.includes(word)){
                addMessage(`BUD: I look for certain keywords in your message, and respond to them with pre-programmed responses`)
            } else if (includesAll(question, keywords.likeMe) && (question.includes("like") || question.includes("love"))){
                addMessage(`BUD: no lol`); answerPrompt(); break
            } else if (keywords.favBook.includes(word) && question.includes("favorite")) {
                addMessage(`BUD: Design Patterns`); answerPrompt(); break
            } else if (keywords.favSong.includes(word) && question.includes("favorite")) {
                addMessage(`BUD: Gangsta's Paradise`); answerPrompt(); break
            } else if (keywords.favMovie.includes(word) && question.includes("favorite")) {
                addMessage(`BUD: Cocomelon!`); answerPrompt(); break
            } else if (includesAll(question, keywords.whereDoYouLive)) {
                addMessage(`BUD: Everywhere and nowhere.`); answerPrompt(); break
            } else if (keywords.someFun.includes(word) && !question.includes("do") && !question.includes("like") && !question.includes("what")) { // prevents "Do you like to have fun?" or "What do you do for fun?"
                if(activitydb){ addMessage("BUD: Slow down there! Something's already going on!"); answerPrompt(); break }
                activitydb = true
                var funStuff = ["emoji cursor trail", "disco background", "15 second moment of silence", "nyan cat"]
                var funThing = funStuff[Math.floor(Math.random() * funStuff.length)]
                addMessage(`BUD: Alright! Enjoy this ${funThing}!`)
                switch (funThing) {
                    case "emoji cursor trail":
                        var cursor = new emojiCursor()
                        setTimeout(() => {
                            removeEmojiCursor()
                            activitydb = false
                        }, 10000);
                        answerPrompt()
                        break;
                    case "disco background":
                        document.body.classList.add("disco")
                        setTimeout(() => {
                            document.body.classList.remove("disco")
                            activitydb = false
                        }, 10000);
                        answerPrompt()
                        break
                    case "15 second moment of silence":
                        setTimeout(() => {
                            activitydb = false
                            answerPrompt()
                        }, 15000);
                        break
                    case "nyan cat":
                        var nyanaudio = new Audio("https://takeb1nzyto.space/assets/music/Nyanyanyanyanyanyanya!%20-%20daniwell%20(Momone%20Momo%20UTAU%20Cover).mp3")
                        nyanaudio.play()
                        setTimeout(() => {
                            nyanaudio.pause()
                            nyanaudio.remove()
                            activitydb = false
                            answerPrompt()
                        }, 15000);
                        break
                    default:
                        addMessage(`BUD: Well that didn't work ${emote("frown")}`)
                        activitydb = false
                        answerPrompt();
                        break;
                }
                break
            } else if (includesAll(question, keywords.helpful)) {
                addMessage(`BUD: Of course!`); answerPrompt(); break
            } else if (includesAll(question, keywords.canYouDie)) {
                addMessage(`BUD: I'm a robot, I can't die!`); answerPrompt(); break
            } else if (includesAll(question, keywords.playGame)) {
                addMessage(`BUD: Alright!`)
                addMessage(`BUD: This isn't a trick question: There are 100 bricks on a plane, one falls off. How many bricks are left on the plane?`)
                awaitMessage().then((response) => {
                    addMessage(`YOU: ${response}`)
                    if (!response.includes("99")) addMessage(`BUD: It was 99.`)
                    addMessage(`BUD: Ok... How do you put an elephant in the fridge?`)
                    awaitMessage().then((response) => {
                        addMessage(`YOU: ${response}`)
                        addMessage(`BUD: Step 1: Open the door, Step 2: Put the elephant in the fridge, Step 3: Close the door.`)
                        addMessage(`BUD: How do you put a giraffe in the fridge?`)
                        awaitMessage().then((response) => {
                            addMessage(`YOU: ${response}`)
                            addMessage(`BUD: Step 1: Open the fridge, Step 2: Take out the elephant, Step 3: Put in the giraffe, Step 4: Close the fridge`)
                            addMessage(`BUD: The king of the jungle is holding a party and every single animal is attending, except for one. What animal won't be coming?`)
                            awaitMessage().then((response) => {
                                addMessage(`YOU: ${response}`)
                                if (response.includes("giraffe")) addMessage(`BUD: Right! You got this!`)
                                addMessage(`BUD: The giraffe because it's still in the fridge.`)
                                addMessage(`BUD: Sally is trying to cross a river. There's no bridge or way to get across other than going through it. The river is filled with human eating alligators that will kill Sally instantly. Despite this, Sally makes it across to safety, how?`)
                                awaitMessage().then((response) => {
                                    addMessage(`YOU: ${response}`)
                                    if (response.includes("at") && response.includes("party")) addMessage(`BUD: Right on!!`)
                                    addMessage(`BUD: The alligators were at the party!!`)
                                    addMessage(`BUD: Right after she makes it across, Sally dies. How?`)
                                    awaitMessage().then((result) => {
                                        addMessage(`YOU: ${result}`)
                                        if (result.includes("brick") && result.includes("plane") && result.includes("plane")) addMessage(`BUD: Spot on!`)
                                        addMessage(`BUD: The brick fell from the plane and hit her on the head!`)
                                        addMessage(`BUD: Thanks for playing!`)
                                        answerPrompt()
                                    })
                                })
                            })
                        })
                    })
                })
                break
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
