import mongoose, { Document, Schema } from 'mongoose';

export type EnrollmentStatus = 'ENROLLED' | 'COMPLETED' | 'DROPPED';

export interface IEnrollment extends Document {
  student: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  academicYear: string;
  semester: number;
  status: EnrollmentStatus;
  attendancePercentage: number;
  totalClasses: number;
  attendedClasses: number;
  internalScore?: number;
  finalScore?: number;
  gradeLetter?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
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
    },
    status: {
      type: String,
      enum: ['ENROLLED', 'COMPLETED', 'DROPPED'],
      default: 'ENROLLED',
    },
    attendancePercentage: {
      type: Number,
      default: 0,
    },
    totalClasses: {
      type: Number,
      default: 0,
    },
    attendedClasses: {
      type: Number,
      default: 0,
    },
    internalScore: {
      type: Number,
      default: null,
    },
    finalScore: {
      type: Number,
      default: null,
    },
    gradeLetter: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

EnrollmentSchema.index({ student: 1, course: 1, academicYear: 1 }, { unique: true });

export const Enrollment = mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);
