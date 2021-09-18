ToggleFloatingLayer('FloatingLayer', 0)
        function formatAMPM(date) {
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0'+minutes : minutes;
            if (document.getElementById("showseconds").checked) {
              var strTime = hours + ':' + minutes + ':' + date.getSeconds()
            } else {
              var strTime = hours + ':' + minutes
            }
            if (document.getElementById("showampm").checked) {
              strTime += ' ' + ampm;             
            }
            return strTime;
          }
          function getdotw() {
            var day = null
            switch (new Date().getDay()) {
              case 0:
                day = "Sunday";
                break;
              case 1:
                day = "Monday";
                break;
              case 2:
                 day = "Tuesday";
                break;
              case 3:
                day = "Wednesday";
                break;
              case 4:
                day = "Thursday";
                break;
              case 5:
                day = "Friday";
                break;
              case 6:
                day = "Saturday";
                break;
            }
            return day
          }
          function getdatestr(date) {
            return `${getdotw()} ${date.getMonth()} ${date.getDay()}, ${date.getFullYear()}`
          }
          var clocktext = document.getElementById("clocktext")
          const datetext = document.getElementById("datetext")
          function update() {
            const d = new Date()
            //clocktext.innerHTML = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()
            clocktext.innerHTML = formatAMPM(d)
            datetext.innerHTML = getdatestr(d)
          }
          update()
          setInterval(() => {
            update()
          }, 500);
          function full() {
              var clockbody = document.getElementById("clockbody")
              if (document.fullscreen) {
                  document.exitFullscreen()
              } else {
                clockbody.requestFullscreen()
              }
          }
          function getElement(id) {
            return document.getElementById(id)
          }
          function refresh() {
            ToggleFloatingLayer('FloatingLayer', 0)
            const showseconds = getElement("showseconds")
            const showampm = getElement("showampm")
            const backgroundselect = getElement("backgroundselect")
            const showdate = getElement("showdate")
            if (showdate.checked) {
              
            } else {
              
            }

            var newbackground = "/assets/clockbackground.png"
            switch (backgroundselect.value) {
              case "Glow 1":
                newbackground = "/assets/downloads/win11/wallpapers/Glow/img20.jpg"
                break;
              case "Glow 2":
                newbackground = "/assets/downloads/win11/wallpapers/Glow/img21.jpg"
                break;
              case "Glow 3":
                newbackground = "/assets/downloads/win11/wallpapers/Glow/img22.jpg"
                break;
              case "Glow 4":
                newbackground = "/assets/downloads/win11/wallpapers/Glow/img23.jpg"
                break;
              case "Sunrise 1":
                newbackground = "/assets/downloads/win11/wallpapers/Sunrise/img28.jpg"
                break;
              case "Sunrise 2":
                newbackground = "/assets/downloads/win11/wallpapers/Sunrise/img29.jpg"
                break;
              case "Sunrise 3":
                newbackground = "/assets/downloads/win11/wallpapers/Sunrise/img30.jpg"
                break;
              case "Abstract 1":
                newbackground = "/assets/downloads/win11/wallpapers/touchkeyboard/TouchKeyboardThemeLight003.jpg"
                break;
              case "Abstract 2":
                newbackground = "/assets/downloads/win11/wallpapers/touchkeyboard/TouchKeyboardThemeDark003.jpg"
                break;
              case "Abstract 3":
                newbackground = "/assets/downloads/win11/wallpapers/touchkeyboard/TouchKeyboardThemeLight000.jpg"
                break;
              case "Light blue":
                newbackground = "/assets/downloads/win11/wallpapers/Screen/img105.jpg"
                break;
              default:
                newbackground = "/assets/clockbackground.png"
                break;
            }
            console.log(newbackground)
            document.body.setAttribute("style", `background-image: url("${newbackground}");`)
            document.getElementById("full_style").innerHTML = `:fullscreen{color:white;\nbackground-image: url(${newbackground});\nbackground-size: cover;}\n:fullscreen p{\npadding-top: 25%;\n}`
          }
          function settings() {
            ToggleFloatingLayer('FloatingLayer', 1)
          }          