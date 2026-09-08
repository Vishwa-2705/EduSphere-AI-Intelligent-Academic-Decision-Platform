import mongoose, { Document, Schema } from 'mongoose';

export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY';

export interface ITimetableSlot extends Document {
  department: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  faculty: mongoose.Types.ObjectId;
  semester: number;
  section: string;
  dayOfWeek: DayOfWeek;
  periodNumber: number;
  startTime: string;
  endTime: string;
  room: string;
  academicYear: string;
  createdAt: Date;
  updatedAt: Date;
}

const TimetableSlotSchema = new Schema<ITimetableSlot>(
  {
    department: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
      index: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    faculty: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    section: {
      type: String,
      required: true,
      default: 'A',
    },
    dayOfWeek: {
      type: String,
      enum: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'],
      required: true,
      index: true,
    },
    periodNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    room: {
      type: String,
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
      default: '2025-2026',
    },
  },
  {
    timestamps: true,
  }
);

TimetableSlotSchema.index(
  { department: 1, semester: 1, section: 1, dayOfWeek: 1, periodNumber: 1 },
  { unique: true }
);

export const TimetableSlot = mongoose.model<ITimetableSlot>('TimetableSlot', TimetableSlotSchema);
