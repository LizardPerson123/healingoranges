let textOptions = ["It Exists!", "Touch Grass!", "The Design Is Very Human!", "Dishes... Dishes A Bad Joke", "Also Try Youtube!", "Where Are Your Fingers", "Also Try Zorbeez!", "Donate To Wikipedia!", "It's Free!", "Featuring Ebola Words!", "Featuring Rotting Roulette!", "Removed Herobrione!", "DougDoug Is Bald!", "Rigged!", "50+ Achievements!", "Slightly Below Expectations!", "The Most Convoluted Way To Use Wikipedia!", "In Beta!",
  "Version Beta 1.1.1!", "Used To Be Worse!", "Featuring Dark Mode!", "Breaks All Good Code Practices!", "Error: Could Not Load Splash Text", "It Exists?", "Best Thing Sinced Sliced Bread!",
  "Some Splash Texts Are Hyper Specific!", "We Block AI!", "Coded By One Man!", "Art By One Man!", "Uses HTML 5!", "Uses The World Wide Web!", "Does Not Use Dial Up!", "Uses Cloudflare!", "Uses GitHub!", "Uses HTTPS!", "Uses JavaScript!",
  "Speeling Is Me Pasion!", "Uses HTML!", "Uses CSS!", "Depressing!", "Get Pranked, Glorfilhemiz!"
]
function generateSubtext() {
  getById("subtext").innerText = textOptions[getRndInteger(0, textOptions.length)]
}

addEventListener("pageshow", function() {
  generateSubtext()
})