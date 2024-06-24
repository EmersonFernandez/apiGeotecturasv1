"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cargarRutas = void 0;
const express_1 = __importDefault(require("express"));
var index_1 = require("./routers/index");
Object.defineProperty(exports, "cargarRutas", { enumerable: true, get: function () { return index_1.cargarRutas; } });
const dotenv_1 = __importDefault(require("dotenv"));
const index_2 = require("./routers/index");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware 
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
(0, index_2.cargarRutas)(app);
app.listen(port, () => {
    console.log(`Servidor corriendo el port ${port}`);
});
