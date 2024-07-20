import jwt from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: any; // Cambia `any` al tipo que necesites para `user`
        }
    }
}


// Crear un token JWT
const word: string = 'clave';
export const generateToken = (usuario: any) => {
    const token = jwt.sign(usuario,  process.env.SECRETWORD || '', { expiresIn: '1h' });
    return token;
}

