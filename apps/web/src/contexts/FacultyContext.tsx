import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  FacultySubRole,
  StudyMaterial,
  MaterialStatus,
  StudentLeaveRequest,
  LeaveStatus,
  ExamItem,
  RoleNotification,
  StudentRecordItem,
  HostelStudentItem,
  initialStudyMaterials,
  initialLeaveRequests,
  initialExamSchedule,
  initialRoleNotifications,
  studentList,
  hostelResidentList,
  getFacultyByEmail,
  FacultyLeaveRequest,
  DepartmentScheduleItem,
  FacultyScheduleItem,
  initialFacultyLeaveRequests,
  initialDepartmentSchedules,
  initialFacultySchedules,
} from '../data/facultyData';
import { getStudentStorageKey, normalizeStudentLeaveApplications, getDefaultStudentLeaveApplications } from '../data/studentData';

interface FacultyContextType {
  // Current user role & department
  activeSubRole: FacultySubRole;
  setActiveSubRole: (role: FacultySubRole) => void;
  allowedSubRoles: FacultySubRole[];
  facultyDepartmentCode: string;
  facultyDepartmentName: string;
  isExclusiveHOD: boolean;
  isWarden: boolean;

  // Department-filtered Materials
  materials: StudyMaterial[];
  myDepartmentMaterials: StudyMaterial[];
  pendingDepartmentMaterials: StudyMaterial[];
  approvedDepartmentMaterials: StudyMaterial[];
  updateMaterialStatus: (id: string, status: MaterialStatus, reason?: string) => void;
  submitMaterial: (material: Omit<StudyMaterial, 'id' | 'status' | 'submittedAt'>) => void;
  createDepartmentSchedule: (schedule: Omit<DepartmentScheduleItem, 'id'>) => void;
  updateDepartmentSchedule: (id: string, schedule: Partial<Omit<DepartmentScheduleItem, 'id'>>) => void;
  deleteDepartmentSchedule: (id: string) => void;
  approveDepartmentSchedule: (id: string) => void;
  createFacultySchedule: (schedule: Omit<FacultyScheduleItem, 'id'>) => void;
  updateFacultySchedule: (id: string, schedule: Partial<Omit<FacultyScheduleItem, 'id'>>) => void;
  deleteFacultySchedule: (id: string) => void;
  approveFacultySchedule: (id: string) => void;
  createExam: (exam: Omit<ExamItem, 'id' | 'daysRemaining' | 'reminderSent' | 'status'>) => void;
  updateExam: (id: string, exam: Partial<Omit<ExamItem, 'id' | 'daysRemaining' | 'reminderSent'>>) => void;
  deleteExam: (id: string) => void;
  approveExam: (id: string) => void;

  // Student Mentorship & Leave Requests
  myMentees: StudentRecordItem[];
  leaveRequests: StudentLeaveRequest[];
  myMenteeLeaveRequests: StudentLeaveRequest[];
  updateLeaveStatus: (id: string, status: LeaveStatus, reason?: string) => void;

  // Faculty Leave Requests (Department faculty to HOD, HOD to Admin)
  facultyLeaveRequests: FacultyLeaveRequest[];
  myDepartmentFacultyLeaves: FacultyLeaveRequest[];
  myOwnFacultyLeaves: FacultyLeaveRequest[];
  applyFacultyLeave: (leave: Omit<FacultyLeaveRequest, 'id' | 'status' | 'submittedDate'>) => void;
  updateFacultyLeaveStatus: (id: string, status: 'Approved' | 'Rejected', reason?: string) => void;

  // Department Schedules (All Years / Sections)
  departmentSchedules: DepartmentScheduleItem[];
  myDepartmentStudentSchedules: DepartmentScheduleItem[];

  // Faculty Schedules (Timetable of Department Faculty)
  facultySchedules: FacultyScheduleItem[];
  myDepartmentFacultySchedules: FacultyScheduleItem[];

  // Exams
  examSchedule: ExamItem[];
  myDepartmentExams: ExamItem[];
  sendExamReminder: (examId: string) => void;

  // Warden Data
  hostelResidents: HostelStudentItem[];
  wardenLeaveRequests: StudentLeaveRequest[];
  updateWardenLeaveStatus: (id: string, status: LeaveStatus) => void;

