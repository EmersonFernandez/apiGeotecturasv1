import { Request, Response } from 'express'
import { Pool, QueryResultRow } from 'pg';
import { getPool } from '../db'


let sqlQuery: string;
const schema = process.env.DB_SCHEMA_USUARIOS;
// para manejar los nombres de las tablas ha utilizar
const NAMES_TABLES: Record<string, string> = {
    usuarios: 'tgeo_usuarios',
};

export async function getUserConnected(req: Request, res: Response) {
    try {
        // Obetenemos el codigo del usuarios que se logueo
        const idUser: number = req.user.id;

        sqlQuery = `
            select 
                ncodigo,
                split_part(lower(vnombres), ' ', 1) AS nombre,
                split_part(lower(vapellidos), ' ', 1) AS apellido,
                vcorreo
            from ${schema}.${NAMES_TABLES.usuarios}
            where ncodigo = $1
        `
        const pool: Pool = await getPool();
        const results = await pool.query(sqlQuery, [idUser]);

        res.status(200).json({
            message: 'OK',
            results: results.rows
        })

    } catch (error) {
        console.log('Error en la base de datos', error);
        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
}