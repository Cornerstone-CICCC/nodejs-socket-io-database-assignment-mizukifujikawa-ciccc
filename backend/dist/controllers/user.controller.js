"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const getUserByUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    const user = yield user_model_1.User.findOne({ username });
    if (!user) {
        res.status(404).send('User not found!');
        return;
    }
    res.status(200).json(user);
});
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("addUser", req.body);
    const { username, password, firstname, lastname } = req.body;
    if (!username || !password || !firstname || !lastname) {
        res.status(500).json({ error: 'Some of the user information is empty!' });
        return;
    }
    const exist = yield user_model_1.User.findOne({ username });
    if (exist) {
        res.status(409).json({ error: 'Username is already taken!' });
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 12);
    try {
        const user = new user_model_1.User({ username, password: hashedPassword, firstname, lastname });
        yield user.save();
        res.status(201).json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Error add user failed' });
    }
});
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ message: 'Username and password are required' });
        return;
    }
    const exist = yield user_model_1.User.findOne({ username });
    if (!exist) {
        res.status(401).json({ error: 'User not found' });
        return;
    }
    const isMatch = yield bcrypt_1.default.compare(password, exist.password);
    if (!isMatch) {
        res.status(401).json({ error: 'Invalid password' });
    }
    if (req.session) {
        req.session.isLoggedIn = true;
        req.session.username = username;
    }
    res.status(200).send("Successfully logged in!");
});
const logoutUser = (req, res) => {
    req.session = null;
    res.status(200).json({
        content: "User logout!"
    });
};
const checkCookie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session && req.session.username) {
        const username = req.session.username;
        const user = yield user_model_1.User.findOne({ username });
        if (!user) {
            res.status(404).send('User not found!');
            return;
        }
        res.status(200).json({
            content: req.session.message,
            user: user,
            isLoggedIn: true
        });
        return;
    }
    res.status(500).json({
        content: "No cookie found!"
    });
});
exports.default = {
    getUserByUsername,
    addUser,
    loginUser,
    logoutUser,
    checkCookie,
};
