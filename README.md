<h1 align="center"> Screenshoteer </h1>

<p align="center"> Makes web screenshots and mobile emulations from the command line. </p>

<hr/>

<p>Tool based on <a href="https://github.com/GoogleChrome/puppeteer">puppeteer</a>. </p>

<h4>Installation </h4>

```shell
npm i -g screenshoteer
```
<p>You can use  screenshoteer like this:</p>

```shell
screenshoteer  --url https://www.example.com
```

<p>And with the help of puppeteer(Headless Chrome) it will generate screenshot of the entire web page.</p>

<p>
Parameters:

--url web page url  
--emulate - emulate web device example: --emulate "iPhone 6"  
--fullpage - can be true or false. It will take screenshot of entire web page if is true. True is the default parameter.  
--pdf - generate additional pdf  
--w - width of the Web Page in px  
--h - height of the Web Page in px
--waitfor - wait time for the page load in milliseconds

<p>

<h4>Example: </h4>

```shell
screenshoteer  --url https://news.ycombinator.com --fullpage false

screenshoteer  --url https://www.reddit.com/r/nodejs --emulate "iPhone 7"

screenshoteer  --url https://www.nytimes.com  --emulate "Nexus 4"

screenshoteer --url https://www.reddit.com/r/javascript/ --w 600 --h 800 --fullpage false

screenshoteer --url https://www.reddit.com/r/javascript/ --w 600 --h 0 --fullpage false

screenshoteer --url https://lobste.rs --pdf

screenshoteer --url https://lobste.rs --w 500


```
<p> List of of supported mobile devices: https://github.com/GoogleChrome/puppeteer/blob/master/DeviceDescriptors.js
</p>

<h3>License</h3>

This project is licensed under the MIT License
