//import * as puppeteer from "puppeteer";
//import puppeteerExtra from "puppeteer-extra";
//import puppeteer from "puppeteer-core";
import chromium from "chrome-aws-lambda";

export async function startBrowser() {
    let browser;
    try {
        console.log("Opening the browser......");
         browser = await chromium.puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });
        // const newpage = await browser.newPage();
        return browser;
        
    } catch (err) {
        console.log("Could not create a browser instance => : ", err);
    }
}