import chrome from "chrome-aws-lambda";
import * as puppeteer1 from "puppeteer";
import puppeteer from 'puppeteer-core';
// import  PuppeteerExtra from "puppeteer-extra";
// import Stealth from 'puppeteer-extra-plugin-stealth';

// PuppeteerExtra.use(Stealth());


export async function startBrowser() {


    try {
        if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
            let browser = await puppeteer.launch({
                args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
                defaultViewport: chrome.defaultViewport,
                executablePath: await chrome.executablePath,
                headless: 'new',
                ignoreHTTPSErrors: true,
            });
            console.log('=====in production=======')
            return browser;
        }
        console.log('=====in local=======')
        let browser = await puppeteer.launch({});
        return browser;

        // if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
        //     console.log("Opening the browser......");
        //     const browser = await puppeteer.launch({
        //         headless: 'new',
        //         args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
        //         defaultViewport: chromium.defaultViewport,
        //         executablePath: await chromium.executablePath,
        //         ignoreHTTPSErrors: true,
        //         ignoreDefaultArgs: ['--disable-extensions']
        //     });
        // const newpage = await browser.newPage();

        // // Return the browser object here if needed
        // return browser;
        //}
    } catch (err) {
        console.log("Could not create a browser instance => : ", err);
    }
}