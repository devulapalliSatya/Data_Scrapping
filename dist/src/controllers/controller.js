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
exports.Controller = void 0;
const config_1 = require("../config/config");
const response_1 = require("../common/response");
const browser_1 = require("../services/browser");
const pageScraper_1 = require("../services/pageScraper");
const Url_1 = require("../database/entity/Url");
const ProductUrls_1 = require("../database/entity/ProductUrls");
const Product_1 = require("../database/entity/Product");
const data_source_1 = require("../database/data-source");
const vestaireProduct_1 = require("../services/vestaireProduct");
const lampooProduct_1 = require("../services/lampooProduct");
const thredupProduct_1 = require("../services/thredupProduct");
const luxuryProduct_1 = require("../services/luxuryProduct");
const theRealProduct_1 = require("../services/theRealProduct");
const { LAMPOO_ID, LUXURY_ID, REAL_ID, THREDUP_ID, VESTAIRE_ID } = config_1.config;
class Controller {
    constructor() {
        /**
         * test - to check if server is running
         * @param req
         * @param res
         * @returns
         */
        this.test = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                (0, response_1.sendResponse)(res, 200, "Everything is OK !!!!", null);
            }
            catch (error) {
                (0, response_1.sendResponse)(res, 403, "Something went wrong.", null);
            }
        });
        /**
         * getAllUrls - to get brand urls of each websites
         * @param req
         * @param res
         * @returns
         */
        this.getAllUrls = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const urlRepository = data_source_1.AppDataSource.getRepository(Url_1.Urls);
                const [urls, count] = yield urlRepository.findAndCount();
                if (!count)
                    return (0, response_1.sendResponse)(res, 404, "No data found.", null);
                let total_count = 0;
                urls.map((elem) => {
                    elem['urls_count'] = elem.urls.length;
                    total_count += elem.urls.length;
                    return elem;
                });
                (0, response_1.sendResponse)(res, 200, "scrapped successfully", Object.assign({ total_count }, urls));
            }
            catch (error) {
                (0, response_1.sendResponse)(res, 403, "Something went wrong.", null);
            }
        });
        /**
         * getAllProductUrlCount - to get product_url_count of each websites
         * @param req
         * @param res
         * @returns
         */
        this.getAllProductUrlCount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield data_source_1.AppDataSource.query(`
                SELECT 
                    pu.url_id AS url_id, u.website_name AS website_name, COUNT(pu.*) AS product_url_count
                FROM product_urls pu 
                INNER JOIN urls u ON u.id = pu.url_id
                GROUP BY pu.url_id, u.id;
            `);
                if (!data.length)
                    return (0, response_1.sendResponse)(res, 404, "No data found.", null);
                (0, response_1.sendResponse)(res, 200, "scrapped successfully", data);
            }
            catch (error) {
                console.log(error);
                (0, response_1.sendResponse)(res, 403, "Something went wrong.", null);
            }
        });
        /**
         * getAllProductUrlCount - to get all products of each websites
         * @param req
         * @param res
         * @returns
         */
        this.getAllProducts = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield data_source_1.AppDataSource.query(`
                SELECT
                    p.id AS product_id,
                    p.product_name,
                    p.brand_name,
                    p.current_price,
                    p.original_price,
                    p.description,
                    p.condition,
                    p.size,
                    p.is_sold,
                    pu.id AS product_url_id,
                    pu.url AS product_url,
                    u.website_name
                FROM products p
                INNER JOIN product_urls pu ON p.product_url_id = pu.id
                INNER JOIN urls u ON u.id = pu.url_id;
            `);
                if (!products.length)
                    return (0, response_1.sendResponse)(res, 404, "No data found.", null);
                (0, response_1.sendResponse)(res, 200, "scrapped successfully", { total_count: products.length, products });
            }
            catch (error) {
                console.log(error);
                (0, response_1.sendResponse)(res, 403, "Something went wrong.", null);
            }
        });
        /**
         * getVestaireProductsUrls - to get all products urls of Vestaire
         * @param req
         * @param res
         * @returns
         */
        this.getVestaireProductsUrls = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield data_source_1.AppDataSource.query(`
                SELECT * FROM product_urls WHERE url_id = ${VESTAIRE_ID};
            `);
                if (!products.length)
                    return (0, response_1.sendResponse)(res, 404, "No data found.", null);
                (0, response_1.sendResponse)(res, 200, "scrapped successfully", { total_count: products.length, products });
            }
            catch (error) {
                console.log(error);
                (0, response_1.sendResponse)(res, 403, "Something went wrong.", null);
            }
        });
        /**
         * getLampooProductsUrls - to get all products urls of Lampoo
         * @param req
         * @param res
         * @returns
         */
        this.getLampooProductsUrls = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield data_source_1.AppDataSource.query(`
                SELECT * FROM product_urls WHERE url_id = ${LAMPOO_ID};
            `);
                if (!products.length)
                    return (0, response_1.sendResponse)(res, 404, "No data found.", null);
                (0, response_1.sendResponse)(res, 200, "scrapped successfully", { total_count: products.length, products });
            }
            catch (error) {
                console.log(error);
                (0, response_1.sendResponse)(res, 403, "Something went wrong.", null);
            }
        });
        /**
         * getThredupProductsUrls - to get all products urls of Thredup
         * @param req
         * @param res
         * @returns
         */
        this.getThredupProductsUrls = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield data_source_1.AppDataSource.query(`
                SELECT * FROM product_urls WHERE url_id = ${THREDUP_ID};
            `);
                if (!products.length)
                    return (0, response_1.sendResponse)(res, 404, "No data found.", null);
                (0, response_1.sendResponse)(res, 200, "scrapped successfully", { total_count: products.length, products });
            }
            catch (error) {
                console.log(error);
                (0, response_1.sendResponse)(res, 403, "Something went wrong.", null);
            }
        });
        /**
         * getLuxuryProductsUrls - to get all products urls of Luxury
         * @param req
         * @param res
         * @returns
         */
        this.getLuxuryProductsUrls = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield data_source_1.AppDataSource.query(`
                SELECT * FROM product_urls WHERE url_id = ${LUXURY_ID};
            `);
                if (!products.length)
                    return (0, response_1.sendResponse)(res, 404, "No data found.", null);
                (0, response_1.sendResponse)(res, 200, "scrapped successfully", { total_count: products.length, products });
            }
            catch (error) {
                console.log(error);
                (0, response_1.sendResponse)(res, 403, "Something went wrong.", null);
            }
        });
        /**
         * getTherealProductsUrls: to get all products urls of The Real Real
         * @param req
         * @param res
         * @returns
         */
        this.getTherealProductsUrls = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield data_source_1.AppDataSource.query(`
                SELECT * FROM product_urls WHERE url_id = ${REAL_ID};
            `);
                if (!products.length)
                    return (0, response_1.sendResponse)(res, 404, "No data found.", null);
                (0, response_1.sendResponse)(res, 200, "scrapped successfully", { total_count: products.length, products });
            }
            catch (error) {
                console.log(error);
                (0, response_1.sendResponse)(res, 403, "Something went wrong.", null);
            }
        });
        /**
         * getVestaireProductsDetails - to get all products details of Vestaire
         * @param req
         * @param res
         * @returns
         */
        this.getVestaireProductsDetails = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield data_source_1.AppDataSource.query(`
                SELECT 
                    p.id AS product_id,
                    p.product_name,
                    p.brand_name,
                    p.current_price,
                    p.original_price,
                    p.description,
                    p.condition,
                    p.size,
                    p.is_sold,
                    pu.id AS product_url_id,
                    pu.url AS product_url,
                    u.website_name
                FROM products p
                INNER JOIN product_urls pu ON p.product_url_id = pu.id
                INNER JOIN urls u ON u.id = pu.url_id
                WHERE pu.url_id = ${VESTAIRE_ID};
            `);
                if (!products.length)
                    return (0, response_1.sendResponse)(res, 404, "No data found.", null);
                (0, response_1.sendResponse)(res, 200, "scrapped successfully", { total_count: products.length, products });
            }
            catch (error) {
                console.log(error);
                (0, response_1.sendResponse)(res, 403, "Something went wrong.", null);
            }
        });
        /**
         * getLampooProductsDetails - to get all products details of Lampoo
         * @param req
         * @param res
         * @returns
         */
        this.getLampooProductsDetails = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield data_source_1.AppDataSource.query(`
                SELECT 
                    p.id AS product_id,
                    p.product_name,
                    p.brand_name,
                    p.current_price,
                    p.original_price,
                    p.description,
                    p.condition,
                    p.size,
                    p.is_sold,
                    pu.id AS product_url_id,
                    pu.url AS product_url,
                    u.website_name
                FROM products p
                INNER JOIN product_urls pu ON p.product_url_id = pu.id
                INNER JOIN urls u ON u.id = pu.url_id
                WHERE pu.url_id = ${LAMPOO_ID};
            `);
                if (!products.length)
                    return (0, response_1.sendResponse)(res, 404, "No data found.", null);
                (0, response_1.sendResponse)(res, 200, "scrapped successfully", { total_count: products.length, products });
            }
            catch (error) {
                console.log(error);
                (0, response_1.sendResponse)(res, 403, "Something went wrong.", null);
            }
        });
        /**
         * getThredupProductsDetails - to get all products details of Thredup
         * @param req
         * @param res
         * @returns
         */
        this.getThredupProductsDetails = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield data_source_1.AppDataSource.query(`
                SELECT 
                    p.id AS product_id,
                    p.product_name,
                    p.brand_name,
                    p.current_price,
                    p.original_price,
                    p.description,
                    p.condition,
                    p.size,
                    p.is_sold,
                    pu.id AS product_url_id,
                    pu.url AS product_url,
                    u.website_name
                FROM products p
                INNER JOIN product_urls pu ON p.product_url_id = pu.id
                INNER JOIN urls u ON u.id = pu.url_id
                WHERE pu.url_id = ${THREDUP_ID};
            `);
                if (!products.length)
                    return (0, response_1.sendResponse)(res, 404, "No data found.", null);
                (0, response_1.sendResponse)(res, 200, "scrapped successfully", { total_count: products.length, products });
            }
            catch (error) {
                console.log(error);
                (0, response_1.sendResponse)(res, 403, "Something went wrong.", null);
            }
        });
        /**
         * getLuxuryProductsDetails - to get all products details of Luxury
         * @param req
         * @param res
         * @returns
         */
        this.getLuxuryProductsDetails = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield data_source_1.AppDataSource.query(`
                SELECT 
                    p.id AS product_id,
                    p.product_name,
                    p.brand_name,
                    p.current_price,
                    p.original_price,
                    p.description,
                    p.condition,
                    p.size,
                    p.is_sold,
                    pu.id AS product_url_id,
                    pu.url AS product_url,
                    u.website_name
                FROM products p
                INNER JOIN product_urls pu ON p.product_url_id = pu.id
                INNER JOIN urls u ON u.id = pu.url_id
                WHERE pu.url_id = ${LUXURY_ID};
            `);
                if (!products.length)
                    return (0, response_1.sendResponse)(res, 404, "No data found.", null);
                (0, response_1.sendResponse)(res, 200, "scrapped successfully", { total_count: products.length, products });
            }
            catch (error) {
                console.log(error);
                (0, response_1.sendResponse)(res, 403, "Something went wrong.", null);
            }
        });
        /**
         * getTheRealProductsDetails: to get all products details of The Real Real
         * @param req
         * @param res
         * @returns
         */
        this.getTherealProductsDetails = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield data_source_1.AppDataSource.query(`
                SELECT 
                    p.id AS product_id,
                    p.product_name,
                    p.brand_name,
                    p.current_price,
                    p.original_price,
                    p.description,
                    p.condition,
                    p.size,
                    p.is_sold,
                    pu.id AS product_url_id,
                    pu.url AS product_url,
                    u.website_name
                FROM products p
                INNER JOIN product_urls pu ON p.product_url_id = pu.id
                INNER JOIN urls u ON u.id = pu.url_id
                WHERE pu.url_id = ${REAL_ID};
            `);
                if (!products.length)
                    return (0, response_1.sendResponse)(res, 404, "No data found.", null);
                (0, response_1.sendResponse)(res, 200, "scrapped successfully", { total_count: products.length, products });
            }
            catch (error) {
                console.log(error);
                (0, response_1.sendResponse)(res, 403, "Something went wrong.", null);
            }
        });
        /**
         * vestialScrap - to scrap vestial brand urls
         * @param req
         * @param res
         * @returns
         */
        this.vestialScrap = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let browserInstance = yield (0, browser_1.startBrowser)();
                const vestiaireUrls = yield pageScraper_1.scraperObject.vestiaireScraper(browserInstance);
                const url = new Url_1.Urls();
                url.website_name = 'https://us.vestiairecollective.com/';
                url.urls = vestiaireUrls;
                const savedUrls = yield data_source_1.AppDataSource.manager.save(url);
                (0, response_1.sendResponse)(res, 200, "scrapped successfully", savedUrls);
            }
            catch (error) {
                (0, response_1.sendResponse)(res, 403, "Something went wrong.", null);
            }
        });
        /**
         * thredupScrap - to scrap thredup brand urls
         * @param req
         * @param res
         * @returns
         */
        this.thredupScrap = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let browserInstance = yield (0, browser_1.startBrowser)();
                let urls = [
                    "https://www.thredup.com/brands/women",
                    "https://www.thredup.com/brands/designer",
                    "https://www.thredup.com/brands/maternity",
                    "https://www.thredup.com/brands/plus",
                    "https://www.thredup.com/brands/girls",
                    "https://www.thredup.com/brands/boys",
                    "https://www.thredup.com/brands/juniors",
                    "https://www.thredup.com/brands/petite",
                    "https://www.thredup.com/brands/tall",
                    "https://www.thredup.com/brands/shoes",
                    "https://www.thredup.com/brands/handbags",
                    "https://www.thredup.com/brands/accessories"
                ];
                let thredupUrls = [];
                for (let url of urls) {
                    const scrappedUrls = (yield pageScraper_1.scraperObject.thredupScraper(browserInstance, url)) || [];
                    thredupUrls.push(...scrappedUrls);
                    console.log("======", scrappedUrls.length, "======");
                }
                yield (browserInstance === null || browserInstance === void 0 ? void 0 : browserInstance.close());
                console.log("controller===", thredupUrls.length);
                const url = new Url_1.Urls();
                url.website_name = 'https://www.thredup.com';
                url.urls = thredupUrls;
                const savedUrls = yield data_source_1.AppDataSource.manager.save(url);
                (0, response_1.sendResponse)(res, 200, "scrapped successfully", savedUrls);
            }
            catch (error) {
                (0, response_1.sendResponse)(res, 403, "Something went wrong.", null);
            }
        });
        /**
         * lampooScrap - to scrap lampoo brand urls
         * @param req
         * @param res
         * @returns
         */
        this.lampooScrap = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let browserInstance = yield (0, browser_1.startBrowser)();
                const lampooUrls = yield pageScraper_1.scraperObject.lampooScraper(browserInstance);
                const url = new Url_1.Urls();
                url.website_name = 'https://www.lampoo.com';
                url.urls = lampooUrls;
                const savedUrls = yield data_source_1.AppDataSource.manager.save(url);
                (0, response_1.sendResponse)(res, 200, "scrapped successfully", savedUrls);
            }
            catch (error) {
                (0, response_1.sendResponse)(res, 403, "Something went wrong.", null);
            }
        });
        /**
         * luxuryScrap - to scrap luxury brand urls
         * @param req
         * @param res
         * @returns
         */
        this.luxuryScrap = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let browserInstance = yield (0, browser_1.startBrowser)();
                const luxuryUrls = yield pageScraper_1.scraperObject.luxuryScraper(browserInstance);
                const url = new Url_1.Urls();
                url.website_name = 'https://theluxurycloset.com';
                url.urls = luxuryUrls;
                const savedUrls = yield data_source_1.AppDataSource.manager.save(url);
                (0, response_1.sendResponse)(res, 200, "scrapped successfully", savedUrls);
            }
            catch (error) {
                (0, response_1.sendResponse)(res, 403, "Something went wrong.", null);
            }
        });
        /**
         * theRealScrap - to scrap theReal brand urls
         * @param req
         * @param res
         * @returns
         */
        this.theRealScrap = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let urls = [
                    "https://www.therealreal.com/designers/women",
                    "https://www.therealreal.com/designers/men",
                    "https://www.therealreal.com/designers/fine-jewelry",
                    "https://www.therealreal.com/designers/watches",
                    "https://www.therealreal.com/designers/art",
                    "https://www.therealreal.com/designers/home",
                    "https://www.therealreal.com/designers/kids"
                ];
                let theRealUrls = [];
                for (let url of urls) {
                    let browserInstance = yield (0, browser_1.startBrowser)();
                    const scrappedUrls = (yield pageScraper_1.scraperObject.theRealScraper(browserInstance, url)) || [];
                    theRealUrls.push(...scrappedUrls);
                    console.log("======", scrappedUrls.length, theRealUrls.length, "======");
                    yield (browserInstance === null || browserInstance === void 0 ? void 0 : browserInstance.close());
                }
                theRealUrls = [...new Set(theRealUrls)];
                const url = new Url_1.Urls();
                url.website_name = 'https://www.therealreal.com';
                url.urls = theRealUrls;
                const savedUrls = yield data_source_1.AppDataSource.manager.save(url);
                return (0, response_1.sendResponse)(res, 200, "scrapped successfully", savedUrls);
            }
            catch (error) {
                (0, response_1.sendResponse)(res, 403, "Something went wrong.", null);
            }
        });
        /**
         * vestaireProductUrlScrap - to scrap urls of products from vestaire from brands urls
         * @param req
         * @param res
         * @returns
         */
        this.vestaireProductUrlScrap = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const urlRepository = data_source_1.AppDataSource.getRepository(Url_1.Urls);
                const urls = yield urlRepository.findOneBy({ id: VESTAIRE_ID });
                const productRepository = data_source_1.AppDataSource.getRepository(ProductUrls_1.Product_urls);
                const latestProductUrl = yield productRepository
                    .createQueryBuilder('product_urls')
                    .where('product_urls.url_id = :url_id', { url_id: VESTAIRE_ID })
                    .orderBy('product_urls.id', 'DESC')
                    .limit(1)
                    .getOne();
                let arr = [];
                if (latestProductUrl) { // To filter out already inserted urls
                    const key = latestProductUrl === null || latestProductUrl === void 0 ? void 0 : latestProductUrl.product_name.split("/")[0];
                    const url = urls === null || urls === void 0 ? void 0 : urls.urls.find((item) => item.includes(key));
                    const index = (urls === null || urls === void 0 ? void 0 : urls.urls.findIndex((item) => item == url)) || 0 + 1;
                    arr = urls === null || urls === void 0 ? void 0 : urls.urls.slice(index + 1);
                }
                if (!arr.length) {
                    arr = urls === null || urls === void 0 ? void 0 : urls.urls;
                }
                let browserInstance = yield (0, browser_1.startBrowser)();
                const products = yield vestaireProduct_1.VestaireProductDetailsScraperObject.findVestaireProductUrls({
                    urls: arr,
                    browserInstance,
                    lastPage: (latestProductUrl === null || latestProductUrl === void 0 ? void 0 : latestProductUrl.page) ? latestProductUrl === null || latestProductUrl === void 0 ? void 0 : latestProductUrl.page : null
                });
                if (!products.length)
                    return (0, response_1.sendResponse)(res, 400, "Something went wrong. No url scrapped.", null);
                const dbArr = [], resArr = [];
                while (products.length) {
                    dbArr.push(products.splice(0, 10000));
                }
                for (let item of dbArr) {
                    const insertedData = yield productRepository.insert(item);
                    resArr.push(...insertedData === null || insertedData === void 0 ? void 0 : insertedData.identifiers);
                }
                return (0, response_1.sendResponse)(res, 200, "scrapped successfully.", resArr);
            }
            catch (error) {
                (0, response_1.sendResponse)(res, 403, "Something went wrong.", null);
            }
        });
        /**
         * vestaireProductDetailsScrap - to scrap details of products from vestaire from products urls
         * @param req
         * @param res
         * @returns
         */
        this.vestaireProductDetailsScrap = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const productRepository = data_source_1.AppDataSource.getRepository(Product_1.Products);
                const [data] = yield data_source_1.AppDataSource.query(`
                    SELECT 
                        p.id AS id, p.product_name AS product_name, p.product_url_id AS product_url_id, pu.url_id AS url_id 
                    FROM product_urls pu 
                    INNER JOIN products p on p.product_url_id = pu.id
                    WHERE pu.url_id = ${VESTAIRE_ID} ORDER BY p.id DESC LIMIT 1;
                `);
                let urlsToScrap = [];
                if (data) {
                    urlsToScrap = yield data_source_1.AppDataSource.query(`
                    SELECT id, url
                    FROM product_urls
                    WHERE id > ${data.product_url_id} AND url_id = ${VESTAIRE_ID};
                `);
                }
                else {
                    urlsToScrap = yield data_source_1.AppDataSource.query(`
                    SELECT id, url
                    FROM product_urls
                    WHERE url_id = ${VESTAIRE_ID};
                `);
                }
                let browserInstance = yield (0, browser_1.startBrowser)();
                const products = yield vestaireProduct_1.VestaireProductDetailsScraperObject.findVestaireProductDetails({ urlsToScrap, browserInstance });
                if (!products.length)
                    return (0, response_1.sendResponse)(res, 400, "Something went wrong. No url scrapped.", null);
                const dbArr = [], resArr = [];
                while (products.length) {
                    dbArr.push(products.splice(0, 10000));
                }
                for (let item of dbArr) {
                    const insertedData = yield productRepository.insert(item);
                    resArr.push(...insertedData === null || insertedData === void 0 ? void 0 : insertedData.identifiers);
                }
                return (0, response_1.sendResponse)(res, 200, "scrapped successfully.", resArr);
            }
            catch (error) {
                console.log(error);
                (0, response_1.sendResponse)(res, 403, "Something went wrong.", null);
            }
        });
        /**
         * lampooProductUrlScrap - to scrap urls of products from lampoo from brands urls
         * @param req
         * @param res
         * @returns
         */
        this.lampooProductUrlScrap = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const urlRepository = data_source_1.AppDataSource.getRepository(Url_1.Urls);
                const productRepository = data_source_1.AppDataSource.getRepository(ProductUrls_1.Product_urls);
                let urls = yield urlRepository.findOneBy({ id: LAMPOO_ID });
                const latestProductUrl = yield productRepository
                    .createQueryBuilder('product_urls')
                    .where('product_urls.url_id = :url_id', { url_id: LAMPOO_ID })
                    .orderBy('product_urls.id', 'DESC')
                    .limit(1)
                    .getOne();
                let arr = [];
                if (latestProductUrl) { // To filter out already inserted urls
                    const key = latestProductUrl === null || latestProductUrl === void 0 ? void 0 : latestProductUrl.url.split("https://www.lampoo.com/au/products/")[1].split("/")[1].split("-")[0];
                    const url = urls === null || urls === void 0 ? void 0 : urls.urls.find((item) => item.includes(key));
                    const index = urls === null || urls === void 0 ? void 0 : urls.urls.findIndex((item) => item == url);
                    arr = urls === null || urls === void 0 ? void 0 : urls.urls.slice(index);
                }
                if (!arr.length) {
                    arr = urls === null || urls === void 0 ? void 0 : urls.urls;
                }
                let browserInstance = yield (0, browser_1.startBrowser)();
                const products = yield lampooProduct_1.LampooProductDetailsScraperObject.findLampooProductUrls({
                    urls: arr.splice(0, 15),
                    browserInstance,
                    lastPage: (latestProductUrl === null || latestProductUrl === void 0 ? void 0 : latestProductUrl.page) ? latestProductUrl === null || latestProductUrl === void 0 ? void 0 : latestProductUrl.page : null
                });
                if (!products.length)
                    return (0, response_1.sendResponse)(res, 400, "Something went wrong. No url scrapped.", null);
                const dbArr = [], resArr = [];
                while (products.length) {
                    dbArr.push(products.splice(0, 10000));
                }
                for (let item of dbArr) {
                    const insertedData = yield productRepository.insert(item);
                    resArr.push(...insertedData === null || insertedData === void 0 ? void 0 : insertedData.identifiers);
                }
                (0, response_1.sendResponse)(res, 200, "scrapped successfully.", resArr);
            }
            catch (error) {
                console.log(error);
                (0, response_1.sendResponse)(res, 403, "Something went wrong.", null);
            }
        });
        /**
        * lampooProductDetailsScrap - to scrap details of products from lampoo from products urls
        * @param req
        * @param res
        * @returns
        */
        this.lampooProductDetailsScrap = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const productRepository = data_source_1.AppDataSource.getRepository(Product_1.Products);
                const [data] = yield data_source_1.AppDataSource.query(`
                    SELECT 
                        p.id AS id, p.product_name AS product_name, p.product_url_id AS product_url_id, pu.url_id AS url_id 
                    FROM product_urls pu 
                    INNER JOIN products p on p.product_url_id = pu.id
                    WHERE pu.url_id = ${LAMPOO_ID} ORDER BY p.id DESC LIMIT 1;
                    `);
                let urlsToScrap = [];
                if (data) {
                    urlsToScrap = yield data_source_1.AppDataSource.query(`
                    SELECT id, url
                    FROM product_urls
                    WHERE id > ${data.product_url_id} AND url_id = ${LAMPOO_ID};
                `);
                }
                else {
                    urlsToScrap = yield data_source_1.AppDataSource.query(`
                    SELECT id, url
                    FROM product_urls
                    WHERE url_id = ${LAMPOO_ID};
                `);
                }
                let browserInstance = yield (0, browser_1.startBrowser)();
                const products = yield lampooProduct_1.LampooProductDetailsScraperObject.findLampooProductDetails({ urlsToScrap: urlsToScrap.splice(0, 1), browserInstance });
                if (!products.length)
                    return (0, response_1.sendResponse)(res, 400, "Something went wrong. No url scrapped.", null);
                const dbArr = [], resArr = [];
                while (products.length) {
                    dbArr.push(products.splice(0, 10));
                }
                for (let item of dbArr) {
                    const insertedData = yield productRepository.insert(item);
                    resArr.push(...insertedData === null || insertedData === void 0 ? void 0 : insertedData.identifiers);
                }
                (0, response_1.sendResponse)(res, 200, "scrapped successfully.", resArr);
            }
            catch (error) {
                console.log({ error });
                (0, response_1.sendResponse)(res, 403, "Something went wrong.", null);
            }
        });
        /**
         * thredupProductUrlScrap - to scrap urls of products from luxury from brands urls
         * @param req
         * @param res
         * @returns
         */
        this.thredupProductUrlScrap = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const urlRepository = data_source_1.AppDataSource.getRepository(Url_1.Urls);
                const productRepository = data_source_1.AppDataSource.getRepository(ProductUrls_1.Product_urls);
                let urls = yield urlRepository.findOneBy({ id: THREDUP_ID });
                let index = (urls === null || urls === void 0 ? void 0 : urls.urls.findIndex(i => i === "https://www.thredup.com/brands/designer/other")) || 0;
                urls === null || urls === void 0 ? void 0 : urls.urls.splice(0, ++index);
                const latestProductUrl = yield productRepository
                    .createQueryBuilder('product_urls')
                    .where('product_urls.url_id = :url_id', { url_id: THREDUP_ID })
                    .orderBy('product_urls.id', 'DESC')
                    .limit(1)
                    .getOne();
                let arr = [];
                if (latestProductUrl) { // To filter out already inserted urls
                    const key = latestProductUrl === null || latestProductUrl === void 0 ? void 0 : latestProductUrl.product_name;
                    const url = urls === null || urls === void 0 ? void 0 : urls.urls.find((item) => item.includes(key));
                    const index = (urls === null || urls === void 0 ? void 0 : urls.urls.findIndex((item) => item == url)) || 0 + 1;
                    arr = urls === null || urls === void 0 ? void 0 : urls.urls.slice(index + 1);
                }
                if (!arr.length) {
                    arr = urls === null || urls === void 0 ? void 0 : urls.urls;
                }
                let browserInstance = yield (0, browser_1.startBrowser)();
                const product = yield thredupProduct_1.thredupProductDetailsScraperObject.findThredupProductUrls({
                    urls: arr,
                    browserInstance,
                    lastPage: (latestProductUrl === null || latestProductUrl === void 0 ? void 0 : latestProductUrl.page) ? latestProductUrl === null || latestProductUrl === void 0 ? void 0 : latestProductUrl.page : null
                });
                if (!product.length)
                    return (0, response_1.sendResponse)(res, 400, "Something went wrong. No url scrapped.", null);
                const dbArr = [], resArr = [];
                while (product.length) {
                    dbArr.push(product.splice(0, 10000));
                }
                for (let item of dbArr) {
                    const insertedData = yield productRepository.insert(item);
                    resArr.push(...insertedData === null || insertedData === void 0 ? void 0 : insertedData.identifiers);
                }
                (0, response_1.sendResponse)(res, 200, "scrapped successfully.", resArr);
            }
            catch (error) {
                console.log(error);
                (0, response_1.sendResponse)(res, 403, "Something went wrong.", null);
            }
        });
        /**
        * thredupProductDetailsScrap - to scrap details of products from thredup from products urls
        * @param req
        * @param res
        * @returns
        */
        this.thredupProductDetailsScrap = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const productRepository = data_source_1.AppDataSource.getRepository(Product_1.Products);
                const [data] = yield data_source_1.AppDataSource.query(`
                    SELECT 
                        p.id AS id, p.product_name AS product_name, p.product_url_id AS product_url_id, pu.url_id AS url_id 
                    FROM product_urls pu 
                    INNER JOIN products p on p.product_url_id = pu.id
                    WHERE pu.url_id = ${THREDUP_ID} ORDER BY p.id DESC LIMIT 1;
                `);
                let urlsToScrap = [];
                if (data) {
                    urlsToScrap = yield data_source_1.AppDataSource.query(`
                    SELECT id, url
                    FROM product_urls
                    WHERE id > ${data.product_url_id} AND url_id = ${THREDUP_ID};
                `);
                }
                else {
                    urlsToScrap = yield data_source_1.AppDataSource.query(`
                    SELECT id, url
                    FROM product_urls
                    WHERE url_id = ${THREDUP_ID};
                `);
                }
                let browserInstance = yield (0, browser_1.startBrowser)();
                const products = yield thredupProduct_1.thredupProductDetailsScraperObject.findThredupProductDetails({ urlsToScrap, browserInstance });
                if (!products.length)
                    return (0, response_1.sendResponse)(res, 400, "Something went wrong. No url scrapped.", null);
                const dbArr = [], resArr = [];
                while (products.length) {
                    dbArr.push(products.splice(0, 10000));
                }
                for (let item of dbArr) {
                    const insertedData = yield productRepository.insert(item);
                    resArr.push(...insertedData === null || insertedData === void 0 ? void 0 : insertedData.identifiers);
                }
                (0, response_1.sendResponse)(res, 200, "scrapped successfully.", resArr);
            }
            catch (error) {
                console.log(error);
                (0, response_1.sendResponse)(res, 403, "Something went wrong.", null);
            }
        });
        /**
         * luxuryProductUrlScrap - to scrap urls of products from luxury from brands urls
         * @param req
         * @param res
         * @returns
         */
        this.luxuryProductUrlScrap = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const urlRepository = data_source_1.AppDataSource.getRepository(Url_1.Urls);
                const productRepository = data_source_1.AppDataSource.getRepository(ProductUrls_1.Product_urls);
                let urls = yield urlRepository.findOneBy({ id: LUXURY_ID });
                const latestProductUrl = yield productRepository
                    .createQueryBuilder('product_urls')
                    .where('product_urls.url_id = :url_id', { url_id: LUXURY_ID })
                    .orderBy('product_urls.id', 'DESC')
                    .limit(1)
                    .getOne();
                let arr = [];
                if (latestProductUrl) { // To filter out already inserted urls
                    const keyArr = latestProductUrl === null || latestProductUrl === void 0 ? void 0 : latestProductUrl.product_name.split("/");
                    const key = keyArr.splice(0, keyArr.length - 1).join("/");
                    const url = urls === null || urls === void 0 ? void 0 : urls.urls.find((item) => item.includes(key));
                    const index = urls === null || urls === void 0 ? void 0 : urls.urls.findIndex((item) => item == url);
                    arr = urls === null || urls === void 0 ? void 0 : urls.urls.slice(index);
                }
                if (!arr.length) {
                    arr = urls === null || urls === void 0 ? void 0 : urls.urls;
                }
                let browserInstance = yield (0, browser_1.startBrowser)();
                const products = yield luxuryProduct_1.LuxuryProductDetailsScraperObject.findLuxuryProductUrls({
                    urls: arr,
                    browserInstance,
                    lastPage: latestProductUrl === null || latestProductUrl === void 0 ? void 0 : latestProductUrl.page
                });
                if (!products.length)
                    return (0, response_1.sendResponse)(res, 400, "Something went wrong. No url scrapped.", null);
                const dbArr = [], resArr = [];
                while (products.length) {
                    dbArr.push(products.splice(0, 10000));
                }
                for (let item of dbArr) {
                    const insertedData = yield productRepository.insert(item);
                    resArr.push(...insertedData === null || insertedData === void 0 ? void 0 : insertedData.identifiers);
                }
                (0, response_1.sendResponse)(res, 200, "scrapped successfully", resArr);
            }
            catch (error) {
                console.log(error);
                (0, response_1.sendResponse)(res, 403, "Something went wrong.", null);
            }
        });
        /**
        * luxuryProductDetailsScrap - to scrap details of products from luxury from products urls
        * @param req
        * @param res
        * @returns
        */
        this.luxuryProductDetailsScrap = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const productRepository = data_source_1.AppDataSource.getRepository(Product_1.Products);
                const [data] = yield data_source_1.AppDataSource.query(`
                    SELECT 
                        p.id AS id, p.product_name AS product_name, p.product_url_id AS product_url_id, pu.url_id AS url_id 
                    FROM product_urls pu 
                    INNER JOIN products p on p.product_url_id = pu.id
                    WHERE pu.url_id = ${LUXURY_ID} ORDER BY p.id DESC LIMIT 1;
                    `);
                let urlsToScrap = [];
                if (data) {
                    urlsToScrap = yield data_source_1.AppDataSource.query(`
                    SELECT id, url
                    FROM product_urls
                    WHERE id > ${data.product_url_id} AND url_id = ${LUXURY_ID};
                `);
                }
                else {
                    urlsToScrap = yield data_source_1.AppDataSource.query(`
                    SELECT id, url
                    FROM product_urls
                    WHERE url_id = ${LUXURY_ID};
                `);
                }
                let browserInstance = yield (0, browser_1.startBrowser)();
                const products = yield luxuryProduct_1.LuxuryProductDetailsScraperObject.findLuxuryProductDetails({ urlsToScrap, browserInstance });
                if (!products.length)
                    return (0, response_1.sendResponse)(res, 400, "Something went wrong. No url scrapped.", null);
                const dbArr = [], resArr = [];
                while (products.length) {
                    dbArr.push(products.splice(0, 10000));
                }
                for (let item of dbArr) {
                    const insertedData = yield productRepository.insert(item);
                    resArr.push(...insertedData === null || insertedData === void 0 ? void 0 : insertedData.identifiers);
                }
                (0, response_1.sendResponse)(res, 200, "scrapped successfully.", resArr);
            }
            catch (error) {
                (0, response_1.sendResponse)(res, 403, "Something went wrong.", null);
            }
        });
        /**
         * theRealProductUrlScrap: to scrap urls of products from luxury from brands urls
         * @param req
         * @param res
         * @returns
         */
        this.theRealProductUrlScrap = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const urlRepository = data_source_1.AppDataSource.getRepository(Url_1.Urls);
                const urls = yield urlRepository.findOneBy({ id: REAL_ID });
                const productRepository = data_source_1.AppDataSource.getRepository(ProductUrls_1.Product_urls);
                const latestProductUrl = yield productRepository
                    .createQueryBuilder('product_urls')
                    .where('product_urls.url_id = :url_id', { url_id: REAL_ID })
                    .orderBy('product_urls.id', 'DESC')
                    .limit(1)
                    .getOne();
                let arr = [];
                if (latestProductUrl) { // To filter out already inserted urls
                    const key = latestProductUrl === null || latestProductUrl === void 0 ? void 0 : latestProductUrl.product_name.split("/")[0];
                    const url = urls === null || urls === void 0 ? void 0 : urls.urls.find((item) => item.includes(key));
                    const index = (urls === null || urls === void 0 ? void 0 : urls.urls.findIndex((item) => item == url)) || 0 + 1;
                    arr = urls === null || urls === void 0 ? void 0 : urls.urls.slice(index + 1);
                }
                if (!arr.length) {
                    arr = urls === null || urls === void 0 ? void 0 : urls.urls;
                }
                let browserInstance = yield (0, browser_1.startBrowser)();
                const products = yield theRealProduct_1.theRealProductDetailsScraperObject.findTheRealProductUrls({
                    urls: arr.splice(0, 2),
                    browserInstance,
                    lastPage: (latestProductUrl === null || latestProductUrl === void 0 ? void 0 : latestProductUrl.page) ? latestProductUrl === null || latestProductUrl === void 0 ? void 0 : latestProductUrl.page : null
                });
                // if (!products.length) return sendResponse(res, 400, "Something went wrong. No url scrapped.", null);
                // const dbArr: any = [], resArr: any = [];
                // while (products.length) {
                //     dbArr.push(products.splice(0, 10000));
                // }
                // for (let item of dbArr) {
                //     const insertedData = await productRepository.insert(item);
                //     resArr.push(...insertedData?.identifiers);
                // }
                return (0, response_1.sendResponse)(res, 200, "scrapped successfully.", products);
            }
            catch (error) {
                (0, response_1.sendResponse)(res, 403, "Something went wrong.", null);
            }
        });
        /**
         * theRealProductDetailsScrap: to scrap details of products from luxury from products urls
         * @param req
         * @param res
         * @returns
         */
        this.theRealProductDetailsScrap = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const productRepository = data_source_1.AppDataSource.getRepository(Product_1.Products);
                const [data] = yield data_source_1.AppDataSource.query(`
                    SELECT 
                        p.id AS id, p.product_name AS product_name, p.product_url_id AS product_url_id, pu.url_id AS url_id 
                    FROM product_urls pu 
                    INNER JOIN products p on p.product_url_id = pu.id
                    WHERE pu.url_id = ${REAL_ID} ORDER BY p.id DESC LIMIT 1;
                    `);
                let urlsToScrap = [];
                if (data) {
                    urlsToScrap = yield data_source_1.AppDataSource.query(`
                    SELECT id, url
                    FROM product_urls
                    WHERE id > ${data.product_url_id} AND url_id = ${REAL_ID};
                `);
                }
                else {
                    urlsToScrap = yield data_source_1.AppDataSource.query(`
                    SELECT id, url
                    FROM product_urls
                    WHERE url_id = ${REAL_ID};
                `);
                }
                let browserInstance = yield (0, browser_1.startBrowser)();
                const products = yield theRealProduct_1.theRealProductDetailsScraperObject.findTheRealProductDetails({ urlsToScrap: urlsToScrap.splice(0, 1), browserInstance });
                const insertedData = yield productRepository.insert(products);
                (0, response_1.sendResponse)(res, 200, "scrapped successfully", insertedData === null || insertedData === void 0 ? void 0 : insertedData.identifiers);
            }
            catch (error) {
                console.log(error);
                (0, response_1.sendResponse)(res, 403, "Something went wrong.", null);
            }
        });
    }
}
exports.Controller = Controller;
