"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const controller_models_1 = require("../controllers/controller.models");
const upload = (0, multer_1.default)();
const router = express_1.default.Router();
router.post('/upload', upload.single('file'), controller_models_1.uploadModels);
router.get('/arquitectonico/:id', controller_models_1.modelsArquitectonico);
exports.default = router;
