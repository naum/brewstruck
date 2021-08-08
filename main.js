const yount = require('./yount.js')

const BRNL = '<br>\n'

nw.Screen.Init()

let win = nw.Window.get()
win.showDevTools()
win.maximize()

const activeScreen = nw.Screen.screens[0]
console.dir(activeScreen)

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
  yount.handleCard(cardname).then((cardlist) => {
    console.log(`cardlist: ${cardlist}`)
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
    document.querySelector('#generated-deck').innerHTML = '<p>Processing&hellip;'
    const targetCard = document.querySelector('#cardchoice').value
    generateDeckCandidateDisplay(targetCard)
  })
}

function setupCardCellLinks (cardlist) {
  document.querySelectorAll('.cardcell').forEach((cc) => {
    cc.addEventListener('click', (e) => {
      const cardho = e.target.firstChild.textContent
      const cqs = encodeURIComponent(cardho)
      window.open(`https://scryfall.com/search/?q=${cqs}`, '_blank')
    })
  })
}

document.addEventListener('DOMContentLoaded', () => {
  genesis()
})
