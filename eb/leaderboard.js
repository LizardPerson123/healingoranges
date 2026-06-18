function applyLeaderboard(leaderboardData, leaderboardDiv) {
  for (element in leaderboardData) { 
    let entry = document.createElement("div")
    entry.innerHTML = `<h1 style="margin-bottom: 0px">${element}: ${leaderboardData[element]}</h1>`
    entry.className = "leaderboardEntry"
    leaderboardDiv.appendChild(entry)
  }
}

async function setUpLeaderboard() {
  ApplyMode()
  let leaderboardData = await getLeaderboard(1)
  let leaderboardDiv = getById("leaderboard")
  applyLeaderboard(leaderboardData, leaderboardDiv)
  
}

let leaderboardPage = 1;
setUpLeaderboard()

async function loadMoreLeaderboard(addToLeaderboardPage = 1) {
  if ((leaderboardPage + addToLeaderboardPage) < 1) {return}
  leaderboardPage += addToLeaderboardPage
  let leaderboardData = await getLeaderboard(leaderboardPage)
  if (Object.entries(leaderboardData).length == 0) {return}
  
  getByClss("leaderboardEntry").forEach(node => node.remove())
  let leaderboardDiv = getById("leaderboard")
  applyLeaderboard(leaderboardData, leaderboardDiv)
}

addEventListener("pageshow", function() {
  ApplyMode()
})

addEventListener("DOMContentLoaded", function() {
  achi.register("Visit The Leaderboard", "bronze")
})