"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const academic_controller_1 = require("../controllers/academic.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get('/departments', auth_middleware_1.authenticate, academic_controller_1.getDepartments);
router.get('/courses', auth_middleware_1.authenticate, academic_controller_1.getCourses);
exports.default = router;
