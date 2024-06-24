import express, { Router,Request,Response} from "express";
import jwt from 'jsonwebtoken'

const router: Router = express.Router();
const word: string = 'clave';

router.get('/', (req:Request, res:Response) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ valid: false, message: 'No token provided' });
    }

    jwt.verify(token, word, (err, decoded) => {
        if (err) {
            return res.status(401).json({ valid: false, message: 'Invalid token' });
        }
        return res.json({ valid: true, username: decoded });
    });
});

export default router;