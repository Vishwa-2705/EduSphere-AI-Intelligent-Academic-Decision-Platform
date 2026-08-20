"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.GradeEntry = exports.Exam = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ExamSchema = new mongoose_1.Schema({
    course: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
        index: true,
    },
    examType: {
        type: String,
        enum: ['INTERNAL_1', 'INTERNAL_2', 'MID_TERM', 'SEMESTER_FINAL', 'LAB_PRACTICAL'],
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    maxMarks: {
        type: Number,
        required: true,
        default: 100,
    },
    weightagePercent: {
        type: Number,
        required: true,
        default: 25,
    },
    examDate: {
        type: Date,
        required: true,
    },
    durationMinutes: {
        type: Number,
        default: 180,
    },
    room: {
        type: String,
        default: '',
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
exports.Exam = mongoose_1.default.model('Exam', ExamSchema);
const GradeEntrySchema = new mongoose_1.Schema({
    exam: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Exam',
        required: true,
        index: true,
    },
    course: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
        index: true,
    },
    student: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    marksObtained: {
        type: Number,
        required: true,
    },
    percentage: {
        type: Number,
        required: true,
    },
    gradeLetter: {
        type: String,
        required: true,
        default: 'P',
    },
    feedback: {
        type: String,
        default: '',
    },
    gradedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});
GradeEntrySchema.index({ exam: 1, student: 1 }, { unique: true });
exports.GradeEntry = mongoose_1.default.model('GradeEntry', GradeEntrySchema);
