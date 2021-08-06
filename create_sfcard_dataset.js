const fs = require('fs')

const SF_CARDS = require('./oracle-cards-20210804210513.json')

let mtgaCardDict = {}

console.log('====')

function handleSFCard (card) {
  if (card.legalities.standard === 'legal' || card.legalities.historic === 'legal') {
    //console.log(`${card.name} is a LEGAL mtga card`) 
    if ('card_faces' in card) {
      card.card_faces.forEach((face, i) => {
        const arturi = ('image_uris' in face) 
          ? face.image_uris.large
          : card.image_uris.large
        mtgaCardDict[face.name] = {
          arturi: arturi,
          mv: card.cmc,
          t: face.type_line,
          o: face.oracle_text,
          c: face.colors,
          s: card.set
        }
      })
    } else {
      mtgaCardDict[card.name] = {
        arturi: card.image_uris.large,
        mv: card.cmc,
        t: card.type_line,
        o: card.oracle_text,
        c: card.colors,
        s: card.set
      }
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
