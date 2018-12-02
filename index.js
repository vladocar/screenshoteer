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
    .parse(process.argv);

if (program.url) urlvalue = program.url
else process.exit(console.log("Please add --url parameter. Something like this: $ screenshoteer --url http:www.example.com"));


if (program.fullpage && program.fullpage == "true") fullPage = true
if (program.fullpage && program.fullpage == "false") fullPage = false
else fullPage = true;

console.log(urlvalue);
console.log(fullPage);

(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  const d = new Date()
  if (program.w && program.h) await page.setViewport({width: Number(program.w), height: Number(program.h)})
  if (program.emulate) await page.emulate(devices[program.emulate]);
  await page.goto(urlvalue)
  await page.screenshot({path: await page.title() + " " +  program.emulate  + " " + d.getTime() + '.png', fullPage: fullPage})
  await page.emulateMedia('screen')
  if (program.pdf) await page.pdf({ path: await page.title() + " " +  program.emulate  + " " + d.getTime()  + '.pdf' })
  console.log(await page.title())
  await browser.close()
})()
