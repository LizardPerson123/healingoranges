let inWar = false
let inPreviousManagement = false

function multiRoundHost() {
  getById("chatButton").style.display = "inline-block"
  
  if (host.placedDownCard && pleb.placedDownCard) {
    if (inPreviousManagement) {return}
    inPreviousManagement = true

    let wonGame

    if (!pleb.cards[0]) {
      broadcast(JSON.stringify({whoWon: 'playerGame'}))
      alert("You Win!")

      let doContinue = confirm("Play Again?")
      if (doContinue) {
        resetGameHost()
        inPreviousManagement = false
        return
      }
      else {
        window.location.reload()
      }
    }
    else if (!host.cards[0]) {
      broadcast(JSON.stringify({whoWon: 'opponentGame'}))
      alert(`${pleb.username} Wins!`)

      let doContinue = confirm("Play Again?")
      if (doContinue) {
        resetGameHost()
        inPreviousManagement = false
        return
      }
      else {
        window.location.reload()
      }
    }

    hideCard("playerCards")
    hideCard("cpuCards")

    showCard(pleb.cards[0], "cpuCards")
    preLoadCard(pleb.cards[1])

    showCard(host.cards[0], "playerCards")
    preLoadCard(host.cards[1])

    let plebCard = pleb.cards[0]
    let hostCard = host.cards[0]

    let compareResult = compare(hostCard[1], plebCard[1])

    if (compareResult == "war") {
      inWar = true
      getById("whoWon").innerHTML = "War!"

      getById("outerPlayerCards").style.width = "100%"
      getById("outerCPUCards").style.width = "100%"

      pleb.warCards.push(pleb.cards[0])
      host.warCards.push(host.cards[0])

      removeItem(host.cards, host.cards[0])
      removeItem(pleb.cards, pleb.cards[0])

      for (let i = 1; i <= 3; i++) {
        if (!(host.cards.length < 2)) {
          let hostCard = nextInDeck(host.cards)[0]

          removeItem(host.cards, hostCard)
          host.warCards.push(hostCard)

          showCard(hostCard, "playerCards")
        }
        
      }

      for (let i = 1; i <= 3; i++) {
        if (!(pleb.cards.length < 2)) {
          let plebCard = nextInDeck(pleb.cards)[0]

          removeItem(pleb.cards, plebCard)
          pleb.warCards.push(plebCard)

          showCard(plebCard, "cpuCards")
        }
        else {
          break
        }
        
      }
    }

    else if (compareResult) {
      getById("whoWon").innerHTML = `You Win ${pleb.username}'s Card`

      wonGame = false

      if (lastResult == "player") {
        streak++
        getById("whoWon").innerHTML += " x" + streak
      }
      else {streak = 1}
      lastResult = "player"

      host.cards.push(pleb.cards[0])
      removeItem(pleb.cards, pleb.cards[0])

      host.cards = nextInDeck(host.cards)
    }

    else {
      getById("whoWon").innerHTML = `${pleb.username} Wins Your Card`

      wonGame = true

      if (lastResult == "other") {
        streak++
        getById("whoWon").innerHTML += " x" + streak
      }
      else {streak = 1}
      lastResult = "other"

      pleb.cards.push(host.cards[0])
      removeItem(host.cards, host.cards[0])

      pleb.cards = nextInDeck(pleb.cards)
    }

    getById("playerCardsNum").innerHTML = `${host.username} Cards: ${host.cards.length}`
    getById("cpuCardsNum").innerHTML = `${pleb.username} Cards: ${pleb.cards.length}`

    if (inWar) {
      broadcast(JSON.stringify({whoWon: 'war', hostCard: host.warCards, plebCard: pleb.warCards, hostCardLength: host.cards.length, plebCardLength: pleb.cards.length}))
    }
    else {
      broadcast(JSON.stringify({whoWon: wonGame, hostCard: hostCard, plebCard: plebCard, hostCardLength: host.cards.length, plebCardLength: pleb.cards.length, nextHostCard: host.cards[1], nextPlebCard: pleb.cards[1]}))
    }

    host.placedDownCard = false
    pleb.placedDownCard = false 

    inPreviousManagement = false
  }
}

