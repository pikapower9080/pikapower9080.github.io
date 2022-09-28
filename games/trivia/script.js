const text = document.querySelector("#mainText")
const textDiv = document.querySelector("#text")
const textTitle = document.querySelector("#title")
let options = document.querySelector("#options")

function waitForClick() {
    return new Promise((resolve) => {
      const listener = (e) => {
        if (e.type == "keydown" && e.key != "Enter") return
        textDiv.removeEventListener("keydown", listener)
        document.removeEventListener("click", listener);
        resolve();
      }
      textDiv.addEventListener("click", (e) => listener(e));
      document.addEventListener("keydown", (e) => listener(e))
    })
}

let lastOptionIndex = 0
let currentQuestionIndex = 0
let score = 0

// UTILS //
function sound(url) {
    const sound = new Audio(`sounds/${url}`)
    sound.volume = 0.2
    sound.play()
}
function includesAll(array, includes) {
    let matches = 0
    includes.forEach((include) => {
        if (array.includes(include)) {
            matches += 1
        }
    })
    console.log(matches, includes.length)
    if (matches == includes.length) {return true} else {return false}
}
function addOption(optionText, onClick, classNames, tooltip, noAnimate) {
    let option = document.createElement("span")
    option.className = 'option'
    option.innerHTML = optionText
    option.addEventListener("click", (e) => {
        sound('select2.wav')
        onClick(option, e)
    })
    lastOptionIndex ++
    option.tabIndex = lastOptionIndex
    setTimeout(() => {
        // Prevent the hover and click sounds from playing at the same time
        option.addEventListener("mouseenter", () => {
            sound('click.wav')
        })
    }, 50);
    option.addEventListener("keydown", (e) => {
        if (e.key == "Enter" || e.key == " ") {
            option.click()
        }
    })
    options.appendChild(option)
}
function clearOptions() {
    options.remove()
    options = document.createElement("div")
    options.id = "options"
    lastOptionIndex = 0
    document.querySelector('main').appendChild(options)
}

const URLSearchParams = new URL(window.location).searchParams
console.debug(URLSearchParams)
let hasValidSearch = false
if (URLSearchParams.get("amount")) {
    hasValidSearch = true
}
function getSessionToken() {
    return new Promise((resolve, reject) => {
        // fetch(`https://opentdb.com/api_token.php?command=request`).then((response) => {
        //     response.json((data) => {
        //         console.log(data.response_message)
        //         resolve(data.token)
        //     }).catch((errorM) => {
        //         reject(errorM)
        //     })
        // }).catch((errorM) => {
        //     reject(errorM)
        // })
        resolve("")
    })
}
function getQuestions() {
    const requestString = `https://opentdb.com/api.php?${URLSearchParams.toString()}`
    console.log(requestString)
    fetch(requestString).then((response) => {
        response.json().then((data) => {
            if ('response_code' in data) {
                let code = data.response_code
                switch (code) {
                    case 0:
                        console.log(data)
                        question(data.results[currentQuestionIndex], data.results)
                        break;
                    case 1:
                        Notiflix.Report.failure(`Error`, "The database didn't return enough results. Try again using a less specific query or less questions.", "Retry", () => {
                            document.getElementById("customize").showModal()
                        })
                        break;
                    case 2:
                        Notiflix.Report.failure(`Error`, "There was a problem with your configuration. Please try again with something different", 'Retry', () => {
                            document.getElementById("unload").click()
                        })
                        break;
                    case 3:
                        alert("Something went wrong with your session token. Please try again.")
                        break;
                    case 4:
                        alert("You've already seen all possible questions with this token. Please try again with a fresh start.")
                    default:
                        alert("An unknown error occurred.")
                        break;
                }
            }
        })
    }).catch(errorM => reject(errorM))
}
function firstCapital(str) {
    return str.substring(0, 1).toUpperCase() + str.substring(1)
}
async function question(questionData, questions) {
    function advance() {
        currentQuestionIndex ++
        if (currentQuestionIndex == questions.length) {
            textTitle.innerHTML = "<strong>Game Over!</strong>"
            text.innerHTML = `You finished with a score of <strong>${score}/${questions.length}</strong>!`
            clearOptions()
            addOption("Play Again", () => {
                document.getElementById("unload").click()
            })
        } else {
            question(questions[currentQuestionIndex], questions)
        }
    }
    clearOptions()
    textTitle.innerHTML = `Category: <strong>${questionData.category}</strong>${URLSearchParams.get("difficulty") == "" ? ` Difficulty: <strong>${firstCapital(questionData.difficulty)}</strong>` : ""}</strong>`
    text.innerHTML = "<br>" + questionData.question
    let options = questionData.incorrect_answers
    if (questionData.type == "boolean") {
        function check(answer) {
            if (questionData.correct_answer == answer) {
                Notiflix.Report.success("Correct!", '', 'Next Question', advance)
                score ++
            } else {
                Notiflix.Report.failure("Incorrect!", "The correct answer was " + questionData.correct_answer + ".", "Move on", advance)
            }
        }
        addOption("True", () => {
            check("True")
        })
        addOption("False", () => {
            check("False")
        })
    } else {
        function check(answer) {
            if (answer == questionData.correct_answer) {
                Notiflix.Report.success("Correct!", '', 'Next Question', advance)
                score ++
            } else {
                Notiflix.Report.failure("Incorrect!", "The correct answer was " + questionData.correct_answer + ".", 'Move on', advance)
            }
        }
        // Add correct answer randomly
        options.splice(Math.floor(Math.random() * options.length + 1), 0, questionData.correct_answer)
        options.forEach((option, i) => {
            addOption(option, () => {
                check(option)
            })
        })
    }
}
if (hasValidSearch) {
    getQuestions()
} else {
    document.getElementById("customize").showModal()
}

document.getElementById("unload").addEventListener("click", () => {
    window.location.search = ""
})
document.getElementById("customize").addEventListener("cancel", (e) => {
    e.preventDefault()
})