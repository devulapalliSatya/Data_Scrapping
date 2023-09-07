"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class Config {
    constructor() {
        this.PORT = +process.env.PORT || 3000;
        this.DB_TYPE = process.env.DB_TYPE || "postgres";
        this.DB_HOST = process.env.DB_HOST || "localhost";
        this.DB_PORT = +process.env.DB_PORT || 5432;
        this.DB_USERNAME = process.env.DB_USERNAME || "postgres";
        this.DB_PASSWORD = process.env.DB_PASSWORD || "123";
        this.DATABASE = process.env.DATABASE || "test";
        this.VESTAIRE_ID = +process.env.VESTAIRE_ID || 1;
        this.LAMPOO_ID = +process.env.LAMPOO_ID || 2;
        this.REAL_ID = +process.env.REAL_ID || 3;
        this.THREDUP_ID = +process.env.THREDUP_ID || 4;
        this.LUXURY_ID = +process.env.LUXURY_ID || 5;
    }
}
exports.config = new Config();
