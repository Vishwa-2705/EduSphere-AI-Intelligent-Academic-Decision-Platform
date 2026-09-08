"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const authenticate = (req, res, next) => {
    try {
        let token;
        // Check Authorization header
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
        else if (req.cookies && req.cookies.accessToken) {
            token = req.cookies.accessToken;
        }
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Authentication required. No token provided.',
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, env_1.ENV.JWT_ACCESS_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({
                success: false,
                message: 'Token expired. Please refresh your token or login again.',
                code: 'TOKEN_EXPIRED',
            });
            return;
        }
        res.status(401).json({
            success: false,
            message: 'Invalid authentication token.',
        });
    }
};
exports.authenticate = authenticate;
const authorizeRoles = (roles, ...extraRoles) => {
    const allowed = Array.isArray(roles) ? roles : [roles, ...extraRoles];
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized. User authentication required.',
            });
            return;
        }
        if (!allowed.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: `Forbidden. Role '${req.user.role}' does not have access to this resource. Required roles: ${allowed.join(', ')}`,
            });
            return;
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
