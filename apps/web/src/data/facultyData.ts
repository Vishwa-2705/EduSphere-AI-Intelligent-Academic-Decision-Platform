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
  | 'Internal Exam'
  | 'Model Exam'
  | 'Semester Exam'
  | 'Lab Exam'
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
  // 2. CSE Department Faculty + Mentor (Aarav Patil)
  {
    id: 'f-cse-aarav',
    name: 'Aarav Patil',
    designation: 'Assistant Professor & Faculty Mentor',
    qualification: 'M.Tech, Ph.D (CSE)',
    experience: '6+ Years',
    subRoles: ['FACULTY', 'MENTOR'],
    email: 'aarav.patil@edusphere.ai',
    phone: '+91 98400 22340',
    departmentCode: 'CSE',
    departmentName: 'Computer Science & Engineering',
    facultyRole: 'FACULTY',
    isMentor: true,
    cabin: 'Tech Block A, Room 402',
    assignedSubjects: ['CS401', 'CS402'],
  },
  // Alias aarav@edusphere.ai for Faculty login
  {
    id: 'f-cse-aarav-alias',
    name: 'Aarav Patil',
    designation: 'Assistant Professor & Faculty Mentor',
    qualification: 'M.Tech, Ph.D (CSE)',
    experience: '6+ Years',
    subRoles: ['FACULTY', 'MENTOR'],
    email: 'aarav@edusphere.ai',
    phone: '+91 98400 22340',
    departmentCode: 'CSE',
    departmentName: 'Computer Science & Engineering',
    facultyRole: 'FACULTY',
    isMentor: true,
    cabin: 'Tech Block A, Room 402',
    assignedSubjects: ['CS401', 'CS402'],
  },
  // 3. CSE Department Faculty + Mentor (Mr. Arun Kumar)
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
  // 1. Aarav Patel - CSE (Mentee of Mr. Arun Kumar)
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
  // 2. Sameer Sen - CSE (Aarav's Roommate & Fellow CSE Mentee)
  {
    id: 'std-sameer',
    name: 'Sameer Sen',
    regNo: '22CS089',
    email: 'sameer.sen@edusphere.ai',
    departmentCode: 'CSE',
    departmentName: 'Computer Science & Engineering',
    year: 'III Year',
    semester: 6,
    section: 'A',
    attendance: 82,
    cgpa: 8.4,
    academicStatus: 'Good',
    mentorName: 'Mr. Arun Kumar',
    mentorEmail: 'arun.kumar@edusphere.ai',
    hostelBlock: 'Block 4 - Aryabhata',
    hostelRoom: '212',
    hostelBed: 'Bed-B',
    studentType: 'RESIDENTIAL',
    parentName: 'Mr. Alok Sen',
    parentPhone: '+91 98111 44556',
    address: '88, Silver Oak Park, Bengaluru 560034',
    subjectMarks: [
      { subject: 'Design & Analysis of Algorithms', internal: 38, maxInternal: 50 },
      { subject: 'Database Management Systems', internal: 40, maxInternal: 50 },
      { subject: 'Computer Networks & Security', internal: 39, maxInternal: 50 },
      { subject: 'Artificial Intelligence & ML', internal: 41, maxInternal: 50 },
    ],
    assignments: [
      { name: 'CS401 Dynamic Programming Case Study', submitted: true },
      { name: 'CS402 Normalization & B+ Tree Schema', submitted: false },
    ],
  },
  // 3. Rahul S - IT (Mentee of Dr. Rohit Sharma)
  {
    id: 'std-rahul',
    name: 'Rahul S',
    regNo: '22IT101',
    email: 'rahul.s@student.edusphere.ai',
    departmentCode: 'IT',
    departmentName: 'Information Technology',
    year: 'III Year',
    semester: 5,
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
  // 4. Vikram Sundaram - IT (Residential IT student, mentee of Dr. Rohit Sharma)
  {
    id: 'std-vikram',
    name: 'Vikram Sundaram',
    regNo: '22IT105',
    email: 'vikram.s@student.edusphere.ai',
    departmentCode: 'IT',
    departmentName: 'Information Technology',
    year: 'III Year',
    semester: 5,
    section: 'B',
    attendance: 91,
    cgpa: 8.9,
    academicStatus: 'Excellent',
    mentorName: 'Dr. Rohit Sharma',
    mentorEmail: 'rohit.sharma@edusphere.ai',
    hostelBlock: 'Block 4 - Aryabhata',
    hostelRoom: '204',
    hostelBed: 'Bed-A',
    studentType: 'RESIDENTIAL',
    parentName: 'Mr. Sundaram V',
    parentPhone: '+91 94400 55556',
    address: '5, Marina View, Chennai 600004',
    subjectMarks: [
      { subject: 'DBMS', internal: 46, maxInternal: 50 },
      { subject: 'Computer Networks', internal: 44, maxInternal: 50 },
      { subject: 'Web Technologies', internal: 47, maxInternal: 50 },
    ],
    assignments: [
      { name: 'IT5001 ER Diagram Assignment', submitted: true },
      { name: 'IT5002 Protocol Analysis', submitted: true },
    ],
  },
  // 5. Priya Sharma - ECE (Residential)
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
  // 6. Rohit Kumar - MECH (Residential)
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
  // 7. Nisha Kulkarni - AI_DS (Day Scholar)
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

export const initialStudyMaterials: StudyMaterial[] = [
  // CSE Materials (Verified by CSE HOD Dr. Priya Kumar)
  {
    id: 'm-cse-001',
    title: 'CS401 Unit 2 – Dynamic Programming Notes',
    departmentCode: 'CSE',
    subjectCode: 'CS401',
    subjectName: 'Design & Analysis of Algorithms',
    unit: 2,
    topic: 'Dynamic Programming (Knapsack & LCS)',
    type: 'PDF',
    description: 'Comprehensive notes covering DP memoization, tabulation, 0/1 Knapsack, and Longest Common Subsequence.',
    fileName: 'CS401_Unit2_DP.pdf',
    fileSize: '3.1 MB',
    academicYear: '2025–2026',
    semester: 6,
    targetClass: 'B.Tech CSE',
    section: 'A & B',
    facultyId: 'f-cse-arun',
    facultyName: 'Mr. Arun Kumar',
    status: 'Approved',
    submittedAt: '2026-08-18',
    reviewedAt: '2026-08-20',
    publishedAt: '2026-08-20',
  },
  {
    id: 'm-cse-002',
    title: 'CS402 Unit 2 – Normalization & B+ Trees',
    departmentCode: 'CSE',
    subjectCode: 'CS402',
    subjectName: 'Database Management Systems',
    unit: 2,
    topic: 'Normalization (1NF, 2NF, 3NF, BCNF) & Indexing',
    type: 'Notes',
    description: 'Theory, decomposition rules, and indexing structures using B+ trees with practice solutions.',
    fileName: 'CS402_Unit2_Normalization.pdf',
    fileSize: '2.4 MB',
    academicYear: '2025–2026',
    semester: 6,
    targetClass: 'B.Tech CSE',
    section: 'A & B',
    facultyId: 'f-cse-arun',
    facultyName: 'Mr. Arun Kumar',
    status: 'Approved',
    submittedAt: '2026-08-24',
    reviewedAt: '2026-08-26',
    publishedAt: '2026-08-26',
  },
  {
    id: 'm-cse-003',
    title: 'CS401 Unit 3 – Graph Algorithms & Network Flow',
    departmentCode: 'CSE',
    subjectCode: 'CS401',
    subjectName: 'Design & Analysis of Algorithms',
    unit: 3,
    topic: 'Shortest Path & Max Flow',
    type: 'PPT',
    description: 'Lecture slide deck covering Dijkstra, Bellman-Ford, and Ford-Fulkerson algorithm implementations.',
    fileName: 'CS401_Unit3_GraphFlow.pptx',
    fileSize: '6.2 MB',
    academicYear: '2025–2026',
    semester: 6,
    targetClass: 'B.Tech CSE',
    section: 'A',
    facultyId: 'f-cse-arun',
    facultyName: 'Mr. Arun Kumar',
    status: 'Submitted',
    submittedAt: '2026-09-02',
  },
  {
    id: 'm-cse-004',
    title: 'CS402 Previous Year Questions (2022–2025)',
    departmentCode: 'CSE',
    subjectCode: 'CS402',
    subjectName: 'Database Management Systems',
    unit: 5,
    topic: 'Comprehensive University Exam PYQ Solution Bank',
    type: 'Previous Year QP',
    description: 'Solved university examination question papers for internal and semester preparation.',
    fileName: 'CS402_PYQ_Solved.pdf',
    fileSize: '4.8 MB',
    academicYear: '2025–2026',
    semester: 6,
    targetClass: 'B.Tech CSE',
    section: 'A & B',
    facultyId: 'f-cse-arun',
    facultyName: 'Mr. Arun Kumar',
    status: 'Under Verification',
    submittedAt: '2026-09-03',
  },
  {
    id: 'm-cse-005',
    title: 'CS401 Algorithm Lab Manual & Test Cases',
    departmentCode: 'CSE',
    subjectCode: 'CS401',
    subjectName: 'Design & Analysis of Algorithms',
    unit: 1,
    topic: 'Laboratory Practicals & Complexity Verification',
    type: 'Lab Material',
    description: 'Step-by-step experiment instructions for sorting, searching, and recursion profiling.',
    fileName: 'CS401_Lab_Manual.pdf',
    fileSize: '1.9 MB',
    academicYear: '2025–2026',
    semester: 6,
    targetClass: 'B.Tech CSE',
    section: 'A & B',
    facultyId: 'f-cse-arun',
    facultyName: 'Mr. Arun Kumar',
    status: 'Rejected',
    submittedAt: '2026-08-28',
    reviewedAt: '2026-08-30',
    rejectionReason: 'Please add expected test outputs and asymptotic benchmark graphs for experiments 4 and 5.',
  },

  // IT Materials (Submitted by Dr. Rohit Sharma -> Verified by IT HOD Dr. Rajesh Venkat)
  {
    id: 'm-it-001',
    title: 'IT5001 Unit 2 – SQL Queries and Joins',
    departmentCode: 'IT',
    subjectCode: 'IT5001',
    subjectName: 'Database Management Systems',
    unit: 2,
    topic: 'SQL Joins, Subqueries & Window Functions',
    type: 'PDF',
    description: 'In-depth SQL reference manual with relational schema scenarios and performance optimization tips.',
    fileName: 'IT5001_Unit2_SQL_Joins.pdf',
    fileSize: '2.8 MB',
    academicYear: '2025–2026',
    semester: 5,
    targetClass: 'B.Tech IT',
    section: 'A & B',
    facultyId: 'f-it-rohit',
    facultyName: 'Dr. Rohit Sharma',
    status: 'Approved',
    submittedAt: '2026-08-21',
    reviewedAt: '2026-08-23',
    publishedAt: '2026-08-23',
  },
  {
    id: 'm-it-002',
    title: 'IT5002 Unit 2 – TCP/IP Protocol Architecture',
    departmentCode: 'IT',
    subjectCode: 'IT5002',
    subjectName: 'Computer Networks',
    unit: 2,
    topic: 'TCP Handshake, IP Subnetting & CIDR',
    type: 'PPT',
    description: 'Presentation deck with packet diagrams, subnetting math exercises, and Wireshark traces.',
    fileName: 'IT5002_Unit2_TCPIP.pptx',
    fileSize: '5.4 MB',
    academicYear: '2025–2026',
    semester: 5,
    targetClass: 'B.Tech IT',
    section: 'A & B',
    facultyId: 'f-it-rohit',
    facultyName: 'Dr. Rohit Sharma',
    status: 'Approved',
    submittedAt: '2026-08-26',
    reviewedAt: '2026-08-28',
    publishedAt: '2026-08-28',
  },
  {
    id: 'm-it-003',
    title: 'IT5001 Unit 3 – Normalization & Functional Dependencies',
    departmentCode: 'IT',
    subjectCode: 'IT5001',
    subjectName: 'Database Management Systems',
    unit: 3,
    topic: '1NF, 2NF, 3NF, BCNF Decomposition',
    type: 'Notes',
    description: 'Lecture notes with step-by-step normal form conversions and lossless join checks.',
    fileName: 'IT5001_Unit3_NormNotes.pdf',
    fileSize: '1.7 MB',
    academicYear: '2025–2026',
    semester: 5,
    targetClass: 'B.Tech IT',
    section: 'A',
    facultyId: 'f-it-rohit',
    facultyName: 'Dr. Rohit Sharma',
    status: 'Under Verification',
    submittedAt: '2026-09-03',
  },
  {
    id: 'm-it-004',
    title: 'IT5002 Question Bank – Units 1 to 3',
    departmentCode: 'IT',
    subjectCode: 'IT5002',
    subjectName: 'Computer Networks',
    unit: 3,
    topic: 'Network Layer & Transport Layer QB',
    type: 'Question Bank',
    description: 'Comprehensive 80-question question bank for Mid-Term review with numerical problems.',
    fileName: 'IT5002_QB_U1to3.pdf',
    fileSize: '1.2 MB',
    academicYear: '2025–2026',
    semester: 5,
    targetClass: 'B.Tech IT',
    section: 'A & B',
    facultyId: 'f-it-rohit',
    facultyName: 'Dr. Rohit Sharma',
    status: 'Rejected',
    submittedAt: '2026-08-29',
    reviewedAt: '2026-08-31',
    rejectionReason: 'Please attach detailed solution keys for the 10-mark subnetting derivation problems.',
  },
];

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

export const initialLeaveRequests: StudentLeaveRequest[] = [
  // Aarav Patel -> CSE Mentor (Mr. Arun Kumar) & Residential Warden
  {
    id: 'lr-aarav-01',
    studentId: 'std-aarav',
    studentName: 'Aarav Patel',
    regNo: '22CS084',
    departmentCode: 'CSE',
    mentorEmail: 'arun.kumar@edusphere.ai',
    mentorName: 'Mr. Arun Kumar',
    leaveType: 'Medical Leave',
    fromDate: '2026-09-10',
    toDate: '2026-09-12',
    numberOfDays: 3,
    reason: 'Severe viral fever and physician-prescribed rest. Medical certificate attached.',
    hasDocument: true,
    submittedAt: '2026-09-03',
    status: 'Pending',
    mentorStatus: 'Pending',
    isHostelLeave: true,
    hostelBlock: 'Block 4 - Aryabhata',
    hostelRoom: '212',
    wardenStatus: 'Approved',
  },
  // Sameer Sen -> CSE Mentor (Mr. Arun Kumar)
  {
    id: 'lr-sameer-01',
    studentId: 'std-sameer',
    studentName: 'Sameer Sen',
    regNo: '22CS089',
    departmentCode: 'CSE',
    mentorEmail: 'arun.kumar@edusphere.ai',
    mentorName: 'Mr. Arun Kumar',
    leaveType: 'On-Duty Leave',
    fromDate: '2026-09-14',
    toDate: '2026-09-15',
    numberOfDays: 2,
    reason: 'Selected as representative for Inter-College Smart India Hackathon zonal round.',
    hasDocument: true,
    submittedAt: '2026-09-03',
    status: 'Pending',
    isHostelLeave: true,
    hostelBlock: 'Block 4 - Aryabhata',
    hostelRoom: '212',
    wardenStatus: 'Approved',
  },
  // Rahul S -> IT Mentor (Dr. Rohit Sharma)
  {
    id: 'lr-rahul-01',
    studentId: 'std-rahul',
    studentName: 'Rahul S',
    regNo: '22IT101',
    departmentCode: 'IT',
    mentorEmail: 'rohit.sharma@edusphere.ai',
    mentorName: 'Dr. Rohit Sharma',
    leaveType: 'Casual Leave',
    fromDate: '2026-09-11',
    toDate: '2026-09-12',
    numberOfDays: 2,
    reason: 'Attending elder sister wedding ceremony in hometown.',
    hasDocument: false,
    submittedAt: '2026-09-04',
    status: 'Pending',
    mentorStatus: 'Pending',
  },
  // Vikram S -> IT Mentor (Dr. Rohit Sharma)
  {
    id: 'lr-vikram-01',
    studentId: 'std-vikram',
    studentName: 'Vikram Sundaram',
    regNo: '22IT105',
    departmentCode: 'IT',
    mentorEmail: 'rohit.sharma@edusphere.ai',
    mentorName: 'Dr. Rohit Sharma',
    leaveType: 'Medical Leave',
    fromDate: '2026-08-25',
    toDate: '2026-08-26',
    numberOfDays: 2,
    reason: 'Dental emergency and orthodontic procedure.',
    hasDocument: true,
    submittedAt: '2026-08-24',
    status: 'Approved',
    actionAt: '2026-08-24',
    isHostelLeave: true,
    hostelBlock: 'Block 4 - Aryabhata',
    hostelRoom: '204',
    wardenStatus: 'Approved',
  },
  // Rohit Kumar -> MECH Leave (previously rejected)
  {
    id: 'lr-rohitk-01',
    studentId: 'std-rohit-kumar',
    studentName: 'Rohit Kumar',
    regNo: '22ME105',
    departmentCode: 'MECH',
    mentorEmail: 'vikram.sethi@edusphere.ai',
    mentorName: 'Dr. Vikram Sethi',
    leaveType: 'Personal Leave',
    fromDate: '2026-08-18',
    toDate: '2026-08-19',
    numberOfDays: 2,
    reason: 'Family trip.',
    hasDocument: false,
    submittedAt: '2026-08-16',
    status: 'Rejected',
    rejectionReason: 'Internal assessment scheduled during this period. Attendance is below minimum 75% threshold.',
    actionAt: '2026-08-17',
  },
];

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
    id: 'fl-cse-001',
    facultyName: 'Aarav Patil',
    facultyId: 'f-cse-aarav',
    facultyEmail: 'aarav.patil@edusphere.ai',
    departmentCode: 'CSE',
    departmentName: 'Computer Science & Engineering',
    leaveType: 'On Duty (OD)',
    fromDate: '2026-09-18',
    toDate: '2026-09-19',
    numberOfDays: 2,
    reason: 'Attending IEEE International Conference on Distributed Computing & Intelligent Systems at IISc Bengaluru.',
    supportingDocument: 'IEEE_Conference_Acceptance_Letter.pdf',
    submittedDate: '2026-09-04',
    status: 'Pending',
    isHODLeave: false,
  },
  {
    id: 'fl-cse-002',
    facultyName: 'Mr. Arun Kumar',
    facultyId: 'f-cse-arun',
    facultyEmail: 'arun.kumar@edusphere.ai',
    departmentCode: 'CSE',
    departmentName: 'Computer Science & Engineering',
    leaveType: 'Casual Leave',
    fromDate: '2026-09-25',
    toDate: '2026-09-26',
    numberOfDays: 2,
    reason: 'Family event and personal commitments in hometown.',
    submittedDate: '2026-09-03',
    status: 'Pending',
    isHODLeave: false,
  },
  {
    id: 'fl-it-001',
    facultyName: 'Dr. Rohit Sharma',
    facultyId: 'f-it-rohit',
    facultyEmail: 'rohit.sharma@edusphere.ai',
    departmentCode: 'IT',
    departmentName: 'Information Technology',
    leaveType: 'Medical Leave',
    fromDate: '2026-09-20',
    toDate: '2026-09-22',
    numberOfDays: 3,
    reason: 'Medical checkup and recovery period post-treatment.',
    supportingDocument: 'Medical_Prescription.pdf',
    submittedDate: '2026-09-02',
    status: 'Pending',
    isHODLeave: false,
  },
  // HOD's own leave request (routed to Admin/Dean)
  {
    id: 'fl-hod-cse-001',
    facultyName: 'Dr. Priya Kumar',
    facultyId: 'f-cse-hod',
    facultyEmail: 'priya.kumar@edusphere.ai',
    departmentCode: 'CSE',
    departmentName: 'Computer Science & Engineering',
    leaveType: 'On Duty (OD)',
    fromDate: '2026-09-28',
    toDate: '2026-09-29',
    numberOfDays: 2,
    reason: 'Participating in AICTE National Curriculum Development Committee Meeting at New Delhi.',
    supportingDocument: 'AICTE_Meeting_Invitation.pdf',
    submittedDate: '2026-09-01',
    status: 'Pending',
    isHODLeave: true,
  },
];

