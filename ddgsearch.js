
const puppeteer = require('puppeteer')

async function searchDdg () {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://duckduckgo.com/', { waitUntil: 'networkidle2' })
  await page.type('#search_form_input_homepage', 'Puppeteer')
  const searchVal = await page.$eval('#search_form_input_homepage', el => el.value)
  console.log(searchVal)
  await browser.close()
}
