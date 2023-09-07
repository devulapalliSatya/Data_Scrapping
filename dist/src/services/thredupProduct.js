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
exports.thredupProductDetailsScraperObject = void 0;
const config_1 = require("../config/config");
const TO_SKIP_URL = [
    "https://www.thredup.com/giftcards",
    "https://www.thredup.com/",
    "https://www.thredup.com/cleanout",
    "https://www.thredup.com/about",
    "https://www.thredup.com/saved/favorites",
    "https://www.thredup.com/my",
    "https://www.thredup.com/cart",
    "https://www.thredup.com/brands",
    "https://www.thredup.com/kids",
    "https://www.thredup.com/rescues",
    "https://www.thredup.com/cleanout/consignment",
    "https://www.thredup.com/legal/tou",
    "https://www.thredup.com/legal/privacy-policy",
    "https://www.thredup.com/legal/accessibility",
    "https://www.thredup.com/contact",
    "https://www.thredup.com/bg",
    "https://www.thredup.com/resale",
    "https://www.thredup.com/careers",
    "https://www.thredup.com/support",
    "https://www.thredup.com/brands/designer/A",
    "https://www.thredup.com/brands/designer/C",
    "https://www.thredup.com/brands/designer/M",
    "https://www.thredup.com/brands/designer/R",
    "https://www.thredup.com/brands/designer/S"
];
exports.thredupProductDetailsScraperObject = {
    findThredupProductUrls({ urls, browserInstance, lastPage }) {
        return __awaiter(this, void 0, void 0, function* () {
            let allUrls = [];
            try {
                let page = yield browserInstance.newPage();
                for (let [index, url] of urls.entries()) {
                    if (allUrls.length > 10000)
                        break;
                    if (index > 0)
                        lastPage = 0;
                    if (TO_SKIP_URL.includes(url))
                        continue;
                    console.log(`Navigating to ${url}...`);
                    yield page.goto(url, { waitUntil: 'networkidle0' });
                    let totalPage = 1;
                    const pageCount = (yield page.$(".kOQ5Zl09UDEBeP3n_NpF")) || "";
                    if (pageCount) {
                        totalPage = yield pageCount.evaluate((el) => el.getAttribute("max"));
                    }
                    let startIndex = 1;
                    if (lastPage && lastPage < totalPage) {
                        startIndex = ++lastPage;
                    }
                    yield page.waitForSelector("#root > div > main > div > div.ui-container.large.u-px-2x > div.ui-container.large.u-flex > div.u-flex-1.u-flex-shrink-0.u-overflow-auto > div.u-relative > div:nth-child(2)");
                    const ifProductsExist = (yield page.$(".Vb607oOokVxxYVL7SQwh.OPW0ubRZTuILGDFWrpz2")) || "";
                    if (!ifProductsExist)
                        continue;
                    for (let i = startIndex; i <= +totalPage; i++) {
                        yield page.waitForSelector("div.Vb607oOokVxxYVL7SQwh.OPW0ubRZTuILGDFWrpz2");
                        let urls = yield page.$$eval('div.Vb607oOokVxxYVL7SQwh.OPW0ubRZTuILGDFWrpz2', (links) => {
                            links = links.map((el) => el.querySelector('a').href);
                            return links;
                        });
                        const urlArr = urls.map((item) => {
                            const regex = new RegExp("/", "g");
                            if (item != TO_SKIP_URL) {
                                const key = url.split("?brand_name_tags=")[1];
                                return {
                                    product_name: key,
                                    url: item,
                                    page: i,
                                    url_id: config_1.config.THREDUP_ID
                                };
                            }
                        }).filter((i) => i);
                        allUrls.push(...urlArr);
                        //await page.waitfornavigation();
                        const ifNextPage = (yield page.$("div.u-flex.u-justify-between.u-py-3xs.u-relative.u-items-start > div.u-flex.u-items-center.u-space-x-1x > button:last-child")) || "";
                        if (ifNextPage)
                            yield page.click("div.u-flex.u-justify-between.u-py-3xs.u-relative.u-items-start > div.u-flex.u-items-center.u-space-x-1x > button:last-child");
                    }
                    console.log(allUrls.length);
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
    findThredupProductDetails({ urlsToScrap, browserInstance }) {
        return __awaiter(this, void 0, void 0, function* () {
            const products = [];
            try {
                let count = 0;
                let page = yield browserInstance.newPage();
                for (let item of urlsToScrap) {
                    console.log(`Navigating to ${item.url}...`);
                    yield page.goto(item.url, { waitUntil: "networkidle0" });
                    yield page.waitForSelector(".kcJ47Ktxoind4bGkMYAt");
                    const product = {};
                    product["product_url_id"] = item.id;
                    product["brand_name"] = yield page.$eval("div.u-flex.LarhPVhimXuUmTnRJDlM.pf7s4T1n1ycRZfLe5veB > div:nth-child(1) > a", (el) => el.textContent);
                    product["product_name"] = yield page.$eval(".wc1Wg5BbXVFBe4MHxY3r", (el) => el.textContent);
                    const ifSold = yield page.$eval("#root > div > main > div > div.dbhnmqvaB2E26dQvyBVl > section > div:nth-child(2) > div:nth-child(1) > button", (el) => el.textContent);
                    if (ifSold != "Sold") {
                        const priceElem = (yield page.$("#root > div > main > div > div.dbhnmqvaB2E26dQvyBVl > section > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div > span.u-text-20.u-font-bold.u-mr-1xs")) || "";
                        if (priceElem) {
                            const originalPriceElement = yield page.$("#root > div > main > div > div.dbhnmqvaB2E26dQvyBVl > section > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div > span.u-text-20.u-font-bold.u-mr-1xs");
                            product["original_price"] = yield page.evaluate((el) => el.textContent, originalPriceElement);
                            const currentPriceElement = yield page.$("#root > div > main > div > div.dbhnmqvaB2E26dQvyBVl > section > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div > span.price.u-font-bold.u-text-20.u-text-alert");
                            product["current_price"] = yield page.evaluate((el) => el.textContent, currentPriceElement);
                        }
                        else {
                            const temp = (yield page.$("#root > div > main > div > div.dbhnmqvaB2E26dQvyBVl > section > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > div > span.u-text-20.u-font-bold.u-mr-1xs")) || "";
                            if (temp) {
                                const originalPriceElement = yield page.$("#root > div > main > div > div.dbhnmqvaB2E26dQvyBVl > section > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > div > span.u-text-20.u-font-bold.u-mr-1xs");
                                product["original_price"] = yield page.evaluate((el) => el.textContent, originalPriceElement);
                                const currentPriceElement = yield page.$("#root > div > main > div > div.dbhnmqvaB2E26dQvyBVl > section > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > div > span.price.u-font-bold.u-text-20.u-text-alert");
                                product["current_price"] = yield page.evaluate((el) => el.textContent, currentPriceElement);
                            }
                            else {
                                const originalPriceElement = yield page.$("#root > div > main > div > div > section > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > span");
                                product["original_price"] = yield page.evaluate((el) => el.textContent, originalPriceElement);
                                product["current_price"] = product["original_price"];
                            }
                        }
                    }
                    else {
                        product["is_sold"] = true;
                        product["original_price"] = "sold";
                        product["current_price"] = "sold";
                    }
                    const regex1 = new RegExp("'", "g");
                    const regex2 = new RegExp('"', "g");
                    const desc = (yield page.$(".jgiusFKudDUr6aL432nM")) || "";
                    if (desc) {
                        const description = yield desc.evaluate((el) => el.textContent);
                        product["description"] = description.replace(regex1, "''").replace(regex2, '""');
                    }
                    product["condition"] = yield page.$eval("#root > div > main > div > div.dbhnmqvaB2E26dQvyBVl > section > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > ul > li", (el) => el.textContent);
                    const sizeElem = (yield page.$(".P9j6cGJ6kvC9bBgLk4pE")) || "";
                    if (sizeElem) {
                        const size = yield sizeElem.evaluate((el) => el.textContent);
                        product["size"] = size.replace(regex1, "''").replace(regex2, '""');
                    }
                    else {
                        product["size"] = yield page.$eval(" div.dbhnmqvaB2E26dQvyBVl > section > div:nth-child(2) > div:nth-child(3) > div:nth-child(3) > ul > li", (el) => el.textContent);
                        product["size"] = product["size"].replace(regex1, "''").replace(regex2, '""');
                    }
                    product["favourites"] = yield page.$eval("button[aria-label='favorite'] > div > span", (el) => el.textContent);
                    product["favourites"] = +product.favourites.split(" ")[0];
                    products.push(product);
                    // ++count;
                    // console.log(count)
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
