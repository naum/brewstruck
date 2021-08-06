
const puppeteer = require('puppeteer')

async function fetchHNStories () {
  const browser = await puppeteer.launch()
  const context = await browser.createIncognitoBrowserContext()
  const page = await context.newPage()
  await page.tracing.start({
    path: 'trace.json',
    categories: ['devtools.timeline']
  })
  await page.goto('https://news.ycombinator.com/news')
  const stories = await page.$$eval('a.storylink', anchors => { return anchors.map(anchor => anchor.textContent).slice(0, 10) })
  console.log(stories)
  await page.tracing.stop()
  await browser.close()
}

fetchHNStories()
