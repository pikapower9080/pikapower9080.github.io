var starts = [
    "Snazzy",
    "Awesome",
    "Super",
    "Funny",
    "Epic",
    "Mr",
    "TheReal",
    "Grilled",
    "Homemade",
    "Handmade",
    "Jolly",
    "Silly"
]
var ends = [
    "Grandma",
    "Banana",
    "Billy",
    "Boy",
    "Girl",
    "Person",
    "Kid",
    "Imposter",
    "Friend",
    "Jellow",
    "Person",
    "Teen",
    "Animal",
    "Monkey",
    "Tiger",
    "Arm",
    "Node",
    "Alligator",
    "Bread",
    "Sofa",
    "Guitar",
    "Scarf",
    "Mint",
    "Snowflake",
    "Ear",
    "Stranger",
    "Period",
    "Bus",
    "Aftershave"
]
function makeUsername() {
    return starts[Math.floor(Math.random() * starts.length)] + ends[Math.floor(Math.random() * ends.length)]
}
function getstandlevel() {
    if (points <= 500) {
        return "Startup"
    } else if(points > 500 && points < 1000) {
        return "Shop"
    } else if(points >= 1000 && points < 5000) {
        return "Corner Store"
    } else if(points >= 5000 && points < 10000){
        return "Supermarket"
    } else if(points >= 10000 && points < 50000){
        return "Company"
    } else if(points >= 50000 && points < 500000){
        return "Monopoly"
    } else if(points >= 1000000 && points < 5000000){
        return "Empire"
    } else if(points >= 5000000){
        return "Universe (You can stop now)"
    }
}