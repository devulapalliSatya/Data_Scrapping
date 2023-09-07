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
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_stealth_1.default)());
function startBrowser() {
    return __awaiter(this, void 0, void 0, function* () {
        let browser;
        try {
            console.log("Opening the browser......");
            browser = yield puppeteer_extra_1.default.launch({
                headless: false,
                defaultViewport: null,
                // userDataDir: './myUserDataDir',
                args: ["--disable-setuid-sandbox"],
                'ignoreHTTPSErrors': true
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
