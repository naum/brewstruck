const yount = require('./yount.js')

const ES = ''
const MTG_COL_W = '}'
const MTG_COL_U = '|'
const MTG_COL_B = '['
const MTG_COL_R = '{'
const MTG_COL_G = ']'
const MTG_COL_LITS = [
  MTG_COL_W, MTG_COL_U, MTG_COL_B, MTG_COL_R, MTG_COL_G
]
const WO_FEATURES = 'left=80,top=80'

let cardFetchElapsedHS = 0
let cardFetchIntervalID = null
let chosenFormat = 'historic'
let sfWin = null

nw.Screen.Init()

let win = nw.Window.get()
win.showDevTools()
win.maximize()

const activeScreen = nw.Screen.screens[0]
console.dir(activeScreen)

function clearGeneratedDeckDisplay () {
  let gdelem = document.getElementById('generated-deck')
  gdelem.innerHTML = ES
}

function determineChosenFormat () {
  const cfelems = document.getElementsByName('chosenformat')
  if (cfelems[0].checked) {
    chosenFormat = 'historic'
  } else {
    chosenFormat = 'standard'
  }
  console.log(`chosenFormat: ${chosenFormat}`)
}

function disableCpuBusyIndicator() {
  let cpubusyElem = document.getElementById('cpu-busy')
  cpubusyElem.style.display = 'none'
  clearInterval(cardFetchIntervalID)
}

function displayCpuBusyIndicator() {
  console.log(`cardFetchElapsedHS: ${cardFetchElapsedHS}`)
  const cpuWorkingLit = MTG_COL_LITS.map((cc, i) => {
    return ((cardFetchElapsedHS % MTG_COL_LITS.length) === i)
      ? `<span class="litcolor">${cc}</span>`
      : cc
  })
  let cpubusyElem = document.getElementById('cpu-busy')
  cpubusyElem.style.display = 'block'
  cpubusyElem.innerHTML = cpuWorkingLit.join(' \u3000 ')
}

function enableCpuBusyIndicator() {
  cardFetchElapsedHS = 0
  cardFetchIntervalID = setInterval(() => {
    displayCpuBusyIndicator()
    cardFetchElapsedHS += 1
  }, 500)
}

function fillMtgaCardDatalist () {
  let clelem = document.getElementById('mtgacards')
  const carddl = yount.mtgaCardList()
  carddl.forEach((cn) => {
    let optelem = document.createElement('option')
    optelem.setAttribute('value', cn)
    clelem.append(optelem)
  })
}

function generateDeckCandidateDisplay (cardname) {
  yount.handleCard(cardname, chosenFormat).then((cardlist) => {
    console.log(`cardlist: ${cardlist}`)
    disableCpuBusyIndicator()
    let gdelem = document.getElementById('generated-deck')
    const sectTitle = '<h2>deck candidates</h2>'
    gdelem.innerHTML = sectTitle + generateDeckCandidateTable(cardlist)
    setupCardCellLinks(cardlist)
  })
}

function generateDeckCandidateTable (cardlist) {
  let tbout = ''
  const thout = 
    '<th class="text-right">mv</th>' +
    '<th class="text-right">synergy</th>' +
    '<th class="text-left">color</th>' +
    '<th class="text-left">card</th>'
  tbout += `<tr>${thout}</tr>`
  cardlist.forEach((c) => {
    const tdout =  
      `<td class="text-right">${c.mv}</td>` +
      `<td class="text-right">${c.synergy}</td>` +
      `<td class="text-left">${c.c}</td>` +
      `<td class="cardcell text-left">${c.name}</td>`
    tbout += `<tr>${tdout}</tr>`
  })
  return `<table id="dc-chart">${tbout}</table>`
}

function genesis () {
  fillMtgaCardDatalist()
  let conelem = document.getElementById('console')
  setupBrewButtonTrigger()
}

function setupBrewButtonTrigger () {
  const belem = document.getElementById('gobrew')
  gobrew.addEventListener('click', () => {
    determineChosenFormat()
    clearGeneratedDeckDisplay()
    enableCpuBusyIndicator()
    const targetCard = document.querySelector('#cardchoice').value
    generateDeckCandidateDisplay(targetCard)
  })
}

function setupCardCellLinks (cardlist) {
  document.querySelectorAll('.cardcell').forEach((cc) => {
    cc.addEventListener('click', (e) => {
      const cardho = e.target.firstChild.textContent
      const cqs = encodeURIComponent(cardho)
      sfWin = window.open(
        `https://scryfall.com/search/?q=${cqs}`, 
        '_blank', 
        WO_FEATURES
      )
    })
  })
}

document.addEventListener('DOMContentLoaded', () => {
  genesis()
})