// ─── Department Academic Schedules (For HOD: All Years & Sections) ─────────
export interface DepartmentScheduleItem {
  id: string;
  departmentCode: string;
  year: 'I Year' | 'II Year' | 'III Year' | 'IV Year';
  semester: number;
  section: 'A' | 'B';
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string;
  endTime: string;
  subjectCode: string;
  subjectName: string;
  facultyName: string;
  room: string;
}

export const initialDepartmentSchedules: DepartmentScheduleItem[] = [
  // CSE III Year - Section A
  { id: 'ds-cse-3a-1', departmentCode: 'CSE', year: 'III Year', semester: 6, section: 'A', day: 'Monday', startTime: '09:00 AM', endTime: '10:00 AM', subjectCode: 'CS402', subjectName: 'Database Management Systems', facultyName: 'Aarav Patil', room: 'Tech Block A, Room 201' },
  { id: 'ds-cse-3a-2', departmentCode: 'CSE', year: 'III Year', semester: 6, section: 'A', day: 'Monday', startTime: '10:00 AM', endTime: '11:00 AM', subjectCode: 'CS401', subjectName: 'Design & Analysis of Algorithms', facultyName: 'Aarav Patil', room: 'Tech Block A, Room 201' },
  { id: 'ds-cse-3a-3', departmentCode: 'CSE', year: 'III Year', semester: 6, section: 'A', day: 'Monday', startTime: '11:15 AM', endTime: '12:15 PM', subjectCode: 'CS403', subjectName: 'Computer Networks & Security', facultyName: 'Mr. Arun Kumar', room: 'Tech Block A, Room 201' },
  { id: 'ds-cse-3a-4', departmentCode: 'CSE', year: 'III Year', semester: 6, section: 'A', day: 'Tuesday', startTime: '09:00 AM', endTime: '10:00 AM', subjectCode: 'CS404', subjectName: 'Artificial Intelligence & ML', facultyName: 'Dr. Priya Kumar', room: 'Tech Block A, Room 201' },
  { id: 'ds-cse-3a-5', departmentCode: 'CSE', year: 'III Year', semester: 6, section: 'A', day: 'Tuesday', startTime: '10:00 AM', endTime: '11:00 AM', subjectCode: 'CS402', subjectName: 'Database Management Systems', facultyName: 'Aarav Patil', room: 'Tech Block A, Room 201' },
  { id: 'ds-cse-3a-6', departmentCode: 'CSE', year: 'III Year', semester: 6, section: 'A', day: 'Wednesday', startTime: '09:00 AM', endTime: '10:00 AM', subjectCode: 'CS401', subjectName: 'Design & Analysis of Algorithms', facultyName: 'Aarav Patil', room: 'Tech Block A, Room 201' },
  { id: 'ds-cse-3a-7', departmentCode: 'CSE', year: 'III Year', semester: 6, section: 'A', day: 'Wednesday', startTime: '10:00 AM', endTime: '12:00 PM', subjectCode: 'CS402L', subjectName: 'DBMS Laboratory', facultyName: 'Aarav Patil', room: 'Computing Lab 3' },
  { id: 'ds-cse-3a-8', departmentCode: 'CSE', year: 'III Year', semester: 6, section: 'A', day: 'Thursday', startTime: '09:00 AM', endTime: '10:00 AM', subjectCode: 'CS403', subjectName: 'Computer Networks & Security', facultyName: 'Mr. Arun Kumar', room: 'Tech Block A, Room 201' },
  { id: 'ds-cse-3a-9', departmentCode: 'CSE', year: 'III Year', semester: 6, section: 'A', day: 'Thursday', startTime: '10:00 AM', endTime: '11:00 AM', subjectCode: 'CS404', subjectName: 'Artificial Intelligence & ML', facultyName: 'Dr. Priya Kumar', room: 'Tech Block A, Room 201' },
  { id: 'ds-cse-3a-10', departmentCode: 'CSE', year: 'III Year', semester: 6, section: 'A', day: 'Friday', startTime: '09:00 AM', endTime: '10:00 AM', subjectCode: 'CS401', subjectName: 'Design & Analysis of Algorithms', facultyName: 'Aarav Patil', room: 'Tech Block A, Room 201' },
  { id: 'ds-cse-3a-11', departmentCode: 'CSE', year: 'III Year', semester: 6, section: 'A', day: 'Friday', startTime: '10:00 AM', endTime: '12:00 PM', subjectCode: 'CS401L', subjectName: 'Algorithms Laboratory', facultyName: 'Aarav Patil', room: 'Computing Lab 2' },

  // CSE III Year - Section B
  { id: 'ds-cse-3b-1', departmentCode: 'CSE', year: 'III Year', semester: 6, section: 'B', day: 'Monday', startTime: '09:00 AM', endTime: '10:00 AM', subjectCode: 'CS403', subjectName: 'Computer Networks & Security', facultyName: 'Mr. Arun Kumar', room: 'Tech Block A, Room 202' },
  { id: 'ds-cse-3b-2', departmentCode: 'CSE', year: 'III Year', semester: 6, section: 'B', day: 'Monday', startTime: '10:00 AM', endTime: '11:00 AM', subjectCode: 'CS402', subjectName: 'Database Management Systems', facultyName: 'Aarav Patil', room: 'Tech Block A, Room 202' },
  { id: 'ds-cse-3b-3', departmentCode: 'CSE', year: 'III Year', semester: 6, section: 'B', day: 'Tuesday', startTime: '09:00 AM', endTime: '10:00 AM', subjectCode: 'CS401', subjectName: 'Design & Analysis of Algorithms', facultyName: 'Aarav Patil', room: 'Tech Block A, Room 202' },
  { id: 'ds-cse-3b-4', departmentCode: 'CSE', year: 'III Year', semester: 6, section: 'B', day: 'Tuesday', startTime: '11:15 AM', endTime: '12:15 PM', subjectCode: 'CS404', subjectName: 'Artificial Intelligence & ML', facultyName: 'Dr. Priya Kumar', room: 'Tech Block A, Room 202' },
  { id: 'ds-cse-3b-5', departmentCode: 'CSE', year: 'III Year', semester: 6, section: 'B', day: 'Wednesday', startTime: '10:00 AM', endTime: '11:00 AM', subjectCode: 'CS404', subjectName: 'Artificial Intelligence & ML', facultyName: 'Dr. Priya Kumar', room: 'Tech Block A, Room 202' },
  { id: 'ds-cse-3b-6', departmentCode: 'CSE', year: 'III Year', semester: 6, section: 'B', day: 'Thursday', startTime: '09:00 AM', endTime: '11:00 AM', subjectCode: 'CS402L', subjectName: 'DBMS Laboratory', facultyName: 'Aarav Patil', room: 'Computing Lab 3' },
  { id: 'ds-cse-3b-7', departmentCode: 'CSE', year: 'III Year', semester: 6, section: 'B', day: 'Friday', startTime: '10:00 AM', endTime: '11:00 AM', subjectCode: 'CS401', subjectName: 'Design & Analysis of Algorithms', facultyName: 'Aarav Patil', room: 'Tech Block A, Room 202' },

  // CSE II Year - Section A & B
  { id: 'ds-cse-2a-1', departmentCode: 'CSE', year: 'II Year', semester: 4, section: 'A', day: 'Monday', startTime: '09:00 AM', endTime: '10:00 AM', subjectCode: 'CS201', subjectName: 'Data Structures & OOP', facultyName: 'Mr. Arun Kumar', room: 'Tech Block A, Room 101' },
  { id: 'ds-cse-2a-2', departmentCode: 'CSE', year: 'II Year', semester: 4, section: 'A', day: 'Tuesday', startTime: '10:00 AM', endTime: '11:00 AM', subjectCode: 'CS202', subjectName: 'Discrete Mathematics', facultyName: 'Mr. Arun Kumar', room: 'Tech Block A, Room 101' },
  { id: 'ds-cse-2b-1', departmentCode: 'CSE', year: 'II Year', semester: 4, section: 'B', day: 'Monday', startTime: '10:00 AM', endTime: '11:00 AM', subjectCode: 'CS201', subjectName: 'Data Structures & OOP', facultyName: 'Mr. Arun Kumar', room: 'Tech Block A, Room 102' },
  { id: 'ds-cse-2b-2', departmentCode: 'CSE', year: 'II Year', semester: 4, section: 'B', day: 'Wednesday', startTime: '09:00 AM', endTime: '10:00 AM', subjectCode: 'CS203', subjectName: 'Computer Architecture', facultyName: 'Aarav Patil', room: 'Tech Block A, Room 102' },

  // CSE I Year - Section A & B
  { id: 'ds-cse-1a-1', departmentCode: 'CSE', year: 'I Year', semester: 2, section: 'A', day: 'Monday', startTime: '09:00 AM', endTime: '10:00 AM', subjectCode: 'CS101', subjectName: 'Problem Solving & Python Programming', facultyName: 'Aarav Patil', room: 'Basic Science Block, Room 101' },
  { id: 'ds-cse-1b-1', departmentCode: 'CSE', year: 'I Year', semester: 2, section: 'B', day: 'Tuesday', startTime: '11:15 AM', endTime: '12:15 PM', subjectCode: 'CS101', subjectName: 'Problem Solving & Python Programming', facultyName: 'Aarav Patil', room: 'Basic Science Block, Room 102' },

  // CSE IV Year - Section A & B
  { id: 'ds-cse-4a-1', departmentCode: 'CSE', year: 'IV Year', semester: 8, section: 'A', day: 'Monday', startTime: '11:15 AM', endTime: '12:15 PM', subjectCode: 'CS451', subjectName: 'Cloud Computing & Distributed Systems', facultyName: 'Dr. Priya Kumar', room: 'Tech Block A, Room 301' },
  { id: 'ds-cse-4b-1', departmentCode: 'CSE', year: 'IV Year', semester: 8, section: 'B', day: 'Thursday', startTime: '02:00 PM', endTime: '04:00 PM', subjectCode: 'CS452', subjectName: 'Capstone Project Technical Review', facultyName: 'Dr. Priya Kumar', room: 'Innovation Seminar Hall' },
];

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
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string;
  endTime: string;
  room: string;
}

