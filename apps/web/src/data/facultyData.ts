// ─── EduSphere AI – Master Faculty & Institutional Data ───────────────────
// Integrated multi-department mapping: CSE, IT, ECE, MECH, AI_DS, and Hostels

export type FacultySubRole = 'HOD' | 'FACULTY' | 'MENTOR' | 'WARDEN';

export type MaterialStatus =
  | 'Draft'
  | 'Submitted'
  | 'Under Verification'
  | 'Approved'
  | 'Rejected'
  | 'Resubmitted'
  | 'Published';

export type MaterialType =
  | 'Notes'
  | 'PDF'
  | 'PPT'
  | 'Question Bank'
  | 'Previous Year QP'
  | 'Assignment'
  | 'Lab Material'
  | 'Reference Material';

export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export type ExamType =
  | 'Periodic Test 1'
  | 'Periodic Test 2'
  | 'Internal Exam'
  | 'Lab Exam'
  | 'Semester Exam'
  | 'Final Semester'
  | 'Model Exam'
  | 'Practical Exam'
  | 'Project Review'
  | 'Viva';

// ─── Department Structure ──────────────────────────────────────────────────
export interface DepartmentItem {
  id: string;
  code: string;
  name: string;
  hodName: string;
  hodEmail: string;
}

export const departments: DepartmentItem[] = [
  {
    id: 'dept-cse',
    code: 'CSE',
    name: 'Department of Computer Science & Engineering',
    hodName: 'Dr. Priya Kumar',
    hodEmail: 'priya.kumar@edusphere.ai',
  },
  {
    id: 'dept-it',
    code: 'IT',
    name: 'Department of Information Technology',
    hodName: 'Dr. Rajesh Venkat',
    hodEmail: 'hod.it@edusphere.ai',
  },
  {
    id: 'dept-ece',
    code: 'ECE',
    name: 'Department of Electronics & Communication Engineering',
    hodName: 'Dr. Nisha Reddy',
    hodEmail: 'nisha.reddy@edusphere.ai',
  },
  {
    id: 'dept-mech',
    code: 'MECH',
    name: 'Department of Mechanical Engineering',
    hodName: 'Dr. Vikram Sethi',
    hodEmail: 'vikram.sethi@edusphere.ai',
  },
  {
    id: 'dept-aids',
    code: 'AI_DS',
    name: 'Department of Artificial Intelligence & Data Science',
    hodName: 'Dr. V. Sen',
    hodEmail: 'v.sen@edusphere.ai',
  },
];

// ─── Faculty Members & Roles ───────────────────────────────────────────────
export interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  qualification?: string;
  experience?: string;
  subRoles?: string[];
  email: string;
  phone: string;
  departmentCode: string;
  departmentName: string;
  facultyRole: 'HOD' | 'FACULTY' | 'MENTOR' | 'WARDEN';
  isMentor?: boolean;
  isWarden?: boolean;
  cabin: string;
  assignedSubjects: string[];
}

