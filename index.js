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
    .option('--waitforselector, [waitforselector]', 'Wait for the selector to appear in page')
    .option('--el, [el]', 'element css selector')
    .option('--auth, [auth]', 'Basic HTTP authentication')
    .option('--no, [no]', 'Exclude')
    .option('--click, [click]', 'Click')
    .option('--file, [file]', 'Output file')
    .option('--theme, [theme]', 'Color Theme light or dark')
    .option('--vd, [vd]', 'Emulate vision deficiency')
    .parse(process.argv);

if (!program.url) {
  console.log('Please add --url parameter.\n' +
              'Something like this: $ screenshoteer --url http://www.example.com');
  process.exit();
}

!program.fullpage ? program.fullPage = true : program.fullPage = JSON.parse(program.fullpage);

console.log(program.url);
console.log(program.fullPage);


const deviceName = puppeteer.devices[program.emulate];


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
    if (program.no) {
      await page.setRequestInterception(true);
      page.on('request', request => {
        if (request.resourceType() === program.no)
          request.abort();
          else
        request.continue();
      });
    }
    const timestamp = new Date().getTime();
    if (program.w || program.h) {
      const newWidth = !program.w?600:program.w
      const newHeight = !program.h?'0':program.h
      if (program.h && !program.fullpage) program.fullPage = false;
      await page.setViewport({width: Number(newWidth), height: Number(newHeight)})
    }
    if (program.theme) {
      await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: program.theme }]);
    }
    if (program.vd) {
      await page.emulateVisionDeficiency(program.vd);
    }
    if (program.emulate)
      await page.emulate(deviceName);
    else
      program.emulate = '';

    if (program.auth) {
      const [username, password] = program.auth.split(';');
      await page.authenticate({ username, password });
    }
    await page.goto(program.url);
    const title = (await page.title()).replace(/[/\\?%*:|"<>]/g, '-');
    if (program.waitfor) await page.waitFor(Number(program.waitfor));
    if (program.waitforselector) await page.waitForSelector(program.waitforselector);
    if (program.click) await page.click(program.click);
    const file = program.file ? program.file : `${title} ${program.emulate} ${program.el} ${timestamp}.png`;
    if (program.el) {
      const el = await page.$(program.el);
      await el.screenshot({path: file});
    } else {
      await page.screenshot({path: file, fullPage: program.fullPage});
    }
    await page.emulateMedia('screen');
    if (program.pdf) await page.pdf({path: `${title} ${program.emulate} ${timestamp}.pdf`});
    console.log(title);
    await browser.close();
  }
})()
