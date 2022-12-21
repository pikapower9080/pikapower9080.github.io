// Credit to https://www.countryliving.com/life/entertainment/a31998110/charades-ideas-topics/ for some ideas!
const defaults = [
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
    "Cutting corners",
    "Hang in there",
    "Miss the boat",
    "No pain, no gain",
    "Speak of the devil",
    "Time flies when you are having fun",
    "Get bent out of shape",
    "A penny for your thoughts",
    "Break the ice",
    "At the drop of a hat",
    "Taste of your own medicine",
    "Give someone the cold shoulder",
    "Go on a wild goose chase",
    "Hit the nail on the head",
    "Let the cat out of the bag",
    "Spill the beans",
    "Method to your madness",
    "The hunchback of notre dame",
    "Peter pan",
    "Alice in wonderland",
    "Mary poppins",
    "Beauty and the beast",
    "The lion king",
    "Playing charades"
]
const carols = [
    "Hark! The Herald Angels Sing",
    "Silent Night",
    "O Come All Ye Faithful",
    "Away in a Manger",
    "We Three Kings",
    "The Little Drummer Boy",
    "12 Days of Christmas",
    "Do You Hear What I Hear?",
    "O Christmas Tree",
    "Jingle Bells",
    "Sleigh Ride",
    "All I Want for Christmas is You",
    "Deck The Halls",
    "Rockin Around the Christmas Tree",
    "Rudolf the Red Nosed Reindeer",
    "Run Run Rudolf",
    "Let it Snow",
    "Holly Jolly Christmas",
    "White Christmas",
    "Blue Christmas",
    "It's the Most Wonderful Time of the Year",
    "It's Beginning to Look a lot Like Christmas",
    "Jingle Bell Rock",
    "You're a Mean One, Mr. Grinch",
    "Winter Wonderland",
    "Santa Baby",
    "Frosty the Snowman",
    "Silver Bells",
    "Baby It's Cold Outside",
    "We Wish You A Merry Christmas"
]


var db = false
function generate() {
    if (db == false) {
        db = true
        var output = document.getElementById("output")
        let set = params.get("christmas") ? carols : defaults
        if (set.length <= 0) {
            output.innerHTML = "That's all! Reload the page to play the same prompts!"
        } else {
            var index = Math.floor(Math.random() * set.length)
            output.innerHTML = set[index]
            output.classList.add("enteranim")
            set.splice(index, 1)
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

document.addEventListener("click", generate)

const params = new URLSearchParams(window.location.search)

if (params.get("christmas")) {
    document.querySelector("#particles-js").style.display = "unset"
    document.querySelector("#christmas-link").style.display = "none"
    particlesJS("particles-js", {"particles":{"number":{"value":400,"density":{"enable":true,"value_area":800}},"color":{"value":"#fff"},"shape":{"type":"circle","stroke":{"width":0,"color":"#000000"},"polygon":{"nb_sides":5},"image":{"src":"img/github.svg","width":100,"height":100}},"opacity":{"value":0.5,"random":true,"anim":{"enable":false,"speed":1,"opacity_min":0.1,"sync":false}},"size":{"value":10,"random":true,"anim":{"enable":false,"speed":40,"size_min":0.1,"sync":false}},"line_linked":{"enable":false,"distance":500,"color":"#ffffff","opacity":0.4,"width":2},"move":{"enable":true,"speed":6,"direction":"bottom","random":false,"straight":false,"out_mode":"out","bounce":false,"attract":{"enable":false,"rotateX":600,"rotateY":1200}}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":false,"mode":"bubble"},"onclick":{"enable":false,"mode":"push"},"resize":true},"modes":{"grab":{"distance":400,"line_linked":{"opacity":0.5}},"bubble":{"distance":400,"size":4,"duration":0.3,"opacity":1,"speed":3},"repulse":{"distance":200,"duration":0.4},"push":{"particles_nb":4},"remove":{"particles_nb":2}}},"retina_detect":true});
}