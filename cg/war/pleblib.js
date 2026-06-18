function multiRoundPleb(event, from) {
  getById("chatButton").style.display = "inline-block"
  let eventData = JSON.parse(event.data)
  eventData = JSON.parse(eventData.content)

  let hostCard = eventData.hostCard
  let plebCard = eventData.plebCard
  let hostCardLength = eventData.hostCardLength
  let plebCardLength = eventData.plebCardLength
  let wonGame = eventData.whoWon

  hideCard("playerCards")
  hideCard("cpuCards")

  getById("playerCardsNum").innerHTML = `${hostName} Cards: ${hostCardLength || 0}`
  getById("cpuCardsNum").innerHTML = `${plebName}: ${plebCardLength || 0}`

  if (wonGame == "playerGame") {
    alert("Host Wins!")
    getById("whoWon").innerHTML = "Waiting For Next Round..."
    getById("round").removeAttribute("onclick")

    onMessageFrom = resetCardsPleb
  }
  else if (wonGame == "opponentGame") {
    alert("You Win!")

    getById("whoWon").innerHTML = "Waiting For Next Round..."
    getById("round").removeAttribute("onclick")

    onMessageFrom = resetCardsPleb
  }

  else if (wonGame == "war") {
    getById("whoWon").innerHTML = "War!"

    getById("outerPlayerCards").style.width = "100%"
    getById("outerCPUCards").style.width = "100%"

    plebCard.forEach((item) => {
      showCard(item, "playerCards")
    })

    hostCard.forEach((item) => {
      showCard(item, "cpuCards")
    })

    onMessageFrom = multiWarRoundPleb
  }

  else if (wonGame) {
    showCard(hostCard, "cpuCards")
    showCard(plebCard, "playerCards")

    getById("whoWon").innerHTML = `You Win ${hostName}'s Card`

    if (lastResult == "player") {
      streak++
      getById("whoWon").innerHTML += " x" + streak
    }
    else {streak = 1}
    lastResult = "player"
  }

  else if (eventData.msg == "message") {
    chat.register(from, eventData.chat)
  }

  else {
    showCard(hostCard, "cpuCards")
    showCard(plebCard, "playerCards")

    getById("whoWon").innerHTML = `${hostName} Wins Your Card`

    if (lastResult == "other") {
      streak++
      getById("whoWon").innerHTML += " x" + streak
    }
    else {streak = 1}
    lastResult = "other"
  }
}

function multiWarRoundPleb(event, from) {
  if (checkIfChatMsg(event, from)) {return}

  let eventData = JSON.parse(event.data)
  eventData = JSON.parse(eventData.content)
  let hostCardLength = eventData.hostCardLength
  let plebCardLength = eventData.plebCardLength

  let wonGame = eventData.whoWon

  if (wonGame == "tie") {
    alert("Tie! The War Continues")
    return
  }

  else if (wonGame) {
    getById("whoWon").innerHTML = `${hostName} Wins The War`
  }

  else {
    getById("whoWon").innerHTML = `${plebName} Wins The War`
  }

  getById("playerCardsNum").innerHTML = `${hostName} Cards: ${hostCardLength}`
  getById("cpuCardsNum").innerHTML = `${plebName} Cards: ${plebCardLength}`

  hideCard("cpuCards")
  hideCard("playerCards")

  getById("outerPlayerCards").style.width = "40%"
  getById("outerCPUCards").style.width = "40%"

  onMessageFrom = multiRoundPleb

  streak = 0
  lastResult = "none"
}

function plebPlaceDownCard() {
  getById("whoWon").innerHTML = "Waiting For Other Player To Place Card"
  broadcast('')
}

function resetCardsPleb(event, from) {
  if (checkIfChatMsg(event, from)) {return}

  getById("playerCardsNum").innerHTML = `${hostName} Cards: 26`
  getById("cpuCardsNum").innerHTML = `${plebName} Cards: 26`
  getById("opponentName").innerText = `${hostName} Cards`

  getById("whoWon").innerHTML = "Click Place Card"

  getById("round").setAttribute("onclick", "plebPlaceDownCard()")
  onMessageFrom = multiRoundPleb
}