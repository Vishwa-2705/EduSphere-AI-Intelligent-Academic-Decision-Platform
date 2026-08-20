import mongoose, { Document, Schema } from 'mongoose';

export interface IProfile extends Document {
  user: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  fullName: string;
  registrationNo: string;
  phone?: string;
  avatarUrl?: string;
  department?: mongoose.Types.ObjectId;
  batchYear?: number;
  currentSemester?: number;
  section?: string;
  designation?: string; // For faculty/mentor/admin
  cabinNumber?: string;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema = new Schema<IProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    registrationNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      default: '',
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      default: null,
    },
    batchYear: {
      type: Number,
      default: null,
    },
    currentSemester: {
      type: Number,
      default: 1,
    },
    section: {
      type: String,
      default: 'A',
    },
    designation: {
      type: String,
      default: '',
    },
    cabinNumber: {
      type: String,
      default: '',
    },
    parentName: {
      type: String,
      default: '',
    },
    parentPhone: {
      type: String,
      default: '',
    },
    parentEmail: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ProfileSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

export const Profile = mongoose.model<IProfile>('Profile', ProfileSchema);
