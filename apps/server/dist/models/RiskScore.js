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
exports.RiskScore = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const RiskScoreSchema = new mongoose_1.Schema({
    student: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    semester: {
        type: Number,
        required: true,
        default: 6,
    },
    academicYear: {
        type: String,
        required: true,
        default: '2025-2026',
    },
    riskLevel: {
        type: String,
        enum: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'],
        default: 'LOW',
        index: true,
    },
    riskScore: {
        type: Number,
        default: 15,
        min: 0,
        max: 100,
    },
    predictedAttendance: {
        type: Number,
        default: 85,
    },
    predictedGpa: {
        type: Number,
        default: 8.2,
    },
    primaryFactors: [
        {
            factor: { type: String, required: true },
            impactScore: { type: Number, default: 0 },
            description: { type: String, default: '' },
        },
    ],
    recommendedActions: [{ type: String }],
    lastAssessedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});
RiskScoreSchema.index({ student: 1, semester: 1, academicYear: 1 }, { unique: true });
exports.RiskScore = mongoose_1.default.model('RiskScore', RiskScoreSchema);
