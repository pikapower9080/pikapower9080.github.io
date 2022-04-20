window.addEventListener("load", function(){
    var codeinput = document.getElementById("codeinput")
    var pre = document.getElementById("highlighted")
    var codepre = document.getElementById("highlighted-content")
    var codeoutput = document.getElementById("codeoutput")
    var settings = {}
    var forceDisableAutoSave = false
    function update(){
        codepre.innerHTML = codeinput.value.replace(new RegExp("&", "g"), "&amp;").replace(new RegExp("<", "g"), "&lt;")
        Prism.highlightElement(codepre)
        pre.scrollTop = codeinput.scrollTop
        pre.scrollLeft = codeinput.scrollLeft
        if (settings.autoSave && !forceDisableAutoSave) localStorage.setItem("code", codeinput.value)
    }
    function runcode(manual){
        if (manual) {
            codeoutput.src = "data:text/html;charset=utf-8," + escape(codeinput.value)
            return true
        }
        if (settings.autoUpdate) {
            codeoutput.src = "data:text/html;charset=utf-8," + escape(codeinput.value)
            return true
        } else {
            return false
        }
    }
    codeinput.addEventListener("input", function(event){
        update()
        runcode()
    })
    codeinput.addEventListener("scroll", function(event){
        pre.scrollTop = codeinput.scrollTop
        pre.scrollLeft = codeinput.scrollLeft
    })
    codeinput.addEventListener("keydown", function(event){
        if (event.key == "Tab") {
            event.preventDefault()
            var code = codeinput.value
            let before_tab = code.slice(0, codeinput.selectionStart)
            let after_tab = code.slice(codeinput.selectionEnd, code.length)
            let cursor_pos = codeinput.selectionStart + 1;
            codeinput.value = before_tab + "\t" + after_tab
            codeinput.selectionStart = cursor_pos
            codeinput.selectionEnd = cursor_pos
            update()
        }
    })
    if (localStorage.getItem("code")) {
        codeinput.value = localStorage.getItem("code")
    }
    update()
    runcode(true)

    var namedialog = document.getElementById("namedialog")
    var nameinput = document.getElementById("filename-input")
    var nameform = document.getElementById("filename-form")
    var exportbtn = document.getElementById("btn-export")
    exportbtn.addEventListener("click", function(){
        new Promise((resolve, reject) => {
            namedialog.showModal()
            nameform.addEventListener("submit", function(event){
                event.preventDefault()
                try{
                    if (nameinput && nameinput.value.trim() != ""){
                        resolve(nameinput.value)
                    } else {
                        nameinput.value = ""
                    }
                } catch(err) { reject(err) }
            })
            namedialog.addEventListener("cancel", function(event){
                reject("Dialog Closed")
            })
        }).then((filename) => {
            var link = document.createElement("a")
            link.href = "data:text/plain;charset=utf-8," + encodeURIComponent(codeinput.value)
            link.download = filename + ".html"
            link.innerHTML = " "
            document.body.appendChild(link)
            link.click()
            link.remove()
            namedialog.close()
        }).catch((err) => {
            namedialog.close()
            console.warn(err)
            exportbtn.innerText = "Failed!"
            setTimeout(() => {
                exportbtn.innerText = "Export"
            }, 2000);
        })
    })
    
    const searchCode = location.search.split("=")[1]
    if (searchCode && location.search.split("?")[1].startsWith("code=")) {
        console.log(searchCode)
        console.log("Code found in url, entering sample mode.")
        forceDisableAutoSave = true
        var buttons = document.getElementById("buttons").getElementsByTagName("button")
        for (let i = 0; i < buttons.length; i++) {
            const element = buttons[i];
            if (element.getAttribute("id") != "btn-export"){
                element.style.display = "none"
            }
        }
        // document.getElementById("open-btn").href = "https://pikapower9080.github.io/tools/html-sandbox/embed" + this.location.search
        codeinput.value = decodeURI(searchCode).replaceAll("\\n", "\n").replaceAll("\\t", "\t")
        update()
        runcode(true)
    }
    
    if (localStorage.getItem("htmlsandbox-settings") && JSON.parse(localStorage.getItem("htmlsandbox-settings"))){
        var settings = JSON.parse(localStorage.getItem("htmlsandbox-settings"))
        if (settings.autoSave == null || settings.autoSave == null ) { // In case they've been tampered with
            settings = {}
            settings.autoSave = true
            settings.autoUpdate = true
            console.log("Settings corrupted, setting to defaults.")
        } else {
            console.log("Settings loaded!")
        }
    } else {
        settings = {autoSave: true, autoUpdate: true}
    }
    console.log(settings)
    function saveSettings(){
        localStorage.setItem("htmlsandbox-settings", JSON.stringify(settings))
    }
    var savebtn = document.getElementById("btn-save")
    savebtn.addEventListener("click", function(){
        localStorage.setItem("code", codeinput.value)
    })
    var autosavetoggle = document.getElementById("autosave-toggle")
    function updateButtons(){
        console.log("Update buttons")
        if(!settings.autoSave) {
            savebtn.style.display = "unset"
            autosavetoggle.innerText = "Enable Auto Save"
        } else {
            savebtn.style.display = "none"
            autosavetoggle.innerText = "Disable Auto Save"
        }
        if(!settings.autoUpdate){
            updatebtn.style.display = "unset"
            autoupdatetoggle.innerText = "Enable Auto Update"
        } else {
            updatebtn.style.display = "none"
            autoupdatetoggle.innerText = "Disable Auto Update"
        }
    }
    autosavetoggle.addEventListener("click", function(event){
        if (settings.autoSave) {
            console.log("No autosave")
            settings.autoSave = false
            updateButtons()
            saveSettings()
        } else {
            console.log("Autosave")
            settings.autoSave = true
            updateButtons()
            saveSettings()
        }
    })
    var updatebtn = document.getElementById("btn-update")
    updatebtn.addEventListener("click", function(){
        runcode(true)
    })
    var autoupdatetoggle = document.getElementById("auto-toggle")
    autoupdatetoggle.addEventListener("click", function(event){
        if (settings.autoUpdate) {
            settings.autoUpdate = false
            updateButtons()
            saveSettings()
        } else {
            settings.autoUpdate = true
            updateButtons()
            saveSettings()
        }
    })
    updateButtons()
})