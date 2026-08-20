import mongoose, { Document, Schema } from 'mongoose';

export type ExamType =
  | 'INTERNAL_1'
  | 'INTERNAL_2'
  | 'MID_TERM'
  | 'SEMESTER_FINAL'
  | 'LAB_PRACTICAL';

export interface IExam extends Document {
  course: mongoose.Types.ObjectId;
  examType: ExamType;
  title: string;
  maxMarks: number;
  weightagePercent: number;
  examDate: Date;
  durationMinutes: number;
  room?: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ExamSchema = new Schema<IExam>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    examType: {
      type: String,
      enum: ['INTERNAL_1', 'INTERNAL_2', 'MID_TERM', 'SEMESTER_FINAL', 'LAB_PRACTICAL'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    maxMarks: {
      type: Number,
      required: true,
      default: 100,
    },
    weightagePercent: {
      type: Number,
      required: true,
      default: 25,
    },
    examDate: {
      type: Date,
      required: true,
    },
    durationMinutes: {
      type: Number,
      default: 180,
    },
    room: {
      type: String,
      default: '',
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Exam = mongoose.model<IExam>('Exam', ExamSchema);

export interface IGradeEntry extends Document {
  exam: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  marksObtained: number;
  percentage: number;
  gradeLetter: string;
  feedback?: string;
  gradedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const GradeEntrySchema = new Schema<IGradeEntry>(
  {
    exam: {
      type: Schema.Types.ObjectId,
      ref: 'Exam',
      required: true,
      index: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    marksObtained: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    gradeLetter: {
      type: String,
      required: true,
      default: 'P',
    },
    feedback: {
      type: String,
      default: '',
    },
    gradedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

GradeEntrySchema.index({ exam: 1, student: 1 }, { unique: true });

export const GradeEntry = mongoose.model<IGradeEntry>('GradeEntry', GradeEntrySchema);
