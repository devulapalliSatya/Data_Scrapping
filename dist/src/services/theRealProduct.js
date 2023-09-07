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
exports.theRealProductDetailsScraperObject = void 0;
exports.theRealProductDetailsScraperObject = {
    findTheRealProductUrls({ urls, browserInstance, lastPage }) {
        return __awaiter(this, void 0, void 0, function* () {
            let allUrls = [];
            try {
                let page = yield browserInstance.newPage();
                yield page.goto("https://www.therealreal.com/designers", { waitUntil: 'networkidle0' });
                //await page.waitForSelector('div.body-wrapper > div.container > main');
                console.log("==========1========");
                let count = 0;
                /**
                 * sauravm807@gmail.com
                 * ABC@12345
                 */
                yield page.waitForSelector('body > div.body-wrapper > header > div.head-utility-container.search-experiment--control > div > div > div.head-utility-row__links.head-utility-row__links--not-logged-in.js-header.search-experiment--control > div:nth-child(2) > a.head-utility-row__sign-in.js-sign-in-link.underlined-link');
                yield page.click('body > div.body-wrapper > header > div.head-utility-container.search-experiment--control > div > div > div.head-utility-row__links.head-utility-row__links--not-logged-in.js-header.search-experiment--control > div:nth-child(2) > a.head-utility-row__sign-in.js-sign-in-link.underlined-link');
                yield page.waitForSelector(".modal2-background");
                let email = yield page.waitForSelector('input[name="user[email]"]');
                yield email.focus();
                yield email.type("sauravm807@gmail.com", { delay: 300 });
                //await page.type('#user_email', 'sauravm807@gmail.com', { delay: 100 });
                let password = yield page.waitForSelector('input[name="user[password]"]');
                yield password.focus();
                //await password.type("ABC@12345", { delay: 300 });
                //await page.type('#user_password', 'ABC@12345', { delay: 100 });
                yield page.click("#user_submit_action > input");
                console.log("==========2========");
                // for (let [index, url] of urls.entries()) {
                //     url = "https://www.therealreal.com/designers/alice-olivia?first=120&page=1&path%5B%5D=alice-olivia";
                //     // if (index > 0) lastPage = 0;
                //     console.log(`Navigating to ${url}...`);
                //     await page.goto(url, { waitUntil: 'networkidle0' });
                //     await page.waitForSelector('div.body-wrapper > div.container > main');
                //     console.log("==========1========")
                //     let count = 0;
                //     /**
                //      * sauravm807@gmail.com
                //      * ABC@12345
                //      */
                //     await page.waitForSelector('body > div.body-wrapper > header > div.head-utility-container.search-experiment--control > div > div > div.head-utility-row__links.head-utility-row__links--not-logged-in.js-header.search-experiment--control > div:nth-child(2) > a.head-utility-row__sign-in.js-sign-in-link.underlined-link');
                //     await page.click('body > div.body-wrapper > header > div.head-utility-container.search-experiment--control > div > div > div.head-utility-row__links.head-utility-row__links--not-logged-in.js-header.search-experiment--control > div:nth-child(2) > a.head-utility-row__sign-in.js-sign-in-link.underlined-link')
                //     await page.waitForSelector(".modal2-background");
                //     await page.waitForSelector('#user_email');
                //     await page.waitForSelector('#user_password');
                //     await page.type('#user_email', 'sauravm807@gmail.com', { delay: 100 });
                //     await page.type('#user_password', 'ABC@12345', { delay: 100 });
                //     await page.click("#user_submit_action > input")
                //     console.log("==========2========")
                //     // while(true) {
                //     //     ++count;
                //     //     await page.waitForSelector('div.js-product-grid.product-grid-wrapper > div.product-grid > div.product-card-wrapper.js-product-card-wrapper');
                //     //     let urls = await page.$$eval('div.product-card-wrapper.js-product-card-wrapper', (links: any) => {
                //     //         links = links.map((el: any) => el.querySelector('.product-card.js-plp-product-card')?.href);
                //     //         return links;
                //     //     });
                //     //     console.log(urls.length);
                //     //     allUrls.push(...urls);
                //     //     const isDisabled = await page.$('div.body-wrapper > div.container > main > div.plp.js-plp-data-handler.js-plp-after-pjax-scroll > div.plp-primary-content > div.plp-header-controls.js-plp-header-controls--sticky > nav > ul > li:last-child > a[aria-disabled]');
                //     //     const isNotDisabled = await page.$('div.body-wrapper > div.container > main > div.plp.js-plp-data-handler.js-plp-after-pjax-scroll > div.plp-primary-content > div.plp-header-controls.js-plp-header-controls--sticky > nav > ul > li:last-child > a[aria-disabled]');
                //     //     console.log({isDisabled, isNotDisabled})
                //     //     // await Promise.all([
                //     //     //     page.click("nav.plp-header-controls__pagination > ul.pagination__numbers-container > li:last-child"),
                //     //     //     page.waitForNavigation()
                //     //     // ]);
                //     //     await page.click("nav.plp-header-controls__pagination > ul.pagination__numbers-container > li:last-child");
                //     //     console.log("after click");
                //     //     await page.waitForNavigation()
                //     //     if (count > 1) break;
                //     // }
                //     //     let totalPage = 1;
                //     //     const pageCount = await page.$("a.pagination__number.js-pagination__number.spagination__number--highlighted");
                //     //     if (pageCount) {
                //     //         console.log("maybe");
                //     //         const ariaLabel = await pageCount.evaluate((el: any) => el.getAttribute("aria-label"));
                //     //         if (ariaLabel) {
                //     //             const parts = ariaLabel.split(',');
                //     //             if (parts.length >= 2) {
                //     //                 const pageNumberText = parts[1].trim().split(' ')[1];
                //     //                 totalPage = parseInt(pageNumberText, 10) || 1;
                //     //                 console.log("worked");
                //     //             }
                //     //         }
                //     //     }
                //     //     console.log(totalPage);
                //     //     let startIndex = 1;
                //     //     if (lastPage && lastPage < totalPage) {
                //     //         startIndex = ++lastPage;
                //     //     }
                //     //     await page.waitForSelector(".plp-primary-content ");
                //     //     const ifProductsExist = (await page.$(".product-grid")) || "";
                //     //     if (!ifProductsExist) continue;
                //     //     for (let i = startIndex; i <= +totalPage; i++) {
                //     //         await page.waitForSelector("div.plp-primary-content > div.js-product-grid.product-grid-wrapper");
                //     //         let urls = await page.$$eval('div.product-card-wrapper.js-product-card-wrapper', (links: any) => {
                //     //             links = links.map((el: any) => el.querySelector('a.product-card.js-plp-product-card ').href);
                //     //             return links;
                //     //         });
                //     //         const urlArr = urls.map((item: any) => {
                //     //             if (item) {
                //     //                 const key = url.split("/")[4].split("?")[0];
                //     //                 return {
                //     //                     product_name: key,
                //     //                     url: item,
                //     //                     page: 1,
                //     //                     url_id: config.REAL_ID
                //     //                 };
                //     //             }
                //     //         }).filter((i: any) => i);
                //     //         allUrls.push(...urlArr);
                //     //         const ifNextPage = (await page.$(".chevron-arrow-right:nth-child(2)")) || "";
                //     //         if (ifNextPage) await page.click(".chevron-arrow-right:nth-child(2)");
                //     //         await page.waitfornavigation(".plp-primary-content");
                //     //     }
                //     break;
                // }
                // console.log(allUrls.length);
                // await browserInstance.close();
                return allUrls;
            }
            catch (error) {
                console.log({ error });
                // await browserInstance.close();
                return allUrls;
            }
        });
    },
    findTheRealProductDetails({ urlsToScrap, browserInstance }) {
        return __awaiter(this, void 0, void 0, function* () {
            const products = [];
            try {
                let count = 0;
                let page = yield browserInstance.newPage();
                for (let item of urlsToScrap) {
                    //let item = "https://www.therealreal.com/products/women/clothing/dresses/alice-olivia-v-neck-mini-dress-iiae7";
                    console.log(`Navigating to ${item}...`);
                    yield page.goto(item, { waitUntil: "networkidle0" });
                    const product = {};
                    const ifPdpBtn = (yield page.$("#pdp-buttons")) || "";
                    if (!ifPdpBtn)
                        continue;
                    yield page.waitForSelector(".pdp-two-cols");
                    product["product_url_id"] = item;
                    product["brand_name"] = yield page.$eval("a[data-event-source]", (el) => el.textContent);
                    product["product_name"] = yield page.$eval("div.product-name", (el) => el.textContent);
                    const original = (yield page.$("div.price-info > div.price-info-values > div.price-info-values__original-price"));
                    if (original) {
                        product["original_price"] = yield page.$eval("div.price-info > div.price-info-values > div.price-info-values__original-price", (el) => el.textContent);
                        product["current_price"] = yield page.$("div.price-info > div.price-info-values > div.price-info-values__final-price-discounted", (el) => el.textContent);
                    }
                    else {
                        const originalPriceElement = yield page.$("div.price-info > div.price-info-values > div.price-info-values__final-price");
                        product["original_price"] = yield page.evaluate((el) => el.textContent, originalPriceElement);
                        product["current_price"] = product["original_price"];
                    }
                    const regex1 = new RegExp("'", "g");
                    const regex2 = new RegExp('"', "g");
                    const desc = (yield page.$("#pdp-details-Description > div > ul")) || "";
                    if (desc) {
                        const description = yield desc.evaluate((el) => el.textContent);
                        product["description"] = description.replace(regex1, "' '").replace(regex2, ' ');
                    }
                    const condition = yield page.$eval("#pdp-details-Condition > div.condition__wrapper > ul > li.condition__attribute--active.condition__attribute > div", (el) => el.textContent);
                    product["condition"] = condition;
                    const sizeElem = (yield page.$("#pdp-details-Details > ul.product-details-group")) || "";
                    if (sizeElem) {
                        const size = yield sizeElem.evaluate((el) => el.textContent);
                        product["size"] = size.replace(regex1, "''").replace(regex2, ', ');
                    }
                    else {
                        product["size"] = yield page.$eval("div.pdp-title__size > div", (el) => el.textContent);
                        product["size"] = product["size"].replace(regex1, "''").replace(regex2, ' ');
                    }
                    product["favourites"] = yield page.$eval("div.obsessed-and-obsession-count > p", (el) => el.textContent);
                    products.push(product);
                    console.log(product);
                    ++count;
                    console.log(count);
                    break;
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
