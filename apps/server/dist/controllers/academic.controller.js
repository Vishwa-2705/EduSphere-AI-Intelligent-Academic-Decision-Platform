"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCourses = exports.getDepartments = void 0;
const Department_1 = require("../models/Department");
const Course_1 = require("../models/Course");
const getDepartments = async (_req, res, next) => {
    try {
        const departments = await Department_1.Department.find({ isActive: true }).populate('headOfDepartment', 'email');
        res.status(200).json({
            success: true,
            data: departments,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getDepartments = getDepartments;
const getCourses = async (req, res, next) => {
    try {
        const { departmentId, semester } = req.query;
        const filter = { isActive: true };
        if (departmentId)
            filter.department = departmentId;
        if (semester)
            filter.semester = Number(semester);
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
