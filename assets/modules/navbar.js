var navbar = {}

navbar.html = `
<nav class="flex navbar-main">
        <a href="/" class="navlabel navlink" style="color: black;">pikapower9080</a>
        <label class="navlink" id="navbar-tools">Tools<div class="nav-tooltip tooltip-tools"><ul><li><a href="/tools/clock">Clock</li><li><a href="/tools/charades">Charades</a></li><li><a href="/tools/color">Random Color Generator</a></li><li><a href="/tools/text">Text Modifiers</a></li><li><a href="/tools/tabflooder">Tab Flooder</a></li><li><a href="/tools/username">Username Generator</a></li><li><a href="/tools/qnotes">Quick Notes</a></li></ul></div></label>
        <label class="navlink navbar-fun" id="navbar-fun">Fun<div class="nav-tooltip tooltip-fun"><ul><li><a href="/fun/sillysentence">Silly Sentence Generator</a></li><li><a href="/fun/peptalk">Pep Talk Generator</a></li><li><a href="/fun/madlibs">MadLibs</a></li><li><a href="/oxygencloud">OxygenCluod</a></li><li><a href="/fun/jsbookmarks">Javascript Bookmarks</a></li><li><a href="/fun/annoying">An Annoying Prank</a></li></ul></div></label>
        <label class="navlink" id="navbar-resources">Resources<div class="nav-tooltip tooltip-resources"><ul><li><a href="/resources/emojilist">List of Emojis</a></li><li><a href="/resources/inputtypes">List of HTML Input Types</a></li><li><a href="https://pikapower9080.github.io/learn-html">Learn HTML</a></li><li><a href="/keycodes">Javascript Keycodes</a></li><li><a href="resources/cssborder">CSS Border Generator</a></li><li><a href="/resources/cssshadow">CSS Shadow Generator</a></li></ul></div></label>
        <label class="navlink" id="navbar-more">More<div class="nav-tooltip tooltip-more"><ul><li><a href="/banana-simulator">Banana Simulator</a></li><li><a href="/games/swoop">Swoop!</a> <a href="https://playcanvas.com/">by PlayCanvas</a></li><li><a href="/games/happyfriday">Happy Friday!</a> <a href=""https://chrome.google.com/webstore/detail/happy-friday/lagckjdgadpknikjoegcibbollkafpid>by Smashplug</a></li><li><a href="/games/griller">Griller's Class Hamburgers</a> <a href="https://chrome.google.com/webstore/detail/grillers-classic-hamburge/ljonmeempigdodakbmcbhgijegeimpld?hl=en">by Smashplug</a></li><li><a href="/experiments/wordmachine">Word Machine</a></li><li><a href="/games/boxelrebound">Boxel Rebound</a> (<a href="https://chrome.google.com/webstore/detail/boxel-rebound/iginnfkhmmfhlkagcmpgofnjhanpmklb?hl=en-US">Extension</a>)</li><li><a href="/experiments/imageoftheday">Unsplash Image of the Day</a></li><li><a href="/disqus">Disqus Comments</a></li></ul></div></label>
        <a href="https://github.com/pikapower9080/pikapower9080.github.io/" class="navlink">GitHub</a>
</nav>
`

navbar.divelement = document.createElement("div")
navbar.divelement.setAttribute("id", "navbar")
navbar.divelement.classList.add("navbar-div")
navbar.divelement.innerHTML = navbar.html
navbar.hr = document.createElement("hr")
navbar.hr.classList.add("nav-hr")
navbar.divelement.appendChild(navbar.hr)


document.body.appendChild(navbar.divelement)