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
Object.defineProperty(exports, "__esModule", { value: true });
exports.scraperObject = void 0;
exports.scraperObject = {
    vestiaireScraper(browser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let url = "https://www.vestiairecollective.com/brands";
                let page = yield browser.newPage();
                console.log(`Navigating to ${url}...`);
                yield page.goto(url);
                yield page.waitForSelector('#__next');
                let urls = yield page.$$eval('main > ul > li > ul > li', (links) => {
                    links = links.map((el) => el.querySelector('a').href);
                    return links;
                });
                urls = [...new Set(urls)];
                yield browser.close();
                return urls;
            }
            catch (error) {
                console.log(error);
            }
        });
    },
    thredupScraper(browser, url) {
        return __awaiter(this, void 0, void 0, function* () {
            let scrappedUrls = [];
            try {
                let page = yield browser.newPage();
                console.log(`Navigating to ${url}...`);
                yield page.goto(url);
                yield page.waitForSelector("div.zKe5Z3CQ_GZ7CbeF0oPk > div.ui-container > nav._quEAFnjv2xlk4GmMgSG");
                const len = yield page.evaluate(() => {
                    return document.querySelectorAll("div.zKe5Z3CQ_GZ7CbeF0oPk > div.ui-container > nav._quEAFnjv2xlk4GmMgSG > a.nklsQFqE_qT3VPQvqurw").length;
                });
                for (let i = 1; i <= len; i++) {
                    if (i !== len)
                        yield Promise.all([
                            page.click(`div.zKe5Z3CQ_GZ7CbeF0oPk > div.ui-container > nav._quEAFnjv2xlk4GmMgSG > a:nth-child(${i + 1})`),
                            page.waitForNavigation({ waitUntil: 'networkidle2' })
                        ]);
                    yield page.waitForSelector("div.NG55LPeX625p1OzdvVdd");
                    let urls = yield page.evaluate(() => {
                        const anchors = Array.from(document.querySelectorAll(".NG55LPeX625p1OzdvVdd a"));
                        return anchors.map((anchor) => {
                            return anchor.href;
                        }).filter(i => i);
                    });
                    scrappedUrls.push(...urls);
                }
                console.log("scrappedUrls", scrappedUrls.length);
                //await browser.close();
                scrappedUrls = [...new Set(scrappedUrls)];
                return scrappedUrls;
            }
            catch (error) {
                console.log(error);
                // await browser.close();
                scrappedUrls = [...new Set(scrappedUrls)];
                return scrappedUrls;
            }
        });
    },
    lampooScraper(browser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let url = "https://www.lampoo.com/au/designers/";
                let page = yield browser.newPage();
                console.log(`Navigating to ${url}...`);
                yield page.goto(url);
                yield page.waitForSelector('#__next');
                let urls = yield page.evaluate(() => {
                    const anchors = Array.from(document.querySelectorAll('a'));
                    return anchors.map(anchor => {
                        if (anchor.href.includes("https://www.lampoo.com/au/designers/"))
                            return anchor.href;
                    }).filter(i => i);
                });
                urls = [...new Set(urls)];
                yield browser.close();
                return urls;
            }
            catch (error) {
                console.log(error);
            }
        });
    },
    luxuryScraper(browser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let url = "https://theluxurycloset.com/designers";
                let page = yield browser.newPage();
                console.log(`Navigating to ${url}...`);
                yield page.goto(url);
                yield page.waitForSelector('#root');
                let allUrls = [];
                let urls = yield page.$$eval('div.DesktopDesignerComponent__rightSection___3YNGp > div > div:nth-child(2) > ul > li', (links) => {
                    links = links.map((el) => {
                        const anchors = Array.from(document.querySelectorAll('ul a'));
                        return anchors.map((anchor) => {
                            if (anchor.href)
                                return anchor.href;
                        });
                    });
                    return links;
                });
                urls.map((item) => {
                    allUrls.push(...item);
                });
                allUrls = [...new Set(allUrls)].filter((i) => i);
                ;
                yield browser.close();
                return allUrls;
            }
            catch (error) {
                console.log(error);
            }
        });
    },
    theRealScraper(browser, url) {
        return __awaiter(this, void 0, void 0, function* () {
            let scrappedUrls = [];
            try {
                let page = yield browser.newPage();
                console.log(`Navigating to ${url}...`);
                yield page.goto(url);
                yield page.waitForSelector(".designer-directory__content > .designer-alphabet");
                yield page.waitForSelector("div.design-directory__columns");
                let urls = yield page.evaluate(() => {
                    const anchors = Array.from(document.querySelectorAll(".designer-directory__designer > a"));
                    return anchors.map((anchor) => {
                        return anchor.href;
                    }).filter(i => i);
                });
                scrappedUrls.push(...urls);
                return scrappedUrls;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
};
