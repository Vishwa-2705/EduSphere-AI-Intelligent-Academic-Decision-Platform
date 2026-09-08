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
exports.MaintenanceTicket = exports.InfrastructureDevice = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const InfrastructureDeviceSchema = new mongoose_1.Schema({
    deviceName: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['WIFI', 'POWER', 'WATER', 'LAB_HARDWARE', 'SECURITY'],
        required: true,
        index: true,
    },
    location: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['OPERATIONAL', 'WARNING', 'CRITICAL', 'MAINTENANCE'],
        default: 'OPERATIONAL',
    },
    telemetryValue: {
        type: Number,
        required: true,
        default: 100,
    },
    metricUnit: {
        type: String,
        default: '%',
    },
    lastPing: {
        type: Date,
        default: Date.now,
    },
    ipAddress: {
        type: String,
        default: '192.168.1.1',
    },
}, {
    timestamps: true,
});
exports.InfrastructureDevice = mongoose_1.default.model('InfrastructureDevice', InfrastructureDeviceSchema);
const MaintenanceTicketSchema = new mongoose_1.Schema({
    ticketNumber: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    reportedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['WIFI', 'ELECTRICAL', 'PLUMBING', 'CIVIL', 'HVAC'],
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    priority: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
        default: 'MEDIUM',
    },
    status: {
        type: String,
        enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED'],
        default: 'OPEN',
    },
    assignedTechnician: {
        type: String,
        default: 'Campus Facility Engineer',
    },
    description: {
        type: String,
        default: '',
    },
    resolvedAt: {
        type: Date,
    },
}, {
    timestamps: true,
});
exports.MaintenanceTicket = mongoose_1.default.model('MaintenanceTicket', MaintenanceTicketSchema);
