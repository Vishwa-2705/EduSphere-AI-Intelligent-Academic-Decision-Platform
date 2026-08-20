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
exports.InterventionLog = exports.MentorAllocation = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const MentorAllocationSchema = new mongoose_1.Schema({
    mentor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    student: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        index: true,
    },
    assignedDate: {
        type: Date,
        default: Date.now,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    notes: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});
exports.MentorAllocation = mongoose_1.default.model('MentorAllocation', MentorAllocationSchema);
const InterventionLogSchema = new mongoose_1.Schema({
    mentor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    student: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    concernType: {
        type: String,
        enum: ['ATTENDANCE_DROP', 'GRADE_DEFICIT', 'BEHAVIORAL', 'COUNSELING'],
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
        required: true,
    },
    actionPlan: {
        type: String,
        default: '',
    },
    targetDate: {
        type: Date,
        default: null,
    },
    parentNotified: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED'],
        default: 'OPEN',
    },
}, {
    timestamps: true,
});
exports.InterventionLog = mongoose_1.default.model('InterventionLog', InterventionLogSchema);
