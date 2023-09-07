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
exports.VestaireProductDetailsScraperObject = void 0;
const config_1 = require("../config/config");
exports.VestaireProductDetailsScraperObject = {
    findVestaireProductUrls({ urls, browserInstance }) {
        return __awaiter(this, void 0, void 0, function* () {
            const productUrls = [];
            try {
                const TO_SKIP_URLS = [
                    "https://www.vestiairecollective.com/new-items/",
                    "https://www.vestiairecollective.com/brands/",
                    "https://www.vestiairecollective.com/women/",
                    "https://www.vestiairecollective.com/men/",
                    "https://www.vestiairecollective.com/we-love/",
                    "https://www.vestiairecollective.com/vintage/",
                    "https://www.vestiairecollective.com/brands/#",
                    "https://www.vestiairecollective.com/kids/",
                    "https://www.vestiairecollective.com/g/express-delivery/",
                    "https://www.vestiairecollective.com/g/direct-shipping/",
                    "https://www.vestiairecollective.com/new-items/#country=US",
                    "https://www.vestiairecollective.com/journal/our-concept-page/"
                ];
                let page = yield browserInstance.newPage();
                for (let [index, url] of urls.entries()) {
                    if (productUrls.length > 10000)
                        break;
                    // if (index === 14) break;
                    if (!TO_SKIP_URLS.includes(url)) {
                        console.log(`Navigating to ${url}...`);
                        yield page.goto(url, { waitUntil: 'networkidle0' });
                        let count = 0;
                        const ifPageNotFound = (yield page.$("#__next > div > section")) || "";
                        if (ifPageNotFound)
                            continue;
                        yield page.waitForSelector("div.product-search_bottomSectionWrapper__OCHXi");
                        while (true) {
                            yield page.waitForSelector("#__next > div > main > .product-search_catalogPage__catalog__gOa9L > div > div");
                            yield page.waitForSelector("div.product-search_catalog__sortActionBar__mhZHl.vc-d-md-flex-title-m > .product-search_catalog__pagination__R7beP > .pagination_pagination__KrWss");
                            const ifProducts = (yield page.$("#__next > div > main > .product-search_catalogPage__catalog__gOa9L> div > div > div.product-search_catalog__columnProductList__gXnZR > div.product-search_catalog__resultContainer__y0_P_ > ul > li")) || "";
                            if (!ifProducts)
                                break;
                            if (count) {
                                yield page.goto(`${url}/p-${count + 1}`, { waitUntil: 'networkidle0' });
                            }
                            ++count;
                            let urls = yield page.$$eval('div.product-search_catalog__resultContainer__y0_P_ > ul li', (links) => {
                                links = links.map((el) => { var _a; return (_a = el.querySelector('div.product-card_productCard__BF_Iz.product-search_catalog__productCardContainer__A2YBW > div.product-card_productCard__imageContainer__bYaVi a')) === null || _a === void 0 ? void 0 : _a.href; });
                                return links;
                            });
                            const urlArr = urls.map((item) => {
                                if (item) {
                                    const brandName = url.split("https://us.vestiairecollective.com/")[1];
                                    const temp = item.split("/");
                                    const productName = temp[temp.length - 1].replace(".shtml", "");
                                    return {
                                        product_name: brandName + productName,
                                        url: item,
                                        page: count,
                                        url_id: config_1.config.VESTAIRE_ID
                                    };
                                }
                            }).filter((i) => i);
                            productUrls.push(...urlArr);
                            console.log(productUrls.length);
                            const isDisabled = yield page.$eval("div.product-search_catalog__sortActionBar__mhZHl.vc-d-md-flex-title-m > .product-search_catalog__pagination__R7beP > .pagination_pagination__KrWss > button:last-child", (button) => button.disabled);
                            // console.log(count);
                            if (isDisabled)
                                break;
                        }
                        // console.log("after while loop", index);
                        // break;
                    }
                    // if (productUrls.length > 5000) break;
                }
                console.log("after for loop");
                yield browserInstance.close();
                return productUrls;
            }
            catch (error) {
                console.log(error);
                yield browserInstance.close();
                return productUrls;
            }
        });
    },
    findVestaireProductDetails({ urlsToScrap, browserInstance }) {
        return __awaiter(this, void 0, void 0, function* () {
            const allProducts = [];
            try {
                let count = 0;
                let page = yield browserInstance.newPage();
                for (let item of urlsToScrap) {
                    console.log(`Navigating to ${item.url}...`);
                    yield page.goto(item.url, { waitUntil: "networkidle0" });
                    const product = {};
                    const ifTypeOne = (yield page.$(".pdp-top_pdpTop__mnbS4")) || "";
                    const ifTypeTwo = (yield page.$(".hero-pdp_heroPDP__iJXuC")) || "";
                    if (ifTypeOne) {
                        yield page.waitForSelector(".product-main-heading_productTitle__brand___s2rF");
                        product["product_url_id"] = item.id;
                        product['brand_name'] = yield page.$eval(".product-main-heading_productTitle__brand__link__eRLSF", (el) => el.textContent);
                        product['product_name'] = yield page.$eval(".product-main-heading_productTitle__name__9tVeL", (el) => el.textContent);
                        product['original_price'] = yield page.$eval(".product-price_productPrice__price__znOI5 > span:nth-child(1)", (el) => el.textContent);
                        const current_price = (yield page.$(".product-price_productPrice__price__znOI5 > span:nth-child(2)")) || "";
                        if (current_price) {
                            product.current_price = yield current_price.evaluate((el) => el.textContent);
                        }
                        else {
                            product.current_price = product.original_price;
                        }
                        product['size'] = yield page.$eval(".product-details_productDetails__resume__characteristics__AkhuD > p:nth-child(1)", (el) => el.textContent);
                        product['size'] = product['size'].replace("sizing guide", "");
                        product['condition'] = yield page.$eval(".product-details_productDetails__resume__characteristics__AkhuD > p:nth-child(2) > span", (el) => el.textContent);
                        product['description'] = yield page.$eval(".product-description_description__container__YJ_DM > div:nth-child(2) > div", (el) => el.textContent);
                        product['url'] = yield page.evaluate(() => document.location.href);
                        product['favourite'] = yield page.$eval(".product-like-button_like__button__38sAi", (el) => el.textContent);
                        product['date_listed'] = yield page.$eval(".product-description-list_descriptionList__list__FJb05 > li:nth-child(1) > span:nth-child(2)", (el) => el.textContent);
                    }
                    if (ifTypeTwo) {
                        yield page.waitForSelector(".hero-pdp_heroPDP__iJXuC");
                        product["product_url_id"] = item.id;
                        product['brand_name'] = yield page.$eval(".hero-pdp-header_heroPDPHeader__brand__XvAUi.vc-title-s", (el) => el.textContent);
                        product['product_name'] = yield page.$eval(".hero-pdp-header_heroPDPHeader__productName___Opjc", (el) => el.textContent);
                        const ifPrice = (yield page.$("div.hero-pdp-details_heroPdpDetails__offerSection__pswk2 > div > span")) || "";
                        if (ifPrice) {
                            product['original_price'] = yield page.$eval("div.hero-pdp-details_heroPdpDetails__offerSection__pswk2 > div > span", (el) => el.textContent);
                            product['original_price'] = product.original_price.replace("Sold at", "").trim();
                            product['current_price'] = product.original_price;
                        }
                        else {
                            product['original_price'] = yield page.$eval("div.hero-pdp-details_heroPdpDetails__offerSection__pswk2 > div > p >span", (el) => el.textContent);
                            product['original_price'] = product.original_price.replace("Sold at", "").trim();
                            product['current_price'] = product.original_price;
                        }
                        product['size'] = yield page.$eval(".hero-pdp-product-details_heroPDPProductDetails__fiTyX.hero-pdp-details_heroPdpDetails__productDetails__mzvQq > p:nth-child(1)", (el) => el.textContent);
                        const desc = (yield page.$(".hero-pdp-product-details_heroPDPProductDetails__fiTyX.hero-pdp-details_heroPdpDetails__productDetails__mzvQq > p:nth-child(3)")) || "";
                        if (desc) {
                            product['condition'] = yield page.$eval(".hero-pdp-product-details_heroPDPProductDetails__fiTyX.hero-pdp-details_heroPdpDetails__productDetails__mzvQq > p:nth-child(2)", (el) => el.textContent);
                            product['description'] = yield desc.evaluate((el) => el.textContent);
                        }
                        else {
                            product['description'] = yield page.$eval(".hero-pdp-product-details_heroPDPProductDetails__fiTyX.hero-pdp-details_heroPdpDetails__productDetails__mzvQq > p:nth-child(2)", (el) => el.textContent);
                        }
                        product['url'] = yield page.evaluate(() => document.location.href);
                        product['favourite'] = yield page.$eval(".hero-pdp_heroPDP__gallery__likeBtn__ZNMWK.product-like-button_like__button__38sAi.product-like-button_like__button--textHidden__zrRxN", (el) => el.textContent);
                        product["is_sold"] = true;
                    }
                    if (Object.keys(product).length)
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
