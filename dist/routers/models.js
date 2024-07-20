"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const controller_models_1 = require("../controllers/controller.models");
const controller_modelsDatas_1 = require("../controllers/controller.modelsDatas");
const middleware_1 = require("../utils/middleware");
const upload = (0, multer_1.default)();
const router = express_1.default.Router();
router.post('/upload', middleware_1.middlewareVerifyToken, upload.single('file'), controller_models_1.uploadModels);
router.get('/arquitectonico/:id/grupo/:idgrupo', middleware_1.middlewareVerifyToken, controller_models_1.modelsArquitectonico);
router.get('/inmobiliario/:id/grupo/:idgrupo', controller_models_1.modelsInmobiliario);
router.get('/catastral/:id/grupo/:idgrupo', middleware_1.middlewareVerifyToken, controller_models_1.modelsCatastral);
router.get('/normativo/:id/grupo/:idgrupo', middleware_1.middlewareVerifyToken, controller_models_1.modelsNormativo);
router.get('/predial/:id/grupo/:idgrupo', middleware_1.middlewareVerifyToken, controller_models_1.modelsPredial);
router.get('/urbanistico/:id/grupo/:idgrupo', middleware_1.middlewareVerifyToken, controller_models_1.modelsUrbanistico);
// ruta para obtner la informacion de los modelos correspondientes
router.get('/datamodels/:id', middleware_1.middlewareVerifyToken, controller_modelsDatas_1.getDataModels);
exports.default = router;
