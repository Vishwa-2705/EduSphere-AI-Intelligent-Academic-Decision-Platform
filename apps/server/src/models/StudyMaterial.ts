import mongoose, { Document, Schema } from 'mongoose';

export interface IStudyMaterial extends Document {
  course: mongoose.Types.ObjectId;
  title: string;
  description: string;
  unitNumber: number;
  fileUrl: string;
  fileSizeBytes: number;
  fileType: string;
  uploadedBy: mongoose.Types.ObjectId;
  downloadCount: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const StudyMaterialSchema = new Schema<IStudyMaterial>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
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
    unitNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 6,
    },
    fileUrl: {
      type: String,
      required: true,
      default: '/materials/sample-document.pdf',
    },
    fileSizeBytes: {
      type: Number,
      default: 2048000, // 2MB
    },
    fileType: {
      type: String,
      default: 'PDF',
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    tags: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export const StudyMaterial = mongoose.model<IStudyMaterial>('StudyMaterial', StudyMaterialSchema);
