"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Crear un token JWT
const word = 'clave';
const generateToken = (usuario) => {
    const token = jsonwebtoken_1.default.sign(usuario, process.env.SECRETWORD || '', { expiresIn: '1h' });
    return token;
};
exports.generateToken = generateToken;
