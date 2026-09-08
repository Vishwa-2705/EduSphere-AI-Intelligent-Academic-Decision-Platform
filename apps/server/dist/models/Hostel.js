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
exports.HostelAllocation = exports.HostelRoom = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const HostelRoomSchema = new mongoose_1.Schema({
    blockName: {
        type: String,
        required: true,
        index: true,
    },
    roomNumber: {
        type: String,
        required: true,
    },
    floor: {
        type: Number,
        required: true,
        default: 1,
    },
    capacity: {
        type: Number,
        required: true,
        default: 2,
    },
    currentOccupancy: {
        type: Number,
        default: 0,
    },
    type: {
        type: String,
        enum: ['AC', 'NON_AC'],
        default: 'NON_AC',
    },
    status: {
        type: String,
        enum: ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE'],
        default: 'AVAILABLE',
    },
    annualFee: {
        type: Number,
        default: 28000,
    },
}, {
    timestamps: true,
});
HostelRoomSchema.index({ blockName: 1, roomNumber: 1 }, { unique: true });
exports.HostelRoom = mongoose_1.default.model('HostelRoom', HostelRoomSchema);
const HostelAllocationSchema = new mongoose_1.Schema({
    student: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        index: true,
    },
    room: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'HostelRoom',
        required: true,
        index: true,
    },
    bedNumber: {
        type: String,
        required: true,
        default: 'Bed-1',
    },
    allocationDate: {
        type: Date,
        default: Date.now,
    },
    academicYear: {
        type: String,
        default: '2025-2026',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    emergencyContact: {
        type: String,
        default: '+91 98111 22334',
    },
}, {
    timestamps: true,
});
exports.HostelAllocation = mongoose_1.default.model('HostelAllocation', HostelAllocationSchema);