export const initialFacultySchedules: FacultyScheduleItem[] = [
  // 1. Aarav Patil Schedule (CSE)
  { id: 'fs-aarav-1', facultyName: 'Aarav Patil', facultyEmail: 'aarav.patil@edusphere.ai', departmentCode: 'CSE', subjectCode: 'CS402', subjectName: 'Database Management Systems', classYear: 'III Year', semester: 6, section: 'A', day: 'Monday', startTime: '09:00 AM', endTime: '10:00 AM', room: 'Tech Block A, Room 201' },
  { id: 'fs-aarav-2', facultyName: 'Aarav Patil', facultyEmail: 'aarav.patil@edusphere.ai', departmentCode: 'CSE', subjectCode: 'CS401', subjectName: 'Design & Analysis of Algorithms', classYear: 'III Year', semester: 6, section: 'A', day: 'Monday', startTime: '10:00 AM', endTime: '11:00 AM', room: 'Tech Block A, Room 201' },
  { id: 'fs-aarav-3', facultyName: 'Aarav Patil', facultyEmail: 'aarav.patil@edusphere.ai', departmentCode: 'CSE', subjectCode: 'CS402', subjectName: 'Database Management Systems', classYear: 'III Year', semester: 6, section: 'B', day: 'Monday', startTime: '10:00 AM', endTime: '11:00 AM', room: 'Tech Block A, Room 202' },
  { id: 'fs-aarav-4', facultyName: 'Aarav Patil', facultyEmail: 'aarav.patil@edusphere.ai', departmentCode: 'CSE', subjectCode: 'CS401', subjectName: 'Design & Analysis of Algorithms', classYear: 'III Year', semester: 6, section: 'B', day: 'Tuesday', startTime: '09:00 AM', endTime: '10:00 AM', room: 'Tech Block A, Room 202' },
  { id: 'fs-aarav-5', facultyName: 'Aarav Patil', facultyEmail: 'aarav.patil@edusphere.ai', departmentCode: 'CSE', subjectCode: 'CS402', subjectName: 'Database Management Systems', classYear: 'III Year', semester: 6, section: 'A', day: 'Tuesday', startTime: '10:00 AM', endTime: '11:00 AM', room: 'Tech Block A, Room 201' },
  { id: 'fs-aarav-6', facultyName: 'Aarav Patil', facultyEmail: 'aarav.patil@edusphere.ai', departmentCode: 'CSE', subjectCode: 'CS401', subjectName: 'Design & Analysis of Algorithms', classYear: 'III Year', semester: 6, section: 'A', day: 'Wednesday', startTime: '09:00 AM', endTime: '10:00 AM', room: 'Tech Block A, Room 201' },
  { id: 'fs-aarav-7', facultyName: 'Aarav Patil', facultyEmail: 'aarav.patil@edusphere.ai', departmentCode: 'CSE', subjectCode: 'CS402L', subjectName: 'DBMS Laboratory', classYear: 'III Year', semester: 6, section: 'A', day: 'Wednesday', startTime: '10:00 AM', endTime: '12:00 PM', room: 'Computing Lab 3' },
  { id: 'fs-aarav-8', facultyName: 'Aarav Patil', facultyEmail: 'aarav.patil@edusphere.ai', departmentCode: 'CSE', subjectCode: 'CS402L', subjectName: 'DBMS Laboratory', classYear: 'III Year', semester: 6, section: 'B', day: 'Thursday', startTime: '09:00 AM', endTime: '11:00 AM', room: 'Computing Lab 3' },
  { id: 'fs-aarav-9', facultyName: 'Aarav Patil', facultyEmail: 'aarav.patil@edusphere.ai', departmentCode: 'CSE', subjectCode: 'CS401', subjectName: 'Design & Analysis of Algorithms', classYear: 'III Year', semester: 6, section: 'A', day: 'Friday', startTime: '09:00 AM', endTime: '10:00 AM', room: 'Tech Block A, Room 201' },
  { id: 'fs-aarav-10', facultyName: 'Aarav Patil', facultyEmail: 'aarav.patil@edusphere.ai', departmentCode: 'CSE', subjectCode: 'CS401L', subjectName: 'Algorithms Laboratory', classYear: 'III Year', semester: 6, section: 'A', day: 'Friday', startTime: '10:00 AM', endTime: '12:00 PM', room: 'Computing Lab 2' },

  // 2. Mr. Arun Kumar Schedule (CSE)
  { id: 'fs-arun-1', facultyName: 'Mr. Arun Kumar', facultyEmail: 'arun.kumar@edusphere.ai', departmentCode: 'CSE', subjectCode: 'CS403', subjectName: 'Computer Networks & Security', classYear: 'III Year', semester: 6, section: 'A', day: 'Monday', startTime: '11:15 AM', endTime: '12:15 PM', room: 'Tech Block A, Room 201' },
  { id: 'fs-arun-2', facultyName: 'Mr. Arun Kumar', facultyEmail: 'arun.kumar@edusphere.ai', departmentCode: 'CSE', subjectCode: 'CS403', subjectName: 'Computer Networks & Security', classYear: 'III Year', semester: 6, section: 'B', day: 'Monday', startTime: '09:00 AM', endTime: '10:00 AM', room: 'Tech Block A, Room 202' },
  { id: 'fs-arun-3', facultyName: 'Mr. Arun Kumar', facultyEmail: 'arun.kumar@edusphere.ai', departmentCode: 'CSE', subjectCode: 'CS403', subjectName: 'Computer Networks & Security', classYear: 'III Year', semester: 6, section: 'A', day: 'Thursday', startTime: '09:00 AM', endTime: '10:00 AM', room: 'Tech Block A, Room 201' },
  { id: 'fs-arun-4', facultyName: 'Mr. Arun Kumar', facultyEmail: 'arun.kumar@edusphere.ai', departmentCode: 'CSE', subjectCode: 'CS201', subjectName: 'Data Structures & OOP', classYear: 'II Year', semester: 4, section: 'A', day: 'Monday', startTime: '09:00 AM', endTime: '10:00 AM', room: 'Tech Block A, Room 101' },

  // 3. Dr. Priya Kumar Schedule (CSE HOD)
  { id: 'fs-priya-1', facultyName: 'Dr. Priya Kumar', facultyEmail: 'priya.kumar@edusphere.ai', departmentCode: 'CSE', subjectCode: 'CS404', subjectName: 'Artificial Intelligence & ML', classYear: 'III Year', semester: 6, section: 'A', day: 'Tuesday', startTime: '09:00 AM', endTime: '10:00 AM', room: 'Tech Block A, Room 201' },
  { id: 'fs-priya-2', facultyName: 'Dr. Priya Kumar', facultyEmail: 'priya.kumar@edusphere.ai', departmentCode: 'CSE', subjectCode: 'CS404', subjectName: 'Artificial Intelligence & ML', classYear: 'III Year', semester: 6, section: 'B', day: 'Tuesday', startTime: '11:15 AM', endTime: '12:15 PM', room: 'Tech Block A, Room 202' },
  { id: 'fs-priya-3', facultyName: 'Dr. Priya Kumar', facultyEmail: 'priya.kumar@edusphere.ai', departmentCode: 'CSE', subjectCode: 'CS404', subjectName: 'Artificial Intelligence & ML', classYear: 'III Year', semester: 6, section: 'A', day: 'Thursday', startTime: '10:00 AM', endTime: '11:00 AM', room: 'Tech Block A, Room 201' },
  { id: 'fs-priya-4', facultyName: 'Dr. Priya Kumar', facultyEmail: 'priya.kumar@edusphere.ai', departmentCode: 'CSE', subjectCode: 'CS451', subjectName: 'Cloud Computing & Distributed Systems', classYear: 'IV Year', semester: 8, section: 'A', day: 'Monday', startTime: '11:15 AM', endTime: '12:15 PM', room: 'Tech Block A, Room 301' },
];

