import {Request,Response} from 'express'
import { Pool,QueryResultRow } from 'pg';
import {getPool} from '../db'

let sqlQuery:string;
const schema = process.env.DB_SCHEMA_USUARIOS;
// para manejar los nombres de las tablas ha utilizar
const NAMES_TABLES: Record<string, string> = {
    usuarios: 'tgeo_usuarios',
};

// Obtener los usuarios
export async function getUsers(req:Request,res:Response) {
    try {
        const pool:Pool = await getPool();
        sqlQuery = `
            select * from ${schema}.${NAMES_TABLES.usuarios} order by ncodigo
        `;
        const results:QueryResultRow = await pool.query(sqlQuery);

        res.status(201).json({
            status:201,
            ok:'Ok',
            results:results.rows
        });

    } catch (error) {
        console.log('Error database', error);
        res.status(500).json({
            message: "Error interno del servidor"

        });
        
    }
}