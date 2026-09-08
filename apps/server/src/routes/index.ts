import { Router } from 'express';
import authRoutes from './auth.routes';
import dashboardRoutes from './dashboard.routes';
import academicRoutes from './academic.routes';
import attendanceRoutes from './attendance.routes';
import examRoutes from './exam.routes';
import timetableRoutes from './timetable.routes';
import materialRoutes from './material.routes';
import mentorshipRoutes from './mentorship.routes';
import feeRoutes from './fee.routes';
import admissionRoutes from './admission.routes';
import hostelRoutes from './hostel.routes';
import infrastructureRoutes from './infrastructure.routes';
import aiRoutes from './ai.routes';

const router = Router();

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
router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/academics', academicRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/exams', examRoutes);
router.use('/timetable', timetableRoutes);
router.use('/materials', materialRoutes);
router.use('/mentorship', mentorshipRoutes);
router.use('/fees', feeRoutes);
router.use('/admissions', admissionRoutes);
router.use('/hostel', hostelRoutes);
router.use('/infrastructure', infrastructureRoutes);
router.use('/ai', aiRoutes);

export default router;
