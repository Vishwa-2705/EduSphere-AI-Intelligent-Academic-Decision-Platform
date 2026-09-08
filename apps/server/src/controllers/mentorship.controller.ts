import { Request, Response, NextFunction } from 'express';
import { MentorAllocation, InterventionLog } from '../models/Mentorship';
import { RiskScore } from '../models/RiskScore';
import { Profile } from '../models/Profile';
import { Enrollment } from '../models/Enrollment';
import { User } from '../models/User';

export const getMentees = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role;

    let allocations: any[] = [];
    if (role === 'MENTOR') {
      allocations = await MentorAllocation.find({ mentor: userId, isActive: true }).populate('student');
    } else {
      allocations = await MentorAllocation.find({ isActive: true }).populate('student').populate('mentor');
    }

    const studentIds = allocations.map((a) => a.student?._id);
    const profiles = await Profile.find({ user: { $in: studentIds } }).populate('department');
    const riskScores = await RiskScore.find({ student: { $in: studentIds } });

    const mentees = await Promise.all(
      allocations.map(async (alloc) => {
        const sId = alloc.student?._id?.toString();
        const sProf = profiles.find((p) => p.user?.toString() === sId);
        const sRisk = riskScores.find((r) => r.student?.toString() === sId);

        // Fetch student enrollments for detailed subject breakdown
        const enrollments = await Enrollment.find({ student: alloc.student?._id }).populate('course');

        const totalAttended = enrollments.reduce((acc, curr) => acc + (curr.attendedClasses || 0), 0);
        const totalClasses = enrollments.reduce((acc, curr) => acc + (curr.totalClasses || 0), 0);
        const attendancePct = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : (sRisk?.predictedAttendance || 85);

        return {
          id: sId,
          studentId: alloc.student?._id,
          name: sProf?.fullName || 'Student',
          email: (alloc.student as any)?.email,
          registrationNo: sProf?.registrationNo || 'N/A',
          department: (sProf?.department as any)?.name || 'Computer Science & Engineering',
          semester: sProf?.currentSemester || 6,
          section: sProf?.section || 'A',
          phone: sProf?.phone || '+91 91234 56789',
          parentName: sProf?.parentName || 'Parent Guardian',
          parentPhone: sProf?.parentPhone || '+91 98111 22334',
          attendancePercentage: attendancePct,
          currentCgpa: sRisk?.predictedGpa || 7.8,
          riskLevel: sRisk?.riskLevel || 'LOW',
          riskScore: sRisk?.riskScore || 15,
          primaryFactor: sRisk?.primaryFactors?.[0]?.factor || 'Normal Academic Progression',
          factors: sRisk?.primaryFactors || [],
          recommendations: sRisk?.recommendedActions || [],
          courseBreakdown: enrollments.map((en: any) => ({
            courseCode: en.course?.code,
            courseTitle: en.course?.title,
            attendancePercentage: en.attendancePercentage,
            internalScore: en.internalScore,
          })),
        };
      })
    );

    const interventions = await InterventionLog.find(
      role === 'MENTOR' ? { mentor: userId } : {}
    ).populate('student').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        totalMentees: mentees.length,
        riskSummary: {
          critical: mentees.filter((m) => m.riskLevel === 'CRITICAL').length,
          moderate: mentees.filter((m) => m.riskLevel === 'MODERATE').length,
          low: mentees.filter((m) => m.riskLevel === 'LOW').length,
        },
        mentees,
        interventions: interventions.map((inv: any) => ({
          id: inv._id,
          studentId: inv.student?._id,
          studentName: inv.student?.email,
          concernType: inv.concernType,
          title: inv.title,
          notes: inv.notes,
          actionPlan: inv.actionPlan,
          status: inv.status,
          parentNotified: inv.parentNotified,
          createdAt: inv.createdAt,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logIntervention = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const mentorId = req.user?.userId;
    const { studentId, concernType, title, notes, actionPlan, parentNotified } = req.body;

    if (!studentId || !concernType || !title || !notes) {
      res.status(400).json({ success: false, message: 'studentId, concernType, title, and notes are required' });
      return;
    }

    const intervention = await InterventionLog.create({
      mentor: mentorId,
      student: studentId,
      concernType,
      title,
      notes,
      actionPlan: actionPlan || 'Scheduled follow-up meeting in 1 week',
      parentNotified: !!parentNotified,
      status: 'OPEN',
    });

    res.status(201).json({
      success: true,
      message: 'Counseling intervention logged successfully',
      data: intervention,
    });
  } catch (error) {
    next(error);
  }
};

export const updateInterventionStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { interventionId } = req.params;
    const { status, actionPlan, notes } = req.body;

    const update: any = {};
    if (status) update.status = status;
    if (actionPlan) update.actionPlan = actionPlan;
    if (notes) update.notes = notes;

    const updated = await InterventionLog.findByIdAndUpdate(interventionId, update, { new: true });
    if (!updated) {
      res.status(404).json({ success: false, message: 'Intervention not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Intervention status updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