async function multiWarRoundHost() {
  if (host.placedDownCard && pleb.placedDownCard) {
    if (inPreviousManagement) {return}
    inPreviousManagement = true
    
    let hostCard = nextInDeck(host.cards)[0]
    removeItem(host.cards, hostCard)
    host.warCards.push(hostCard)

    let plebCard = nextInDeck(pleb.cards)[0]
    removeItem(pleb.cards, plebCard)
    pleb.warCards.push(plebCard)

    let compareResult = compare(hostCard[1], plebCard[1])

    if (compareResult == "war") {
      alert("Tie! The War Continues")
      showCard(hostCard, "playerCards")
      showCard(plebCard, "cpuCards")

      await broadcast(JSON.stringify({whoWon: "tie", hostCardLength: host.cards.length, plebCardLength: pleb.cards.length}))

      inPreviousManagement = false
      return
    }
    else if (compareResult) {
      getById("whoWon").innerHTML = `${host.username} Wins The War`
      host.warCards.forEach(function(card) {
        host.cards.push(card)
      })

      pleb.warCards.forEach(function(card) {
        host.cards.push(card)
      })

      await broadcast(JSON.stringify({whoWon: false, hostCardLength: host.cards.length, plebCardLength: pleb.cards.length}))
    }
    else {
      getById("whoWon").innerHTML = `${pleb.username} Wins The War`
      host.warCards.forEach(function(card) {
        pleb.cards.push(card)
      })

      pleb.warCards.forEach(function(card) {
        pleb.cards.push(card)
      })

      await broadcast(JSON.stringify({whoWon: true, hostCardLength: host.cards.length, plebCardLength: pleb.cards.length}))
    }

    host.warCards = []
    pleb.warCards = []

    getById("round").setAttribute("onclick", "hostPlaceDownCard()")

    getById("playerCardsNum").innerHTML = `${host.username} Cards: ${host.cards.length}`
    getById("cpuCardsNum").innerHTML = `${pleb.username} Cards: ${pleb.cards.length}`

    hideCard("cpuCards")
    hideCard("playerCards")

    getById("outerPlayerCards").style.width = "40%"
    getById("outerCPUCards").style.width = "40%"

    inWar = false
    host.placedDownCard = false
    pleb.placedDownCard = false

    streak = 0
    lastResult = "none"
    inPreviousManagement = false
  }
}

function plebPlacedDownCard(event, from) {
  if (checkIfChatMsg(event, from)) {return}

  pleb.placedDownCard = true
  if (inWar) {
    multiWarRoundHost()
    return
  }

  multiRoundHost()
}

function hostPlaceDownCard() {
  host.placedDownCard = true
  getById("whoWon").innerHTML = "Waiting For Other Player To Place Card"

  if (inWar) {
    multiWarRoundHost()
    return
  }

  multiRoundHost()
}

function resetGameHost() {
  host.cards = []
  pleb.cards = []
  host.warCards = []
  pleb.warCards = []
  host.placedDownCard = false
  pleb.placedDownCard = false
  inWar = false

  resetCards()

  let start = startGame(host.cards, pleb.cards, 8)
  host.cards = start[0]
  pleb.cards = start[1]

  getById("playerCardsNum").innerHTML = `${host.username} Cards: 26`
  getById("cpuCardsNum").innerHTML = `${pleb.username} Cards: 26`
  getById("opponentName").innerText = `${pleb.username} Cards`

  getById("whoWon").innerHTML = "Click Place Card"

  broadcast('')
}

function checkIfChatMsg(event, from) {
  try {
    let eventData = JSON.parse(event.data)
    eventData = JSON.parse(eventData.content)
    if (eventData.msg == "message") {chat.register(from, eventData.chat); return true}
  }
  catch(e) {}
}