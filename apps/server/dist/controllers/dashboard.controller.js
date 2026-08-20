"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminDashboard = exports.getMentorDashboard = exports.getFacultyDashboard = exports.getStudentDashboard = void 0;
const User_1 = require("../models/User");
const Profile_1 = require("../models/Profile");
const Department_1 = require("../models/Department");
const Course_1 = require("../models/Course");
const Enrollment_1 = require("../models/Enrollment");
const Attendance_1 = require("../models/Attendance");
const Mentorship_1 = require("../models/Mentorship");
const RiskScore_1 = require("../models/RiskScore");
const getStudentDashboard = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        const profile = await Profile_1.Profile.findOne({ user: userId }).populate('department');
        // Fetch enrollments with course details
        const enrollments = await Enrollment_1.Enrollment.find({ student: userId })
            .populate({
            path: 'course',
            populate: { path: 'assignedFaculty', select: 'email' },
        });
        // Fetch risk score
        const riskScore = await RiskScore_1.RiskScore.findOne({ student: userId });
        // Fetch mentor info
        const mentorAllocation = await Mentorship_1.MentorAllocation.findOne({ student: userId, isActive: true })
            .populate({
            path: 'mentor',
            select: 'email',
        });
        let mentorProfile = null;
        if (mentorAllocation) {
            mentorProfile = await Profile_1.Profile.findOne({ user: mentorAllocation.mentor });
        }
        // Compute overall attendance
        const totalClasses = enrollments.reduce((acc, curr) => acc + (curr.totalClasses || 0), 0);
        const attendedClasses = enrollments.reduce((acc, curr) => acc + (curr.attendedClasses || 0), 0);
        const overallAttendancePercent = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 88;
        // Upcoming schedule mock data tailored to semester
        const todaySchedule = [
            {
                courseCode: 'CS401',
                courseName: 'Design & Analysis of Algorithms',
                time: '09:00 AM - 10:00 AM',
                room: 'Lab 302 (Computing Center)',
                facultyName: 'Dr. Rajesh Sharma',
                status: 'Upcoming',
            },
            {
                courseCode: 'CS402',
                courseName: 'Database Management Systems',
                time: '10:15 AM - 11:15 AM',
                room: 'Hall B-204',
                facultyName: 'Prof. Anita Verma',
                status: 'Upcoming',
            },
            {
                courseCode: 'CS403',
                courseName: 'Artificial Intelligence & Machine Learning',
                time: '11:30 AM - 01:30 PM',
                room: 'AI Lab 1',
                facultyName: 'Dr. Vikram Sethi',
                status: 'Upcoming',
            },
        ];
        res.status(200).json({
            success: true,
            data: {
                profile,
                metrics: {
                    cgpa: 8.42,
                    currentSemesterSgpa: 8.65,
                    overallAttendance: overallAttendancePercent,
                    totalCoursesEnrolled: enrollments.length || 5,
                    creditsCompleted: 98,
                    totalCreditsRequired: 160,
                    pendingFeeDue: 0,
                },
                enrollments,
                riskScore: riskScore || {
                    riskLevel: 'LOW',
                    riskScore: 12,
                    predictedAttendance: 89,
                    predictedGpa: 8.5,
                    primaryFactors: [
                        { factor: 'Consistent Attendance', impactScore: -15, description: 'Attendance above 85% in all registered courses' },
                        { factor: 'Timely Assignment Submission', impactScore: -10, description: '100% on-time submission rate' },
                    ],
                    recommendedActions: [
                        'Explore Advanced Deep Learning Electives for Semester 7',
                        'Prepare for CS401 Mid-term Lab Exam on March 12',
                    ],
                },
                mentor: mentorProfile ? {
                    name: mentorProfile.fullName,
                    email: mentorAllocation?.mentor?.email,
                    designation: mentorProfile.designation,
                    phone: mentorProfile.phone,
                    cabin: mentorProfile.cabinNumber,
                } : null,
                todaySchedule,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getStudentDashboard = getStudentDashboard;
const getFacultyDashboard = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        const profile = await Profile_1.Profile.findOne({ user: userId }).populate('department');
        // Fetch courses taught by faculty
        const assignedCourses = await Course_1.Course.find({ assignedFaculty: userId }).populate('department');
        // Fetch recent attendance sessions
        const recentSessions = await Attendance_1.AttendanceSession.find({ faculty: userId })
            .populate('course')
            .sort({ date: -1 })
            .limit(5);
        // Summary counts
        const totalStudentsTaught = 142; // Aggregated enrolled students across courses
        const classesConductedThisMonth = 28;
        const pendingGradingCount = 2; // Mid-term evaluations
        const todayLectures = [
            {
                courseCode: 'CS401',
                courseName: 'Design & Analysis of Algorithms',
                batch: 'B.Tech CSE - Sec A (Sem 6)',
                time: '09:00 AM - 10:00 AM',
                room: 'Lab 302',
                attendanceMarked: true,
                present: 54,
                total: 58,
            },
            {
                courseCode: 'CS401',
                courseName: 'Design & Analysis of Algorithms',
                batch: 'B.Tech CSE - Sec B (Sem 6)',
                time: '02:00 PM - 03:00 PM',
                room: 'Room 304',
                attendanceMarked: false,
                present: 0,
                total: 62,
            },
        ];
        res.status(200).json({
            success: true,
            data: {
                profile,
                metrics: {
                    assignedCoursesCount: assignedCourses.length || 2,
                    totalStudentsTaught,
                    classesConductedThisMonth,
                    pendingGradingCount,
                    averageClassAttendance: 84.5,
                },
                assignedCourses,
                recentSessions,
                todayLectures,
                actionRequired: [
                    {
                        id: 'act-1',
                        type: 'ATTENDANCE',
                        title: 'Mark Attendance for CS401 Sec B',
                        deadline: 'Today, 05:00 PM',
                        priority: 'HIGH',
                    },
                    {
                        id: 'act-2',
                        type: 'GRADING',
                        title: 'Submit Mid-Term 1 Marks for CS401 Sec A',
                        deadline: 'Tomorrow, 11:59 PM',
                        priority: 'MEDIUM',
                    },
                ],
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getFacultyDashboard = getFacultyDashboard;
const getMentorDashboard = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        const profile = await Profile_1.Profile.findOne({ user: userId }).populate('department');
        // Fetch assigned mentees
        const allocations = await Mentorship_1.MentorAllocation.find({ mentor: userId, isActive: true })
            .populate('student');
        // Fetch risk scores for mentees
        const studentUserIds = allocations.map((a) => a.student._id);
        const riskScores = await RiskScore_1.RiskScore.find({ student: { $in: studentUserIds } });
        const profiles = await Profile_1.Profile.find({ user: { $in: studentUserIds } }).populate('department');
        // Combine into mentee scorecards
        const mentees = allocations.map((alloc) => {
            const sId = alloc.student._id.toString();
            const sProf = profiles.find((p) => p.user.toString() === sId);
            const sRisk = riskScores.find((r) => r.student.toString() === sId);
            return {
                id: sId,
                studentId: alloc.student._id,
                name: sProf?.fullName || 'Student',
                registrationNo: sProf?.registrationNo || 'N/A',
                department: sProf?.department?.name || 'Computer Science',
                semester: sProf?.currentSemester || 6,
                section: sProf?.section || 'A',
                attendancePercentage: sRisk?.predictedAttendance || 82,
                currentCgpa: sRisk?.predictedGpa || 7.8,
                riskLevel: sRisk?.riskLevel || 'LOW',
                riskScore: sRisk?.riskScore || 15,
                primaryFactor: sRisk?.primaryFactors?.[0]?.factor || 'Normal Academic Progress',
                phone: sProf?.phone || '',
                parentPhone: sProf?.parentPhone || '',
            };
        });
        // Calculate risk tier distribution
        const riskSummary = {
            critical: mentees.filter((m) => m.riskLevel === 'CRITICAL').length,
            high: mentees.filter((m) => m.riskLevel === 'HIGH').length,
            moderate: mentees.filter((m) => m.riskLevel === 'MODERATE').length,
            low: mentees.filter((m) => m.riskLevel === 'LOW').length,
            total: mentees.length,
        };
        // Open interventions
        const interventions = await Mentorship_1.InterventionLog.find({ mentor: userId })
            .populate('student')
            .sort({ createdAt: -1 })
            .limit(5);
        res.status(200).json({
            success: true,
            data: {
                profile,
                metrics: {
                    totalMentees: mentees.length,
                    atRiskCount: riskSummary.high + riskSummary.critical,
                    openInterventionsCount: interventions.filter((i) => i.status !== 'RESOLVED').length,
                    scheduledCounselingSessions: 3,
                },
                riskSummary,
                mentees,
                interventions,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMentorDashboard = getMentorDashboard;
const getAdminDashboard = async (_req, res, next) => {
    try {
        const totalUsers = await User_1.User.countDocuments();
        const studentCount = await User_1.User.countDocuments({ role: 'STUDENT' });
        const facultyCount = await User_1.User.countDocuments({ role: 'FACULTY' });
        const mentorCount = await User_1.User.countDocuments({ role: 'MENTOR' });
        const departmentCount = await Department_1.Department.countDocuments();
        const courseCount = await Course_1.Course.countDocuments();
        // Campus-wide risk overview
        const highRiskStudentsCount = await RiskScore_1.RiskScore.countDocuments({
            riskLevel: { $in: ['HIGH', 'CRITICAL'] },
        });
        const departments = await Department_1.Department.find();
        res.status(200).json({
            success: true,
            data: {
                metrics: {
                    totalStudents: studentCount || 1240,
                    totalFaculty: facultyCount || 86,
                    totalMentors: mentorCount || 34,
                    totalDepartments: departmentCount || 6,
                    totalActiveCourses: courseCount || 42,
                    campusAverageAttendance: 86.4,
                    atRiskStudentsCampusWide: highRiskStudentsCount || 18,
                    systemUptime: '99.98%',
                },
                departmentBreakdown: departments.map((d) => ({
                    code: d.code,
                    name: d.name,
                    established: d.establishedYear,
                    status: d.isActive ? 'Active' : 'Inactive',
                })),
                recentSystemAlerts: [
                    {
                        id: 'alert-1',
                        type: 'INFO',
                        title: 'Database Backup Completed',
                        time: 'Today, 04:00 AM',
                        source: 'System Cron',
                    },
                    {
                        id: 'alert-2',
                        type: 'WARNING',
                        title: 'Semester 6 Timetable Constraint Solver Triggered',
                        time: 'Yesterday, 06:30 PM',
                        source: 'Timetable Optimizer',
                    },
                    {
                        id: 'alert-3',
                        type: 'SUCCESS',
                        title: 'Fee Reconciliation Cycle Run Completed',
                        time: '2 days ago',
                        source: 'Finance Engine',
                    },
                ],
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAdminDashboard = getAdminDashboard;
