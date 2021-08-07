
const ACARDS = require('./mtgacarddict.json')
const STANDARD_SETS = [
  'afr', 'stx', 'khm', 'znr',
  'm21', 'iko', 'thb', 'eld'
]
const STANDARD_2022_SETS = [
  'afr', 'stx', 'khm', 'znr'
]

const cheerio = require('cheerio')
const puppeteer = require('puppeteer')

const EDHREC_URL = 'https://edhrec.com/cards/'

function byMV (a, b) {
  const a_mv = ACARDS[a.name].mv ?? 0
  const b_mv = ACARDS[b.name].mv ?? 0
  if (a_mv !== b_mv) {
    return (a_mv >= 6 && b_mv >= 6) ? b.synergy - a.synergy : a_mv - b_mv
  } else {
    return b.synergy - a.synergy
  }
}

function bySynergyScore (a, b) {
  return b.synergy - a.synergy
}

function formatCardQS (cardname) {
  if (cardname) {
    cardname = cardname.replace(/,/g, '')
    cardname = cardname.replace(/\'/g, '')
    cardname = cardname.replace(/\s\/\/.*$/, '')
    return cardname.replace(/\s/g, '-').toLowerCase()
  }
}

function generateImageFilename (u) {
  let fn = u.replace(/^http(s)?:\/\//, '')
  fn = fn.replace(/[^\w]/g, '_')
  fn = fn.replace(/^www_/, '')
  fn = fn.replace(/_$/, '')
  //console.log(`fn: ${fn}`)
  return fn
}

async function handleCard (cardName) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  const targetUrl = `${EDHREC_URL}${formatCardQS(cardName)}`
  console.log(`targetUrl: ${targetUrl}`)
  await page.goto(targetUrl, {waitUntil: 'networkidle0', timeout: 240000})
  const data = await page.evaluate(() => document.querySelector('*').outerHTML)
  const $ = cheerio.load(data)
  let synCards = []
  $('div[class^="CardView_card_"]').each((i, e) => {
    const cardName = e.children[0].children[1].children[1].children[0].data
    let synPercent
    if (e.children[0].children[1].children[2]) {
      synPercent = e.children[0].children[1].children[2].children[0].data
    } else {
      synPercent = 'NA'
    }
    const synScore = pluckSynergyVal(synPercent)
    if (cardName in ACARDS) {
      synCards.push({ 
        name: cardName, 
        synergy: synScore,
        mv: ACARDS[cardName].mv,
        c: ACARDS[cardName].c.join(''),
        o: ACARDS[cardName].o,
        arturi: ACARDS[cardName].arturi
      })
    }
  })
  console.log("====")
  console.log(`${cardName.toUpperCase()}`)
  console.log('----')
  console.log(`Total cards: ${synCards.length}`)
  console.log('----')
  //synCards.sort(bySynergyScore)
  synCards.sort(byMV)
  synCards.forEach((c) => {
    if (! 'mv' in ACARDS[c.name]) {
      console.log(`Missing **mv** for ${c.name}!`)
    }
    //if (c.name in ACARDS && STANDARD_SETS.includes(ACARDS[c.name].s)) {
    if (c.name in ACARDS) {
      console.log(`${c.synergy}, ${c.name}, ${ACARDS[c.name].mv}, ${ACARDS[c.name].c.join('')}`)
    }
  })
  console.log('----')
  await browser.close()
  return synCards
}

function mtgaCardList () {
  return Object.keys(ACARDS).sort()
}

function pluckSynergyVal (synPercentStr) {
  let synScore = synPercentStr.replace(/^.*?((?:\-)?\d+)\% synergy.*$/s, '$1')
  synScore = parseInt(synScore) 
  return (Number.isInteger(synScore)) ? synScore : -999
}

module.exports = { handleCard, mtgaCardList }