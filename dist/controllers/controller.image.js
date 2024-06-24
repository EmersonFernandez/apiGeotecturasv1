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
exports.uploadImage = exports.getImage = void 0;
const db_1 = require("../db");
let sqlQuery;
const schema = process.env.DB_SCHEMA_ARCHIVOS;
// para manejar los nombres de las tablas ha utilizar
const NAMES_TABLES = {
    image: 'tgeo_imagenes_publicas',
};
function getImage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Obetenemos el codigo del usuarios que se logueo
            const image = req.params.id;
            sqlQuery = `
            select *
            from ${schema}.${NAMES_TABLES.image}
            where ncodigo = $1
        `;
            const pool = yield (0, db_1.getPool)();
            const results = yield pool.query(sqlQuery, [image]);
            if (Number(results.rows.length) === 0) {
                res.status(404).send('No se encontró la imagen');
            }
            else {
                const { vnombre_archivo, vtipo_mime, bytdatos } = results.rows[0];
                res.set('Content-Disposition', `inline; filename="${vnombre_archivo}"`);
                res.set('Content-Type', vtipo_mime);
                res.send(bytdatos);
            }
        }
        catch (error) {
            console.log('Error en la base de datos', error);
            return res.status(500).json({
                error: true,
                message: "Error interno del servidor"
            });
        }
    });
}
exports.getImage = getImage;
function uploadImage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.file) {
            return res.status(400).send('No se ha subido ningún archivo.');
        }
        const { originalname, mimetype, size, buffer } = req.file;
        const sqlQuerySeq = `select COALESCE(max(ncodigo) , 0) + 1 seq from "archivos".tgeo_imagenes_publicas`;
        const sqlQuery = `
    INSERT INTO archivos.tgeo_imagenes_publicas (ncodigo,vnombre_archivo, vtipo_mime, ntamano_bytes, bytdatos)
    VALUES($1, $2, $3, $4, $5) RETURNING vnombre_archivo as nombre
    `;
        try {
            const pool = yield (0, db_1.getPool)();
            const resultsSeq = yield pool.query(sqlQuerySeq);
            const seq = resultsSeq.rows[0].seq;
            const results = yield pool.query(sqlQuery, [seq, originalname, mimetype, size, buffer]);
            res.status(201).send(`Imagen subida con ID: ${results.rows[0].nombre}`);
        }
        catch (err) {
            console.error(err);
            res.status(500).send('Error al subir la imagen.');
        }
    });
}
exports.uploadImage = uploadImage;