  // Notifications
  notifications: RoleNotification[];
  addNotification: (notification: Omit<RoleNotification, 'id' | 'createdAt'>) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
}

const FacultyContext = createContext<FacultyContextType | undefined>(undefined);

export const FacultyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile } = useAuth();

  // Determine faculty identity from logged in user
  const facultyInfo = user?.email ? getFacultyByEmail(user.email) : undefined;
  const facultyDepartmentCode = facultyInfo?.departmentCode || (profile?.department as any)?.code || 'CSE';
  const facultyDepartmentName = facultyInfo?.departmentName || (profile?.department as any)?.name || 'Computer Science & Engineering';
  const isExclusiveHOD = facultyInfo?.facultyRole === 'HOD';
  const isWarden = facultyInfo?.facultyRole === 'WARDEN';

  // Compute allowed sub-roles
  const computeAllowedSubRoles = (): FacultySubRole[] => {
    if (isExclusiveHOD) return ['HOD'];
    if (isWarden) return ['WARDEN'];
    if (facultyInfo?.facultyRole === 'MENTOR') return ['MENTOR'];
    if (facultyInfo?.isMentor) return ['FACULTY', 'MENTOR'];
    return ['FACULTY'];
  };

  const allowedSubRoles = computeAllowedSubRoles();

  // Active Sub-Role state
  const [activeSubRole, setActiveSubRoleState] = useState<FacultySubRole>(() => {
    if (isExclusiveHOD) return 'HOD';
    if (isWarden) return 'WARDEN';
    if (facultyInfo?.facultyRole === 'MENTOR') return 'MENTOR';
    return 'FACULTY';
  });

  // Keep activeSubRole aligned when user or facultyInfo changes
  useEffect(() => {
    if (isExclusiveHOD) {
      setActiveSubRoleState('HOD');
    } else if (isWarden) {
      setActiveSubRoleState('WARDEN');
    } else if (facultyInfo?.facultyRole === 'MENTOR') {
      setActiveSubRoleState('MENTOR');
    } else if (!allowedSubRoles.includes(activeSubRole)) {
      setActiveSubRoleState('FACULTY');
    }
  }, [user?.email, isExclusiveHOD, isWarden]);

  const setActiveSubRole = (role: FacultySubRole) => {
    // Strict access control: cannot switch to unauthorized role
    if (!allowedSubRoles.includes(role)) {
      console.warn(`[FacultyContext] Unauthorized role switch attempted: ${role}`);
      return;
    }
    setActiveSubRoleState(role);
  };

  // State collections
  const [materials, setMaterials] = useState<StudyMaterial[]>(() => {
    const saved = localStorage.getItem('edusphere_materials');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          localStorage.setItem('edusphere_materials', JSON.stringify([]));
          return [];
        }
      } catch {
        // ignore invalid saved data
      }
    }
    return [];
  });

  const pruneHistoricalLeaveRequests = useCallback((items: StudentLeaveRequest[]) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 45);

    return items.filter(item => {
      if (!item.fromDate) return true;
      const [year, month, day] = item.fromDate.split('-').map(Number);
      const dateValue = new Date(year, (month || 1) - 1, day || 1);
      return !Number.isNaN(dateValue.getTime()) ? dateValue >= cutoff : true;
    });
  }, []);

  const [leaveRequests, setLeaveRequests] = useState<StudentLeaveRequest[]>(() => {
    const saved = localStorage.getItem('edusphere_leaves');
    const base = saved ? JSON.parse(saved) : initialLeaveRequests;
    return Array.isArray(base) ? pruneHistoricalLeaveRequests(base) : [];
  });

  const [facultyLeaveRequests, setFacultyLeaveRequests] = useState<FacultyLeaveRequest[]>(() => {
    const saved = localStorage.getItem('edusphere_faculty_leaves');
    return saved ? JSON.parse(saved) : initialFacultyLeaveRequests;
  });

  const [departmentSchedules, setDepartmentSchedules] = useState<DepartmentScheduleItem[]>(() => {
    const saved = localStorage.getItem('edusphere_dept_schedules');
    return saved ? JSON.parse(saved) : initialDepartmentSchedules;
  });

  const [facultySchedules, setFacultySchedules] = useState<FacultyScheduleItem[]>(() => {
    const saved = localStorage.getItem('edusphere_faculty_schedules');
    return saved ? JSON.parse(saved) : initialFacultySchedules;
  });

  const [exams, setExams] = useState<ExamItem[]>(() => {
    const saved = localStorage.getItem('edusphere_exams');
    return saved ? JSON.parse(saved) : initialExamSchedule;
  });

  const [notifications, setNotifications] = useState<RoleNotification[]>(() => {
    const saved = localStorage.getItem('edusphere_role_notifs');
    if (!saved) {
      return initialRoleNotifications;
    }

    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        localStorage.setItem('edusphere_role_notifs', JSON.stringify([]));
        return [];
      }
    } catch {
      // ignore invalid stored data
    }

    return [];
  });

  useEffect(() => {
    localStorage.setItem('edusphere_role_notifs', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    const saved = localStorage.getItem('edusphere_role_notifs');
    if (saved && saved !== '[]') {
      localStorage.setItem('edusphere_role_notifs', JSON.stringify([]));
      setNotifications([]);
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem('edusphere_materials', JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    const saved = localStorage.getItem('edusphere_materials');
    if (!saved) {
      localStorage.setItem('edusphere_materials', JSON.stringify([]));
      setMaterials([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('edusphere_leaves', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  // Listen to external updates to shared leave requests (e.g. student submissions)
  useEffect(() => {
    const handler = () => {
      try {
        const saved = localStorage.getItem('edusphere_leaves');
        if (saved) {
          const parsed = JSON.parse(saved);
          const cleaned = Array.isArray(parsed) ? pruneHistoricalLeaveRequests(parsed) : [];
          setLeaveRequests(cleaned);
          localStorage.setItem('edusphere_leaves', JSON.stringify(cleaned));
        }
      } catch (e) {
        // ignore parse errors
      }
    };

    window.addEventListener('edusphere_leaves_updated', handler as EventListener);
    // Also respond to storage events across tabs
    window.addEventListener('storage', handler as EventListener);

    return () => {
      window.removeEventListener('edusphere_leaves_updated', handler as EventListener);
      window.removeEventListener('storage', handler as EventListener);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('edusphere_faculty_leaves', JSON.stringify(facultyLeaveRequests));
  }, [facultyLeaveRequests]);

  useEffect(() => {
    localStorage.setItem('edusphere_dept_schedules', JSON.stringify(departmentSchedules));
  }, [departmentSchedules]);

  useEffect(() => {
    localStorage.setItem('edusphere_faculty_schedules', JSON.stringify(facultySchedules));
  }, [facultySchedules]);

  useEffect(() => {
    localStorage.setItem('edusphere_exams', JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem('edusphere_role_notifs', JSON.stringify(notifications));
  }, [notifications]);

  // Department filtered materials (HOD and Faculty see only their department)
  const myDepartmentMaterials = materials.filter(m => m.departmentCode === facultyDepartmentCode);
  const pendingDepartmentMaterials = myDepartmentMaterials.filter(m =>
    ['Submitted', 'Under Verification', 'Resubmitted'].includes(m.status)
  );
  const approvedDepartmentMaterials = myDepartmentMaterials.filter(m => m.status === 'Approved');

  // Mentees strictly assigned to logged in mentor by mentor email mapping
  const myMentees = studentList.filter(s =>
    s.mentorEmail.toLowerCase() === (user?.email || '').toLowerCase()
  );

  // Leave requests assigned to logged in mentor only for their actual mentees
  const myMenteeLeaveRequests = leaveRequests.filter(lr => {
    const isAssignedMentee = myMentees.some(student =>
      student.id === lr.studentId ||
      student.regNo === lr.regNo ||
      student.email.toLowerCase() === (lr.studentName ? '' : '')
    );

    return (
      lr.mentorEmail.toLowerCase() === (user?.email || '').toLowerCase() &&
      isAssignedMentee
    );
  });

  // Faculty Leave Requests filtered by department for HOD review (excluding HOD's own leaves,
  // and keeping only the assigned faculty roster for the HOD's department)
  const assignedFacultyNames = new Set([
    'Dr. R. Mehta',
    'Prof. S. Iyer',
    'Dr. P. Nair',
    'Mr. Arun Kumar',
    'Ms. Aditi Rao',
    'Mr. Karan Shah',
    'Prof. Anita Verma',
  ]);

  const myDepartmentFacultyLeaves = facultyLeaveRequests.filter(
    lr => lr.departmentCode === facultyDepartmentCode && !lr.isHODLeave && assignedFacultyNames.has(lr.facultyName)
  );

  // My own faculty/HOD leave requests
  const myOwnFacultyLeaves = facultyLeaveRequests.filter(
    lr => lr.facultyEmail.toLowerCase() === (user?.email || '').toLowerCase()
  );

  // Department-filtered schedules
  const myDepartmentStudentSchedules = departmentSchedules.filter(
    s => s.departmentCode === facultyDepartmentCode
  );

  const myDepartmentFacultySchedules = facultySchedules.filter(
    s => s.departmentCode === facultyDepartmentCode
  );

  // Department-filtered exams
  const myDepartmentExams = exams.filter(e => e.departmentCode === facultyDepartmentCode);

  // Warden specific data
  const hostelResidents = hostelResidentList;
  const wardenLeaveRequests = leaveRequests.filter(lr => lr.isHostelLeave);

  // Material actions
  const updateMaterialStatus = useCallback((id: string, status: MaterialStatus, reason?: string) => {
    setMaterials(prev =>
      prev.map(m =>
        m.id === id
          ? {
              ...m,
              status,
              reviewedAt: new Date().toISOString().split('T')[0],
              ...(status === 'Approved' ? { publishedAt: new Date().toISOString().split('T')[0] } : {}),
              ...(reason ? { rejectionReason: reason } : {}),
            }
          : m
      )
    );

    // Notify faculty of approval or rejection
    const targetMat = materials.find(m => m.id === id);
    if (targetMat) {
      const newNotif: RoleNotification = {
        id: `notif-${Date.now()}`,
        recipientEmail: targetMat.facultyId,
        recipientRole: 'FACULTY',
        departmentCode: targetMat.departmentCode,
        title: status === 'Approved' ? 'Study Material Approved by HOD' : 'Study Material Rejected',
        message: status === 'Approved'
          ? `Your material "${targetMat.title}" has been approved by the HOD and published to students.`
          : `Your material "${targetMat.title}" was rejected. Reason: ${reason || 'Please modify and resubmit.'}`,
        category: 'Material',
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  }, [materials]);

  const submitMaterial = useCallback((material: Omit<StudyMaterial, 'id' | 'status' | 'submittedAt'>) => {
    const newMaterial: StudyMaterial = {
      ...material,
      id: `mat-${Date.now()}`,
      status: 'Submitted',
      submittedAt: new Date().toISOString().split('T')[0],
    };
    setMaterials(prev => [newMaterial, ...prev]);

    // Dispatch notification to HOD
    const newNotif: RoleNotification = {
      id: `notif-${Date.now()}`,
      recipientEmail: 'hod',
      recipientRole: 'HOD',
      departmentCode: material.departmentCode,
      title: 'New Material for Verification',
      message: `${material.facultyName} submitted "${material.title}" (${material.subjectCode}) for verification.`,
      category: 'Material',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const createDepartmentSchedule = useCallback((schedule: Omit<DepartmentScheduleItem, 'id'>) => {
    setDepartmentSchedules(prev => [{
      ...schedule,
      id: `ds-${Date.now()}`,
      status: schedule.status || 'Draft',
    }, ...prev]);
  }, []);

  const updateDepartmentSchedule = useCallback((id: string, schedule: Partial<Omit<DepartmentScheduleItem, 'id'>>) => {
    setDepartmentSchedules(prev => prev.map(item => item.id === id ? { ...item, ...schedule } : item));
  }, []);

  const deleteDepartmentSchedule = useCallback((id: string) => {
    setDepartmentSchedules(prev => prev.filter(item => item.id !== id));
  }, []);

  const approveDepartmentSchedule = useCallback((id: string) => {
    setDepartmentSchedules(prev => {
      const target = prev.find(item => item.id === id);
      if (!target) return prev;
      if (facultyInfo?.facultyRole !== 'HOD' || facultyDepartmentCode !== target.departmentCode) return prev;

      return prev.map(item => item.id === id
        ? {
            ...item,
            status: 'Approved',
            approvedBy: facultyInfo.name || profile?.fullName || user?.email || 'HOD',
            approvedAt: new Date().toISOString(),
          }
        : item
      );
    });
  }, [facultyDepartmentCode, facultyInfo, profile?.fullName, user?.email]);

  const createFacultySchedule = useCallback((schedule: Omit<FacultyScheduleItem, 'id'>) => {
    setFacultySchedules(prev => [{
      ...schedule,
      id: `fs-${Date.now()}`,
      status: schedule.status || 'Draft',
    }, ...prev]);
  }, []);

  const updateFacultySchedule = useCallback((id: string, schedule: Partial<Omit<FacultyScheduleItem, 'id'>>) => {
    setFacultySchedules(prev => prev.map(item => item.id === id ? { ...item, ...schedule } : item));
  }, []);

  const deleteFacultySchedule = useCallback((id: string) => {
    setFacultySchedules(prev => prev.filter(item => item.id !== id));
  }, []);

  const approveFacultySchedule = useCallback((id: string) => {
    setFacultySchedules(prev => prev.map(item => item.id === id ? { ...item, status: 'Approved' } : item));
  }, []);

  const createExam = useCallback((exam: Omit<ExamItem, 'id' | 'daysRemaining' | 'reminderSent' | 'status'>) => {
    setExams(prev => [{
      ...exam,
      id: `ex-${Date.now()}`,
      daysRemaining: 0,
      reminderSent: false,
      status: 'Draft',
    }, ...prev]);
  }, []);

  const updateExam = useCallback((id: string, exam: Partial<Omit<ExamItem, 'id' | 'daysRemaining' | 'reminderSent'>>) => {
    setExams(prev => prev.map(item => item.id === id ? { ...item, ...exam } : item));
  }, []);

  const deleteExam = useCallback((id: string) => {
    setExams(prev => prev.filter(item => item.id !== id));
  }, []);

  const approveExam = useCallback((id: string) => {
    setExams(prev => {
      const target = prev.find(item => item.id === id);
      if (!target) return prev;
      if (facultyInfo?.facultyRole !== 'HOD' || facultyDepartmentCode !== target.departmentCode) return prev;

      return prev.map(item => item.id === id
        ? {
            ...item,
            status: 'Approved',
            approvedBy: facultyInfo.name || profile?.fullName || user?.email || 'HOD',
            approvedAt: new Date().toISOString(),
          }
        : item
      );
    });
  }, [facultyDepartmentCode, facultyInfo, profile?.fullName, user?.email]);

  // Student Leave actions
  const resolveOverallLeaveStatus = useCallback((mentorStatus?: LeaveStatus, wardenStatus?: LeaveStatus) => {
    if (mentorStatus === 'Rejected' || wardenStatus === 'Rejected') return 'Rejected';
    if (mentorStatus === 'Approved' || wardenStatus === 'Approved') return 'Approved';
    return 'Pending';
  }, []);

  const updateLeaveStatus = useCallback((id: string, status: LeaveStatus, reason?: string) => {
    setLeaveRequests(prev =>
      prev.map(lr => {
        if (lr.id !== id) return lr;

        const nextMentorStatus = status;
        const nextOverallStatus = resolveOverallLeaveStatus(nextMentorStatus, lr.wardenStatus);

        return {
          ...lr,
          status: nextOverallStatus,
          mentorStatus: nextMentorStatus,
          actionAt: new Date().toISOString().split('T')[0],
          ...(reason ? { rejectionReason: reason } : {}),
        };
      })
    );

    const targetLeave = leaveRequests.find(lr => lr.id === id);
    if (targetLeave) {
      const studentItem = studentList.find(s => s.id === targetLeave.studentId || s.regNo === targetLeave.regNo);
      const studentEmail = studentItem?.email || '';

      // Dispatch notification to the actual student email, not the internal studentId.
      const newNotif: RoleNotification = {
        id: `notif-${Date.now()}`,
        recipientEmail: studentEmail || targetLeave.studentId,
        recipientRole: 'STUDENT',
        departmentCode: targetLeave.departmentCode,
        title: status === 'Approved' ? 'Leave Request Approved' : 'Leave Request Rejected',
        message: status === 'Approved'
          ? `Your leave request from ${targetLeave.fromDate} to ${targetLeave.toDate} has been approved by your mentor.`
          : `Your leave request has been rejected. Reason: ${reason || 'Internal assessment scheduled during this period.'}`,
        category: 'Leave',
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications(prev => [newNotif, ...prev]);

      if (studentEmail) {
        const studentNotification = {
          category: 'Leave',
          title: status === 'Approved' ? 'Leave Request Approved' : 'Leave Request Rejected',
          message: status === 'Approved'
            ? `Your leave request from ${targetLeave.fromDate} to ${targetLeave.toDate} has been approved by your mentor.`
            : `Your leave request has been rejected. Reason: ${reason || 'Internal assessment scheduled during this period.'}`,
          time: 'Just now',
          unread: true,
          expanded: false,
          icon: 'Bell',
        };

        const storageKey = getStudentStorageKey(studentEmail, 'notifications');
        const saved = localStorage.getItem(storageKey);
        const existing = saved ? JSON.parse(saved) : [];
        const nextInbox = Array.isArray(existing) ? [studentNotification, ...existing] : [studentNotification];
        localStorage.setItem(storageKey, JSON.stringify(nextInbox));
      }
    }

    // Keep per-student leave_applications (student-local store) in sync so student UI shows updated status
    try {
      const target = leaveRequests.find(lr => lr.id === id);
      if (target) {
        const studentItem = studentList.find(s => s.id === target.studentId || s.regNo === target.regNo);
        const studentEmail = studentItem?.email || '';
        if (studentEmail) {
          const storageKey = getStudentStorageKey(studentEmail, 'leave_applications');
          const saved = localStorage.getItem(storageKey);
          const existing = saved ? normalizeStudentLeaveApplications(JSON.parse(saved), studentEmail) : getDefaultStudentLeaveApplications(studentEmail);

          const isDayScholar = studentItem?.studentType === 'DAY_SCHOLAR';
          const labels = isDayScholar ? ['Parent', 'Mentor'] : ['Parent', 'Warden', 'Mentor'];
          const nextApprovals = labels.map((label) => {
            if (label === 'Mentor') return { label, status: status === 'Approved' ? 'Approved' : status === 'Rejected' ? 'Declined' : 'Awaiting' };
            if (label === 'Warden') return { label, status: (target.wardenStatus === 'Approved' ? 'Approved' : target.wardenStatus === 'Rejected' ? 'Declined' : 'Awaiting') as 'Approved' | 'Declined' | 'Awaiting' };
            return { label, status: 'Awaiting' as const };
          });

          const appStatus = resolveOverallLeaveStatus(status, target.wardenStatus) === 'Approved' ? 'Approved' : resolveOverallLeaveStatus(status, target.wardenStatus) === 'Rejected' ? 'Declined' : 'Awaiting';
          const appDate = (() => {
            if (!target.fromDate) return new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
            const [year, month, day] = target.fromDate.split('-').map(Number);
            return new Date(year, month - 1, day).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
          })();

          const matchedIndex = existing.findIndex(app => app.requestId === target.id || (app.type === target.leaveType && app.date === appDate && `${app.duration}` === `${target.numberOfDays} Days`));
          const updated = matchedIndex >= 0
            ? existing.map((app, index) => index === matchedIndex
                ? { ...app, date: appDate, type: target.leaveType, duration: `${target.numberOfDays} Days`, status: appStatus, approvals: nextApprovals, requestId: target.id }
                : app)
            : [{ date: appDate, type: target.leaveType, duration: `${target.numberOfDays} Days`, status: appStatus, approvals: nextApprovals, requestId: target.id }, ...existing];

          localStorage.setItem(storageKey, JSON.stringify(updated));
        }
      }
    } catch (e) {
      // ignore storage sync errors
    }
  }, [leaveRequests, resolveOverallLeaveStatus]);

  // Faculty Leave actions
  const applyFacultyLeave = useCallback((leave: Omit<FacultyLeaveRequest, 'id' | 'status' | 'submittedDate'>) => {
    const newLeave: FacultyLeaveRequest = {
      ...leave,
      id: `fl-${Date.now()}`,
      status: 'Pending',
      submittedDate: new Date().toISOString().split('T')[0],
    };
    setFacultyLeaveRequests(prev => [newLeave, ...prev]);

    // Dispatch notification
    const recipient = leave.isHODLeave ? 'admin@edusphere.ai' : 'priya.kumar@edusphere.ai';
    const recipientRole = leave.isHODLeave ? 'ADMIN' : 'HOD';
    const newNotif: RoleNotification = {
      id: `notif-${Date.now()}`,
      recipientEmail: recipient,
      recipientRole: recipientRole as any,
      departmentCode: leave.departmentCode,
      title: 'New Faculty Leave Request',
      message: `${leave.facultyName} (${leave.departmentCode}) submitted a ${leave.leaveType} request for ${leave.numberOfDays} days.`,
      category: 'Leave',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const updateFacultyLeaveStatus = useCallback((id: string, status: 'Approved' | 'Rejected', reason?: string) => {
    setFacultyLeaveRequests(prev =>
      prev.map(fl =>
        fl.id === id
          ? {
              ...fl,
              status,
              reviewedAt: new Date().toISOString().split('T')[0],
              ...(reason ? { rejectionReason: reason } : {}),
            }
          : fl
      )
    );

    const targetLeave = facultyLeaveRequests.find(fl => fl.id === id);
    if (targetLeave) {
      const newNotif: RoleNotification = {
        id: `notif-${Date.now()}`,
        recipientEmail: targetLeave.facultyEmail,
        recipientRole: 'FACULTY',
        departmentCode: targetLeave.departmentCode,
        title: status === 'Approved' ? 'Faculty Leave Approved' : 'Faculty Leave Rejected',
        message: status === 'Approved'
          ? `Your leave request for ${targetLeave.fromDate} to ${targetLeave.toDate} has been approved.`
          : `Your leave request has been rejected. Reason: ${reason || 'Department operational requirements.'}`,
        category: 'Leave',
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  }, [facultyLeaveRequests]);

  // Warden leave approval
  const updateWardenLeaveStatus = useCallback((id: string, status: LeaveStatus) => {
    setLeaveRequests(prev =>
      prev.map(lr => {
        if (lr.id !== id) return lr;

        const nextWardenStatus = status;
        const nextOverallStatus = resolveOverallLeaveStatus(lr.status, nextWardenStatus);

        return { ...lr, wardenStatus: nextWardenStatus, status: nextOverallStatus };
      })
    );
    // Sync to student local leave applications so student sees warden decision
    try {
      const target = leaveRequests.find(lr => lr.id === id);
      if (target) {
        const studentItem = studentList.find(s => s.id === target.studentId || s.regNo === target.regNo);
        const studentEmail = studentItem?.email || '';
        if (studentEmail) {
          const storageKey = getStudentStorageKey(studentEmail, 'leave_applications');
          const saved = localStorage.getItem(storageKey);
          const existing = saved ? normalizeStudentLeaveApplications(JSON.parse(saved), studentEmail) : getDefaultStudentLeaveApplications(studentEmail);

          const isDayScholar = studentItem?.studentType === 'DAY_SCHOLAR';
          const labels = isDayScholar ? ['Parent', 'Mentor'] : ['Parent', 'Warden', 'Mentor'];
          const nextApprovals = labels.map((label) => {
            if (label === 'Warden') return { label, status: status === 'Approved' ? 'Approved' : 'Declined' };
            if (label === 'Mentor') return { label, status: (target.status === 'Approved' ? 'Approved' : target.status === 'Rejected' ? 'Declined' : 'Awaiting') as 'Approved' | 'Declined' | 'Awaiting' };
            return { label, status: 'Awaiting' as const };
          });

          const appStatus = resolveOverallLeaveStatus(target.status, status) === 'Approved' ? 'Approved' : resolveOverallLeaveStatus(target.status, status) === 'Rejected' ? 'Declined' : 'Awaiting';
          const appDate = (() => {
            if (!target.fromDate) return new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
            const [year, month, day] = target.fromDate.split('-').map(Number);
            return new Date(year, month - 1, day).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
          })();

          const matchedIndex = existing.findIndex(app => app.requestId === target.id || (app.type === target.leaveType && app.date === appDate && `${app.duration}` === `${target.numberOfDays} Days`));
          const updated = matchedIndex >= 0
            ? existing.map((app, index) => index === matchedIndex
                ? { ...app, date: appDate, type: target.leaveType, duration: `${target.numberOfDays} Days`, status: appStatus, approvals: nextApprovals, requestId: target.id }
                : app)
            : [{ date: appDate, type: target.leaveType, duration: `${target.numberOfDays} Days`, status: appStatus, approvals: nextApprovals, requestId: target.id }, ...existing];

          localStorage.setItem(storageKey, JSON.stringify(updated));
        }
      }
    } catch (e) {
      // ignore
    }
  }, [leaveRequests, resolveOverallLeaveStatus]);

  // Exam reminder
  const sendExamReminder = useCallback((examId: string) => {
    const exam = exams.find(e => e.id === examId);
    if (!exam) return;

    setExams(prev =>
      prev.map(e => (e.id === examId ? { ...e, reminderSent: true } : e))
    );

    const targetStudents = studentList.filter(student =>
      student.departmentCode === exam.departmentCode &&
      student.mentorEmail.toLowerCase() === (user?.email || '').toLowerCase()
    );

    const reminderNotifications: RoleNotification[] = targetStudents.map(student => ({
      id: `notif-${Date.now()}-${student.id}`,
      recipientEmail: student.email,
      recipientRole: 'STUDENT',
      departmentCode: exam.departmentCode,
      title: `Exam Reminder: ${exam.subject}`,
      message: `Reminder: ${exam.subject} (${exam.examType}) is scheduled for ${exam.date} at ${exam.startTime} in ${exam.venue}.`,
      category: 'Exam',
      isRead: false,
      createdAt: new Date().toISOString(),
    }));

    setNotifications(prev => [...reminderNotifications, ...prev]);

    targetStudents.forEach(student => {
      const studentNotification = {
        category: 'Examination',
        title: `Exam Reminder: ${exam.subject}`,
        message: `Reminder: ${exam.subject} (${exam.examType}) is scheduled for ${exam.date} at ${exam.startTime} in ${exam.venue}.`,
        time: 'Just now',
        unread: true,
        expanded: false,
        icon: 'Clock3',
        details: [
          { label: 'Subject', value: exam.subject },
          { label: 'Date', value: exam.date },
          { label: 'Time', value: exam.startTime },
          { label: 'Venue', value: exam.venue },
        ],
      };

      const storageKey = getStudentStorageKey(student.email, 'notifications');
      const saved = localStorage.getItem(storageKey);
      const existing = saved ? JSON.parse(saved) : [];
      const nextInbox = Array.isArray(existing) ? [studentNotification, ...existing] : [studentNotification];
      localStorage.setItem(storageKey, JSON.stringify(nextInbox));
    });
  }, [exams, user?.email]);

  // Notifications read state
  const addNotification = useCallback((notification: Omit<RoleNotification, 'id' | 'createdAt'>) => {
    const newNotif: RoleNotification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  return (
    <FacultyContext.Provider
      value={{
        activeSubRole,
        setActiveSubRole,
        allowedSubRoles,
        facultyDepartmentCode,
        facultyDepartmentName,
        isExclusiveHOD,
        isWarden,
        materials,
        myDepartmentMaterials,
        pendingDepartmentMaterials,
        approvedDepartmentMaterials,
        updateMaterialStatus,
        submitMaterial,
        createDepartmentSchedule,
        updateDepartmentSchedule,
        deleteDepartmentSchedule,
        approveDepartmentSchedule,
        createFacultySchedule,
        updateFacultySchedule,
        deleteFacultySchedule,
        approveFacultySchedule,
        createExam,
        updateExam,
        deleteExam,
        approveExam,
        myMentees,
        leaveRequests,
        myMenteeLeaveRequests,
        updateLeaveStatus,
        facultyLeaveRequests,
        myDepartmentFacultyLeaves,
        myOwnFacultyLeaves,
        applyFacultyLeave,
        updateFacultyLeaveStatus,
        departmentSchedules,
        myDepartmentStudentSchedules,
        facultySchedules,
        myDepartmentFacultySchedules,
        examSchedule: exams,
        myDepartmentExams,
        sendExamReminder,
        hostelResidents,
        wardenLeaveRequests,
        updateWardenLeaveStatus,
        notifications,
        addNotification,
        markNotificationRead,
        markAllRead,
      }}
    >
      {children}
    </FacultyContext.Provider>
  );
};

export const useFaculty = (): FacultyContextType => {
  const ctx = useContext(FacultyContext);
  if (!ctx) throw new Error('useFaculty must be used within FacultyProvider');
  return ctx;
};

