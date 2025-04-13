"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkLoggedOut = void 0;
const checkLoggedOut = (req, res, next) => {
    if (req.session && req.session.isLoggedIn) {
        res.status(301).redirect('/');
        return;
    }
    next();
};
exports.checkLoggedOut = checkLoggedOut;
