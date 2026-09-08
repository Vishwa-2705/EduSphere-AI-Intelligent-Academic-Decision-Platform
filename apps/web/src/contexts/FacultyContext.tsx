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
    return saved ? JSON.parse(saved) : initialStudyMaterials;
  });

  const [leaveRequests, setLeaveRequests] = useState<StudentLeaveRequest[]>(() => {
    const saved = localStorage.getItem('edusphere_leaves');
    return saved ? JSON.parse(saved) : initialLeaveRequests;
  });

  const [facultyLeaveRequests, setFacultyLeaveRequests] = useState<FacultyLeaveRequest[]>(() => {
    const saved = localStorage.getItem('edusphere_faculty_leaves');
    return saved ? JSON.parse(saved) : initialFacultyLeaveRequests;
  });

  const [departmentSchedules] = useState<DepartmentScheduleItem[]>(() => {
    const saved = localStorage.getItem('edusphere_dept_schedules');
    return saved ? JSON.parse(saved) : initialDepartmentSchedules;
  });

  const [facultySchedules] = useState<FacultyScheduleItem[]>(() => {
    const saved = localStorage.getItem('edusphere_faculty_schedules');
    return saved ? JSON.parse(saved) : initialFacultySchedules;
  });

  const [exams, setExams] = useState<ExamItem[]>(() => {
    const saved = localStorage.getItem('edusphere_exams');
    return saved ? JSON.parse(saved) : initialExamSchedule;
  });

  const [notifications, setNotifications] = useState<RoleNotification[]>(() => {
    const saved = localStorage.getItem('edusphere_role_notifs');
    return saved ? JSON.parse(saved) : initialRoleNotifications;
  });

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem('edusphere_materials', JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem('edusphere_leaves', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem('edusphere_faculty_leaves', JSON.stringify(facultyLeaveRequests));
  }, [facultyLeaveRequests]);

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

  // Mentees strictly assigned to logged in mentor
  const myMentees = studentList.filter(s => {
    if (user?.email?.toLowerCase().includes('arun')) {
      return s.departmentCode === 'CSE'; // Arun Kumar mentors CSE students
    }
    if (user?.email?.toLowerCase().includes('rohit')) {
      return s.departmentCode === 'IT'; // Rohit Sharma mentors IT students
    }
    if (user?.email?.toLowerCase().includes('mentor')) {
      return s.departmentCode === 'CSE'; // Legacy mentor
    }
    return s.mentorEmail.toLowerCase() === user?.email?.toLowerCase();
  });

  // Leave requests assigned to logged in mentor
  const myMenteeLeaveRequests = leaveRequests.filter(lr => {
    if (user?.email?.toLowerCase().includes('arun')) {
      return lr.departmentCode === 'CSE';
    }
    if (user?.email?.toLowerCase().includes('rohit')) {
      return lr.departmentCode === 'IT';
    }
    return lr.mentorEmail.toLowerCase() === user?.email?.toLowerCase();
  });

  // Faculty Leave Requests filtered by department for HOD review (excluding HOD's own leaves)
  const myDepartmentFacultyLeaves = facultyLeaveRequests.filter(
    lr => lr.departmentCode === facultyDepartmentCode && !lr.isHODLeave
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

  // Student Leave actions
  const updateLeaveStatus = useCallback((id: string, status: LeaveStatus, reason?: string) => {
    setLeaveRequests(prev =>
      prev.map(lr =>
        lr.id === id
          ? {
              ...lr,
              status,
              actionAt: new Date().toISOString().split('T')[0],
              ...(reason ? { rejectionReason: reason } : {}),
            }
          : lr
      )
    );

    // Dispatch notification to student
    const targetLeave = leaveRequests.find(lr => lr.id === id);
    if (targetLeave) {
      const newNotif: RoleNotification = {
        id: `notif-${Date.now()}`,
        recipientEmail: targetLeave.studentId,
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
    }
  }, [leaveRequests]);

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
      prev.map(lr => (lr.id === id ? { ...lr, wardenStatus: status } : lr))
    );
  }, []);

  // Exam reminder
  const sendExamReminder = useCallback((examId: string) => {
    setExams(prev =>
      prev.map(e => (e.id === examId ? { ...e, reminderSent: true } : e))
    );

    const exam = exams.find(e => e.id === examId);
    if (exam) {
      const newNotif: RoleNotification = {
        id: `notif-${Date.now()}`,
        recipientEmail: 'all-students',
        recipientRole: 'STUDENT',
        departmentCode: exam.departmentCode,
        title: `Exam Reminder: ${exam.subject}`,
        message: `Reminder: ${exam.subject} (${exam.examType}) is scheduled for ${exam.date} at ${exam.startTime} in ${exam.venue}.`,
        category: 'Exam',
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  }, [exams]);

  // Notifications read state
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

