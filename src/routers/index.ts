// cargar las rutas de manera dinamica
import { Express, Router } from 'express';
import fs from 'fs';
import path from 'path';

export async function cargarRutas(app: Express) {
    const directorio = __dirname;
    console.log("Este es el directorio: ", directorio);

    try {
        const archivos = await fs.promises.readdir(directorio);
        

        for (const nombreArchivo of archivos) {
            const rutaArchivo = path.join(directorio, nombreArchivo);
            const nombreRouter = path.basename(nombreArchivo, '.js');
    
    
            if (nombreRouter !== 'index' && nombreArchivo.endsWith('.js')) {
                // Importar dinámicamente el módulo de ruta
                const { default: router } = await import(rutaArchivo) as { default: Router };

                // Montar la ruta en la aplicación Express
                app.use(`/api/${nombreRouter}`, router);
            }
        }
    } catch (error) {
        console.error('Error al leer el directorio:', error);
    }
}
