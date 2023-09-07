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
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const config_1 = require("./config/config");
const router_1 = require("./routers/router");
const data_source_1 = require("./database/data-source");
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = config_1.config.PORT || 3000;
    }
    init() {
        this.addRoutesAndMiddlewares(this.app);
        this.listenToPort(this.app, this.port);
    }
    addRoutesAndMiddlewares(app) {
        app.use(express_1.default.json(), express_1.default.urlencoded({ extended: true }));
        app.use('/api', router_1.router.getRouters());
    }
    listenToPort(app, port) {
        data_source_1.AppDataSource.initialize()
            .then(() => __awaiter(this, void 0, void 0, function* () {
            app.listen(port, () => {
                console.log(`Server listening to port : ${port}.`);
            });
        })).catch((err) => {
            console.log("Database connection failed.", err);
        });
    }
}
exports.app = new App();
