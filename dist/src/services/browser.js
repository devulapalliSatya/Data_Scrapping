"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startBrowser = void 0;
const chrome_aws_lambda_1 = __importDefault(require("chrome-aws-lambda"));
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
// import  PuppeteerExtra from "puppeteer-extra";
// import Stealth from 'puppeteer-extra-plugin-stealth';
// PuppeteerExtra.use(Stealth());
function startBrowser() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
                let browser = yield puppeteer_core_1.default.launch({
                    args: [...chrome_aws_lambda_1.default.args, "--hide-scrollbars", "--disable-web-security"],
                    defaultViewport: chrome_aws_lambda_1.default.defaultViewport,
                    executablePath: yield chrome_aws_lambda_1.default.executablePath,
                    headless: 'new',
                    ignoreHTTPSErrors: true,
                });
                console.log('=====in production=======');
                return browser;
            }
            console.log('=====in local=======');
            let browser = yield puppeteer_core_1.default.launch({});
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
        }
        catch (err) {
            console.log("Could not create a browser instance => : ", err);
        }
    });
}
exports.startBrowser = startBrowser;
