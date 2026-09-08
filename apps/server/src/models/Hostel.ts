import mongoose, { Document, Schema } from 'mongoose';

export interface IHostelRoom extends Document {
  blockName: string; // 'Block 1 - Aryabhata', 'Block 2 - Ramanujan', etc.
  roomNumber: string;
  floor: number;
  capacity: number;
  currentOccupancy: number;
  type: 'AC' | 'NON_AC';
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
  annualFee: number;
  createdAt: Date;
  updatedAt: Date;
}

const HostelRoomSchema = new Schema<IHostelRoom>(
  {
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
  },
  {
    timestamps: true,
  }
);

HostelRoomSchema.index({ blockName: 1, roomNumber: 1 }, { unique: true });

export const HostelRoom = mongoose.model<IHostelRoom>('HostelRoom', HostelRoomSchema);

export interface IHostelAllocation extends Document {
  student: mongoose.Types.ObjectId;
  room: mongoose.Types.ObjectId;
  bedNumber: string;
  allocationDate: Date;
  academicYear: string;
  isActive: boolean;
  emergencyContact: string;
  createdAt: Date;
  updatedAt: Date;
}

const HostelAllocationSchema = new Schema<IHostelAllocation>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    room: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  }
);

export const HostelAllocation = mongoose.model<IHostelAllocation>(
  'HostelAllocation',
  HostelAllocationSchema
);
