"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const dashboard_routes_1 = __importDefault(require("./dashboard.routes"));
const academic_routes_1 = __importDefault(require("./academic.routes"));
const attendance_routes_1 = __importDefault(require("./attendance.routes"));
const exam_routes_1 = __importDefault(require("./exam.routes"));
const timetable_routes_1 = __importDefault(require("./timetable.routes"));
const material_routes_1 = __importDefault(require("./material.routes"));
const mentorship_routes_1 = __importDefault(require("./mentorship.routes"));
const fee_routes_1 = __importDefault(require("./fee.routes"));
const admission_routes_1 = __importDefault(require("./admission.routes"));
const hostel_routes_1 = __importDefault(require("./hostel.routes"));
const infrastructure_routes_1 = __importDefault(require("./infrastructure.routes"));
const ai_routes_1 = __importDefault(require("./ai.routes"));
const router = (0, express_1.Router)();
// Health Check
router.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'online',
        service: 'EduSphere AI Backend Core API',
        version: '3.0.0',
        capabilities: [
            'Authentication & RBAC',
            'Academic ERP & Course Catalog',
            'Class Attendance & Roll-Call Registry',
            'Examinations, Marks & GPA Transcript Engine',
            'Timetable & Constraint Optimization Solver',
            'Digital Study Materials Repository',
            'Mentorship, 360 Dossiers & Counseling Logs',
            'Fees, Invoicing & Payment Gateway Checkout',
            'Admissions Intake & 1-Click Student Provisioning',
            'Hostel Bed Occupancy & Room Allocations',
            'Campus Infrastructure Telemetry (Wi-Fi, Power, Water)',
            'Explainable AI Risk Engine (XGBoost + SHAP)',
            'Generative AI Academic Decision Advisor (Gemini RAG)',
        ],
        timestamp: new Date().toISOString(),
    });
});
// Mount all core platform modules
router.use('/auth', auth_routes_1.default);
router.use('/dashboard', dashboard_routes_1.default);
router.use('/academics', academic_routes_1.default);
router.use('/attendance', attendance_routes_1.default);
router.use('/exams', exam_routes_1.default);
router.use('/timetable', timetable_routes_1.default);
router.use('/materials', material_routes_1.default);
router.use('/mentorship', mentorship_routes_1.default);
router.use('/fees', fee_routes_1.default);
router.use('/admissions', admission_routes_1.default);
router.use('/hostel', hostel_routes_1.default);
router.use('/infrastructure', infrastructure_routes_1.default);
router.use('/ai', ai_routes_1.default);
exports.default = router;
