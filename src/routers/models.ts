import express, { Router } from "express";
import multer from 'multer'
import { uploadModels,modelsArquitectonico } from '../controllers/controller.models'
const upload = multer();

const router: Router = express.Router();

router.post('/upload', upload.single('file'), uploadModels);
router.get('/arquitectonico/:id', modelsArquitectonico);

export default router;