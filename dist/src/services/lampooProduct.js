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
exports.LampooProductDetailsScraperObject = void 0;
const URL = "https://www.lampoo.com/au/designers/";
const TO_SKIP_URL = "https://www.lampoo.com/au/account/orders-and-returns/";
const config_1 = require("../config/config");
exports.LampooProductDetailsScraperObject = {
    findLampooProductUrls({ urls, browserInstance, lastPage }) {
        return __awaiter(this, void 0, void 0, function* () {
            let allUrls = [];
            try {
                let page = yield browserInstance.newPage();
                for (let [index, url] of urls.entries()) {
                    if (allUrls.length > 10000)
                        break;
                    if (index > 0)
                        lastPage = 0;
                    if (url == URL)
                        continue;
                    console.log(`Navigating to ${url}...`);
                    yield page.goto(url, { waitUntil: 'networkidle0' });
                    let totalPage = 1;
                    const pageCount = (yield page.$("div.w-full.mx-auto > div:nth-child(4) > div > div > span:nth-child(3)")) || "";
                    if (pageCount) {
                        totalPage = yield pageCount.evaluate((el) => el.textContent);
                    }
                    let startIndex = 1;
                    if (lastPage && lastPage <= totalPage) {
                        startIndex = ++lastPage;
                    }
                    for (let i = startIndex; i <= +totalPage; i++) {
                        let urls = yield page.$$eval('div.group', (links) => {
                            links = links.map((el) => el.querySelector('a').href);
                            return links;
                        });
                        const urlArr = urls.map((item) => {
                            const regex = new RegExp("/", "g");
                            if (item != TO_SKIP_URL) {
                                const website_name = item.split("https://www.lampoo.com/au/products/")[1].replace(regex, "-");
                                return {
                                    product_name: website_name.slice(0, website_name.length - 1),
                                    url: item,
                                    page: i,
                                    url_id: config_1.config.LAMPOO_ID
                                };
                            }
                        }).filter((i) => i);
                        allUrls.push(...urlArr);
                        const ifNextPage = (yield page.$("#__next > main > div.w-full.mx-auto > div:nth-child(4) > div > button:nth-child(3) > div")) || "";
                        if (ifNextPage)
                            yield page.click("#__next > main > div.w-full.mx-auto > div:nth-child(4) > div > button:nth-child(3) > div");
                    }
                    // console.log({ index })
                    // if (index == 100) break;
                }
                yield browserInstance.close();
                return allUrls;
            }
            catch (error) {
                console.log({ error });
                yield browserInstance.close();
                return allUrls;
            }
        });
    },
    findLampooProductDetails({ urlsToScrap, browserInstance }) {
        return __awaiter(this, void 0, void 0, function* () {
            const products = [];
            try {
                let count = 0;
                let page = yield browserInstance.newPage();
                for (let item of urlsToScrap) {
                    console.log(`Navigating to ${item.url}...`);
                    yield page.goto(item.url, { waitUntil: "networkidle0" });
                    const product = {};
                    const ifPdpBtn = (yield page.$("#pdp-buttons")) || "";
                    if (!ifPdpBtn)
                        continue;
                    yield page.waitForSelector("#pdp-buttons");
                    product["product_url_id"] = item.id;
                    product["brand_name"] = yield page.$eval("#pdp-buttons > div.flex.flex-col.pt-2 > div > a > p", (el) => el.textContent);
                    product["product_name"] = yield page.$eval("#pdp-buttons > div.flex.flex-col.pt-2 > div > h1", (el) => el.textContent);
                    product["original_price"] = yield page.$eval("#pdp-buttons > div.flex.flex-col.pt-2 > div > div.flex.justify-end.text-xl > div > span:nth-child(1)", (el) => el.textContent);
                    const currentPrice = (yield page.$("#pdp-buttons > div.flex.flex-col.pt-2 > div > div.flex.justify-end.text-xl > div > span:nth-child(2)")) || "";
                    if (currentPrice) {
                        product["current_price"] = yield currentPrice.evaluate((el) => el.textContent);
                    }
                    else {
                        product["current_price"] = product["original_price"];
                    }
                    const regex1 = new RegExp("'", "g");
                    const regex2 = new RegExp('"', "g");
                    const desc = (yield page.$("#pdp-buttons > div.mt-4.px-3 > div:nth-child(1) > section > div > div:nth-child(2) > p")) || "";
                    if (desc) {
                        const description = yield desc.evaluate((el) => el.textContent);
                        product["description"] = description.replace(regex1, "''").replace(regex2, '""');
                    }
                    const condition = yield page.$eval("#pdp-buttons > div.mt-4.px-3 > div:nth-child(2) > div", (el) => el.textContent);
                    product["condition"] = condition.split(":")[1].trim();
                    const sizeElem = (yield page.$("#product-size-selector > div.css-jz49cj-control > div.css-f1eru0 > div.css-1dimb5e-singleValue > div > div.block")) || "";
                    if (sizeElem) {
                        const size = yield sizeElem.evaluate((el) => el.textContent);
                        product["size"] = size.replace(regex1, "''").replace(regex2, '""');
                    }
                    else {
                        const ifPres = (yield page.$("#pdp-buttons > div.mt-10 > div > div > div > div > div")) || "";
                        if (ifPres) {
                            product["size"] = yield page.$eval("#pdp-buttons > div.mt-10 > div > div > div > div > div", (el) => el.textContent);
                            product["size"] = product["size"].replace(regex1, "''").replace(regex2, '""');
                        }
                    }
                    products.push(product);
                    ++count;
                    console.log(count);
                }
                yield browserInstance.close();
                return products;
            }
            catch (error) {
                console.log({ error });
                yield browserInstance.close();
                return products;
            }
        });
    }
};
