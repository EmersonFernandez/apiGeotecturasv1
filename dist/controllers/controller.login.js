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
exports.login = void 0;
const db_1 = require("../db");
// import {QueryResultRows} from '../utils/types'
const functions_1 = require("../utils/functions");
let sqlQuery;
const schema = process.env.DB_SCHEMA_USUARIOS;
// para manejar los nombres de las tablas ha utilizar
const NAMES_TABLES = {
    usuarios: 'tgeo_usuarios',
};
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password } = req.body;
        try {
            const pool = yield (0, db_1.getPool)();
            if (!username || !password) {
                return res.status(400).json({
                    message: "Todos los campos son obligatorios"
                });
            }
            const query = `
            SELECT * FROM ${schema}.${NAMES_TABLES.usuarios} WHERE UPPER(vusuario) = UPPER($1) AND vpassword = $2;
        `;
            const results = yield pool.query(query, [username.trim(), password.trim()]);
            const user = results.rows[0];
            if (user) {
                const userData = {
                    id: user.ncodigo,
                    username: user.vusuario,
                    rol: Number(user.nrol)
                };
                const token = (0, functions_1.generateToken)(userData);
                // Mandamos el token al token
                res.cookie('token', token, { maxAge: 900000, httpOnly: true }); // Set cookie named 'token'
                return res.status(200).json({
                    message: "Credenciales Correctas",
                    token
                });
            }
            else {
                // Respuesta genérica para no dar pistas sobre si el usuario o la contraseña son incorrectos
                return res.status(401).json({
                    message: "Usuario o contraseña incorrecta"
                });
            }
        }
        catch (error) {
            console.log('Error en la base de datos', error);
            return res.status(500).json({
                message: "Error interno del servidor"
            });
        }
    });
}
exports.login = login;
