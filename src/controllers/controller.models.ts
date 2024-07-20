import { Request, Response } from 'express'
import { Pool, QueryResultRow } from 'pg';
import { getPool } from '../db'

// variables
let sqlQuery: string;

// nombre del schema donde esta almacenadas la tablas
const schema = process.env.DB_SCHEMA_MODELOS;

// para manejar los nombres de las tablas ha utilizar
const NAMES_TABLES: Record<string, string> = {
    modelos: 'tgeo_modelos',
    elementos: 'tgeo_modelos_elementos',
    usuarioModelosElementos: 'tgeo_usuario_elemento_modelo',
};

// carga de los modelos a la base de dato
export async function uploadModels(req: Request, res: Response) {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ error: 'Error al cargar el archivo' });
    }

    const { originalname, mimetype, size, buffer } = file;
    const { modelo } = req.body;
    try {

        const pool: Pool = await getPool();

        const sqlQueryseqModelsElements: string = `SELECT COALESCE(max(ncodigo),0) + 1 as seq FROM ${schema}.${NAMES_TABLES.elementos}`;
        const resultSeqModelsElements: QueryResultRow = await pool.query(sqlQueryseqModelsElements);
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
        const results: QueryResultRow = await pool.query(sqlQuery, [seqModelsElements, modelo, originalname, mimetype, size, buffer]);
        Number(results.rowCount) > 0 ? res.status(201).json({ message: 'Arhivo cargado correctamente' }) : null;

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error en la base de dato', details: error });
    }
}

// reusable function to retrieve and send a file
const modelsGenerateElements = async (req:any, res:any, params:number) => {
    try {

        // validamos el la respuesta del token
        // if(!req.user){
        //     res.status(401).json({message:'no hay token'})
        // }

        const pool = await getPool();
        const sqlQuery = `
            SELECT * FROM ${schema}.${NAMES_TABLES.elementos} , ${schema}.${NAMES_TABLES.usuarioModelosElementos}
            WHERE ${schema}.${NAMES_TABLES.elementos}.ncodigo = ${schema}.${NAMES_TABLES.usuarioModelosElementos}.nelemento_modelo
            AND nmodelo = $1 AND ${schema}.${NAMES_TABLES.elementos}.ncodigo = $2 AND nusuario = $3 AND ngrupo = $4
        `;

        // Buscar el modelo 3D en la base de datos por su ncodigo
        const result = await pool.query(sqlQuery, [params, req.params.id, 1, req.params.idgrupo]);
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
    } catch (error) {
        console.error('Error al recuperar y enviar el archivo FBX:', error);
        res.status(500).json({ error: 'Error en la base de dato', details: error });
    }
};


// mostrar los elementos del modelos arquitectonico 
export async function modelsArquitectonico(req: Request, res: Response) {
    await modelsGenerateElements(req,res,1);
}

// mostrar los elmentos de los modelos catastral
export async function modelsCatastral(req: Request, res: Response) {
    await modelsGenerateElements(req,res,2);
}

// mostrar los elementos del modelos inmobiliario 
export async function modelsInmobiliario(req:Request, res: Response) {
    await modelsGenerateElements(req,res,3);
}

// mostrar los elementos de los modelos normativo
export async function modelsNormativo(req: Request, res: Response) {
    await modelsGenerateElements(req,res,4);
}

// mostrar los elementos de los modelos predial
export async function modelsPredial(req: Request, res: Response) {
    await modelsGenerateElements(req,res,5);
}

// mostrar los elementos de los modelos urbanisitico
export async function modelsUrbanistico(req: Request, res: Response) {
    await modelsGenerateElements(req,res,6);
}