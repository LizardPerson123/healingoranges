let host
let pleb
let hostName
let plebName
let thisPlayer

function joinSession(username, password, sessionID) {
  return new Promise(async function (resolve, reject) {
    getById("multiplayerMenu").style.display = "none"; 

    plebName = username
    thisPlayer = username

    try {
      let [hostUsername, assume, players] = await joinSessionApi(username, password, sessionID)

      hostName = hostUsername

      if (assume != "war") {alert("This Is Not A War Session"); window.location.reload()}

      beginGamePleb()
      resolve()
    }
    catch (err) {
      err = err.message

      switch (err) {
        case ("NO USER"): alert("That User Does Not Exist"); break
        case ("INCORRECT PASSWORD"): alert("Wrong Password"); break
        case ("USERNAME AND PASSWORD REQUIRED"): alert("Please Provide Username And Password"); break
        case ("NO SESSION"): alert("No Session"); break
        case ("ACCOUNT BANNED"): alert("Your Account Is Banned, View Your Account Page For More Information"); break
        default: alert(err)
      }

      window.location.reload()
    }

  })
}

function newSession(username, password) {
  return new Promise(async function (resolve, reject) {
    getById("multiplayerMenu").style.display = "none";  
    getById("multiplayerNewMenu").style.display = "block";  
    
    try {
      let sessionID = await newSessionApi(username, password, "war")
      getById("status").innerText = "Session Code: " + sessionID

      onUserLeft = function (event) {
        alert("User Left")
        window.location.reload()
      }

      onNewUser = beginGameHost

      host = username
      thisPlayer = username
       
      resolve()
    }
    catch (err) {
      switch (err.message) {
        case ("NO USER"): alert("That User Does Not Exist"); break
        case ("INCORRECT PASSWORD"): alert("Wrong Password"); break
        case ("USERNAME AND PASSWORD REQUIRED"): alert("Please Provide Username And Password"); break
        case ("ACCOUNT BANNED"): alert("Your Account Is Banned, View Your Account Page For More Information"); break
        default: alert(err)
      }

      window.location.reload()
    }
    
  })
}

function beginGameHost(event) {
  achi.register("Play War Multiplayer", "bronze")
  let eventData = JSON.parse(event.data)
  getById("multiplayerNewMenu").style.display = "none"
  getById("cards").style.display = "flex"
  getById("whoWon").style.display = "block"
  getById("opponentName").innerText = `${eventData.username} Cards`
  getById("playerCardsNum").style.display = "block"
  getById("cpuCardsNum").style.display = "block"

  host = {
    username: host,
    cards: [],
    warCards: [],
    placedDownCard: false
  }

  pleb = {
    username: eventData.username,
    cards: [],
    warCards: [],
    placedDownCard: false
  }

  resetCards()
  
  let start = startGame(host.cards, pleb.cards, 52)

  host.cards = start[0]
  pleb.cards = start[1]

  getById("round").style.display = "inline"
  getById("playerCardsNum").innerHTML = `${host.username} Cards: 26`
  getById("cpuCardsNum").innerHTML = `${pleb.username} Cards: 26`
  getById("opponentName").innerText = `${pleb.username} Cards`

  getById("round").setAttribute("onclick", "hostPlaceDownCard()")

  getById("whoWon").innerHTML = "Click Place Card"

  onMessageFrom = plebPlacedDownCard
}

function beginGamePleb() {
  achi.register("Play War Multiplayer", "bronze")
  getById("whoWon").style.display = "block"
  getById("multiplayerNewMenu").style.display = "none"
  getById("round").style.display = "inline"
  getById("cards").style.display = "flex"
  getById("opponentName").innerText = `${hostName} Cards`
  getById("playerCardsNum").style.display = "block"
  getById("cpuCardsNum").style.display = "block"
  getById("playerCardsNum").innerHTML = `${hostName} Cards: 26`
  getById("cpuCardsNum").innerHTML = `${plebName} Cards: 26`

  getById("whoWon").innerHTML = "Click Place Card"

  getById("round").setAttribute("onclick", "plebPlaceDownCard()")
  onMessageFrom = multiRoundPleb
}