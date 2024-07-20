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
exports.getUserConnected = void 0;
const db_1 = require("../db");
let sqlQuery;
const schema = process.env.DB_SCHEMA_USUARIOS;
// para manejar los nombres de las tablas ha utilizar
const NAMES_TABLES = {
    usuarios: 'tgeo_usuarios',
};
function getUserConnected(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Obetenemos el codigo del usuarios que se logueo
            const idUser = req.user.id;
            sqlQuery = `
            select 
                ncodigo,
                split_part(lower(vnombres), ' ', 1) AS nombre,
                split_part(lower(vapellidos), ' ', 1) AS apellido,
                vcorreo
            from ${schema}.${NAMES_TABLES.usuarios}
            where ncodigo = $1
        `;
            const pool = yield (0, db_1.getPool)();
            const results = yield pool.query(sqlQuery, [idUser]);
            res.status(200).json({
                message: 'OK',
                results: results.rows
            });
        }
        catch (error) {
            console.log('Error en la base de datos', error);
            return res.status(500).json({
                message: "Error interno del servidor"
            });
        }
    });
}
exports.getUserConnected = getUserConnected;
