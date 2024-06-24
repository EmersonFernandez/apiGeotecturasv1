import express,{Express,Request,Response} from 'express'
export {cargarRutas} from './routers/index'
import dotenv  from "dotenv"
import { cargarRutas } from './routers/index';
import cookieParser from 'cookie-parser';
import cors from 'cors'
dotenv.config();

const app:Express = express();
const port = process.env.PORT || 3000;

// Middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

cargarRutas(app);
app.get('/', (req:Request, res:Response) => {
    res.status(200).send('oks');
});

app.listen(port , () => {
    console.log(`Servidor corriendo el port ${port}`);
    
});




