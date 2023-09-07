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
exports.LuxuryProductDetailsScraperObject = void 0;
const config_1 = require("../config/config");
exports.LuxuryProductDetailsScraperObject = {
    findLuxuryProductUrls({ urls, browserInstance, lastPage }) {
        return __awaiter(this, void 0, void 0, function* () {
            let productUrls = [];
            try {
                let page = yield browserInstance.newPage();
                yield page.setViewport({ width: 1366, height: 768 });
                for (let [index, url] of urls.entries()) {
                    if (productUrls.length > 10000)
                        break;
                    console.log(`Navigating to ${url}...`);
                    yield page.goto(url, { waitUntil: 'networkidle2' });
                    let count = 0;
                    yield page.waitForSelector("#root");
                    let currentUrl = "";
                    while (true) {
                        ++count;
                        yield page.waitForSelector("#root > div.DesktopWidth__base___3ZRAa", { waitUntil: 'load' });
                        if (lastPage) {
                            if (count === 1) {
                                yield page.$eval('div.Mpp__paginationItem___1uP0o > ul > div:last-child', (el) => el.click());
                                continue;
                            }
                            if (count === 2) {
                                currentUrl = yield page.url();
                                const splitUrl = currentUrl.split("&page=");
                                const baseUrl = splitUrl[0];
                                const toNavigate = `${baseUrl}&page=${lastPage + 1}`;
                                console.log(`Navigating to ${toNavigate}...`);
                                count = ++lastPage;
                                yield page.goto(toNavigate, { waitUntil: 'networkidle2' });
                            }
                        }
                        if (count > 1)
                            currentUrl = yield page.url();
                        if (count === 2) {
                            console.log(`Navigating to ${currentUrl}...`);
                            yield page.goto(currentUrl, { waitUntil: 'networkidle2' });
                        }
                        yield page.waitForSelector("#root > div.DesktopWidth__base___3ZRAa");
                        let urls = yield page.$$eval('div.Mpp__productGridWrapperNewBase___1Vm7T > div', (links) => {
                            links = links.map((el) => { var _a; return (_a = el.querySelector('a')) === null || _a === void 0 ? void 0 : _a.href; });
                            return links;
                        });
                        const urlArr = urls.map((item) => {
                            if (item) {
                                const brandName = url.split("https://theluxurycloset.com/")[1] + "/";
                                const temp = item.split("/");
                                const productName = temp[temp.length - 1];
                                return {
                                    product_name: brandName + productName,
                                    url: item,
                                    page: count,
                                    url_id: config_1.config.LUXURY_ID
                                };
                            }
                        }).filter((i) => i);
                        productUrls.push(...urlArr);
                        // console.log(productUrls.length);
                        const ifLastBtn = (yield page.$("div.Mpp__paginationItem___1uP0o > ul > div:last-child")) || "";
                        // console.log("count====", count);
                        // if (count === 100) break;
                        if (!ifLastBtn)
                            break;
                        if (count === 1) {
                            yield page.$eval('div.Mpp__paginationItem___1uP0o > ul > div:last-child', (el) => el.click());
                        }
                        else {
                            const splitUrl = currentUrl.split("&page=");
                            const pageNo = +splitUrl[1];
                            const baseUrl = splitUrl[0];
                            const toNavigate = `${baseUrl}&page=${pageNo + 1}`;
                            console.log(`Navigating to ${toNavigate}...`);
                            yield page.goto(toNavigate, { waitUntil: 'networkidle2' });
                        }
                    }
                }
                console.log("after for loop");
                yield browserInstance.close();
                return productUrls;
            }
            catch (error) {
                console.log({ error });
                yield browserInstance.close();
                return productUrls;
            }
        });
    },
    findLuxuryProductDetails({ urlsToScrap, browserInstance }) {
        return __awaiter(this, void 0, void 0, function* () {
            const allProducts = [];
            try {
                let page = yield browserInstance.newPage();
                for (let item of urlsToScrap) {
                    console.log(`Navigating to ${item.url}...`);
                    yield page.goto(item.url, { waitUntil: 'networkidle2' });
                    const product = {};
                    yield page.waitForSelector("#root > .DesktopWidth__base___3ZRAa");
                    product["product_url_id"] = item.id;
                    product['brand_name'] = yield page.$eval(".ProductDetailsCard__newBrandName___8h5-f", (el) => el.textContent);
                    product['product_name'] = yield page.$eval(".ProductDetailsCard__productName___1xdQ-", (el) => el.textContent);
                    const currentPriceHandle1 = (yield page.$(".ProductPriceV2__newProductPrice___3VQFU")) || "";
                    const originalPriceHandle1 = (yield page.$(".ProductPriceV2__newDiscountedOfferPrice___lNSAA")) || "";
                    const originalPriceHandle2 = (yield page.$(".ProductPriceV2__newStrikeOffPrice___G-L9p")) || "";
                    const currentPriceHandle2 = (yield page.$(".ProductPriceV2__newVoucherAmount___3nnI_")) || "";
                    const originalPriceHandle3 = (yield page.$(".ProductPriceV2__newProductPrice___3VQFU")) || "";
                    if (currentPriceHandle1) {
                        product['current_price'] = yield currentPriceHandle1.evaluate((el) => el.textContent);
                    }
                    if (currentPriceHandle2) {
                        product['current_price'] = yield currentPriceHandle2.evaluate((el) => el.textContent);
                    }
                    if (originalPriceHandle1) {
                        const price = yield originalPriceHandle1.evaluate((el) => el.textContent);
                        product["original_price"] = price.split('Off on')[1].replace(')', '');
                    }
                    if (originalPriceHandle2) {
                        product["original_price"] = yield originalPriceHandle2.evaluate((el) => el.textContent);
                    }
                    if (!product.original_price && originalPriceHandle3) {
                        product["original_price"] = yield originalPriceHandle3.evaluate((el) => el.textContent);
                    }
                    if (!product.current_price)
                        product['current_price'] = product.original_price;
                    product['condition'] = yield page.$eval(".ProductConditionAndAuthenticStrip__newSppProductDescription___Vo8TJ", (el) => el.textContent);
                    const sizeHandle = (yield page.$(".ProductDetailsCard__newSize___2tbsp")) || "";
                    if (sizeHandle) {
                        product['size'] = yield sizeHandle.evaluate((el) => el.textContent);
                    }
                    else {
                        yield page.$eval('div.ProductInformationNewSpp__base___1cY2P > div:nth-child(3) > div', (el) => el.click());
                        let sizes = yield page.$$eval('.ProductInformationNewSpp__sizeAndFitListBase___1h-gl li', (item) => {
                            item = item.map((el) => {
                                const anchors = Array.from(document.querySelectorAll('.ProductInformationNewSpp__sizeAndFitListBase___1h-gl > li span span'));
                                return anchors.map((anchor) => anchor.textContent.trim());
                            });
                            return item;
                        });
                        product['size'] = sizes[0].join(" ").trim();
                    }
                    yield page.$eval('div.ProductInformationNewSpp__base___1cY2P > div:nth-child(2) > div', (el) => el.click());
                    let description = yield page.$eval(".HtmlText__footer___7DbCF", (el) => el.textContent);
                    const regex1 = new RegExp("'", "g");
                    const regex2 = new RegExp('"', "g");
                    product['description'] = description.replace(regex1, "''").replace(regex2, '""');
                    product['url'] = yield page.evaluate(() => document.location.href);
                    const isSold = ((yield page.$(".SppButtonWrapper__soldOutWrapper___2akOv"))) || "";
                    if (isSold)
                        product["is_sold"] = true;
                    allProducts.push(product);
                }
                browserInstance.close();
                return allProducts;
            }
            catch (error) {
                console.log(error);
                browserInstance.close();
                return allProducts;
            }
        });
    }
};
