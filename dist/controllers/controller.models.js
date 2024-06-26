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
exports.modelsArquitectonico = exports.uploadModels = void 0;
const db_1 = require("../db");
let sqlQuery;
const schema = process.env.DB_SCHEMA_MODELOS;
// para manejar los nombres de las tablas ha utilizar
const NAMES_TABLES = {
    modelos: 'tgeo_modelos',
    elementos: 'tgeo_modelos_elementos',
    data: 'tgeo_modelos_datas',
};
// Cargar elementos de los modelos
function uploadModels(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: 'Error al cargar el archivo' });
        }
        const { originalname, mimetype, size, buffer } = file;
        const { modelo } = req.body;
        try {
            const pool = yield (0, db_1.getPool)();
            const sqlQueryseqModelsElements = `SELECT COALESCE(max(ncodigo),0) + 1 as seq FROM ${schema}.${NAMES_TABLES.elementos}`;
            const resultSeqModelsElements = yield pool.query(sqlQueryseqModelsElements);
            const seqModelsElements = Number(resultSeqModelsElements.rowCount) > 0 ? resultSeqModelsElements.rows[0].seq : res.status(400).json({ message: "Secuencia no encontrada" });
            sqlQuery = `
            insert into ${schema}.${NAMES_TABLES.elementos}
            (
                ncodigo,
                nmodelo,
                vnombre_archivo,
                vtipo_mime,
                ntamano_byte,
                bytdato
            ) values 
            (
                $1,$2,$3,$4,$5,$6
            )
        `;
            const results = yield pool.query(sqlQuery, [seqModelsElements, modelo, originalname, mimetype, size, buffer]);
            Number(results.rowCount) > 0 ? res.status(201).json({ message: 'Arhivo cargado correctamente' }) : null;
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error en la base de dato', details: error });
        }
    });
}
exports.uploadModels = uploadModels;
// Reusable function to retrieve and send a file
const modelsGenerateElements = (req, res, params) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield (0, db_1.getPool)();
        const sqlQuery = `
            SELECT * FROM ${schema}.${NAMES_TABLES.elementos} WHERE nmodelo = $1 and ncodigo = $2
        `;
        // Busca el modelo 3D en la base de datos por su ncodigo
        const result = yield pool.query(sqlQuery, [params, req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'File not found' });
        }
        const file = result.rows[0];
        const buffer = file.bytdato;
        // Configura las cabeceras de respuesta
        res.set({
            'Content-Disposition': `inline; filename="${file.vnombre_archivo}"`, // Establece el nombre de archivo para la descarga
            'Content-Type': 'model/vnd.autodesk.fbx', // Establece el tipo MIME para archivos FBX
            'Content-Length': buffer.length // Establece la longitud del contenido en bytes
        });
        // Envía el archivo como respuesta
        res.send(buffer);
    }
    catch (error) {
        console.error('Error al recuperar y enviar el archivo FBX:', error);
        res.status(500).json({ error: 'Error en la base de dato', details: error });
    }
});
// Mostrar los elementos del modelo Arquitectonico 
function modelsArquitectonico(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield modelsGenerateElements(req, res, 1);
    });
}
exports.modelsArquitectonico = modelsArquitectonico;
