"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chat_controller_1 = __importDefault(require("../controllers/chat.controller"));
const chatRouter = (0, express_1.default)();
// Get all chat messages
chatRouter.get('/', chat_controller_1.default.getAllChats);
chatRouter.get('/:room', chat_controller_1.default.getChatsByRoom);
exports.default = chatRouter;
