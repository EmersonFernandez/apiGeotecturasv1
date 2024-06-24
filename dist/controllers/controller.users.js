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
exports.getUsers = void 0;
const db_1 = require("../db");
let sqlQuery;
const schema = process.env.DB_SCHEMA_USUARIOS;
// para manejar los nombres de las tablas ha utilizar
const NAMES_TABLES = {
    usuarios: 'tgeo_usuarios',
};
// Obtener los usuarios
function getUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pool = yield (0, db_1.getPool)();
            sqlQuery = `
            select * from ${schema}.${NAMES_TABLES.usuarios} order by ncodigo
        `;
            const results = yield pool.query(sqlQuery);
            res.status(201).json({
                status: 201,
                ok: 'Ok',
                results: results.rows
            });
        }
        catch (error) {
            console.log('Error database', error);
            res.status(500).json({
                message: "Error interno del servidor"
            });
        }
    });
}
exports.getUsers = getUsers;
