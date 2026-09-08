import { Request, Response, NextFunction } from 'express';
import { AdmissionApplication } from '../models/Admission';
import { Department } from '../models/Department';
import { User } from '../models/User';
import { Profile } from '../models/Profile';
import bcrypt from 'bcryptjs';

export const getAdmissionApplications = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, quota } = req.query;
    const filter: any = {};

    if (status) filter.status = status;
    if (quota) filter.allocatedQuota = quota;

    const applications = await AdmissionApplication.find(filter)
      .populate('department')
      .sort({ appliedDate: -1 });

    const totalApplications = await AdmissionApplication.countDocuments();
    const verifiedCount = await AdmissionApplication.countDocuments({ status: 'VERIFIED' });
    const admittedCount = await AdmissionApplication.countDocuments({ status: 'ADMITTED' });

    res.status(200).json({
      success: true,
      data: {
        metrics: {
          totalApplications,
          verifiedCount,
          admittedCount,
          seatsFilledPercentage: 92.5,
        },
        applications,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { applicationId } = req.params;
    const { status, documentsVerified, remarks } = req.body;

    const update: any = {};
    if (status) update.status = status;
    if (documentsVerified !== undefined) update.documentsVerified = documentsVerified;
    if (remarks) update.remarks = remarks;

    const app = await AdmissionApplication.findByIdAndUpdate(applicationId, update, { new: true });
    if (!app) {
      res.status(404).json({ success: false, message: 'Application not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Application ${app.applicationNumber} updated to ${app.status}`,
      data: app,
    });
  } catch (error) {
    next(error);
  }
};

export const provisionStudentFromAdmission = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { applicationId } = req.params;
    const app = await AdmissionApplication.findById(applicationId);

    if (!app) {
      res.status(404).json({ success: false, message: 'Application not found' });
      return;
    }

    if (app.provisionedStudentId) {
      res.status(400).json({ success: false, message: 'Student account already provisioned for this application' });
      return;
    }

    // Provision user
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Student@12345', salt);

    const user = await User.create({
      email: app.email,
      passwordHash,
      role: 'STUDENT',
      isActive: true,
    });

    const regNo = `26CS${Math.floor(100 + Math.random() * 900)}`;
    const names = app.candidateName.split(' ');

    await Profile.create({
      user: user._id,
      firstName: names[0] || app.candidateName,
      lastName: names.slice(1).join(' ') || '',
      registrationNo: regNo,
      phone: app.phone,
      department: app.department,
      batchYear: 2026,
      currentSemester: 1,
      section: 'A',
    });

    app.status = 'ADMITTED';
    app.provisionedStudentId = user._id;
    await app.save();

    res.status(201).json({
      success: true,
      message: `Student account provisioned successfully (${app.email} | Reg: ${regNo})`,
      data: {
        userId: user._id,
        registrationNo: regNo,
        email: app.email,
      },
    });
  } catch (error) {
    next(error);
  }
};
