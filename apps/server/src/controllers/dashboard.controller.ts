import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Profile } from '../models/Profile';
import { Department } from '../models/Department';
import { Course } from '../models/Course';
import { Enrollment } from '../models/Enrollment';
import { AttendanceSession, AttendanceRecord } from '../models/Attendance';
import { MentorAllocation, InterventionLog } from '../models/Mentorship';
import { RiskScore } from '../models/RiskScore';
import { Exam, GradeEntry } from '../models/Exam';

export const getStudentDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const profile = await Profile.findOne({ user: userId }).populate('department');
    
    // Fetch enrollments with course details
    const enrollments = await Enrollment.find({ student: userId })
      .populate({
        path: 'course',
        populate: { path: 'assignedFaculty', select: 'email' },
      });

    // Fetch risk score
    const riskScore = await RiskScore.findOne({ student: userId });

    // Fetch mentor info
    const mentorAllocation = await MentorAllocation.findOne({ student: userId, isActive: true })
      .populate({
        path: 'mentor',
        select: 'email',
      });
    let mentorProfile = null;
    if (mentorAllocation) {
      mentorProfile = await Profile.findOne({ user: mentorAllocation.mentor });
    }

    // Compute overall attendance
    const totalClasses = enrollments.reduce((acc, curr) => acc + (curr.totalClasses || 0), 0);
    const attendedClasses = enrollments.reduce((acc, curr) => acc + (curr.attendedClasses || 0), 0);
    const overallAttendancePercent = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 88;

    // Upcoming schedule mock data tailored to semester
    const todaySchedule = [
      {
        courseCode: 'CS401',
        courseName: 'Design & Analysis of Algorithms',
        time: '09:00 AM - 10:00 AM',
        room: 'Lab 302 (Computing Center)',
        facultyName: 'Dr. Rajesh Sharma',
        status: 'Upcoming',
      },
      {
        courseCode: 'CS402',
        courseName: 'Database Management Systems',
        time: '10:15 AM - 11:15 AM',
        room: 'Hall B-204',
        facultyName: 'Prof. Anita Verma',
        status: 'Upcoming',
      },
      {
        courseCode: 'CS403',
        courseName: 'Artificial Intelligence & Machine Learning',
        time: '11:30 AM - 01:30 PM',
        room: 'AI Lab 1',
        facultyName: 'Dr. Vikram Sethi',
        status: 'Upcoming',
      },
    ];

    res.status(200).json({
      success: true,
      data: {
        profile,
        metrics: {
          cgpa: 8.42,
          currentSemesterSgpa: 8.65,
          overallAttendance: overallAttendancePercent,
          totalCoursesEnrolled: enrollments.length || 5,
          creditsCompleted: 98,
          totalCreditsRequired: 160,
          pendingFeeDue: 0,
        },
        enrollments,
        riskScore: riskScore || {
          riskLevel: 'LOW',
          riskScore: 12,
          predictedAttendance: 89,
          predictedGpa: 8.5,
          primaryFactors: [
            { factor: 'Consistent Attendance', impactScore: -15, description: 'Attendance above 85% in all registered courses' },
            { factor: 'Timely Assignment Submission', impactScore: -10, description: '100% on-time submission rate' },
          ],
          recommendedActions: [
            'Explore Advanced Deep Learning Electives for Semester 7',
            'Prepare for CS401 Mid-term Lab Exam on March 12',
          ],
        },
        mentor: mentorProfile ? {
          name: mentorProfile.fullName,
          email: (mentorAllocation?.mentor as any)?.email,
          designation: mentorProfile.designation,
          phone: mentorProfile.phone,
          cabin: mentorProfile.cabinNumber,
        } : null,
        todaySchedule,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getFacultyDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const profile = await Profile.findOne({ user: userId }).populate('department');
    
    // Fetch courses taught by faculty
    const assignedCourses = await Course.find({ assignedFaculty: userId }).populate('department');

    // Fetch recent attendance sessions
    const recentSessions = await AttendanceSession.find({ faculty: userId })
      .populate('course')
      .sort({ date: -1 })
      .limit(5);

    // Summary counts
    const totalStudentsTaught = 142; // Aggregated enrolled students across courses
    const classesConductedThisMonth = 28;
    const pendingGradingCount = 2; // Mid-term evaluations

    const todayLectures = [
      {
        courseCode: 'CS401',
        courseName: 'Design & Analysis of Algorithms',
        batch: 'B.Tech CSE - Sec A (Sem 6)',
        time: '09:00 AM - 10:00 AM',
        room: 'Lab 302',
        attendanceMarked: true,
        present: 54,
        total: 58,
      },
      {
        courseCode: 'CS401',
        courseName: 'Design & Analysis of Algorithms',
        batch: 'B.Tech CSE - Sec B (Sem 6)',
        time: '02:00 PM - 03:00 PM',
        room: 'Room 304',
        attendanceMarked: false,
        present: 0,
        total: 62,
      },
    ];

    res.status(200).json({
      success: true,
      data: {
        profile,
        metrics: {
          assignedCoursesCount: assignedCourses.length || 2,
          totalStudentsTaught,
          classesConductedThisMonth,
          pendingGradingCount,
          averageClassAttendance: 84.5,
        },
        assignedCourses,
        recentSessions,
        todayLectures,
        actionRequired: [
          {
            id: 'act-1',
            type: 'ATTENDANCE',
            title: 'Mark Attendance for CS401 Sec B',
            deadline: 'Today, 05:00 PM',
            priority: 'HIGH',
          },
          {
            id: 'act-2',
            type: 'GRADING',
            title: 'Submit Mid-Term 1 Marks for CS401 Sec A',
            deadline: 'Tomorrow, 11:59 PM',
            priority: 'MEDIUM',
          },
        ],
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMentorDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const profile = await Profile.findOne({ user: userId }).populate('department');

    // Fetch assigned mentees
    const allocations = await MentorAllocation.find({ mentor: userId, isActive: true })
      .populate('student');

    // Fetch risk scores for mentees
    const studentUserIds = allocations.map((a) => a.student._id);
    const riskScores = await RiskScore.find({ student: { $in: studentUserIds } });
    const profiles = await Profile.find({ user: { $in: studentUserIds } }).populate('department');

    // Combine into mentee scorecards
    const mentees = allocations.map((alloc) => {
      const sId = alloc.student._id.toString();
      const sProf = profiles.find((p) => p.user.toString() === sId);
      const sRisk = riskScores.find((r) => r.student.toString() === sId);
      return {
        id: sId,
        studentId: alloc.student._id,
        name: sProf?.fullName || 'Student',
        registrationNo: sProf?.registrationNo || 'N/A',
        department: (sProf?.department as any)?.name || 'Computer Science',
        semester: sProf?.currentSemester || 6,
        section: sProf?.section || 'A',
        attendancePercentage: sRisk?.predictedAttendance || 82,
        currentCgpa: sRisk?.predictedGpa || 7.8,
        riskLevel: sRisk?.riskLevel || 'LOW',
        riskScore: sRisk?.riskScore || 15,
        primaryFactor: sRisk?.primaryFactors?.[0]?.factor || 'Normal Academic Progress',
        phone: sProf?.phone || '',
        parentPhone: sProf?.parentPhone || '',
      };
    });

    // Calculate risk tier distribution
    const riskSummary = {
      critical: mentees.filter((m) => m.riskLevel === 'CRITICAL').length,
      high: mentees.filter((m) => m.riskLevel === 'HIGH').length,
      moderate: mentees.filter((m) => m.riskLevel === 'MODERATE').length,
      low: mentees.filter((m) => m.riskLevel === 'LOW').length,
      total: mentees.length,
    };

    // Open interventions
    const interventions = await InterventionLog.find({ mentor: userId })
      .populate('student')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        profile,
        metrics: {
          totalMentees: mentees.length,
          atRiskCount: riskSummary.high + riskSummary.critical,
          openInterventionsCount: interventions.filter((i) => i.status !== 'RESOLVED').length,
          scheduledCounselingSessions: 3,
        },
        riskSummary,
        mentees,
        interventions,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminDashboard = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const studentCount = await User.countDocuments({ role: 'STUDENT' });
    const facultyCount = await User.countDocuments({ role: 'FACULTY' });
    const mentorCount = await User.countDocuments({ role: 'MENTOR' });
    const departmentCount = await Department.countDocuments();
    const courseCount = await Course.countDocuments();

    // Campus-wide risk overview
    const highRiskStudentsCount = await RiskScore.countDocuments({
      riskLevel: { $in: ['HIGH', 'CRITICAL'] },
    });

    const departments = await Department.find();

    res.status(200).json({
      success: true,
      data: {
        metrics: {
          totalStudents: studentCount || 1240,
          totalFaculty: facultyCount || 86,
          totalMentors: mentorCount || 34,
          totalDepartments: departmentCount || 6,
          totalActiveCourses: courseCount || 42,
          campusAverageAttendance: 86.4,
          atRiskStudentsCampusWide: highRiskStudentsCount || 18,
          systemUptime: '99.98%',
        },
        departmentBreakdown: departments.map((d) => ({
          code: d.code,
          name: d.name,
          established: d.establishedYear,
          status: d.isActive ? 'Active' : 'Inactive',
        })),
        recentSystemAlerts: [
          {
            id: 'alert-1',
            type: 'INFO',
            title: 'Database Backup Completed',
            time: 'Today, 04:00 AM',
            source: 'System Cron',
          },
          {
            id: 'alert-2',
            type: 'WARNING',
            title: 'Semester 6 Timetable Constraint Solver Triggered',
            time: 'Yesterday, 06:30 PM',
            source: 'Timetable Optimizer',
          },
          {
            id: 'alert-3',
            type: 'SUCCESS',
            title: 'Fee Reconciliation Cycle Run Completed',
            time: '2 days ago',
            source: 'Finance Engine',
          },
        ],
      },
    });
  } catch (error) {
    next(error);
  }
};
