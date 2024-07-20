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
exports.getDataModels = void 0;
const db_1 = require("../db");
// variables
let sqlQuery;
// nombre del schema donde esta almacenadas la tablas
const schemaModels = process.env.DB_SCHEMA_MODELOS;
// para manejar los nombres de las tablas ha utilizar
const NAMES_TABLES = {
    elementos: 'tgeo_modelos_elementos',
    dataTabla: 'tgeo_tablas_datos',
    usuarioModelosElementos: 'tgeo_usuario_elemento_modelo',
};
function getDataModels(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // validamos el la respuesta del token
            if (!req.user) {
                res.status(401).json({ message: 'no hay token' });
            }
            const pool = yield (0, db_1.getPool)();
            // fucion almacenada para obtener el nombre de la tabla de la informacion del modelo
            const sqlTable = `SELECT * FROM ${schemaModels}.obtener_tabla_informacion_modelo($1,$2)`;
            const resultTable = yield pool.query(sqlTable, [req.params.id, req.user.id]);
            // obtenmos el schema y el nombre de la tabla
            const { schema, nombre } = resultTable.rows[0];
            if (!schema || !nombre) {
                res.status(401).json({ message: 'no hay dato para este modelos' });
                return;
            }
            // armado del query para extraer la informacion de los modelos 
            const sqlQuery = `SELECT * FROM \"${schema}\".${nombre}`;
            const result = yield pool.query(sqlQuery);
            res.status(200).json({
                message: 'OK',
                results: result.rows
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
exports.getDataModels = getDataModels;
