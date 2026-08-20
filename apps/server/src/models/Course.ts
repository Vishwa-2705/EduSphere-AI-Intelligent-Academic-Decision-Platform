import mongoose, { Document, Schema } from 'mongoose';

export interface ISyllabusTopic {
  unit: number;
  title: string;
  hours: number;
  topics: string[];
}

export interface ICourse extends Document {
  code: string;
  title: string;
  description: string;
  credits: number;
  semester: number;
  department: mongoose.Types.ObjectId;
  assignedFaculty?: mongoose.Types.ObjectId;
  syllabusTopics: ISyllabusTopic[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    credits: {
      type: Number,
      required: true,
      default: 3,
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    assignedFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    syllabusTopics: [
      {
        unit: { type: Number, required: true },
        title: { type: String, required: true },
        hours: { type: Number, default: 8 },
        topics: [{ type: String }],
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Course = mongoose.model<ICourse>('Course', CourseSchema);
