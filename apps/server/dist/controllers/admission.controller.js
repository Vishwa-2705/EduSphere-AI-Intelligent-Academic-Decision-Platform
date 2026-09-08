"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.provisionStudentFromAdmission = exports.updateApplicationStatus = exports.getAdmissionApplications = void 0;
const Admission_1 = require("../models/Admission");
const User_1 = require("../models/User");
const Profile_1 = require("../models/Profile");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const getAdmissionApplications = async (req, res, next) => {
    try {
        const { status, quota } = req.query;
        const filter = {};
        if (status)
            filter.status = status;
        if (quota)
            filter.allocatedQuota = quota;
        const applications = await Admission_1.AdmissionApplication.find(filter)
            .populate('department')
            .sort({ appliedDate: -1 });
        const totalApplications = await Admission_1.AdmissionApplication.countDocuments();
        const verifiedCount = await Admission_1.AdmissionApplication.countDocuments({ status: 'VERIFIED' });
        const admittedCount = await Admission_1.AdmissionApplication.countDocuments({ status: 'ADMITTED' });
        res.status(200).json({
            success: true,
            data: {
                metrics: {
                    totalApplications,
                    verifiedCount,
                    admittedCount,
                    seatsFilledPercentage: 92.5,
                },
                applications,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAdmissionApplications = getAdmissionApplications;
const updateApplicationStatus = async (req, res, next) => {
    try {
        const { applicationId } = req.params;
        const { status, documentsVerified, remarks } = req.body;
        const update = {};
        if (status)
            update.status = status;
        if (documentsVerified !== undefined)
            update.documentsVerified = documentsVerified;
        if (remarks)
            update.remarks = remarks;
        const app = await Admission_1.AdmissionApplication.findByIdAndUpdate(applicationId, update, { new: true });
        if (!app) {
            res.status(404).json({ success: false, message: 'Application not found' });
            return;
        }
        res.status(200).json({
            success: true,
            message: `Application ${app.applicationNumber} updated to ${app.status}`,
            data: app,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateApplicationStatus = updateApplicationStatus;
const provisionStudentFromAdmission = async (req, res, next) => {
    try {
        const { applicationId } = req.params;
        const app = await Admission_1.AdmissionApplication.findById(applicationId);
        if (!app) {
            res.status(404).json({ success: false, message: 'Application not found' });
            return;
        }
        if (app.provisionedStudentId) {
            res.status(400).json({ success: false, message: 'Student account already provisioned for this application' });
            return;
        }
        // Provision user
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash('Student@12345', salt);
        const user = await User_1.User.create({
            email: app.email,
            passwordHash,
            role: 'STUDENT',
            isActive: true,
        });
        const regNo = `26CS${Math.floor(100 + Math.random() * 900)}`;
        const names = app.candidateName.split(' ');
        await Profile_1.Profile.create({
            user: user._id,
            firstName: names[0] || app.candidateName,
            lastName: names.slice(1).join(' ') || '',
            registrationNo: regNo,
            phone: app.phone,
            department: app.department,
            batchYear: 2026,
            currentSemester: 1,
            section: 'A',
        });
        app.status = 'ADMITTED';
        app.provisionedStudentId = user._id;
        await app.save();
        res.status(201).json({
            success: true,
            message: `Student account provisioned successfully (${app.email} | Reg: ${regNo})`,
            data: {
                userId: user._id,
                registrationNo: regNo,
                email: app.email,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.provisionStudentFromAdmission = provisionStudentFromAdmission;
