
const puppeteer = require('puppeteer')

URL_GRAB_BAG = [
  'https://azspot.net',
  'https://google.com',
  'https://bbc.com'
]

async function grabImageLinks () {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  let currentUrl
  page
    .waitForSelector('img')
    .then(() => console.log(`First URL with image: ${currentUrl}`))
  for (currentUrl of URL_GRAB_BAG) {
    await page.goto(currentUrl)
  }
  await browser.close()
}

grabImageLinks()
