let users = []
let usersData
let host
let pleb
let totalCards
let thisPlayer

function joinSession(username, password, sessionID) {
  return new Promise(async function (resolve, reject) {
    getById("multiplayerMenu").style.display = "none";
    getById("multiplayerJoin").style.display = "block";  

    pleb = username
    thisPlayer = username

    try {
      onMessageFrom = function(event) {
        let eventData = JSON.parse(event.data)
        let content = JSON.parse(eventData.content)
        let from = eventData.from

        if (from == host) {
          content.users.forEach(function (item) {
            users.push(item)
            getById("usernames2").innerHTML += `<p id="${item}" style="font-size: 1.3em; margin-top: 0px;">${item}</p>`
          })
        }
      }

      let [hostName, assume, usersList] = await joinSessionApi(username, password, sessionID)
      host = hostName

      users = [pleb].concat(usersList)

      users.forEach((item) => {getById("usernames2").innerHTML += `<p id="${item}" style="font-size: 1.3em; margin-top: 0px;">${item}</p>`; })

      if (assume != "slapjack") {alert("This Is Not A Slapjack Session"); window.location.reload()}

      getById("host").innerText = "Host: " + host

      onMessageFrom = async function(event) {
        getById("cards").style.display = "flex"
        getById("multiplayerJoin").style.display = "none"
        getById("currentTurn").style.display = "block"
        getById("round").innerHTML = "Place Card"
        getById("round").style.display = "inline-block"
        getById("round").removeAttribute("onclick")

        onUserLeft = function(event) {
          let eventData = JSON.parse(event.data)

          getById(`${eventData.username}Num`).remove()
        }

        users.forEach(function(username) {
          getById("cardNum").innerHTML += `
            <p id="${username}Num" class="infoText">${username} Cards: ${Math.round(52 / users.length)}</p>
          `
        })

        onMessageFrom = gamePleb
      }
      

      onNewUser = function(event) {
        let eventData = JSON.parse(event.data)

        users.push(eventData.username)
        getById("usernames2").innerHTML += `<p id="${eventData.username}" style="font-size: 1.3em; margin-top: 0px;">${eventData.username}</p>`
      }

      onUserLeft = function(event) {
         let eventData = JSON.parse(event.data)

         let removedUser = eventData.username
         getById(removedUser).remove()
         removeItem(users, removedUser)

      }

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
        default: alert("Something Happened")
      }

      window.location.reload()
    }

  })
}

function newSession(username, password) {
  return new Promise(async function (resolve, reject) {
    getById("multiplayerMenu").style.display = "none";  
    getById("multiplayerNewMenu").style.display = "block";  

    host = username

    try {
      let sessionID = await newSessionApi(username, password, "slapjack")
      getById("status").innerText = "Session Code: " + sessionID

      onUserLeft = function (event) {
        let eventData = JSON.parse(event.data)

        let removedUser = eventData.username
        getById(removedUser).remove()
        removeItem(users, removedUser)

        if (users.length < 1) {
          getById("startMultiplayerGame").style.display = "none"
        }

        if (users.length == 4) {openJoin()}
      }

      onNewUser = function(event) {
        let eventData = JSON.parse(event.data)

        users.push(eventData.username)
        getById("usernames").innerHTML += `<p id="${eventData.username}" style="font-size: 1.3em;  margin-top: 0px;">${eventData.username}</p>`

        getById("startMultiplayerGame").style.display = "inline"
        if (users.length == 5) {alert("Max Users Reached"); endJoiningApi()}
      }

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
        default: alert("Something Happened")
      }

      window.location.reload()
    }
    
  })
}

async function beginGameHost(){
  await endJoiningApi()
  let members = await getMembersApi()

  getById("round").innerHTML = "Place Card"

  if (members.length < 2) {
    alert("Not Enough Players")
    return
  }

  users = members

  getById("cards").style.display = "flex"

  usersCards = []
  users.forEach(function(user) {
    usersCards.push([])
  })

  onUserLeft = onUserLeave

  usersCards = dealCardsMulti(usersCards)

  usersData = {}
  let i = 0

  totalCards = 0

  users.forEach((item) => {
    usersData[item] = {cards: usersCards[i], username: item}
    totalCards += usersData[item].cards.length
    i++
  })

  await broadcast("")

  gameHost()
}

function onUserLeave(event) {
  let eventData = JSON.parse(event.data)
  delete usersData[eventData.username]

  getById(`${eventData.username}Num`).remove()
}