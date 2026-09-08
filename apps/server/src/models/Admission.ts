import mongoose, { Document, Schema } from 'mongoose';

export type AdmissionStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'VERIFIED' | 'ADMITTED' | 'REJECTED';
export type AdmissionQuota = 'GENERAL' | 'OBC' | 'SC' | 'ST' | 'MERIT' | 'MANAGEMENT' | 'SPORTS' | 'DEFENCE' | 'EWS';

export interface IAdmissionApplication extends Document {
  applicationNumber: string;
  candidateName: string;
  email: string;
  phone: string;
  dateOfBirth?: Date;
  gender?: string;
  department: mongoose.Types.ObjectId;
  appliedBranch?: string;
  program: string;
  entranceExam?: string;
  entranceScore: number;
  qualifyingMarksPercentage: number;
  allocatedQuota: AdmissionQuota;
  status: AdmissionStatus;
  documentsVerified: boolean;
  provisionedStudentId?: mongoose.Types.ObjectId;
  remarks?: string;
  appliedDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdmissionSchema = new Schema<IAdmissionApplication>(
  {
    applicationNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    candidateName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['MALE', 'FEMALE', 'OTHER'],
      default: 'MALE',
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    appliedBranch: {
      type: String,
      default: 'CSE',
    },
    program: {
      type: String,
      default: 'B.Tech in Computer Science & Engineering',
    },
    entranceExam: {
      type: String,
      enum: ['JEE_MAIN', 'JEE_ADVANCED', 'KCET', 'MHT_CET', 'COMEDK', 'OTHER'],
      default: 'JEE_MAIN',
    },
    entranceScore: {
      type: Number,
      required: true,
    },
    qualifyingMarksPercentage: {
      type: Number,
      required: true,
    },
    allocatedQuota: {
      type: String,
      enum: ['GENERAL', 'OBC', 'SC', 'ST', 'MERIT', 'MANAGEMENT', 'SPORTS', 'DEFENCE', 'EWS'],
      default: 'GENERAL',
    },
    status: {
      type: String,
      enum: ['SUBMITTED', 'UNDER_REVIEW', 'VERIFIED', 'ADMITTED', 'REJECTED'],
      default: 'UNDER_REVIEW',
    },
    documentsVerified: {
      type: Boolean,
      default: false,
    },
    provisionedStudentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    remarks: {
      type: String,
      default: '',
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const AdmissionApplication = mongoose.model<IAdmissionApplication>(
  'AdmissionApplication',
  AdmissionSchema
);
