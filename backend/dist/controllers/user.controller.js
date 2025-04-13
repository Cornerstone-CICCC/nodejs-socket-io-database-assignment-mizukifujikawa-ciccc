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
const user_model_1 = __importDefault(require("../models/user.model"));
/**
 * Get all users
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {void} Returns list of users.
 */
const getUsers = (req, res) => {
    const users = user_model_1.default.findAll();
    res.status(200).json(users);
};
/**
 * Get user by ID
 *
 * @param {Request<{ id: string}>} req
 * @param {Response} res
 * @returns {void} Returns one user.
 */
const getUserById = (req, res) => {
    const { id } = req.params;
    const user = user_model_1.default.findById(id);
    if (!user) {
        res.status(404).send('User not found!');
        return;
    }
    res.status(200).json(user);
};
/**
 * Get user by username
 *
 * @param {Request<{ username: string}>} req
 * @param {Response} res
 * @returns {void} Returns one user.
 */
const getUserByUsername = (req, res) => {
    const { username } = req.params;
    const user = user_model_1.default.findByUsername(username);
    if (!user) {
        res.status(404).send('User not found!');
        return;
    }
    res.status(200).json(user);
};
/**
 * Add new user
 *
 * @param {Request<{}, {}, Omit<User, 'id'>>} req
 * @param {Response} res
 * @returns {void} Returns newly created user.
 */
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, firstname, lastname } = req.body;
    if (!username || !password || !firstname || !lastname) {
        res.status(500).json({ error: 'Some of the user information is empty!' });
        return;
    }
    const user = yield user_model_1.default.create({ username, password, firstname, lastname });
    if (!user) {
        res.status(409).json({ error: 'Username is taken!' });
        return;
    }
    res.status(201).json(user);
});
/**
 * Edit user by ID
 *
 * @param {Request<{ id: string }, {}, Partial<User>>} req
 * @param {Response} res
 * @returns {void} Returns updated user.
 */
const updateUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { username, password } = req.body;
    const user = yield user_model_1.default.editUserById(id, { username, password });
    if (!user) {
        res.status(404).json({ error: "User does not exist!" });
        return;
    }
    res.status(200).json(user);
});
/**
 * Delete user by ID
 *
 * @param {Request<{ id: string }>} req
 * @param {Response} res
 * @returns {void} Returns success or fail message.
 */
const deleteUserById = (req, res) => {
    const { id } = req.params;
    const result = user_model_1.default.removeUserById(id);
    if (!result) {
        res.status(404).json({ message: "User not found!" });
        return;
    }
    res.status(200).json({ message: "Deleted user!" });
};
/**
 * Login user
 *
 * @param {Request<{}, {}, Partial<User>>} req
 * @param {Response} res
 * @returns {void} Returns cookie and redirect.
 */
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ message: 'Username and password are required' });
        return;
    }
    const user = yield user_model_1.default.checkUserPass(username, password);
    if (user.isFailure()) {
        console.error(`Login failed: ${user.error.message}`);
        res.status(401).send("Login details are incorrect!");
        return;
    }
    if (req.session) {
        console.log('req.session');
        req.session.isLoggedIn = true;
        req.session.username = user.value.username;
    }
    res.status(200).send("Successfully logged in!");
});
/**
 * Logout user
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {void}
 */
const logoutUser = (req, res) => {
    req.session = null;
    res.status(200).json({
        content: "User logout!"
    });
};
const checkCookie = (req, res) => {
    if (req.session && req.session.username) {
        console.log("checkCookie");
        const username = req.session.username;
        const user = user_model_1.default.findByUsername(username);
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
};
exports.default = {
    getUsers,
    getUserById,
    getUserByUsername,
    addUser,
    updateUserById,
    deleteUserById,
    loginUser,
    logoutUser,
    checkCookie
};
