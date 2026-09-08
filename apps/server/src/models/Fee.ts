import mongoose, { Document, Schema } from 'mongoose';

export type FeePaymentStatus = 'PAID' | 'PARTIAL' | 'OVERDUE' | 'PENDING';

export interface IFeeInvoice extends Document {
  student: mongoose.Types.ObjectId;
  academicYear: string;
  semester: number;
  tuitionFee: number;
  laboratoryFee: number;
  hostelFee: number;
  busFee: number;
  libraryFee: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  dueDate: Date;
  status: FeePaymentStatus;
  transactions: {
    transactionId: string;
    amount: number;
    paymentMethod: 'ONLINE_UPI' | 'NET_BANKING' | 'CREDIT_CARD' | 'DEMAND_DRAFT';
    paidAt: Date;
    receiptNumber: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const FeeInvoiceSchema = new Schema<IFeeInvoice>(
  {
    student: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  }
);

export const FeeInvoice = mongoose.model<IFeeInvoice>('FeeInvoice', FeeInvoiceSchema);