export const facultyMembers: FacultyMember[] = [
  // 1. CSE HOD - Exclusive HOD role
  {
    id: 'f-cse-hod',
    name: 'Dr. Priya Kumar',
    designation: 'Professor & Head of Department',
    qualification: 'Ph.D in Computer Science, M.Tech',
    experience: '18+ Years',
    subRoles: ['HOD'],
    email: 'priya.kumar@edusphere.ai',
    phone: '+91 98400 11234',
    departmentCode: 'CSE',
    departmentName: 'Computer Science & Engineering',
    facultyRole: 'HOD',
    cabin: 'Tech Block A, Room 401',
    assignedSubjects: ['CS403', 'CS404'],
  },
  // Alias faculty@edusphere.ai -> Dr. Priya Kumar (CSE HOD)
  {
    id: 'f-cse-hod-alias',
    name: 'Dr. Priya Kumar',
    designation: 'Professor & Head of Department',
    qualification: 'Ph.D in Computer Science, M.Tech',
    experience: '18+ Years',
    subRoles: ['HOD'],
    email: 'faculty@edusphere.ai',
    phone: '+91 98400 11234',
    departmentCode: 'CSE',
    departmentName: 'Computer Science & Engineering',
    facultyRole: 'HOD',
    cabin: 'Tech Block A, Room 401',
    assignedSubjects: ['CS403', 'CS404'],
  },
  // 2. CSE Faculty roster under Priya Kumar: Mehta, Iyer, Nair, Arun Kumar + 2 extra faculty members
  {
    id: 'f-cse-mehta',
    name: 'Dr. R. Mehta',
    designation: 'Associate Professor',
    qualification: 'Ph.D in Computer Science',
    experience: '12+ Years',
    subRoles: ['FACULTY'],
    email: 'mehta@edusphere.ai',
    phone: '+91 98400 22340',
    departmentCode: 'CSE',
    departmentName: 'Computer Science & Engineering',
    facultyRole: 'FACULTY',
    isMentor: false,
    cabin: 'Tech Block A, Room 402',
    assignedSubjects: ['CS401'],
  },
  {
    id: 'f-cse-iyer',
    name: 'Prof. S. Iyer',
    designation: 'Professor & Faculty Mentor',
    qualification: 'M.Tech, Ph.D',
    experience: '14+ Years',
    subRoles: ['FACULTY', 'MENTOR'],
    email: 'iyer@edusphere.ai',
    phone: '+91 98400 22341',
    departmentCode: 'CSE',
    departmentName: 'Computer Science & Engineering',
    facultyRole: 'FACULTY',
    isMentor: true,
    cabin: 'Tech Block A, Room 404',
    assignedSubjects: ['CS402'],
  },
  {
    id: 'f-cse-nair',
    name: 'Dr. P. Nair',
    designation: 'Associate Professor',
    qualification: 'M.Tech, Ph.D',
    experience: '11+ Years',
    subRoles: ['FACULTY'],
    email: 'nair@edusphere.ai',
    phone: '+91 98400 22342',
    departmentCode: 'CSE',
    departmentName: 'Computer Science & Engineering',
    facultyRole: 'FACULTY',
    isMentor: false,
    cabin: 'Tech Block A, Room 405',
    assignedSubjects: ['CS403'],
  },
  {
    id: 'f-cse-arun',
    name: 'Mr. Arun Kumar',
    designation: 'Associate Professor & Faculty Mentor',
    qualification: 'M.Tech (CSE)',
    experience: '10+ Years',
    subRoles: ['FACULTY', 'MENTOR'],
    email: 'arun.kumar@edusphere.ai',
    phone: '+91 98400 22345',
    departmentCode: 'CSE',
    departmentName: 'Computer Science & Engineering',
    facultyRole: 'FACULTY',
    isMentor: true,
    cabin: 'Tech Block A, Room 403',
    assignedSubjects: ['CS401', 'CS402'],
  },
  {
    id: 'f-cse-extra-1',
    name: 'Ms. Aditi Rao',
    designation: 'Assistant Professor',
    qualification: 'M.Tech (CSE)',
    experience: '8+ Years',
    subRoles: ['FACULTY'],
    email: 'aditi.rao@edusphere.ai',
    phone: '+91 98400 22346',
    departmentCode: 'CSE',
    departmentName: 'Computer Science & Engineering',
    facultyRole: 'FACULTY',
    isMentor: false,
    cabin: 'Tech Block A, Room 406',
    assignedSubjects: ['CS404'],
  },
  {
    id: 'f-cse-extra-2',
    name: 'Mr. Karan Shah',
    designation: 'Assistant Professor',
    qualification: 'M.Tech (CSE)',
    experience: '7+ Years',
    subRoles: ['FACULTY'],
    email: 'karan.shah@edusphere.ai',
    phone: '+91 98400 22347',
    departmentCode: 'CSE',
    departmentName: 'Computer Science & Engineering',
    facultyRole: 'FACULTY',
    isMentor: false,
    cabin: 'Tech Block A, Room 407',
    assignedSubjects: ['CS403'],
  },
  // 4. MECH Department Faculty (Mr. Rohit Kumar)
  {
    id: 'f-mech-rohit',
    name: 'Mr. Rohit Kumar',
    designation: 'Assistant Professor',
    qualification: 'M.Tech (CAD/CAM)',
    experience: '7+ Years',
    subRoles: ['FACULTY'],
    email: 'rohit.kumar@edusphere.ai',
    phone: '+91 98400 55678',
    departmentCode: 'MECH',
    departmentName: 'Mechanical Engineering',
    facultyRole: 'FACULTY',
    isMentor: false,
    cabin: 'Mechanical Block, Room 204',
    assignedSubjects: ['ME301', 'ME302'],
  },
  // 5. IT Department Faculty + Mentor (Dr. Rohit Sharma - mapped to IT!)
  {
    id: 'f-it-rohit',
    name: 'Dr. Rohit Sharma',
    designation: 'Associate Professor & Faculty Mentor',
    qualification: 'Ph.D (IT), M.Tech',
    experience: '12+ Years',
    subRoles: ['FACULTY', 'MENTOR'],
    email: 'rohit.sharma@edusphere.ai',
    phone: '+91 98765 43210',
    departmentCode: 'IT',
    departmentName: 'Information Technology',
    facultyRole: 'FACULTY',
    isMentor: true,
    cabin: 'Tech Block B, Room 304',
    assignedSubjects: ['IT5001', 'IT5002'],
  },
  // 6. IT HOD - Exclusive HOD role
  {
    id: 'f-it-hod',
    name: 'Dr. Rajesh Venkat',
    designation: 'Professor & Head of Department',
    qualification: 'Ph.D (IT), M.E.',
    experience: '16+ Years',
    subRoles: ['HOD'],
    email: 'hod.it@edusphere.ai',
    phone: '+91 98400 44567',
    departmentCode: 'IT',
    departmentName: 'Information Technology',
    facultyRole: 'HOD',
    cabin: 'Tech Block B, Room 301',
    assignedSubjects: ['IT5001', 'IT5002'],
  },
  // 7. Dedicated Mentor (Prof. Anita Verma - CSE)
  {
    id: 'f-cse-mentor',
    name: 'Prof. Anita Verma',
    designation: 'Senior Counselor & Academic Mentor',
    qualification: 'M.Sc., M.Phil, Ph.D',
    experience: '14+ Years',
    subRoles: ['MENTOR'],
    email: 'mentor@edusphere.ai',
    phone: '+91 97654 32109',
    departmentCode: 'CSE',
    departmentName: 'Computer Science & Engineering',
    facultyRole: 'MENTOR',
    isMentor: true,
    cabin: 'Mentorship Center, Desk 04',
    assignedSubjects: [],
  },
  // 8. Warden Role (Mr. K. Narayanan)
  {
    id: 'f-warden',
    name: 'Mr. K. Narayanan',
    designation: 'Chief Hostel Warden & Residential Officer',
    qualification: 'M.A., M.Ed.',
    experience: '20+ Years',
    subRoles: ['WARDEN'],
    email: 'warden@edusphere.ai',
    phone: '+91 98400 88990',
    departmentCode: 'HOSTEL',
    departmentName: 'Campus Residential Services',
    facultyRole: 'WARDEN',
    isWarden: true,
    cabin: 'Hostel Admin Complex, Room 102',
    assignedSubjects: [],
  },
];

