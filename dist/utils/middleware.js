"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.middlewareVerifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const word = 'clave';
// Middlewares
const middlewareVerifyToken = (req, res, next) => {
    const token = req.headers['authorization'] || '';
    // req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: true, message: 'Token de autenticación no proporcionado' });
    }
    // token.split(' ')[1] para cuando se recuperre desde header
    jsonwebtoken_1.default.verify(token.split(' ')[1], process.env.SECRETWORD || '', (err, user) => {
        if (err) {
            return res.status(403).json({ error: true, message: 'Token de autenticación inválido' });
        }
        req.user = user;
        console.log(user);
        next();
    });
};
exports.middlewareVerifyToken = middlewareVerifyToken;
