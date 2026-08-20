import mongoose, { Document, Schema } from 'mongoose';

export interface IDepartment extends Document {
  code: string;
  name: string;
  headOfDepartment?: mongoose.Types.ObjectId;
  establishedYear: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DepartmentSchema = new Schema<IDepartment>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    headOfDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    establishedYear: {
      type: Number,
      default: 2000,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Department = mongoose.model<IDepartment>('Department', DepartmentSchema);