// Helper to look up faculty user details by email
export const getFacultyByEmail = (email: string): FacultyMember | undefined => {
  const clean = email.trim().toLowerCase();
  return facultyMembers.find(f => f.email.toLowerCase() === clean);
};

// ─── Course Catalog ────────────────────────────────────────────────────────
export interface CourseSubject {
  code: string;
  name: string;
  departmentCode: string;
  semester: number;
  credits: number;
  totalStudents: number;
  assignedFaculty: string;
  facultyId?: string;
  sections?: string[];
  units: number;
}

export const courseSubjects: CourseSubject[] = [
  // CSE Courses
  { code: 'CS401', name: 'Design & Analysis of Algorithms', departmentCode: 'CSE', semester: 6, credits: 4, totalStudents: 64, assignedFaculty: 'Mr. Arun Kumar', facultyId: 'f-cse-arun', sections: ['A', 'B'], units: 5 },
  { code: 'CS402', name: 'Database Management Systems', departmentCode: 'CSE', semester: 6, credits: 4, totalStudents: 64, assignedFaculty: 'Mr. Arun Kumar', facultyId: 'f-cse-arun', sections: ['A', 'B'], units: 5 },
  { code: 'CS403', name: 'Computer Networks & Security', departmentCode: 'CSE', semester: 6, credits: 3, totalStudents: 64, assignedFaculty: 'Dr. Priya Kumar', facultyId: 'f-cse-hod', sections: ['A'], units: 5 },
  { code: 'CS404', name: 'Artificial Intelligence & ML', departmentCode: 'CSE', semester: 6, credits: 4, totalStudents: 64, assignedFaculty: 'Dr. Priya Kumar', facultyId: 'f-cse-hod', sections: ['A'], units: 5 },
  // IT Courses (taught by Dr. Rohit Sharma and IT faculty)
  { code: 'IT5001', name: 'Database Management Systems', departmentCode: 'IT', semester: 5, credits: 4, totalStudents: 60, assignedFaculty: 'Dr. Rohit Sharma', facultyId: 'f-it-rohit', sections: ['A', 'B'], units: 5 },
  { code: 'IT5002', name: 'Computer Networks', departmentCode: 'IT', semester: 5, credits: 4, totalStudents: 60, assignedFaculty: 'Dr. Rohit Sharma', facultyId: 'f-it-rohit', sections: ['A', 'B'], units: 5 },
  { code: 'IT5003', name: 'Web Technologies & Cloud Services', departmentCode: 'IT', semester: 5, credits: 3, totalStudents: 60, assignedFaculty: 'Dr. Rajesh Venkat', facultyId: 'f-it-hod', sections: ['A'], units: 5 },
  { code: 'IT5004', name: 'Operating Systems & Virtualization', departmentCode: 'IT', semester: 5, credits: 4, totalStudents: 60, assignedFaculty: 'Dr. Rajesh Venkat', facultyId: 'f-it-hod', sections: ['A'], units: 5 },
];