// ─── Examination Timetable ─────────────────────────────────────────────────
export interface ExamItem {
  id: string;
  departmentCode: string;
  subjectCode: string;
  subject: string;
  examType: ExamType;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  semester: number;
  daysRemaining: number;
  reminderSent: boolean;
}

export const initialExamSchedule: ExamItem[] = [
  // CSE Exams
  {
    id: 'ex-cse-001',
    departmentCode: 'CSE',
    subjectCode: 'CS401',
    subject: 'Design & Analysis of Algorithms',
    examType: 'Internal Exam',
    date: '2026-09-14',
    startTime: '09:30 AM',
    endTime: '11:00 AM',
    venue: 'Tech Block A, Hall 101',
    semester: 6,
    daysRemaining: 9,
    reminderSent: false,
  },
  {
    id: 'ex-cse-002',
    departmentCode: 'CSE',
    subjectCode: 'CS402',
    subject: 'Database Management Systems',
    examType: 'Internal Exam',
    date: '2026-09-17',
    startTime: '09:30 AM',
    endTime: '11:00 AM',
    venue: 'Tech Block A, Hall 102',
    semester: 6,
    daysRemaining: 12,
    reminderSent: false,
  },
  {
    id: 'ex-cse-003',
    departmentCode: 'CSE',
    subjectCode: 'CS401',
    subject: 'Algorithms Lab Practical Assessment',
    examType: 'Lab Exam',
    date: '2026-09-22',
    startTime: '01:30 PM',
    endTime: '04:30 PM',
    venue: 'Computing Lab 3',
    semester: 6,
    daysRemaining: 17,
    reminderSent: false,
  },

  // IT Exams
  {
    id: 'ex-it-001',
    departmentCode: 'IT',
    subjectCode: 'IT5001',
    subject: 'Database Management Systems',
    examType: 'Internal Exam',
    date: '2026-09-15',
    startTime: '10:00 AM',
    endTime: '11:30 AM',
    venue: 'Examination Hall 1',
    semester: 5,
    daysRemaining: 10,
    reminderSent: false,
  },
  {
    id: 'ex-it-002',
    departmentCode: 'IT',
    subjectCode: 'IT5002',
    subject: 'Computer Networks',
    examType: 'Internal Exam',
    date: '2026-09-18',
    startTime: '10:00 AM',
    endTime: '11:30 AM',
    venue: 'Examination Hall 2',
    semester: 5,
    daysRemaining: 13,
    reminderSent: false,
  },
  {
    id: 'ex-it-003',
    departmentCode: 'IT',
    subjectCode: 'IT5001',
    subject: 'DBMS Lab & Query Performance Practical',
    examType: 'Lab Exam',
    date: '2026-09-24',
    startTime: '02:00 PM',
    endTime: '05:00 PM',
    venue: 'Systems Lab 2',
    semester: 5,
    daysRemaining: 19,
    reminderSent: false,
  },
];

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

