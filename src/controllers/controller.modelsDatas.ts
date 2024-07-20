import { Request, Response } from 'express'
import { Pool, QueryResultRow } from 'pg';
import { getPool } from '../db'

// variables ->
let sqlQuery: string;

// nombre del schema donde esta almacenadas la tablas
const schemaModels = process.env.DB_SCHEMA_MODELOS;


// para manejar los nombres de las tablas ha utilizar
const NAMES_TABLES: Record<string, string> = {
    elementos: 'tgeo_modelos_elementos',
    dataTabla: 'tgeo_tablas_datos',
    usuarioModelosElementos: 'tgeo_usuario_elemento_modelo',
};





export async function getDataModels(req: Request, res: Response) {
    try {

        // validamos el la respuesta del token
        // if (!req.user) {
        //     res.status(401).json({ message: 'no hay token' })
        // }

        const pool: Pool = await getPool();
        // fucion almacenada para obtener el nombre de la tabla de la informacion del modelo
        const sqlTable = `SELECT * FROM ${schemaModels}.obtener_tabla_informacion_modelo($1,$2)`;
        const resultTable: QueryResultRow = await pool.query(sqlTable, [req.params.id, 1]);

        // obtenmos el schema y el nombre de la tabla
        const { schema, nombre } = resultTable.rows[0];

        if (!schema || !nombre) {
            res.status(401).json({ message: 'no hay dato para este modelos' });
            return;
        }


        // armado del query para extraer la informacion de los modelos 
        const sqlQuery = `SELECT * FROM \"${schema}\".${nombre}`;
        const result: QueryResultRow = await pool.query(sqlQuery);

        res.status(200).json({
            message: 'OK',
            results: result.rows
        });


    } catch (error) {
        console.log('Error en la base de datos', error);
        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
}

