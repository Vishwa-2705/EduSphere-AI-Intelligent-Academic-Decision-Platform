"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyCourses = exports.createCourse = exports.getCourseById = exports.getCourses = exports.createDepartment = exports.getDepartments = void 0;
const Department_1 = require("../models/Department");
const Course_1 = require("../models/Course");
const Enrollment_1 = require("../models/Enrollment");
const Profile_1 = require("../models/Profile");
const getDepartments = async (_req, res, next) => {
    try {
        const departments = await Department_1.Department.find({ isActive: true }).populate('headOfDepartment', 'email');
        // Fetch stats for each department
        const deptWithStats = await Promise.all(departments.map(async (d) => {
            const studentCount = await Profile_1.Profile.countDocuments({ department: d._id });
            const courseCount = await Course_1.Course.countDocuments({ department: d._id });
            return {
                _id: d._id,
                code: d.code,
                name: d.name,
                establishedYear: d.establishedYear,
                isActive: d.isActive,
                studentCount,
                courseCount,
            };
        }));
        res.status(200).json({
            success: true,
            data: deptWithStats,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getDepartments = getDepartments;
const createDepartment = async (req, res, next) => {
    try {
        const { code, name, establishedYear } = req.body;
        if (!code || !name) {
            res.status(400).json({ success: false, message: 'Department code and name are required' });
            return;
        }
        const existing = await Department_1.Department.findOne({ code: code.toUpperCase() });
        if (existing) {
            res.status(400).json({ success: false, message: 'Department code already exists' });
            return;
        }
        const department = await Department_1.Department.create({
            code: code.toUpperCase(),
            name,
            establishedYear: establishedYear || new Date().getFullYear(),
            isActive: true,
        });
        res.status(201).json({
            success: true,
            message: 'Department created successfully',
            data: department,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createDepartment = createDepartment;
const getCourses = async (req, res, next) => {
    try {
        const { departmentId, semester, search } = req.query;
        const filter = { isActive: true };
        if (departmentId)
            filter.department = departmentId;
        if (semester)
            filter.semester = Number(semester);
        if (search) {
            filter.$or = [
                { code: { $regex: search, $options: 'i' } },
                { title: { $regex: search, $options: 'i' } },
            ];
        }
        const courses = await Course_1.Course.find(filter)
            .populate('department')
            .populate('assignedFaculty', 'email');
        res.status(200).json({
            success: true,
            data: courses,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getCourses = getCourses;
const getCourseById = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const course = await Course_1.Course.findById(courseId)
            .populate('department')
            .populate('assignedFaculty', 'email');
        if (!course) {
            res.status(404).json({ success: false, message: 'Course not found' });
            return;
        }
        const enrollmentCount = await Enrollment_1.Enrollment.countDocuments({ course: course._id, status: 'ENROLLED' });
        res.status(200).json({
            success: true,
            data: {
                ...course.toObject(),
                enrolledStudentsCount: enrollmentCount,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getCourseById = getCourseById;
const createCourse = async (req, res, next) => {
    try {
        const { code, title, description, credits, semester, departmentId, facultyId, syllabusTopics } = req.body;
        if (!code || !title || !departmentId || !semester) {
            res.status(400).json({ success: false, message: 'Course code, title, department, and semester are required' });
            return;
        }
        const existing = await Course_1.Course.findOne({ code: code.toUpperCase() });
        if (existing) {
            res.status(400).json({ success: false, message: 'Course code already exists' });
            return;
        }
        const course = await Course_1.Course.create({
            code: code.toUpperCase(),
            title,
            description: description || '',
            credits: credits || 4,
            semester: Number(semester),
            department: departmentId,
            assignedFaculty: facultyId || null,
            syllabusTopics: syllabusTopics || [
                { unit: 1, title: 'Introduction & Foundations', hours: 8, topics: ['Overview', 'Fundamentals'] },
                { unit: 2, title: 'Core Theoretical Paradigms', hours: 10, topics: ['Methodologies', 'Architectures'] },
                { unit: 3, title: 'Applications & Case Studies', hours: 10, topics: ['Practical Design', 'System Integration'] },
                { unit: 4, title: 'Advanced Analysis & Future Trends', hours: 8, topics: ['Performance Evaluation', 'Research Frontiers'] },
            ],
            isActive: true,
        });
        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            data: course,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createCourse = createCourse;
const getMyCourses = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        const role = req.user?.role;
        if (role === 'STUDENT') {
            const enrollments = await Enrollment_1.Enrollment.find({ student: userId, status: 'ENROLLED' })
                .populate({
                path: 'course',
                populate: [
                    { path: 'department' },
                    { path: 'assignedFaculty', select: 'email' },
                ],
            });
            // Get faculty profile info for each course
            const formatted = await Promise.all(enrollments.map(async (en) => {
                const course = en.course;
                let facultyProfile = null;
                if (course?.assignedFaculty?._id) {
                    facultyProfile = await Profile_1.Profile.findOne({ user: course.assignedFaculty._id });
                }
                return {
                    enrollmentId: en._id,
                    courseId: course?._id,
                    code: course?.code,
                    title: course?.title,
                    description: course?.description,
                    credits: course?.credits,
                    semester: course?.semester,
                    department: course?.department?.name || 'Computer Science',
                    facultyName: facultyProfile?.fullName || 'Dr. Rajesh Sharma',
                    facultyEmail: course?.assignedFaculty?.email || 'faculty@edusphere.ai',
                    attendancePercentage: en.attendancePercentage,
                    attendedClasses: en.attendedClasses,
                    totalClasses: en.totalClasses,
                    internalScore: en.internalScore,
                    syllabusTopics: course?.syllabusTopics || [],
                };
            }));
            res.status(200).json({
                success: true,
                data: formatted,
            });
            return;
        }
        if (role === 'FACULTY') {
            const courses = await Course_1.Course.find({ assignedFaculty: userId, isActive: true })
                .populate('department');
            const formatted = await Promise.all(courses.map(async (c) => {
                const studentCount = await Enrollment_1.Enrollment.countDocuments({ course: c._id, status: 'ENROLLED' });
                return {
                    courseId: c._id,
                    code: c.code,
                    title: c.title,
                    description: c.description,
                    credits: c.credits,
                    semester: c.semester,
                    department: c.department?.name || 'Computer Science',
                    enrolledStudentsCount: studentCount,
                    syllabusTopics: c.syllabusTopics || [],
                };
            }));
            res.status(200).json({
                success: true,
                data: formatted,
            });
            return;
        }
        // Default for Admin / Mentor
        const allCourses = await Course_1.Course.find({ isActive: true }).populate('department').populate('assignedFaculty', 'email');
        res.status(200).json({
            success: true,
            data: allCourses,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMyCourses = getMyCourses;