export const initialRoleNotifications: RoleNotification[] = [
  // HOD CSE Notifications
  {
    id: 'notif-hod-01',
    recipientEmail: 'priya.kumar@edusphere.ai',
    recipientRole: 'HOD',
    departmentCode: 'CSE',
    title: 'New Material for Verification',
    message: 'Mr. Arun Kumar submitted "CS401 Unit 3 – Graph Algorithms" for HOD verification.',
    category: 'Material',
    isRead: false,
    createdAt: '2026-09-02T10:15:00',
  },
  // Faculty CSE Notifications
  {
    id: 'notif-fac-01',
    recipientEmail: 'arun.kumar@edusphere.ai',
    recipientRole: 'FACULTY',
    departmentCode: 'CSE',
    title: 'Material Approved by HOD',
    message: 'Your material "CS402 Unit 2 – Normalization & B+ Trees" has been approved and published to CSE students.',
    category: 'Material',
    isRead: false,
    createdAt: '2026-08-26T14:30:00',
  },
  // Mentor CSE Notifications
  {
    id: 'notif-mnt-01',
    recipientEmail: 'arun.kumar@edusphere.ai',
    recipientRole: 'MENTOR',
    departmentCode: 'CSE',
    title: 'Student Leave Request Pending',
    message: 'Aarav Patel (22CS084) submitted a Medical Leave request for 3 days.',
    category: 'Leave',
    isRead: false,
    createdAt: '2026-09-04T09:00:00',
  },
  // Faculty/Mentor IT Notifications (Dr. Rohit Sharma)
  {
    id: 'notif-rohit-01',
    recipientEmail: 'rohit.sharma@edusphere.ai',
    recipientRole: 'FACULTY',
    departmentCode: 'IT',
    title: 'IT Department Material Approved',
    message: 'Your study material "IT5001 Unit 2 – SQL Queries and Joins" was approved by IT HOD.',
    category: 'Material',
    isRead: false,
    createdAt: '2026-08-23T11:00:00',
  },
  {
    id: 'notif-rohit-02',
    recipientEmail: 'rohit.sharma@edusphere.ai',
    recipientRole: 'MENTOR',
    departmentCode: 'IT',
    title: 'IT Mentee Leave Submitted',
    message: 'Rahul S (22IT101) requested Casual Leave from Sep 11 to Sep 12.',
    category: 'Leave',
    isRead: false,
    createdAt: '2026-09-04T10:00:00',
  },
  // Warden Notifications
  {
    id: 'notif-war-01',
    recipientEmail: 'warden@edusphere.ai',
    recipientRole: 'WARDEN',
    title: 'Hostel Outing Request',
    message: 'Aarav Patel (Block 4, Room 212) submitted an out-of-station hostel leave pass.',
    category: 'Hostel',
    isRead: false,
    createdAt: '2026-09-04T09:15:00',
  },
];

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