// ─── Existing Students Dataset (Mapped strictly by Department) ──────────────
export interface StudentRecordItem {
  id: string;
  name: string;
  regNo: string;
  email: string;
  phone?: string;
  departmentCode: string;
  departmentName: string;
  department?: string;
  year: string;
  admissionYear?: string | number;
  semester: number;
  section: string;
  attendance: number;
  cgpa: number;
  academicStatus: 'Excellent' | 'Good' | 'Average' | 'At Risk';
  mentorName: string;
  mentorEmail: string;
  hostelBlock: string;
  hostelRoom: string;
  hostelBed: string;
  studentType: 'RESIDENTIAL' | 'DAY_SCHOLAR';
  parentName: string;
  parentPhone: string;
  address: string;
  subjectMarks: { subject: string; internal: number; maxInternal: number }[];
  assignments: { name: string; submitted: boolean }[];
}

export const studentList: StudentRecordItem[] = [
  {
    id: 'std-aarav',
    name: 'Aarav Patel',
    regNo: '22CS084',
    email: 'aarav@edusphere.ai',
    departmentCode: 'CSE',
    departmentName: 'Computer Science & Engineering',
    year: 'III Year',
    semester: 6,
    section: 'A',
    attendance: 88,
    cgpa: 8.9,
    academicStatus: 'Excellent',
    mentorName: 'Mr. Arun Kumar',
    mentorEmail: 'arun.kumar@edusphere.ai',
    hostelBlock: 'Block 4 - Aryabhata',
    hostelRoom: '212',
    hostelBed: 'Bed-A',
    studentType: 'RESIDENTIAL',
    parentName: 'Mr. Rakesh Patel',
    parentPhone: '+91 99887 66554',
    address: '12, Emerald Residency, Nehru Nagar, Bengaluru 560020',
    subjectMarks: [
      { subject: 'Design & Analysis of Algorithms', internal: 44, maxInternal: 50 },
      { subject: 'Database Management Systems', internal: 46, maxInternal: 50 },
      { subject: 'Computer Networks & Security', internal: 42, maxInternal: 50 },
      { subject: 'Artificial Intelligence & ML', internal: 45, maxInternal: 50 },
    ],
    assignments: [
      { name: 'CS401 Dynamic Programming Case Study', submitted: true },
      { name: 'CS402 Normalization & B+ Tree Schema', submitted: true },
      { name: 'CS403 TCP Congestion Control Simulation', submitted: true },
    ],
  },
  {
    id: 'std-priya-sharma',
    name: 'Priya Sharma',
    regNo: '22EC091',
    email: 'priya.sharma@edusphere.ai',
    departmentCode: 'ECE',
    departmentName: 'Electronics & Communication Engineering',
    year: 'III Year',
    semester: 6,
    section: 'A',
    attendance: 92,
    cgpa: 9.2,
    academicStatus: 'Excellent',
    mentorName: 'Dr. Nisha Reddy',
    mentorEmail: 'nisha.reddy@edusphere.ai',
    hostelBlock: 'Block 2 - Veda',
    hostelRoom: '108',
    hostelBed: 'Bed-B',
    studentType: 'RESIDENTIAL',
    parentName: 'Mr. Sunil Sharma',
    parentPhone: '+91 98555 33221',
    address: '18, Lotus Arcade, Whitefield, Bengaluru 560066',
    subjectMarks: [
      { subject: 'Digital Signal Processing', internal: 47, maxInternal: 50 },
      { subject: 'VLSI Design', internal: 46, maxInternal: 50 },
    ],
    assignments: [
      { name: 'DSP Filter Design Project', submitted: true },
    ],
  },
  {
    id: 'std-nisha',
    name: 'Nisha Kulkarni',
    regNo: '23AI042',
    email: 'nisha.kulkarni@edusphere.ai',
    departmentCode: 'AI_DS',
    departmentName: 'Artificial Intelligence & Data Science',
    year: 'II Year',
    semester: 4,
    section: 'A',
    attendance: 94,
    cgpa: 8.7,
    academicStatus: 'Excellent',
    mentorName: 'Dr. V. Sen',
    mentorEmail: 'v.sen@edusphere.ai',
    hostelBlock: '',
    hostelRoom: '',
    hostelBed: '',
    studentType: 'DAY_SCHOLAR',
    parentName: 'Mrs. Meena Kulkarni',
    parentPhone: '+91 99880 11223',
    address: '44, Lake View Apartments, Indiranagar, Bengaluru 560038',
    subjectMarks: [
      { subject: 'Machine Learning Algorithms', internal: 48, maxInternal: 50 },
    ],
    assignments: [
      { name: 'K-Means Cluster Optimization', submitted: true },
    ],
  },
  {
    id: 'std-rohit-kumar',
    name: 'Rohit Kumar',
    regNo: '22ME105',
    email: 'rohit.kumar@edusphere.ai',
    departmentCode: 'MECH',
    departmentName: 'Mechanical Engineering',
    year: 'III Year',
    semester: 6,
    section: 'A',
    attendance: 68,
    cgpa: 8.6,
    academicStatus: 'At Risk',
    mentorName: 'Dr. Vikram Sethi',
    mentorEmail: 'vikram.sethi@edusphere.ai',
    hostelBlock: 'Block 5 - Bhaskara',
    hostelRoom: '315',
    hostelBed: 'Bed-C',
    studentType: 'RESIDENTIAL',
    parentName: 'Mr. Mahesh Kumar',
    parentPhone: '+91 98333 44556',
    address: '7, Green Park Residency, Koramangala, Bengaluru 560095',
    subjectMarks: [
      { subject: 'Heat & Mass Transfer', internal: 32, maxInternal: 50 },
      { subject: 'Design of Machine Elements', internal: 35, maxInternal: 50 },
    ],
    assignments: [
      { name: 'Thermal Simulation Report', submitted: false },
    ],
  },
  {
    id: 'std-rahul',
    name: 'Rahul S',
    regNo: '22IT101',
    email: 'rahul.s@edusphere.ai',
    departmentCode: 'IT',
    departmentName: 'Information Technology',
    year: 'III Year',
    semester: 6,
    section: 'A',
    attendance: 87,
    cgpa: 8.4,
    academicStatus: 'Good',
    mentorName: 'Dr. Rohit Sharma',
    mentorEmail: 'rohit.sharma@edusphere.ai',
    hostelBlock: '',
    hostelRoom: '',
    hostelBed: '',
    studentType: 'DAY_SCHOLAR',
    parentName: 'Mr. Suresh S',
    parentPhone: '+91 94400 11112',
    address: '12, Gandhi Nagar, Chennai 600020',
    subjectMarks: [
      { subject: 'DBMS', internal: 42, maxInternal: 50 },
      { subject: 'Computer Networks', internal: 38, maxInternal: 50 },
      { subject: 'Web Technologies', internal: 44, maxInternal: 50 },
      { subject: 'Operating Systems', internal: 40, maxInternal: 50 },
    ],
    assignments: [
      { name: 'IT5001 ER Diagram Assignment', submitted: true },
      { name: 'IT5002 Protocol Analysis', submitted: true },
    ],
  },
];

