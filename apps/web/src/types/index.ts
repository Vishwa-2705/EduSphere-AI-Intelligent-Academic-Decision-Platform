export type UserRole = 'STUDENT' | 'FACULTY' | 'MENTOR' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  lastLogin?: string;
  createdAt?: string;
}

export interface Department {
  _id: string;
  code: string;
  name: string;
  establishedYear: number;
}

export type FacultyRoleLevel = 'HOD' | 'FACULTY' | 'MENTOR' | 'WARDEN';

export interface Profile {
  _id: string;
  user: string;
  firstName: string;
  lastName: string;
  fullName: string;
  registrationNo: string;
  phone?: string;
  avatarUrl?: string;
  department?: Department | null;
  batchYear?: number;
  currentSemester?: number;
  section?: string;
  designation?: string;
  cabinNumber?: string;
  parentName?: string;
  parentPhone?: string;
  address?: string;
  facultyRole?: FacultyRoleLevel;
  isMentor?: boolean;
  isWarden?: boolean;
  subRoles?: FacultyRoleLevel[];
}

export interface AuthResponse {
  user: User;
  profile: Profile | null;
  accessToken: string;
  refreshToken: string;
}

export interface StudentMetrics {
  cgpa: number;
  currentSemesterSgpa: number;
  overallAttendance: number;
  totalCoursesEnrolled: number;
  creditsCompleted: number;
  totalCreditsRequired: number;
  pendingFeeDue: number;
}

export interface CourseEnrollment {
  _id: string;
  course: {
    _id: string;
    code: string;
    title: string;
    credits: number;
    assignedFaculty?: { email: string };
  };
  attendancePercentage: number;
  totalClasses: number;
  attendedClasses: number;
  internalScore?: number;
}

export interface RiskFactor {
  factor: string;
  impactScore: number;
  description: string;
}

export interface RiskScoreData {
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  riskScore: number;
  predictedAttendance: number;
  predictedGpa: number;
  primaryFactors: RiskFactor[];
  recommendedActions: string[];
}

export interface MenteeItem {
  id: string;
  studentId: string;
  name: string;
  registrationNo: string;
  department: string;
  semester: number;
  section: string;
  attendancePercentage: number;
  currentCgpa: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  riskScore: number;
  primaryFactor: string;
  phone: string;
  parentPhone: string;
}
