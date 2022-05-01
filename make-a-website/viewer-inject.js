var iframeElement = document.createElement("iframe")
iframeElement.src = "https://pikapower9080.github.io/tools/html-sandbox/embed/"
iframeElement.classList.add("viewer-frame")
iframeElement.style.display = "none"

var btnElement = document.createElement("button")
btnElement.innerText = "HTML Viewer"
btnElement.classList.add("viewer-btn")

btnElement.addEventListener("click", function(){
    if (iframeElement.style.display == "none"){
        iframeElement.style.display = "block"
    } else {
        iframeElement.style.display = "none"
    }
})

document.body.appendChild(btnElement)
document.body.appendChild(iframeElement)