// ─── Study Materials (Categorized by Department) ───────────────────────────
export interface StudyMaterial {
  id: string;
  title: string;
  departmentCode: string;
  subjectCode: string;
  subjectName: string;
  unit: number;
  topic: string;
  type: MaterialType;
  description: string;
  fileName: string;
  fileSize: string;
  academicYear: string;
  semester: number;
  targetClass: string;
  section: string;
  facultyId: string;
  facultyName: string;
  status: MaterialStatus;
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
  publishedAt?: string;
}

export const initialStudyMaterials: StudyMaterial[] = [];

// ─── Student Leave Requests ────────────────────────────────────────────────
export interface StudentLeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  regNo: string;
  departmentCode: string;
  mentorEmail: string;
  mentorName: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  numberOfDays: number;
  reason: string;
  hasDocument: boolean;
  submittedAt: string;
  status: LeaveStatus;
  mentorStatus?: LeaveStatus;
  rejectionReason?: string;
  actionAt?: string;
  // Warden specific fields for residential students
  isHostelLeave?: boolean;
  hostelBlock?: string;
  hostelRoom?: string;
  wardenStatus?: LeaveStatus;
}

export const initialLeaveRequests: StudentLeaveRequest[] = [];

// ─── Faculty Leave Request Structure ───────────────────────────────────────
export interface FacultyLeaveRequest {
  id: string;
  facultyName: string;
  facultyId: string;
  facultyEmail: string;
  departmentCode: string;
  departmentName: string;
  leaveType: 'Casual Leave' | 'Medical Leave' | 'On Duty (OD)' | 'Earned Leave' | 'Special Casual Leave';
  fromDate: string;
  toDate: string;
  numberOfDays: number;
  reason: string;
  supportingDocument?: string;
  submittedDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  rejectionReason?: string;
  reviewedAt?: string;
  isHODLeave?: boolean;
}

