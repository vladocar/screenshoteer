#!/usr/bin/env node

const puppeteer = require('puppeteer')
const devices = require('puppeteer/DeviceDescriptors')
const program = require('commander')

var urlvalue, emulate = "";

program
    .option('--url, [url]', 'The url')
    .option('--emulate, [emulate]', 'emulate device')
    .option('--fullpage, [fullpage]', 'Full Page')
    .option('--pdf, [pdf]', 'Generate PDF')
    .option('--w, [w]', 'width')
    .option('--h, [h]', 'height')
    .option('--waitfor, [waitfor]', 'Wait time in milliseconds')
    .option('--el, [el]', 'element css selector')
    .option('--auth, [auth]', 'Basic HTTP authentication')
    .parse(process.argv);

if (program.url) urlvalue = program.url
else process.exit(console.log("Please add --url parameter. Something like this: $ screenshoteer --url http:www.example.com"));

!program.fullpage ? fullPage = true : fullPage = JSON.parse(program.fullpage); 

console.log(urlvalue);
console.log(fullPage);

(async () => {

  try {
    await execute();
  } catch(e) {
    console.error(e);
    process.exit(1);
  }

  async function execute() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    const d = new Date()
    if (program.w && program.h) await page.setViewport({width: Number(program.w), height: Number(program.h)})
    if (program.emulate) await page.emulate(devices[program.emulate]);
    if (program.auth) {
      const [username, password] = program.auth.split(':');
      await page.authenticate({username:username, password:password});
    } 
    await page.goto(urlvalue)
    const title = await page.title()
    const t = title.replace(/[/\\?%*:|"<>]/g, '-')
    if (program.waitfor) await page.waitFor(Number(program.waitfor))
    if (program.el) {
      const el = await page.$(program.el);
      await el.screenshot({
        path: `${t} ${program.emulate} ${program.el} ${d.getTime()}.png`
      });
    } else {
      await page.screenshot({path: t + " " +  program.emulate  + " " + d.getTime() + '.png', fullPage: fullPage})
    }
    await page.emulateMedia('screen')
    if (program.pdf) await page.pdf({ path: t + " " +  program.emulate  + " " + d.getTime()  + '.pdf' })
    console.log(t)
    await browser.close()
  }

})()



