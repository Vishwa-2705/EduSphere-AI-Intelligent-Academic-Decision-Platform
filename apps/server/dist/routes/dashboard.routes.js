"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Student dashboard: accessible by STUDENT and ADMIN
router.get('/student', auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)('STUDENT', 'ADMIN'), dashboard_controller_1.getStudentDashboard);
// Faculty dashboard: accessible by FACULTY and ADMIN
router.get('/faculty', auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)('FACULTY', 'ADMIN'), dashboard_controller_1.getFacultyDashboard);
// Mentor dashboard: accessible by MENTOR and ADMIN
router.get('/mentor', auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)('MENTOR', 'ADMIN'), dashboard_controller_1.getMentorDashboard);
// Admin dashboard: accessible by ADMIN only
router.get('/admin', auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)('ADMIN'), dashboard_controller_1.getAdminDashboard);
exports.default = router;
