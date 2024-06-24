import express,{Router} from "express";
import {getUserConnected} from '../controllers/controller.userConnected'
import {middlewareVerifyToken} from '../utils/middleware'

const router:Router = express.Router();

router.get('/', middlewareVerifyToken ,getUserConnected)

export default router;