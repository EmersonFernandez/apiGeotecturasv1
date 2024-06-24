import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config(); // Cargar variables de entorno desde .env

let pool: Pool | null = null; // Variable para almacenar la instancia de Pool

export function getPool(): Pool {
    if (!pool) {
        // Crear una nueva instancia de Pool si no existe
        pool = new Pool({
            user: process.env.DB_USER || '', // Obtener usuario de las variables de entorno
            host: process.env.DB_SERVER || '', // Obtener host de las variables de entorno
            database: process.env.DB_DATABASE || '', // Obtener base de datos de las variables de entorno
            password: process.env.DB_PASS || '', // Obtener contraseña de las variables de entorno
            port: Number(process.env.DB_PORT) || 5432, // Obtener puerto de las variables de entorno o usar el valor por defecto 5432
            ssl: {
                rejectUnauthorized: false, // Esto puede ser true en producción si tienes un certificado válido
            },
        });

        // Realizar una prueba de conexión
        pool.connect()
            .then(client => {
                client.release(); // Liberar el cliente después de la conexión exitosa
                console.log('Conexión a la base de datos exitosa');
            })
            .catch(error => {
                console.error('Error al conectar a la base de datos:', error);
            });
    }

    return pool;
}
