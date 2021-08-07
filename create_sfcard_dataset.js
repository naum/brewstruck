const fs = require('fs')

const SF_CARDS = require('./oracle-cards-20210804210513.json')

let mtgaCardDict = {}

console.log('====')

function handleSFCard (card) {
  if (card.legalities.standard === 'legal' || card.legalities.historic === 'legal') {
    console.log(`${card.name} is a LEGAL mtga card`) 
    let arturi, o
    if ('card_faces' in card) {
      arturi = ('image_uris' in card.card_faces[0])
        ? card.card_faces[0].image_uris.large
        : card.image_uris.large
      o = ('oracle_text' in card.card_faces[0])
        ? card.card_faces[0].oracle_text
        : card.oracle_text
    } else {
      arturi = card.image_uris.large
      o = card.oracle_text
    }
    mtgaCardDict[card.name] = {
      arturi: arturi,
      mv: card.cmc,
      t: card.type_line,
      o: o,
      c: card.color_identity,
      s: card.set
    }
  } 
}

function reportRunTotals () {
  const cardNames = Object.keys(mtgaCardDict)
  console.log('----')
  console.log(`Total historic and standard cards: ${cardNames.length}`)
  console.log('====')
  //console.dir(mtgaCardDict)
}

function saveMtgaCardDict () {
  const jstr = JSON.stringify(mtgaCardDict)
  fs.writeFileSync('mtgacarddict.json', jstr)
}

SF_CARDS.forEach(handleSFCard)
saveMtgaCardDict()
reportRunTotals()
