// Credit to https://www.countryliving.com/life/entertainment/a31998110/charades-ideas-topics/ for some ideas!
var easywords = [
    "Cat",
    "Dog",
    "Blowing your nose",
    "Drinking",
    "Walking the dog",
    "Playing video games",
    "Fish",
    "Rabbit",
    "Penguin",
    "Elephant",
    "Lion",
    "Chicken",
    "Cow",
    "Skating on thin ice",
    "Using a Pogo Stick",
    "Playing Golf",
    "Sweeping the floor",
    "Mowing the lawn",
    "Sharpening a pencil",
    "Going on a picnic",
    "Shooting a bow and arrow",
    "Teaching a class",
    "Santa",
    "Conductor",
    "Overwhelm",
    "Happy Birthday",
    "Cradle",
    "Soccer",
    "Shopping",
    "Send a text message",
    "Sending a letter",
    "Bite the bullet",
    "Cry wolf",
    "Cool as a cucumber",
    "Curiosity killed the cat",
    "Your goose is cooked",
    "Dead as a doornail",
    "Cat got your tongue",
    "Best thing since sliced bread",
    "Fake news",
    "Star Wars",
    "Blessing in disguise",
    "A dime a dozen",
    "Beat around the bush",
    "Better late than never",
    "cutting corners",
    "hang in there",
    "miss the boat",
    "No pain, no gain",
    "speak of the devil",
    "time flies when you are having fun",
    "get bent out of shape",
    "a penny for your thoughts",
    "break the ice",
    "at the drop of a hat",
    "taste of your own medicine",
    "give someone the cold shoulder",
    "go on a wild goose chase",
    "hit the nail on the head",
    "let the cat out of the bag",
    "spill the beans",
    "method to your madness",
    "the hunchback of notre dame",
    "peter pan",
    "alice in wonderland",
    "mary poppins",
    "beauty and the beast",
    "the lion king",
    "playing charades"
]



var db = false
function generate() {
    if (db == false) {
        db = true
        var output = document.getElementById("output")
        if (easywords.length <= 0) {
            output.innerHTML = "That's all! Reload the page to play the same prompts!"
        } else {
            var aindex = Math.floor(Math.random() * easywords.length)
            output.innerHTML = easywords[aindex]
            output.classList.add("enteranim")
            easywords.splice(aindex, 1)
            setTimeout(() => {
                output.classList.remove("enteranim")
                db = false
            }, 500);
        }
    }
}
var countdown = 25
setInterval(() => {
    if (document.getElementById("autocheckbox").checked) {
        document.getElementById('countdown').style.display = ""
        if (countdown < 1) {
            generate()
            countdown = 25
        } else {
            countdown -= 1
        }
        document.getElementById('countdown').innerHTML = countdown
    } else {
        document.getElementById('countdown').style.display = "none"
    }
}, 1000); // Every second