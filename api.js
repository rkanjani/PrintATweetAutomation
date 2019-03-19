const puppeteer = require("puppeteer");

try {
  var url = process.argv[2];

  urlToImage(url).then(function() {
    console.log("saved!");
  });
} catch (err) {
  console.log(err);
}

async function urlToImage(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setBypassCSP(true);
  //turn this into dynamic input
  await page.goto(url);
  await page.addScriptTag({ path: "picture.js" });
  await page.setViewport({ width: 1200, height: 900, deviceScaleFactor: 7 });
  // Get the "viewport" of the page, as reported by the page.
  async function captureTweet(selector, padding = 0) {
    const rect = await page.evaluate(selector => {
      const element = document.querySelector(selector);
      const { x, y, width, height } = element.getBoundingClientRect();
      return { left: x, top: y, width, height, id: element.id };
    }, selector);

    return await page.screenshot({
      path: "tweet.png",
      clip: {
        x: rect.left - padding,
        y: rect.top - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2
      }
    });
  }

  await captureTweet(".tweet", -5);
  console.log("THIS WORKED!");
  await browser.close();
  return "tweet-kanye.png";
}