export const initialFacultyLeaveRequests: FacultyLeaveRequest[] = [
  {
    id: 'fl-cse-mehta',
    facultyName: 'Dr. R. Mehta',
    facultyId: 'f-cse-mehta',
    facultyEmail: 'mehta@edusphere.ai',
    departmentCode: 'CSE',
    departmentName: 'Computer Science & Engineering',
    leaveType: 'Casual Leave',
    fromDate: '2026-09-12',
    toDate: '2026-09-13',
    numberOfDays: 2,
    reason: 'Personal work and family visit.',
    submittedDate: '2026-09-10',
    status: 'Pending',
  },
  {
    id: 'fl-cse-iyer',
    facultyName: 'Prof. S. Iyer',
    facultyId: 'f-cse-iyer',
    facultyEmail: 'iyer@edusphere.ai',
    departmentCode: 'CSE',
    departmentName: 'Computer Science & Engineering',
    leaveType: 'Medical Leave',
    fromDate: '2026-09-15',
    toDate: '2026-09-17',
    numberOfDays: 3,
    reason: 'Medical consultation and rest.',
    submittedDate: '2026-09-11',
    status: 'Pending',
  },
  {
    id: 'fl-cse-nair',
    facultyName: 'Dr. P. Nair',
    facultyId: 'f-cse-nair',
    facultyEmail: 'nair@edusphere.ai',
    departmentCode: 'CSE',
    departmentName: 'Computer Science & Engineering',
    leaveType: 'On Duty (OD)',
    fromDate: '2026-09-18',
    toDate: '2026-09-18',
    numberOfDays: 1,
    reason: 'Departmental workshop participation.',
    submittedDate: '2026-09-10',
    status: 'Approved',
  },
  {
    id: 'fl-cse-arun',
    facultyName: 'Mr. Arun Kumar',
    facultyId: 'f-cse-arun',
    facultyEmail: 'arun.kumar@edusphere.ai',
    departmentCode: 'CSE',
    departmentName: 'Computer Science & Engineering',
    leaveType: 'Casual Leave',
    fromDate: '2026-09-20',
    toDate: '2026-09-21',
    numberOfDays: 2,
    reason: 'Family commitment.',
    submittedDate: '2026-09-11',
    status: 'Pending',
  },
  {
    id: 'fl-cse-aditi',
    facultyName: 'Ms. Aditi Rao',
    facultyId: 'f-cse-extra-1',
    facultyEmail: 'aditi.rao@edusphere.ai',
    departmentCode: 'CSE',
    departmentName: 'Computer Science & Engineering',
    leaveType: 'Earned Leave',
    fromDate: '2026-09-16',
    toDate: '2026-09-19',
    numberOfDays: 4,
    reason: 'Planned leave for personal commitments.',
    submittedDate: '2026-09-09',
    status: 'Pending',
  },
  {
    id: 'fl-cse-karan',
    facultyName: 'Mr. Karan Shah',
    facultyId: 'f-cse-extra-2',
    facultyEmail: 'karan.shah@edusphere.ai',
    departmentCode: 'CSE',
    departmentName: 'Computer Science & Engineering',
    leaveType: 'Casual Leave',
    fromDate: '2026-09-14',
    toDate: '2026-09-14',
    numberOfDays: 1,
    reason: 'Official travel and conference attendance.',
    submittedDate: '2026-09-10',
    status: 'Pending',
  },
  {
    id: 'fl-cse-anita',
    facultyName: 'Prof. Anita Verma',
    facultyId: 'f-cse-mentor',
    facultyEmail: 'mentor@edusphere.ai',
    departmentCode: 'CSE',
    departmentName: 'Computer Science & Engineering',
    leaveType: 'Special Casual Leave',
    fromDate: '2026-09-22',
    toDate: '2026-09-23',
    numberOfDays: 2,
    reason: 'Mentoring and academic counselor outreach.',
    submittedDate: '2026-09-11',
    status: 'Pending',
  },
];

