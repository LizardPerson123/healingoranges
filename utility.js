function getRndInteger(min, max) {return Math.floor(Math.random() * (max - min) ) + min}
let getById = id => {return document.getElementById(id) }
let getByClss = className => {return Array.from(document.getElementsByClassName(className))}

function titleCase(str) {
   let splitStr = str.toLowerCase().split(' ')
   for (var i = 0; i < splitStr.length; i++) {
     splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1)
   }
   return splitStr.join(' ')
}

function generateRandomCode(times, min, max) {
  let total = []
  for (let i = 0; i < times; i++) {
    total.push(getRndInteger(min, max))
  }

  return total.join("")
}