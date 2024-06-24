import express,{Router} from "express";
import {login} from '../controllers/controller.login'

const router:Router = express.Router();

router.post('/', login)

export default router;