// ─── Department Academic Schedules (For HOD: All Years & Sections) ─────────
export interface DepartmentScheduleItem {
  id: string;
  departmentCode: string;
  year: 'I Year' | 'II Year' | 'III Year' | 'IV Year';
  semester: number;
  section: 'A' | 'B';
  date?: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string;
  endTime: string;
  subjectCode: string;
  subjectName: string;
  facultyName: string;
  room: string;
  status: 'Draft' | 'Approved';
}

export const initialDepartmentSchedules: DepartmentScheduleItem[] = [];

// ─── Department Faculty Schedules (Timetable of all CSE Faculty) ───────────
export interface FacultyScheduleItem {
  id: string;
  facultyName: string;
  facultyEmail: string;
  departmentCode: string;
  subjectCode: string;
  subjectName: string;
  classYear: 'I Year' | 'II Year' | 'III Year' | 'IV Year';
  semester: number;
  section: 'A' | 'B';
  date?: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string;
  endTime: string;
  room: string;
  status: 'Draft' | 'Approved';
}

export const initialFacultySchedules: FacultyScheduleItem[] = [];

// ─── Examination Timetable ─────────────────────────────────────────────────
export interface ExamItem {
  id: string;
  departmentCode: string;
  subjectCode: string;
  subject: string;
  facultyName?: string;
  examType: ExamType;
  year?: 'I Year' | 'II Year' | 'III Year' | 'IV Year';
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  semester: number;
  daysRemaining: number;
  reminderSent: boolean;
  status: 'Draft' | 'Approved';
}

