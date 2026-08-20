"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("./config/env");
const db_1 = require("./config/db");
const routes_1 = __importDefault(require("./routes"));
const error_middleware_1 = require("./middlewares/error.middleware");
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)({
    origin: [env_1.ENV.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
if (env_1.ENV.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
// API Routes
app.use('/api/v1', routes_1.default);
// Root Welcome Route
app.get('/', (_req, res) => {
    res.json({
        message: 'Welcome to EduSphere AI: Intelligent Academic Decision Platform API',
        status: 'online',
        version: '1.0.0',
        documentation: '/api/v1/health',
    });
});
// Error handling
app.use(error_middleware_1.notFoundHandler);
app.use(error_middleware_1.errorHandler);
// Start server
const startServer = async () => {
    await (0, db_1.connectDB)();
    app.listen(env_1.ENV.PORT, () => {
        console.log(`====================================================`);
        console.log(`🚀 EduSphere AI Server running on port ${env_1.ENV.PORT}`);
        console.log(`🌐 Health endpoint: http://localhost:${env_1.ENV.PORT}/api/v1/health`);
        console.log(`⚙️ Environment: ${env_1.ENV.NODE_ENV}`);
        console.log(`====================================================`);
    });
};
startServer();
exports.default = app;
