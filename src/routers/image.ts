import express,{Router} from "express";
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
import {uploadImage,getImage} from '../controllers/controller.image'
// import {middlewareVerifyToken} from '../utils/middleware'

const router:Router = express.Router();

router.get('/:id', getImage);
router.post('/upload',upload.single('image'), uploadImage);



export default router;