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
exports.FeeInvoice = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const FeeInvoiceSchema = new mongoose_1.Schema({
    student: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    academicYear: {
        type: String,
        required: true,
        default: '2025-2026',
    },
    semester: {
        type: Number,
        required: true,
        default: 6,
    },
    tuitionFee: {
        type: Number,
        required: true,
        default: 45000,
    },
    laboratoryFee: {
        type: Number,
        default: 12000,
    },
    hostelFee: {
        type: Number,
        default: 28000,
    },
    busFee: {
        type: Number,
        default: 0,
    },
    libraryFee: {
        type: Number,
        default: 3500,
    },
    totalAmount: {
        type: Number,
        required: true,
        default: 88500,
    },
    paidAmount: {
        type: Number,
        default: 0,
    },
    balanceAmount: {
        type: Number,
        default: 88500,
    },
    dueDate: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    status: {
        type: String,
        enum: ['PAID', 'PARTIAL', 'OVERDUE', 'PENDING'],
        default: 'PENDING',
    },
    transactions: [
        {
            transactionId: { type: String, required: true },
            amount: { type: Number, required: true },
            paymentMethod: { type: String, enum: ['ONLINE_UPI', 'NET_BANKING', 'CREDIT_CARD', 'DEMAND_DRAFT'], default: 'ONLINE_UPI' },
            paidAt: { type: Date, default: Date.now },
            receiptNumber: { type: String, required: true },
        },
    ],
}, {
    timestamps: true,
});
exports.FeeInvoice = mongoose_1.default.model('FeeInvoice', FeeInvoiceSchema);
