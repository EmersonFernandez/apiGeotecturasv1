import { Request, Response } from 'express'
import { Pool, QueryResultRow } from 'pg';
import { getPool } from '../db'
// import {QueryResultRows} from '../utils/types'
import {generateToken} from '../utils/functions'

// Interfaz
export interface User {
    id: number;
    username: string;
    rol: number;
}

let sqlQuery: string;
const schema = process.env.DB_SCHEMA_USUARIOS;
// para manejar los nombres de las tablas ha utilizar
const NAMES_TABLES: Record<string, string> = {
    usuarios: 'tgeo_usuarios',
};


export async function login(req: Request, res: Response) {
    const { username, password }: { username: string, password: string } = req.body;

    try {
        const pool: Pool = await getPool();

        if (!username || !password) {
            return res.status(400).json({
                error: true,
                message: "Todos los campos son obligatorios"
            });
        }

        const query = `
            SELECT * FROM ${schema}.${NAMES_TABLES.usuarios} WHERE UPPER(vusuario) = UPPER($1) AND vpassword = $2;
        `;
        const results:QueryResultRow = await pool.query(query, [username.trim(), password.trim()]);
        const user = results.rows[0];

        if (user) {
            const userData: User = {
                id: user.ncodigo,
                username: user.vusuario,
                rol: Number(user.nrol)
            }

            const token = generateToken(userData);
            // Mandamos el token al token
            res.cookie('token', token, { maxAge: 900000, httpOnly: true }); // Set cookie named 'token'

            return res.status(200).json({
                error: false,
                message: "Credenciales Correctas",
                token
            });


        } else {
            // Respuesta genérica para no dar pistas sobre si el usuario o la contraseña son incorrectos
            return res.status(401).json({
                error: true,
                message: "Usuario o contraseña incorrecta"
            });
        }
    } catch (error) {
        console.log('Error en la base de datos', error);
        return res.status(500).json({
            error: true,
            message: "Error interno del servidor"
        });
    }
}
