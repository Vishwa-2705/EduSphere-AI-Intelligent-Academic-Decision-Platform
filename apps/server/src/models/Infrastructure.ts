import mongoose, { Document, Schema } from 'mongoose';

export interface IInfrastructureDevice extends Document {
  deviceName: string;
  category: 'WIFI' | 'POWER' | 'WATER' | 'LAB_HARDWARE' | 'SECURITY';
  location: string;
  status: 'OPERATIONAL' | 'WARNING' | 'CRITICAL' | 'MAINTENANCE';
  telemetryValue: number;
  metricUnit: string;
  lastPing: Date;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InfrastructureDeviceSchema = new Schema<IInfrastructureDevice>(
  {
    deviceName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['WIFI', 'POWER', 'WATER', 'LAB_HARDWARE', 'SECURITY'],
      required: true,
      index: true,
    },
    location: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['OPERATIONAL', 'WARNING', 'CRITICAL', 'MAINTENANCE'],
      default: 'OPERATIONAL',
    },
    telemetryValue: {
      type: Number,
      required: true,
      default: 100,
    },
    metricUnit: {
      type: String,
      default: '%',
    },
    lastPing: {
      type: Date,
      default: Date.now,
    },
    ipAddress: {
      type: String,
      default: '192.168.1.1',
    },
  },
  {
    timestamps: true,
  }
);

export const InfrastructureDevice = mongoose.model<IInfrastructureDevice>(
  'InfrastructureDevice',
  InfrastructureDeviceSchema
);

export interface IMaintenanceTicket extends Document {
  ticketNumber: string;
  reportedBy: mongoose.Types.ObjectId;
  title: string;
  category: 'WIFI' | 'ELECTRICAL' | 'PLUMBING' | 'CIVIL' | 'HVAC';
  location: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  assignedTechnician?: string;
  description: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MaintenanceTicketSchema = new Schema<IMaintenanceTicket>(
  {
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    reportedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['WIFI', 'ELECTRICAL', 'PLUMBING', 'CIVIL', 'HVAC'],
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
      default: 'MEDIUM',
    },
    status: {
      type: String,
      enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED'],
      default: 'OPEN',
    },
    assignedTechnician: {
      type: String,
      default: 'Campus Facility Engineer',
    },
    description: {
      type: String,
      default: '',
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const MaintenanceTicket = mongoose.model<IMaintenanceTicket>(
  'MaintenanceTicket',
  MaintenanceTicketSchema
);
