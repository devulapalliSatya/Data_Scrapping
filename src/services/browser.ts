import chromium from "chrome-aws-lambda";
//import puppeteer from 'puppeteer-core';
import * as puppeteer from "puppeteer";

export async function startBrowser() {
    let browser;
    
    try {
        if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
            let options = {
               args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
               defaultViewport: chromium.defaultViewport,
               executablePath: await chromium.executablePath,
               headless: true,
               ignoreHTTPSErrors: true,
             };
         
        console.log("Opening the browser......");
        let browser = await puppeteer.launch(options)
        return browser;
    
        // const newpage = await browser.newPage();
       
    }  
    }catch (err) {
        console.log("Could not create a browser instance => : ", err);
    }
}