import { Request, Response } from 'express'
import { Pool, QueryResultRow } from 'pg';
import { getPool } from '../db'


let sqlQuery: string;
const schema = process.env.DB_SCHEMA_ARCHIVOS;
// para manejar los nombres de las tablas ha utilizar
const NAMES_TABLES: Record<string, string> = {
    image: 'tgeo_imagenes_publicas',
};



export async function getImage(req: Request, res: Response) {
    try {
        // Obetenemos el codigo del usuarios que se logueo
        const image = req.params.id;

        sqlQuery = `
            select *
            from ${schema}.${NAMES_TABLES.image}
            where ncodigo = $1
        `
        const pool: Pool = await getPool();
        const results = await pool.query(sqlQuery, [image]);

        if (Number(results.rows.length) === 0) {
            res.status(404).send('No se encontró la imagen');
        } else {
            const { vnombre_archivo, vtipo_mime, bytdatos } = results.rows[0];
            res.set('Content-Disposition', `inline; filename="${vnombre_archivo}"`);
            res.set('Content-Type', vtipo_mime);
            res.send(bytdatos);
        }

    } catch (error) {
        console.log('Error en la base de datos', error);
        return res.status(500).json({
            error: true,
            message: "Error interno del servidor"
        });
    }
}


export async function uploadImage(req: Request, res: Response) {
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
        const pool: Pool = await getPool();
        const resultsSeq = await pool.query(sqlQuerySeq);
        const seq = resultsSeq.rows[0].seq;
        const results = await pool.query(
            sqlQuery,
            [seq,originalname, mimetype, size, buffer]
        );

        res.status(201).send(`Imagen subida con ID: ${results.rows[0].nombre}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al subir la imagen.');
    }
}