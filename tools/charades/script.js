        // Credit to https://www.countryliving.com/life/entertainment/a31998110/charades-ideas-topics/ for some ideas!
        var easywords = [
            "Cat",
            "Dog",
            "Blowing your nose",
            "Drinking",
            "Sleeping",
            "Cooking",
            "Writing",
            "Walking the dog",
            "Playing video games",
            "Reading",
            "Eating",
            "Fish",
            "Rabbit",
            "Penguin",
            "Elephant",
            "Lion",
            "Chicken",
            "Cow",
            "Skating on Ice",
            "Using a Pogo Stick",
            "Playing Golf",
            "Biking",
            "Jump rope",
            "Playing Violin",
            "Playing Piano",
            "Singing",
            "Sweeping the floor",
            "Doing Laundrey",
            "Making your Bed",
            "Driving",
            "Mowing the lawn",
            "Sharpening a pencil",
            "Going on a picnic",
            "Yoga",
            "Bowling",
            "Shooting a bow and arrow",
            "Teaching a class",
            "Santa",
            "Conductor",
            "Overwhelm",
            "Birthday",
            "Cradle",
            "Soccer",
            "Taking notes",
            "Listening to music",
            "Running",
            "Shopping",
            "Dancing",
            "Texting",
            "Sending a letter",
            "Bored",
            "Bite the bullet",
            "Cry wolf",
            "Cool as a cucumber",
            "Curiosity killed the cat",
            "Your goose is cooked",
            "Dead as a doornail",
            "Pardon my French",
            "Cat got your tongue",
            "Pot calling the kettle black",
            "Quit cold turkey",
            "Herding cats",
            "Best thing since sliced bread",
            "Go belly up",
            "Fake news",
            "Star Wars",
            "Lord of the Rings",
            "Hamilton",
            "Thor Ragnarok",
            "We don't talk about Bruno",
            "Hard Days Night",
            "Yellow Submarine",
            "All You Need is Love",
            "Octopus' Garden"
        ]




        var db = false
        function generate(){
            if (db == false) {
                db = true
                var output = document.getElementById("output")
                if (easywords.length <= 0) {
                    output.innerHTML = "That's all! Reload the page to play the same prompts!"
                } else {
                    var aindex = Math.floor(Math.random()*easywords.length)
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