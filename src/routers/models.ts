import express, { Router } from "express";
import multer from 'multer'
import { uploadModels, 
        modelsArquitectonico,
        modelsInmobiliario,
        modelsCatastral,
        modelsNormativo,
        modelsPredial,
        modelsUrbanistico
    } from '../controllers/controller.models'
import { getDataModels } from "../controllers/controller.modelsDatas";
import { middlewareVerifyToken } from '../utils/middleware'
const upload = multer();

const router: Router = express.Router();

router.post('/upload', middlewareVerifyToken, upload.single('file'), uploadModels);
router.get('/arquitectonico/:id/grupo/:idgrupo', middlewareVerifyToken,  modelsArquitectonico);
router.get('/inmobiliario/:id/grupo/:idgrupo', modelsInmobiliario);
router.get('/catastral/:id/grupo/:idgrupo', middlewareVerifyToken, modelsCatastral);
router.get('/normativo/:id/grupo/:idgrupo', middlewareVerifyToken, modelsNormativo);
router.get('/predial/:id/grupo/:idgrupo', middlewareVerifyToken, modelsPredial);
router.get('/urbanistico/:id/grupo/:idgrupo', middlewareVerifyToken, modelsUrbanistico);


// ruta para obtner la informacion de los modelos correspondientes
router.get('/datamodels/:id', middlewareVerifyToken ,getDataModels)

export default router;