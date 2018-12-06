#!/usr/bin/env node

const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const program = require('commander');

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

if (!program.url) {
  console.log('Please add --url parameter.\n' +
              'Something like this: $ screenshoteer --url http://www.example.com');
  process.exit();
}

!program.fullpage ? program.fullPage = true : program.fullPage = JSON.parse(program.fullpage);

console.log(program.url);
console.log(program.fullPage);

(async () => {

  try {
    await execute();
  } catch(e) {
    console.error(e);
    process.exit(1);
  }

  async function execute() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const timestamp = new Date().getTime();
    if (program.w && program.h) await page.setViewport({width: Number(program.w), height: Number(program.h)});
    if (program.emulate)
      await page.emulate(devices[program.emulate]);
    else
      program.emulate = '';
    if (program.auth) {
      const [username, password] = program.auth.split(';');
      await page.authenticate({ username, password });
    } 
    await page.goto(program.url);
    const title = (await page.title()).replace(/[/\\?%*:|"<>]/g, '-');
    if (program.waitfor) await page.waitFor(Number(program.waitfor));
    if (program.el) {
      const el = await page.$(program.el);
      await el.screenshot({path: `${title} ${program.emulate} ${program.el} ${timestamp}.png`});
    } else {
      await page.screenshot({path: `${title} ${program.emulate} ${timestamp}.png`, fullPage: program.fullPage});
    }
    await page.emulateMedia('screen');
    if (program.pdf) await page.pdf({path: `${title} ${program.emulate} ${timestamp}.pdf`});
    console.log(title);
    await browser.close();
  }

})()
