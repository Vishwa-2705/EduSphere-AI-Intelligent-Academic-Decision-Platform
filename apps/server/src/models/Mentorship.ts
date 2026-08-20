import mongoose, { Document, Schema } from 'mongoose';

export interface IMentorAllocation extends Document {
  mentor: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  assignedDate: Date;
  isActive: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MentorAllocationSchema = new Schema<IMentorAllocation>(
  {
    mentor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    student: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  }
);

export const MentorAllocation = mongoose.model<IMentorAllocation>(
  'MentorAllocation',
  MentorAllocationSchema
);

export interface IInterventionLog extends Document {
  mentor: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  concernType: 'ATTENDANCE_DROP' | 'GRADE_DEFICIT' | 'BEHAVIORAL' | 'COUNSELING';
  title: string;
  notes: string;
  actionPlan: string;
  targetDate?: Date;
  parentNotified: boolean;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: Date;
  updatedAt: Date;
}

const InterventionLogSchema = new Schema<IInterventionLog>(
  {
    mentor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    student: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  }
);

export const InterventionLog = mongoose.model<IInterventionLog>(
  'InterventionLog',
  InterventionLogSchema
);
