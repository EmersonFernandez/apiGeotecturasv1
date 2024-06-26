import { Request, Response } from 'express'
import { Pool, QueryResultRow } from 'pg';
import { getPool } from '../db'

let sqlQuery: string;
const schema = process.env.DB_SCHEMA_MODELOS;
// para manejar los nombres de las tablas ha utilizar
const NAMES_TABLES: Record<string, string> = {
    modelos: 'tgeo_modelos',
    elementos: 'tgeo_modelos_elementos',
    data: 'tgeo_modelos_datas',
};

// Cargar elementos de los modelos
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

// Reusable function to retrieve and send a file
const modelsGenerateElements = async (req:any, res:any, params:number) => {
    try {
        const pool = await getPool();

        const sqlQuery = `
            SELECT * FROM ${schema}.${NAMES_TABLES.elementos} WHERE nmodelo = $1 and ncodigo = $2
        `;

        // Busca el modelo 3D en la base de datos por su ncodigo
        const result = await pool.query(sqlQuery, [params, req.params.id]);

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
    } catch (error) {
        console.error('Error al recuperar y enviar el archivo FBX:', error);
        res.status(500).json({ error: 'Error en la base de dato', details: error });
    }
};


// Mostrar los elementos del modelo Arquitectonico 
export async function modelsArquitectonico(req: Request, res: Response) {
    await modelsGenerateElements(req,res,1);
}