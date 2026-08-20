"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
const zod_1 = require("zod");
const errorHandler = (err, _req, res, _next) => {
    console.error('[Unhandled Error]:', err);
    if (err instanceof zod_1.ZodError) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: err.errors.map((e) => ({
                path: e.path.join('.'),
                message: e.message,
            })),
        });
        return;
    }
    if (err.name === 'ValidationError') {
        // Mongoose validation error
        res.status(400).json({
            success: false,
            message: 'Database validation failed',
            errors: Object.values(err.errors).map((e) => e.message),
        });
        return;
    }
    if (err.code === 11000) {
        // Mongoose duplicate key
        const field = Object.keys(err.keyPattern || {})[0] || 'Field';
        res.status(409).json({
            success: false,
            message: `Duplicate entry error: ${field} already exists.`,
        });
        return;
    }
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: `API Route not found: ${req.method} ${req.originalUrl}`,
    });
};
exports.notFoundHandler = notFoundHandler;
