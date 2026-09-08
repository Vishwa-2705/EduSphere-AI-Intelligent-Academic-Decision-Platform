"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminFeeOverview = exports.payFeeOnline = exports.getMyFeeInvoice = void 0;
const Fee_1 = require("../models/Fee");
const Profile_1 = require("../models/Profile");
const getStudentFeeConfig = (profile) => {
    const registrationNo = profile?.registrationNo || '22CS084';
    if (profile?.studentType === 'DAY_SCHOLAR') {
        return {
            tuitionFee: 46000,
            laboratoryFee: 12500,
            hostelFee: 0,
            busFee: 6000,
            libraryFee: 3500,
            totalAmount: 62000,
            paidAmount: 62000,
            balanceAmount: 0,
            status: 'PAID',
            paymentMethod: 'ONLINE_UPI',
            transactionId: 'TXN-EDU-973442',
        };
    }
    if (registrationNo.includes('22EC')) {
        return {
            tuitionFee: 47000,
            laboratoryFee: 13500,
            hostelFee: 24000,
            busFee: 0,
            libraryFee: 4200,
            totalAmount: 88700,
            paidAmount: 88700,
            balanceAmount: 0,
            status: 'PAID',
            paymentMethod: 'NETBANKING',
            transactionId: 'TXN-EDU-952104',
        };
    }
    if (registrationNo.includes('22ME')) {
        return {
            tuitionFee: 43000,
            laboratoryFee: 11800,
            hostelFee: 26000,
            busFee: 0,
            libraryFee: 3600,
            totalAmount: 84400,
            paidAmount: 84400,
            balanceAmount: 0,
            status: 'PAID',
            paymentMethod: 'CARD',
            transactionId: 'TXN-EDU-912776',
        };
    }
    return {
        tuitionFee: 45000,
        laboratoryFee: 12000,
        hostelFee: 28000,
        busFee: 0,
        libraryFee: 3500,
        totalAmount: 88500,
        paidAmount: 88500,
        balanceAmount: 0,
        status: 'PAID',
        paymentMethod: 'ONLINE_UPI',
        transactionId: 'TXN-EDU-984511',
    };
};
const getMyFeeInvoice = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        const profile = await Profile_1.Profile.findOne({ user: userId }).populate('department');
        const feeConfig = getStudentFeeConfig(profile);
        let invoice = await Fee_1.FeeInvoice.findOne({ student: userId }).sort({ createdAt: -1 });
        // Auto-create sample invoice if none exists
        if (!invoice) {
            invoice = await Fee_1.FeeInvoice.create({
                student: userId,
                academicYear: '2025-2026',
                semester: profile?.currentSemester || 6,
                tuitionFee: feeConfig.tuitionFee,
                laboratoryFee: feeConfig.laboratoryFee,
                hostelFee: feeConfig.hostelFee,
                busFee: feeConfig.busFee,
                libraryFee: feeConfig.libraryFee,
                totalAmount: feeConfig.totalAmount,
                paidAmount: feeConfig.paidAmount,
                balanceAmount: feeConfig.balanceAmount,
                status: feeConfig.status,
                transactions: [
                    {
                        transactionId: feeConfig.transactionId,
                        amount: feeConfig.paidAmount,
                        paymentMethod: feeConfig.paymentMethod,
                        paidAt: new Date(),
                        receiptNumber: `REC-2026-${profile?.registrationNo || '22CS084'}-${Math.floor(1000 + Math.random() * 9000)}`,
                    },
                ],
            });
        }
        res.status(200).json({
            success: true,
            data: {
                student: {
                    fullName: profile?.fullName || 'Student',
                    registrationNo: profile?.registrationNo || '22CS084',
                    semester: profile?.currentSemester || 6,
                    department: profile?.department?.name || 'Computer Science & Engineering',
                },
                invoice,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMyFeeInvoice = getMyFeeInvoice;
const payFeeOnline = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        const { amount, paymentMethod } = req.body;
        const invoice = await Fee_1.FeeInvoice.findOne({ student: userId });
        if (!invoice) {
            res.status(404).json({ success: false, message: 'Fee invoice not found' });
            return;
        }
        const payAmount = Number(amount) || invoice.balanceAmount;
        const newPaid = invoice.paidAmount + payAmount;
        const newBalance = Math.max(0, invoice.totalAmount - newPaid);
        const receiptNo = `REC-2026-${Math.floor(10000 + Math.random() * 90000)}`;
        const txnId = `TXN-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
        invoice.paidAmount = newPaid;
        invoice.balanceAmount = newBalance;
        invoice.status = newBalance === 0 ? 'PAID' : 'PARTIAL';
        invoice.transactions.push({
            transactionId: txnId,
            amount: payAmount,
            paymentMethod: paymentMethod || 'ONLINE_UPI',
            paidAt: new Date(),
            receiptNumber: receiptNo,
        });
        await invoice.save();
        res.status(200).json({
            success: true,
            message: `Payment of ₹${payAmount.toLocaleString()} processed successfully`,
            data: {
                receiptNumber: receiptNo,
                transactionId: txnId,
                invoice,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.payFeeOnline = payFeeOnline;
const getAdminFeeOverview = async (_req, res, next) => {
    try {
        const invoices = await Fee_1.FeeInvoice.find().populate('student');
        const profiles = await Profile_1.Profile.find();
        const totalExpected = invoices.reduce((acc, curr) => acc + curr.totalAmount, 0) || 1240 * 88500;
        const totalCollected = invoices.reduce((acc, curr) => acc + curr.paidAmount, 0) || Math.round(totalExpected * 0.948);
        const totalOutstanding = totalExpected - totalCollected;
        const reconciliationRate = totalExpected > 0 ? Number(((totalCollected / totalExpected) * 100).toFixed(1)) : 94.8;
        const recentInvoices = invoices.map((inv) => {
            const sId = inv.student?._id?.toString();
            const prof = profiles.find((p) => p.user?.toString() === sId);
            return {
                id: inv._id,
                studentName: prof?.fullName || 'Enrolled Student',
                registrationNo: prof?.registrationNo || 'N/A',
                totalAmount: inv.totalAmount,
                paidAmount: inv.paidAmount,
                balanceAmount: inv.balanceAmount,
                status: inv.status,
                dueDate: inv.dueDate,
                recentReceipt: inv.transactions?.[inv.transactions.length - 1]?.receiptNumber || 'REC-AUTO-01',
            };
        });
        res.status(200).json({
            success: true,
            data: {
                metrics: {
                    totalExpected: `₹${(totalExpected / 10000000).toFixed(2)} Cr`,
                    totalCollected: `₹${(totalCollected / 10000000).toFixed(2)} Cr`,
                    totalOutstanding: `₹${(totalOutstanding / 100000).toFixed(2)} Lakhs`,
                    reconciliationRate: `${reconciliationRate}%`,
                },
                invoices: recentInvoices,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAdminFeeOverview = getAdminFeeOverview;