export const initialExamSchedule: ExamItem[] = [];

// ─── Institutional Notifications ──────────────────────────────────────────
export interface RoleNotification {
  id: string;
  recipientEmail: string;
  recipientRole: 'HOD' | 'FACULTY' | 'MENTOR' | 'WARDEN' | 'STUDENT';
  departmentCode?: string;
  title: string;
  message: string;
  category: 'Material' | 'Leave' | 'Exam' | 'Hostel' | 'Academic';
  isRead: boolean;
  createdAt: string;
}

export const initialRoleNotifications: RoleNotification[] = [];

// ─── Hostel Management (Warden Dataset) ────────────────────────────────────
export interface HostelStudentItem {
  id: string;
  name: string;
  regNo: string;
  departmentCode: string;
  year: string;
  blockName: string;
  roomNumber: string;
  bedNumber: string;
  curfewStatus: 'PRESENT' | 'ON_LEAVE' | 'LATE_PASS';
  emergencyContact: string;
}

export const hostelResidentList: HostelStudentItem[] = [
  {
    id: 'std-aarav',
    name: 'Aarav Patel',
    regNo: '22CS084',
    departmentCode: 'CSE',
    year: 'III Year',
    blockName: 'Block 4 - Aryabhata',
    roomNumber: '212',
    bedNumber: 'Bed-A',
    curfewStatus: 'PRESENT',
    emergencyContact: 'Mr. Rakesh Patel (+91 99887 66554)',
  },
  {
    id: 'std-sameer',
    name: 'Sameer Sen',
    regNo: '22CS089',
    departmentCode: 'CSE',
    year: 'III Year',
    blockName: 'Block 4 - Aryabhata',
    roomNumber: '212',
    bedNumber: 'Bed-B',
    curfewStatus: 'PRESENT',
    emergencyContact: 'Mr. Alok Sen (+91 98111 44556)',
  },
  {
    id: 'std-priya-sharma',
    name: 'Priya Sharma',
    regNo: '22EC091',
    departmentCode: 'ECE',
    year: 'III Year',
    blockName: 'Block 2 - Veda',
    roomNumber: '108',
    bedNumber: 'Bed-B',
    curfewStatus: 'PRESENT',
    emergencyContact: 'Mr. Sunil Sharma (+91 98555 33221)',
  },
  {
    id: 'std-rohit-kumar',
    name: 'Rohit Kumar',
    regNo: '22ME105',
    departmentCode: 'MECH',
    year: 'III Year',
    blockName: 'Block 5 - Bhaskara',
    roomNumber: '315',
    bedNumber: 'Bed-C',
    curfewStatus: 'PRESENT',
    emergencyContact: 'Mr. Mahesh Kumar (+91 98333 44556)',
  },
  {
    id: 'std-vikram',
    name: 'Vikram Sundaram',
    regNo: '22IT105',
    departmentCode: 'IT',
    year: 'III Year',
    blockName: 'Block 4 - Aryabhata',
    roomNumber: '204',
    bedNumber: 'Bed-A',
    curfewStatus: 'PRESENT',
    emergencyContact: 'Mr. Sundaram V (+91 94400 55556)',
  },
];

// ── Backward-compatible Aliases ─────────────────────────────────────────────
export const studyMaterials = initialStudyMaterials;
export const subjects = courseSubjects;
export const examSchedule = initialExamSchedule;
export const leaveRequests = initialLeaveRequests;
export const mentorStudents = studentList;
export type ExamSchedule = ExamItem;
export type LeaveRequest = StudentLeaveRequest;

