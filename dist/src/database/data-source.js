"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const config_1 = require("../config/config");
const Url_1 = require("./entity/Url");
const ProductUrls_1 = require("./entity/ProductUrls");
const Product_1 = require("./entity/Product");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: config_1.config.DB_HOST,
    port: config_1.config.DB_PORT,
    username: config_1.config.DB_USERNAME,
    password: config_1.config.DB_PASSWORD,
    database: config_1.config.DATABASE,
    synchronize: true,
    logging: false,
    entities: [Url_1.Urls, ProductUrls_1.Product_urls, Product_1.Products],
    migrations: [],
    subscribers: [],
});
