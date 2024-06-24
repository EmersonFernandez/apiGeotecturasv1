"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_userConnected_1 = require("../controllers/controller.userConnected");
const middleware_1 = require("../utils/middleware");
const router = express_1.default.Router();
router.get('/', middleware_1.middlewareVerifyToken, controller_userConnected_1.getUserConnected);
exports.default = router;
