"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadMaterial = exports.uploadMaterial = exports.getMaterials = void 0;
const StudyMaterial_1 = require("../models/StudyMaterial");
const Profile_1 = require("../models/Profile");
const getMaterials = async (req, res, next) => {
    try {
        const { courseId, search } = req.query;
        const filter = {};
        if (courseId)
            filter.course = courseId;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }
        const materials = await StudyMaterial_1.StudyMaterial.find(filter)
            .populate('course')
            .populate('uploadedBy', 'email')
            .sort({ createdAt: -1 });
        const formatted = await Promise.all(materials.map(async (m) => {
            const uId = m.uploadedBy?._id;
            const prof = await Profile_1.Profile.findOne({ user: uId });
            return {
                id: m._id,
                courseId: m.course?._id,
                courseCode: m.course?.code,
                courseTitle: m.course?.title,
                title: m.title,
                description: m.description,
                unitNumber: m.unitNumber,
                fileUrl: m.fileUrl,
                fileSize: `${(m.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB`,
                fileType: m.fileType,
                uploadedBy: prof?.fullName || 'Faculty Member',
                downloadCount: m.downloadCount,
                createdAt: m.createdAt,
            };
        }));
        res.status(200).json({
            success: true,
            data: formatted,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMaterials = getMaterials;
const uploadMaterial = async (req, res, next) => {
    try {
        const facultyId = req.user?.userId;
        const { courseId, title, description, unitNumber, fileUrl, fileType, fileSizeBytes } = req.body;
        if (!courseId || !title || !unitNumber) {
            res.status(400).json({ success: false, message: 'courseId, title, and unitNumber are required' });
            return;
        }
        const material = await StudyMaterial_1.StudyMaterial.create({
            course: courseId,
            title,
            description: description || '',
            unitNumber: Number(unitNumber),
            fileUrl: fileUrl || '/materials/cs401-dynamic-programming.pdf',
            fileSizeBytes: fileSizeBytes || 3400000,
            fileType: fileType || 'PDF',
            uploadedBy: facultyId,
        });
        res.status(201).json({
            success: true,
            message: 'Study material uploaded successfully',
            data: material,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.uploadMaterial = uploadMaterial;
const downloadMaterial = async (req, res, next) => {
    try {
        const { materialId } = req.params;
        const material = await StudyMaterial_1.StudyMaterial.findByIdAndUpdate(materialId, { $inc: { downloadCount: 1 } }, { new: true });
        if (!material) {
            res.status(404).json({ success: false, message: 'Material not found' });
            return;
        }
        res.status(200).json({
            success: true,
            data: {
                fileUrl: material.fileUrl,
                title: material.title,
                downloadCount: material.downloadCount,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.downloadMaterial = downloadMaterial;
