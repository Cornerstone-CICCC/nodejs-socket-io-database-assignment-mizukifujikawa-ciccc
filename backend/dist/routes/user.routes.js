"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const userRouter = (0, express_1.Router)();
userRouter.post('/signup', auth_middleware_1.checkLoggedOut, user_controller_1.default.addUser); // POST /users/signup
userRouter.post('/login', auth_middleware_1.checkLoggedOut, user_controller_1.default.loginUser); // POST /users/login
userRouter.get('/logout', user_controller_1.default.logoutUser); // GET /users/logout
userRouter.get('/check-auth', user_controller_1.default.checkCookie); // GET /users/check-auth
userRouter.get('/:username', user_controller_1.default.getUserByUsername); // GET /users
exports.default = userRouter;
