import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express'

declare global {
    namespace Express {
        interface Request {
            user?: any; // Cambia `any` al tipo que necesites para `user`
        }
    }
}

const word: string = 'clave';
// Middlewares

export const middlewareVerifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token: string = req.headers['authorization'] || '';
    // req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: true, message: 'Token de autenticación no proporcionado' });
    }
    // token.split(' ')[1] para cuando se recuperre desde header
    jwt.verify( token.split(' ')[1], process.env.SECRETWORD || '', (err, user) => {
        if (err) {
            return res.status(403).json({ error: true, message: 'Token de autenticación inválido' });
        }
        req.user = user;
        console.log(user);
        
        next();

    });

}
