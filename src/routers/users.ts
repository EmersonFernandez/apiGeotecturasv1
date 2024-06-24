import express,{Router} from "express";
import {getUsers} from '../controllers/controller.users'
import {middlewareVerifyToken} from '../utils//middleware'

const router:Router = express.Router();

router.get('/', middlewareVerifyToken ,getUsers)

export default router;