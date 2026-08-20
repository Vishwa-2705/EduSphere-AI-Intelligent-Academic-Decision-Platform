"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const dashboard_routes_1 = __importDefault(require("./dashboard.routes"));
const academic_routes_1 = __importDefault(require("./academic.routes"));
const router = (0, express_1.Router)();
// Health Check
router.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'online',
        service: 'EduSphere AI Backend Core API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
    });
});
// Mount modules
router.use('/auth', auth_routes_1.default);
router.use('/dashboard', dashboard_routes_1.default);
router.use('/academics', academic_routes_1.default);
exports.default = router;
