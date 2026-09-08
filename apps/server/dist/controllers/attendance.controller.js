"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttendanceAlerts = exports.createAttendanceSession = exports.getCourseAttendance = exports.getMyAttendance = void 0;
const Attendance_1 = require("../models/Attendance");
const Enrollment_1 = require("../models/Enrollment");
const Course_1 = require("../models/Course");
const Profile_1 = require("../models/Profile");
const User_1 = require("../models/User");
const Mentorship_1 = require("../models/Mentorship");
const getMyAttendance = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        const enrollments = await Enrollment_1.Enrollment.find({ student: userId, status: 'ENROLLED' })
            .populate({
            path: 'course',
            populate: { path: 'assignedFaculty', select: 'email' },
        });
        // Fetch individual attendance history records
        const recentRecords = await Attendance_1.AttendanceRecord.find({ student: userId })
            .populate('course')
            .populate('session')
            .sort({ date: -1 })
            .limit(20);
        const summary = enrollments.map((en) => {
            const course = en.course;
            const attended = en.attendedClasses || 0;
            const total = en.totalClasses || 0;
            const pct = en.attendancePercentage || (total > 0 ? Math.round((attended / total) * 100) : 0);
            const isEligible = pct >= 75;
            return {
                enrollmentId: en._id,
                courseId: course?._id,
                courseCode: course?.code,
                courseTitle: course?.title,
                credits: course?.credits,
                attendedClasses: attended,
                totalClasses: total,
                attendancePercentage: pct,
                isEligibleForExam: isEligible,
                status: isEligible ? 'ELIGIBLE' : 'SHORTAGE',
            };
        });
        const totalAttended = enrollments.reduce((acc, curr) => acc + (curr.attendedClasses || 0), 0);
        const totalClasses = enrollments.reduce((acc, curr) => acc + (curr.totalClasses || 0), 0);
        const overallPercentage = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 88;
        res.status(200).json({
            success: true,
            data: {
                overallPercentage,
                totalAttended,
                totalClasses,
                statutoryThreshold: 75,
                isOverallEligible: overallPercentage >= 75,
                courseBreakdown: summary,
                recentRecords: recentRecords.map((r) => ({
                    recordId: r._id,
                    courseCode: r.course?.code,
                    courseTitle: r.course?.title,
                    date: r.date,
                    status: r.status,
                    slotTime: r.session?.slotTime || '09:00 AM - 10:00 AM',
                    topicCovered: r.session?.topicCovered || '',
                    remarks: r.remarks,
                })),
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMyAttendance = getMyAttendance;
const getCourseAttendance = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const course = await Course_1.Course.findById(courseId).populate('assignedFaculty', 'email');
        if (!course) {
            res.status(404).json({ success: false, message: 'Course not found' });
            return;
        }
        const enrollments = await Enrollment_1.Enrollment.find({ course: courseId, status: 'ENROLLED' })
            .populate('student');
        const studentIds = enrollments.map((e) => e.student._id);
        const profiles = await Profile_1.Profile.find({ user: { $in: studentIds } });
        const studentRoster = enrollments.map((en) => {
            const sId = en.student._id.toString();
            const prof = profiles.find((p) => p.user.toString() === sId);
            const attended = en.attendedClasses || 0;
            const total = en.totalClasses || 0;
            const pct = en.attendancePercentage || (total > 0 ? Math.round((attended / total) * 100) : 0);
            return {
                studentId: en.student._id,
                fullName: prof?.fullName || 'Student',
                registrationNo: prof?.registrationNo || 'N/A',
                section: prof?.section || 'A',
                attendedClasses: attended,
                totalClasses: total,
                attendancePercentage: pct,
                isShortage: pct < 75,
            };
        });
        const sessions = await Attendance_1.AttendanceSession.find({ course: courseId }).sort({ date: -1 }).limit(10);
        res.status(200).json({
            success: true,
            data: {
                course: {
                    id: course._id,
                    code: course.code,
                    title: course.title,
                },
                enrolledCount: enrollments.length,
                shortageCount: studentRoster.filter((s) => s.isShortage).length,
                studentRoster,
                recentSessions: sessions,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getCourseAttendance = getCourseAttendance;
const createAttendanceSession = async (req, res, next) => {
    try {
        const facultyId = req.user?.userId;
        const { courseId, date, slotTime, topicCovered, records } = req.body;
        if (!courseId || !records || !Array.isArray(records)) {
            res.status(400).json({ success: false, message: 'courseId and records array are required' });
            return;
        }
        const presentCount = records.filter((r) => r.status === 'PRESENT' || r.status === 'LATE').length;
        const absentCount = records.filter((r) => r.status === 'ABSENT').length;
        const session = await Attendance_1.AttendanceSession.create({
            course: courseId,
            faculty: facultyId,
            date: date ? new Date(date) : new Date(),
            slotTime: slotTime || '09:00 AM - 10:00 AM',
            topicCovered: topicCovered || 'Regular Lecture Session',
            totalStudents: records.length,
            presentCount,
            absentCount,
        });
        // Create records and recalculate Enrollment statistics
        await Promise.all(records.map(async (rec) => {
            await Attendance_1.AttendanceRecord.create({
                session: session._id,
                course: courseId,
                student: rec.studentId,
                date: session.date,
                status: rec.status,
                remarks: rec.remarks || '',
            });
            // Update enrollment
            const enrollment = await Enrollment_1.Enrollment.findOne({ course: courseId, student: rec.studentId });
            if (enrollment) {
                enrollment.totalClasses = (enrollment.totalClasses || 0) + 1;
                if (rec.status === 'PRESENT' || rec.status === 'LATE') {
                    enrollment.attendedClasses = (enrollment.attendedClasses || 0) + 1;
                }
                enrollment.attendancePercentage = Math.round((enrollment.attendedClasses / enrollment.totalClasses) * 100);
                await enrollment.save();
            }
        }));
        res.status(201).json({
            success: true,
            message: `Roll-call attendance recorded successfully (${presentCount}/${records.length} Present)`,
            data: session,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createAttendanceSession = createAttendanceSession;
const getAttendanceAlerts = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        const role = req.user?.role;
        let studentIds = [];
        if (role === 'MENTOR') {
            const allocations = await Mentorship_1.MentorAllocation.find({ mentor: userId, isActive: true });
            studentIds = allocations.map((a) => a.student);
        }
        else {
            const allStudents = await User_1.User.find({ role: 'STUDENT' });
            studentIds = allStudents.map((s) => s._id);
        }
        const shortageEnrollments = await Enrollment_1.Enrollment.find({
            student: { $in: studentIds },
            attendancePercentage: { $lt: 75 },
            status: 'ENROLLED',
        }).populate('course').populate('student');
        const profiles = await Profile_1.Profile.find({ user: { $in: studentIds } });
        const alerts = shortageEnrollments.map((en) => {
            const sId = en.student?._id?.toString();
            const prof = profiles.find((p) => p.user.toString() === sId);
            const course = en.course;
            return {
                studentId: en.student?._id,
                fullName: prof?.fullName || 'Student',
                registrationNo: prof?.registrationNo || 'N/A',
                phone: prof?.phone,
                parentPhone: prof?.parentPhone,
                courseCode: course?.code,
                courseTitle: course?.title,
                attendancePercentage: en.attendancePercentage,
                attendedClasses: en.attendedClasses,
                totalClasses: en.totalClasses,
                deficitClasses: Math.ceil((0.75 * en.totalClasses - en.attendedClasses) / 0.25) || 3,
                severity: en.attendancePercentage < 60 ? 'CRITICAL' : 'BORDERLINE',
            };
        });
        res.status(200).json({
            success: true,
            data: {
                totalAlerts: alerts.length,
                criticalCount: alerts.filter((a) => a.severity === 'CRITICAL').length,
                borderlineCount: alerts.filter((a) => a.severity === 'BORDERLINE').length,
                alerts,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAttendanceAlerts = getAttendanceAlerts;
