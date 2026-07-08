function letThereBeLight() {
  getById("styleTag").innerHTML = ""
  getById("imgMode").src = "images/moon.svg"
  localStorage.setItem("mode", "light")
}

function letThereBeDark() {
  getById("styleTag").innerHTML = `
    body {background-color: #171a1a; color: white}

    #darkButton {
      background-color: gray !important;
      color: black !important
    }

    #sidebar {
      background-color: #1a1818
    }

    h1 {
      text-shadow: 0px 0px 0px rgba(128, 128, 128, 0.0)
    }

    .option {box-shadow: 15px 15px 15px rgba(255, 255, 255, 0.4);}
  `

  getById("imgMode").src = "images/sun.svg"

  localStorage.setItem("mode", "dark")
}

function applyMode() {
  let mode = localStorage.getItem("mode")

  if (mode == "dark") {
    letThereBeDark()
  }
  else {
    letThereBeLight()
  }
}

function toggleMode() {
  let mode = localStorage.getItem("mode")

  if (mode == "dark") {
    letThereBeLight()
  }
  else {
    letThereBeDark()
  }
}

addEventListener("pageshow", function() {
  applyMode()
})

applyMode()

console.log("Hey You, Yeah You. Do Not Put Anything Here If You Don't Know What You're Doing!\n If Someone Has Asked You To Put Something Here, Don't Trust Them! They Could Be Trying To Steal Your Personal Information, Like Usernames And Passwords")