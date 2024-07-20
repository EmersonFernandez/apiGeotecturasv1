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
exports.modelsUrbanistico = exports.modelsPredial = exports.modelsNormativo = exports.modelsInmobiliario = exports.modelsCatastral = exports.modelsArquitectonico = exports.uploadModels = void 0;
const db_1 = require("../db");
// variables
let sqlQuery;
// nombre del schema donde esta almacenadas la tablas
const schema = process.env.DB_SCHEMA_MODELOS;
// para manejar los nombres de las tablas ha utilizar
const NAMES_TABLES = {
    modelos: 'tgeo_modelos',
    elementos: 'tgeo_modelos_elementos',
    usuarioModelosElementos: 'tgeo_usuario_elemento_modelo',
};
// carga de los modelos a la base de dato
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
// reusable function to retrieve and send a file
const modelsGenerateElements = (req, res, params) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // validamos el la respuesta del token
        if (!req.user) {
            res.status(401).json({ message: 'no hay token' });
        }
        const pool = yield (0, db_1.getPool)();
        const sqlQuery = `
            SELECT * FROM ${schema}.${NAMES_TABLES.elementos} , ${schema}.${NAMES_TABLES.usuarioModelosElementos}
            WHERE ${schema}.${NAMES_TABLES.elementos}.ncodigo = ${schema}.${NAMES_TABLES.usuarioModelosElementos}.nelemento_modelo
            AND nmodelo = $1 AND ${schema}.${NAMES_TABLES.elementos}.ncodigo = $2 AND nusuario = $3 AND ngrupo = $4
        `;
        // Buscar el modelo 3D en la base de datos por su ncodigo
        const result = yield pool.query(sqlQuery, [params, req.params.id, req.user.id, req.params.idgrupo]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Archivo no encontrado o el usuario no tiene acceso' });
        }
        const file = result.rows[0];
        const buffer = file.bytdato;
        // configurar las cabeceras de respuesta
        res.set({
            'Content-Disposition': `inline; filename="${file.vnombre_archivo}"`, // establece el nombre de archivo para la descarga
            'Content-Type': 'model/vnd.autodesk.fbx', // establece el tipo MIME para archivos FBX
            'Content-Length': buffer.length //establece la longitud del contenido en bytes
        });
        // envía el archivo como respuesta
        res.send(buffer);
    }
    catch (error) {
        console.error('Error al recuperar y enviar el archivo FBX:', error);
        res.status(500).json({ error: 'Error en la base de dato', details: error });
    }
});
// mostrar los elementos del modelos arquitectonico 
function modelsArquitectonico(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield modelsGenerateElements(req, res, 1);
    });
}
exports.modelsArquitectonico = modelsArquitectonico;
// mostrar los elmentos de los modelos catastral
function modelsCatastral(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield modelsGenerateElements(req, res, 2);
    });
}
exports.modelsCatastral = modelsCatastral;
// mostrar los elementos del modelos inmobiliario 
function modelsInmobiliario(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield modelsGenerateElements(req, res, 3);
    });
}
exports.modelsInmobiliario = modelsInmobiliario;
// mostrar los elementos de los modelos normativo
function modelsNormativo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield modelsGenerateElements(req, res, 4);
    });
}
exports.modelsNormativo = modelsNormativo;
// mostrar los elementos de los modelos predial
function modelsPredial(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield modelsGenerateElements(req, res, 5);
    });
}
exports.modelsPredial = modelsPredial;
// mostrar los elementos de los modelos urbanisitico
function modelsUrbanistico(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield modelsGenerateElements(req, res, 6);
    });
}
exports.modelsUrbanistico = modelsUrbanistico;
