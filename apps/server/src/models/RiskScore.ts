import mongoose, { Document, Schema } from 'mongoose';

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface IRiskFactor {
  factor: string;
  impactScore: number;
  description: string;
}

export interface IRiskScore extends Document {
  student: mongoose.Types.ObjectId;
  semester: number;
  academicYear: string;
  riskLevel: RiskLevel;
  riskScore: number; // 0 to 100
  predictedAttendance: number;
  predictedGpa: number;
  primaryFactors: IRiskFactor[];
  recommendedActions: string[];
  lastAssessedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RiskScoreSchema = new Schema<IRiskScore>(
  {
    student: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  }
);

RiskScoreSchema.index({ student: 1, semester: 1, academicYear: 1 }, { unique: true });

export const RiskScore = mongoose.model<IRiskScore>('RiskScore', RiskScoreSchema);
