"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_users_1 = require("../controllers/controller.users");
const middleware_1 = require("../utils//middleware");
const router = express_1.default.Router();
router.get('/', middleware_1.middlewareVerifyToken, controller_users_1.getUsers);
exports.default = router;
