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
//import * as puppeteer from "puppeteer";
//import puppeteerExtra from "puppeteer-extra";
//import puppeteer from "puppeteer-core";
const chrome_aws_lambda_1 = __importDefault(require("chrome-aws-lambda"));
function startBrowser() {
    return __awaiter(this, void 0, void 0, function* () {
        let browser;
        try {
            console.log("Opening the browser......");
            browser = yield chrome_aws_lambda_1.default.puppeteer.launch({
                args: chrome_aws_lambda_1.default.args,
                defaultViewport: chrome_aws_lambda_1.default.defaultViewport,
                executablePath: yield chrome_aws_lambda_1.default.executablePath,
                headless: chrome_aws_lambda_1.default.headless,
                ignoreHTTPSErrors: true,
            });
            // const newpage = await browser.newPage();
            return browser;
        }
        catch (err) {
            console.log("Could not create a browser instance => : ", err);
        }
    });
}
exports.startBrowser = startBrowser;
