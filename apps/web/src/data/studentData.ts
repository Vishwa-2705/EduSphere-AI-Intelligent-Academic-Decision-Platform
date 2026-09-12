export type AccommodationStatus = 'Hosteller' | 'Day Scholar';

export type StudentRecord = {
  email: string;
  name: string;
  registerNumber: string;
  programme: string;
  department: string;
  semester: string;
  accommodationStatus?: AccommodationStatus;
  academicYear: string;
  admissionYear: string;
  admissionType: string;
  dateOfAdmission: string;
  phone: string;
  emailDisplay: string;
  address: string;
  dob: string;
  guardian: string;
  guardianPhone: string;
  emergencyContact: string;
  academicStatus: string;
  cgpa: number;
  sgpa: number;
  gender: 'Male' | 'Female';
  mentorName: string;
  mentorDepartment: string;
  mentorDesignation: string;
  mentorEmail: string;
  mentorContact: string;
  mentorHours: string;
  mentorNextMeeting: string;
  mentorRecentInfo: string;
  hostelBlock: string;
  hostelRoom: string;
  hostelBed: string;
  hostelFee: number;
  busFee: number;
  roommateName: string;
  roommateDepartment: string;
  roommatePhone: string;
  tuitionFee: number;
  laboratoryFee: number;
  libraryFee: number;
  totalFee: number;
  paidFee: number;
  balanceFee: number;
  transactionId: string;
  paymentMethod: string;
  studentType?: 'RESIDENTIAL' | 'DAY_SCHOLAR';
};

export type StudentNotification = {
  category: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  expanded: boolean;
  icon: string;
  details?: { label: string; value: string }[];
};

export const studentRecords: StudentRecord[] = [
  {
    email: 'aarav@edusphere.ai',
    name: 'Aarav Patel',
    registerNumber: '22CS084',
    programme: 'B.Tech Computer Science & Engineering',
    department: 'Computer Science & Engineering',
    semester: 'VI',
    academicYear: '2025 - 2026',
    admissionYear: '2022',
    admissionType: 'Management Quota',
    dateOfAdmission: '14 Aug 2022',
    phone: '+91 98765 43210',
    emailDisplay: 'aarav@edusphere.ai',
    address: '12, Emerald Residency, Nehru Nagar, Bengaluru, Karnataka 560020',
    dob: '15 Aug 2004',
    guardian: 'Mr. Rakesh Patel',
    guardianPhone: '+91 99887 66554',
    emergencyContact: 'Ms. Nisha Patel / +91 97777 33445',
    academicStatus: 'Dean’s Honor Roll Track',
    cgpa: 8.9,
    sgpa: 8.8,
    gender: 'Male',
    mentorName: 'Mr. Arun Kumar',
    mentorDepartment: 'Computer Science & Engineering',
    mentorDesignation: 'Associate Professor & Faculty Mentor',
    mentorEmail: 'arun.kumar@edusphere.ai',
    mentorContact: '+91 98400 22345',
    mentorHours: 'Tue & Thu • 4:00 PM - 5:30 PM',
    mentorNextMeeting: 'Thursday, 05 Sep 2026 • 4:15 PM',
    mentorRecentInfo: 'Assigned mentor Arun Kumar for academic guidance and project supervision.',
    accommodationStatus: 'Hosteller',
    hostelBlock: 'Block 4 - Aryabhata',
    hostelRoom: '212',
    hostelBed: 'Bed-A (Window Side)',
    hostelFee: 28000,
    busFee: 0,
    roommateName: 'Sameer Sen (22CS089)',
    roommateDepartment: 'Computer Science & Engineering',
    roommatePhone: '+91 94567 89012',
    tuitionFee: 45000,
    laboratoryFee: 12000,
    libraryFee: 3500,
    totalFee: 88500,
    paidFee: 88500,
    balanceFee: 0,
    transactionId: 'TXN-EDU-984511',
    paymentMethod: 'ONLINE_UPI',
  },
  {
    email: 'priya.sharma@edusphere.ai',
    name: 'Priya Sharma',
    registerNumber: '22EC091',
    programme: 'B.Tech Electronics & Communication Engineering',
    department: 'Electronics & Communication Engineering',
    semester: 'VI',
    academicYear: '2025 - 2026',
    admissionYear: '2022',
    admissionType: 'Merit Quota',
    dateOfAdmission: '12 Aug 2022',
    phone: '+91 91234 67890',
    emailDisplay: 'priya.sharma@edusphere.ai',
    address: '18, Lotus Arcade, Whitefield, Bengaluru, Karnataka 560066',
    dob: '22 Sep 2004',
    guardian: 'Mr. Sunil Sharma',
    guardianPhone: '+91 98555 33221',
    emergencyContact: 'Ms. Neha Sharma / +91 97723 44551',
    academicStatus: 'Merit Scholarship Track',
    cgpa: 9.2,
    sgpa: 9.1,
    gender: 'Female',
    mentorName: 'Dr. Nisha Reddy',
    mentorDepartment: 'Electronics & Communication Engineering',
    mentorDesignation: 'Associate Professor',
    mentorEmail: 'nisha.reddy@edusphere.ai',
    mentorContact: '+91 99880 11345',
    mentorHours: 'Mon & Wed • 3:30 PM - 5:00 PM',
    mentorNextMeeting: 'Wednesday, 04 Sep 2026 • 3:45 PM',
    mentorRecentInfo: 'Reviewed her DSP project roadmap, communication lab performance, and attendance recovery plan with a mentoring focus on stay-on-track progression.',
    accommodationStatus: 'Hosteller',
    hostelBlock: 'Block 2 - Veda',
    hostelRoom: '108',
    hostelBed: 'Bed-B (East Side)',
    hostelFee: 24000,
    busFee: 0,
    roommateName: 'Nandini Joshi (22EC099)',
    roommateDepartment: 'Electronics & Communication Engineering',
    roommatePhone: '+91 98456 44321',
    tuitionFee: 47000,
    laboratoryFee: 13500,
    libraryFee: 4200,
    totalFee: 88700,
    paidFee: 88700,
    balanceFee: 0,
    transactionId: 'TXN-EDU-952104',
    paymentMethod: 'NETBANKING',
  },
  {
    email: 'rohit.kumar@edusphere.ai',
    name: 'Rohit Kumar',
    registerNumber: '22ME105',
    programme: 'B.Tech Mechanical Engineering',
    department: 'Mechanical Engineering',
    semester: 'VI',
    academicYear: '2025 - 2026',
    admissionYear: '2022',
    admissionType: 'Merit Quota',
    dateOfAdmission: '10 Aug 2022',
    phone: '+91 93456 78901',
    emailDisplay: 'rohit.kumar@edusphere.ai',
    address: '7, Green Park Residency, Koramangala, Bengaluru, Karnataka 560095',
    dob: '10 Nov 2004',
    guardian: 'Mr. Mahesh Kumar',
    guardianPhone: '+91 98333 44556',
    emergencyContact: 'Ms. Kavya Kumar / +91 97744 11223',
    academicStatus: 'Applied Research Track',
    cgpa: 8.6,
    sgpa: 8.7,
    gender: 'Male',
    mentorName: 'Dr. Vikram Sethi',
    mentorDepartment: 'Mechanical Engineering',
    mentorDesignation: 'Assistant Professor',
    mentorEmail: 'vikram.sethi@edusphere.ai',
    mentorContact: '+91 98710 33421',
    mentorHours: 'Tue & Fri • 2:30 PM - 4:00 PM',
    mentorNextMeeting: 'Friday, 06 Sep 2026 • 2:45 PM',
    mentorRecentInfo: 'Discussed thermal engineering progress, CAD project milestones, and workshop practice with a focus on applied research and practical improvement.',
    accommodationStatus: 'Hosteller',
    hostelBlock: 'Block 5 - Bhaskara',
    hostelRoom: '315',
    hostelBed: 'Bed-C (North Side)',
    hostelFee: 26000,
    busFee: 0,
    roommateName: 'Karan Nair (22ME110)',
    roommateDepartment: 'Mechanical Engineering',
    roommatePhone: '+91 97665 11432',
    tuitionFee: 43000,
    laboratoryFee: 11800,
    libraryFee: 3600,
    totalFee: 84400,
    paidFee: 84400,
    balanceFee: 0,
    transactionId: 'TXN-EDU-912776',
    paymentMethod: 'CARD',
  },
  {
    email: 'nisha.kulkarni@edusphere.ai',
    name: 'Nisha Kulkarni',
    registerNumber: '23AI042',
    programme: 'B.Tech Artificial Intelligence & Data Science',
    department: 'Artificial Intelligence & Data Science',
    semester: 'IV',
    academicYear: '2025 - 2026',
    admissionYear: '2023',
    admissionType: 'Merit Quota',
    dateOfAdmission: '16 Aug 2023',
    phone: '+91 90123 45678',
    emailDisplay: 'nisha.kulkarni@edusphere.ai',
    address: '44, Lake View Apartments, Indiranagar, Bengaluru, Karnataka 560038',
    dob: '08 Mar 2005',
    guardian: 'Mrs. Meena Kulkarni',
    guardianPhone: '+91 99880 11223',
    emergencyContact: 'Mr. Ajay Kulkarni / +91 98877 66554',
    academicStatus: 'Data Science Scholars Track',
    cgpa: 8.7,
    sgpa: 8.9,
    gender: 'Female',
    mentorName: 'Dr. V. Sen',
    mentorDepartment: 'Artificial Intelligence & Data Science',
    mentorDesignation: 'Associate Professor',
    mentorEmail: 'v.sen@edusphere.ai',
    mentorContact: '+91 97654 11009',
    mentorHours: 'Mon & Wed • 3:00 PM - 4:30 PM',
    mentorNextMeeting: 'Wednesday, 09 Sep 2026 • 3:30 PM',
    mentorRecentInfo: 'Reviewed machine learning coursework and the student research project plan.',
    hostelBlock: '',
    hostelRoom: '',
    hostelBed: '',
    hostelFee: 0,
    busFee: 6000,
    roommateName: '',
    roommateDepartment: '',
    roommatePhone: '',
    tuitionFee: 46000,
    laboratoryFee: 12500,
    libraryFee: 3500,
    totalFee: 62000,
    paidFee: 62000,
    balanceFee: 0,
    transactionId: 'TXN-EDU-973442',
    paymentMethod: 'ONLINE_UPI',
    studentType: 'DAY_SCHOLAR',
  },
  {
    email: 'rahul.s@edusphere.ai',
    name: 'Rahul S',
    registerNumber: '22IT101',
    programme: 'B.Tech Information Technology',
    department: 'Information Technology',
    semester: 'VI',
    academicYear: '2025 - 2026',
    admissionYear: '2022',
    admissionType: 'Merit Quota',
    dateOfAdmission: '09 Aug 2022',
    phone: '+91 91234 55667',
    emailDisplay: 'rahul.s@edusphere.ai',
    address: '12, Gandhi Nagar, Chennai, Tamil Nadu 600020',
    dob: '14 Apr 2004',
    guardian: 'Mr. Suresh S',
    guardianPhone: '+91 94400 11112',
    emergencyContact: 'Mrs. Meena S / +91 98765 43222',
    academicStatus: 'Academic Improvement Track',
    cgpa: 8.4,
    sgpa: 8.5,
    gender: 'Male',
    mentorName: 'Dr. Rohit Sharma',
    mentorDepartment: 'Information Technology',
    mentorDesignation: 'Associate Professor & Faculty Mentor',
    mentorEmail: 'rohit.sharma@edusphere.ai',
    mentorContact: '+91 98765 43210',
    mentorHours: 'Tue & Thu • 3:00 PM - 4:30 PM',
    mentorNextMeeting: 'Thursday, 11 Sep 2026 • 3:15 PM',
    mentorRecentInfo: 'Monitoring DBMS and networking performance with a structured remediation plan for improved exam readiness.',
    accommodationStatus: 'Day Scholar',
    hostelBlock: '',
    hostelRoom: '',
    hostelBed: '',
    hostelFee: 0,
    busFee: 5000,
    roommateName: '',
    roommateDepartment: '',
    roommatePhone: '',
    tuitionFee: 44000,
    laboratoryFee: 11000,
    libraryFee: 3200,
    totalFee: 58200,
    paidFee: 58200,
    balanceFee: 0,
    transactionId: 'TXN-EDU-314159',
    paymentMethod: 'ONLINE_UPI',
    studentType: 'DAY_SCHOLAR',
  },
];

export const getStudentRecord = (email?: string): StudentRecord => {
  const normalized = (email || 'aarav@edusphere.ai').trim().toLowerCase();
  const normalizedAliasMap: Record<string, string> = {
    'rahul@edusphere.ai': 'rahul.s@edusphere.ai',
    'rahul.s@student.edusphere.ai': 'rahul.s@edusphere.ai',
  };
  const mappedEmail = normalizedAliasMap[normalized] || normalized;
  const record = studentRecords.find((student) => student.email === mappedEmail) || studentRecords[0];
  return {
    ...record,
    accommodationStatus: record.accommodationStatus || (record.studentType === 'DAY_SCHOLAR' ? 'Day Scholar' : 'Hosteller'),
  };
};

export const getStudentStorageKey = (email: string | undefined, key: string) => {
  const safeEmail = (email || 'aarav@edusphere.ai').trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
  return `edusphere_${safeEmail}_${key}`;
};

const departmentUnits: Record<string, string[]> = {
  EC401: ['Discrete-Time Signals', 'Z-Transform and System Analysis'],
  EC402: ['Processor Architecture', 'Embedded Interfaces and RTOS'],
  EC403: ['Radio Propagation', 'Cellular and Mobile Networks'],
  EC404: ['CMOS Circuit Design', 'Physical Design and Fabrication'],
  EC405: ['State-Space Analysis', 'Digital Control Systems'],
  EC406: ['Differential Amplifiers', 'Power Amplifiers and IC Design'],
  ME401: ['Power Cycles and Boilers', 'Refrigeration and HVAC'],
  ME402: ['CNC and Advanced Machining', 'Production Planning and Control'],
  ME403: ['Parametric Modelling', 'Finite Element Design'],
  ME404: ['Open Channel Flow', 'Turbomachinery and Fluid Machines'],
  ME405: ['Bearings and Gears', 'Machine Elements and CAD'],
  ME406: ['Composite Materials', 'Corrosion and Surface Engineering'],
  DS101: ['Searching and Sorting', 'Advanced Graph Algorithms'],
  DBMS201: ['Query Processing and Optimization', 'Distributed Databases'],
  CN301: ['Transport and Application Protocols', 'Network Administration'],
  OS302: ['Protection and Security', 'Distributed Operating Systems'],
  CC401: ['Serverless and Edge Computing', 'Cloud Observability'],
  AI501: ['Natural Language Processing', 'Responsible AI and Deployment'],
};

const withFiveCourseUnits = <T extends { courseCatalog: Array<{ code: string; units: string[] }> }>(profile: T): T => ({
  ...profile,
  courseCatalog: profile.courseCatalog.map((course) => ({
    ...course,
    units: [...course.units, ...(departmentUnits[course.code] || ['Practical Applications', 'Capstone Review and Assessment'])].slice(0, 5),
  })),
} as T);

export const getDepartmentAcademicProfile = (email?: string) => {
  const record = getStudentRecord(email);
  const department = record.department;

  if (department.includes('Electronics')) {
    return withFiveCourseUnits({
      timetableByDay: {
        Monday: [
          { time: '09:00 - 10:00', subject: 'Digital Signal Processing', faculty: 'Dr. Neha Iyer', room: 'ECE Lab 2', status: 'Active' },
          { time: '10:15 - 11:15', subject: 'Microprocessors & Embedded Systems', faculty: 'Prof. Vinay Shah', room: 'Hall E-204', status: 'Active' },
          { time: '11:30 - 12:30', subject: 'Wireless Communication', faculty: 'Dr. Meera Nair', room: 'RF Lab 1', status: 'Active' },
          { time: '12:30 - 13:30', subject: 'Lunch Break', faculty: 'Campus Cafeteria', room: 'Canteen', status: 'Break' },
          { time: '13:30 - 14:30', subject: 'VLSI Design', faculty: 'Dr. Anupama Reddy', room: 'VLSI Lab', status: 'Active' },
          { time: '14:45 - 15:45', subject: 'Analog Circuits', faculty: 'Prof. Karthik Nair', room: 'Circuit Lab', status: 'Active' },
          { time: '16:00 - 16:30', subject: 'Mentor Guidance', faculty: 'Dr. Neha Iyer', room: 'Mentor Desk', status: 'Active' },
        ],
        Tuesday: [
          { time: '09:00 - 10:00', subject: 'Control Systems', faculty: 'Dr. S. Prasad', room: 'Control Lab', status: 'Active' },
          { time: '10:15 - 11:15', subject: 'Analog Circuits', faculty: 'Prof. Karthik Nair', room: 'Circuit Lab', status: 'Active' },
          { time: '11:30 - 12:30', subject: 'Digital Signal Processing', faculty: 'Dr. Neha Iyer', room: 'ECE Lab 2', status: 'Active' },
          { time: '12:30 - 13:30', subject: 'Lunch Break', faculty: 'Campus Cafeteria', room: 'Canteen', status: 'Break' },
          { time: '13:30 - 14:30', subject: 'Microprocessors', faculty: 'Prof. Vinay Shah', room: 'Embedded Lab', status: 'Active' },
          { time: '14:45 - 15:45', subject: 'Wireless Communication', faculty: 'Dr. Meera Nair', room: 'RF Lab 1', status: 'Active' },
          { time: '16:00 - 16:30', subject: 'Mentor Guidance', faculty: 'Dr. Neha Iyer', room: 'Mentor Desk', status: 'Active' },
        ],
        Wednesday: [
          { time: '09:00 - 10:00', subject: 'VLSI Design', faculty: 'Dr. Anupama Reddy', room: 'VLSI Lab', status: 'Active' },
          { time: '10:15 - 11:15', subject: 'Control Systems', faculty: 'Dr. S. Prasad', room: 'Control Lab', status: 'Active' },
          { time: '11:30 - 12:30', subject: 'Microprocessors & Embedded Systems', faculty: 'Prof. Vinay Shah', room: 'Embedded Lab', status: 'Active' },
          { time: '12:30 - 13:30', subject: 'Lunch Break', faculty: 'Campus Cafeteria', room: 'Canteen', status: 'Break' },
          { time: '13:30 - 14:30', subject: 'Digital Signal Processing', faculty: 'Dr. Neha Iyer', room: 'ECE Lab 2', status: 'Active' },
          { time: '14:45 - 15:45', subject: 'Wireless Communication', faculty: 'Dr. Meera Nair', room: 'RF Lab 1', status: 'Active' },
          { time: '16:00 - 16:30', subject: 'Mentor Guidance', faculty: 'Dr. Neha Iyer', room: 'Mentor Desk', status: 'Active' },
        ],
        Thursday: [
          { time: '09:00 - 10:00', subject: 'Wireless Communication', faculty: 'Dr. Meera Nair', room: 'RF Lab 1', status: 'Active' },
          { time: '10:15 - 11:15', subject: 'VLSI Design', faculty: 'Dr. Anupama Reddy', room: 'VLSI Lab', status: 'Active' },
          { time: '11:30 - 12:30', subject: 'Analog Circuits', faculty: 'Prof. Karthik Nair', room: 'Circuit Lab', status: 'Active' },
          { time: '12:30 - 13:30', subject: 'Lunch Break', faculty: 'Campus Cafeteria', room: 'Canteen', status: 'Break' },
          { time: '13:30 - 14:30', subject: 'Control Systems', faculty: 'Dr. S. Prasad', room: 'Control Lab', status: 'Active' },
          { time: '14:45 - 15:45', subject: 'Embedded Lab', faculty: 'Prof. Vinay Shah', room: 'Embedded Lab', status: 'Active' },
          { time: '16:00 - 16:30', subject: 'Mentor Guidance', faculty: 'Dr. Neha Iyer', room: 'Mentor Desk', status: 'Active' },
        ],
        Friday: [
          { time: '09:00 - 10:00', subject: 'Digital Signal Processing', faculty: 'Dr. Neha Iyer', room: 'ECE Lab 2', status: 'Active' },
          { time: '10:15 - 11:15', subject: 'Wireless Communication', faculty: 'Dr. Meera Nair', room: 'RF Lab 1', status: 'Active' },
          { time: '11:30 - 12:30', subject: 'Control Systems', faculty: 'Dr. S. Prasad', room: 'Control Lab', status: 'Active' },
          { time: '12:30 - 13:30', subject: 'Lunch Break', faculty: 'Campus Cafeteria', room: 'Canteen', status: 'Break' },
          { time: '13:30 - 14:30', subject: 'Microprocessors', faculty: 'Prof. Vinay Shah', room: 'Embedded Lab', status: 'Active' },
          { time: '14:45 - 15:45', subject: 'VLSI Lab', faculty: 'Dr. Anupama Reddy', room: 'VLSI Lab', status: 'Active' },
          { time: '16:00 - 16:30', subject: 'Mentor Guidance', faculty: 'Dr. Neha Iyer', room: 'Mentor Desk', status: 'Active' },
        ],
        Saturday: [
          { time: '09:00 - 10:00', subject: 'Analog Circuits', faculty: 'Prof. Karthik Nair', room: 'Circuit Lab', status: 'Active' },
          { time: '10:15 - 11:15', subject: 'VLSI Design', faculty: 'Dr. Anupama Reddy', room: 'VLSI Lab', status: 'Active' },
          { time: '11:30 - 12:30', subject: 'Project Review', faculty: 'Industry Mentor', room: 'Innovation Hub', status: 'Active' },
          { time: '12:30 - 13:30', subject: 'Lunch Break', faculty: 'Campus Cafeteria', room: 'Canteen', status: 'Break' },
          { time: '13:30 - 14:30', subject: 'Signal Processing Lab', faculty: 'Dr. Neha Iyer', room: 'DSP Lab', status: 'Active' },
          { time: '14:45 - 15:45', subject: 'Revision Session', faculty: 'Dr. S. Prasad', room: 'Room E-210', status: 'Active' },
        ],
      },
      courseCatalog: [
        { code: 'EC401', subject: 'Digital Signal Processing', faculty: 'Dr. Neha Iyer', credits: 4, progress: 86, grade: 'A', status: 'On Track', units: ['Transforms and Filter Design', 'Sampling and Reconstruction', 'DSP Architecture and Algorithms'], description: 'Focuses on digital filtering, signal analysis, and speech/image processing.' },
        { code: 'EC402', subject: 'Microprocessors & Embedded Systems', faculty: 'Prof. Vinay Shah', credits: 4, progress: 82, grade: 'A', status: 'Stable', units: ['8086/ARM Architecture', 'Interfacing and Timing', 'Real-time Embedded Design'], description: 'Covers embedded hardware architectures, interfacing, and real-time performance tuning.' },
        { code: 'EC403', subject: 'Wireless Communication', faculty: 'Dr. Meera Nair', credits: 4, progress: 79, grade: 'A', status: 'Stable', units: ['Channels and Propagation', 'Modulation and Coding', 'Mobile Network Layers'], description: 'Explores wireless channels, cellular communication, and radio system design.' },
        { code: 'EC404', subject: 'VLSI Design', faculty: 'Dr. Anupama Reddy', credits: 4, progress: 81, grade: 'A', status: 'On Track', units: ['CMOS Logic Design', 'RTL Design and Synthesis', 'Verification Tools'], description: 'Introduces digital IC design, synthesis, and VLSI testing methodologies.' },
        { code: 'EC405', subject: 'Control Systems', faculty: 'Dr. S. Prasad', credits: 3, progress: 77, grade: 'A', status: 'Needs Review', units: ['Modeling and Stability', 'Frequency Response', 'Controller Design'], description: 'Covers system dynamics, transfer functions, and feedback control design.' },
        { code: 'EC406', subject: 'Analog Circuits', faculty: 'Prof. Karthik Nair', credits: 3, progress: 85, grade: 'A+', status: 'Excellent', units: ['BJT and MOSFET Circuits', 'Amplifiers and Oscillators', 'Filters and Signal Conditioning'], description: 'Deals with analog signal processing and electronic circuit analysis.' },
      ],
      attendanceList: [
        { code: 'EC401', subject: 'Digital Signal Processing', attended: 28, total: 31, percentage: 90, status: 'Eligible' },
        { code: 'EC402', subject: 'Microprocessors & Embedded Systems', attended: 26, total: 30, percentage: 87, status: 'Eligible' },
        { code: 'EC403', subject: 'Wireless Communication', attended: 27, total: 31, percentage: 87, status: 'Eligible' },
        { code: 'EC404', subject: 'VLSI Design', attended: 25, total: 30, percentage: 83, status: 'Eligible' },
        { code: 'EC405', subject: 'Control Systems', attended: 20, total: 28, percentage: 71, status: 'Below 75%' },
        { code: 'EC406', subject: 'Analog Circuits', attended: 29, total: 31, percentage: 94, status: 'Eligible' },
      ],
      examSchedule: [
        { subject: 'Digital Signal Processing', type: 'Internal Assessment', date: '12 Sep 2026', time: '09:00 AM', venue: 'Room E-201', status: 'Scheduled' },
        { subject: 'Microprocessors & Embedded Systems', type: 'Model Examination', date: '14 Sep 2026', time: '11:00 AM', venue: 'Room E-204', status: 'Scheduled' },
        { subject: 'Wireless Communication', type: 'Internal Assessment', date: '16 Sep 2026', time: '01:30 PM', venue: 'RF Lab 1', status: 'Scheduled' },
        { subject: 'VLSI Design', type: 'Model Examination', date: '18 Sep 2026', time: '10:00 AM', venue: 'VLSI Lab', status: 'Scheduled' },
        { subject: 'Control Systems', type: 'End Semester Examination', date: '25 Sep 2026', time: '09:00 AM', venue: 'Room E-106', status: 'Scheduled' },
        { subject: 'Analog Circuits', type: 'End Semester Examination', date: '27 Sep 2026', time: '02:00 PM', venue: 'Circuit Lab', status: 'Scheduled' },
      ],
      materials: [
        { title: 'DSP Filter Design Notes', subject: 'Digital Signal Processing', type: 'PDF', uploadedBy: 'Dr. Neha Iyer', date: '05 Sep 2026', action: 'View / Download' },
        { title: 'Embedded System Interface Guide', subject: 'Microprocessors & Embedded Systems', type: 'Assignment', uploadedBy: 'Prof. Vinay Shah', date: '04 Sep 2026', action: 'View / Download' },
        { title: 'Wireless Cellular Modulation Sheet', subject: 'Wireless Communication', type: 'PPT', uploadedBy: 'Dr. Meera Nair', date: '03 Sep 2026', action: 'View / Download' },
      ],
      semesterHistory: [
        { semester: 'Semester 1', sgpa: 8.6, cgpa: 8.6, result: 'Pass', status: 'Completed' },
        { semester: 'Semester 2', sgpa: 8.9, cgpa: 8.8, result: 'Pass', status: 'Completed' },
        { semester: 'Semester 3', sgpa: 9.0, cgpa: 8.9, result: 'Pass', status: 'Completed' },
        { semester: 'Semester 4', sgpa: 9.1, cgpa: 9.0, result: 'Pass', status: 'Completed' },
        { semester: 'Semester 5', sgpa: 9.2, cgpa: 9.1, result: 'Pass', status: 'Completed' },
        { semester: 'Semester 6', sgpa: 9.1, cgpa: 9.1, result: 'In Progress', status: 'Current' },
      ],
    });
  }

  if (department.includes('Mechanical')) {
    return withFiveCourseUnits({
      timetableByDay: {
        Monday: [
          { time: '09:00 - 10:00', subject: 'Thermal Engineering', faculty: 'Dr. Arjun Rao', room: 'Heat Transfer Lab', status: 'Active' },
          { time: '10:15 - 11:15', subject: 'Manufacturing Technology', faculty: 'Prof. Mohan Verma', room: 'Workshop Hall', status: 'Active' },
          { time: '11:30 - 12:30', subject: 'CAD / CAM', faculty: 'Dr. Suma Nair', room: 'Design Studio 3', status: 'Active' },
          { time: '12:30 - 13:30', subject: 'Lunch Break', faculty: 'Campus Cafeteria', room: 'Canteen', status: 'Break' },
          { time: '13:30 - 14:30', subject: 'Fluid Mechanics', faculty: 'Dr. Priya Menon', room: 'Fluid Lab', status: 'Active' },
          { time: '14:45 - 15:45', subject: 'Machine Design', faculty: 'Prof. Divya Raju', room: 'Design Studio 2', status: 'Active' },
          { time: '16:00 - 16:30', subject: 'Mentor Guidance', faculty: 'Dr. Arjun Rao', room: 'Mentor Desk', status: 'Active' },
        ],
        Tuesday: [
          { time: '09:00 - 10:00', subject: 'Machine Design', faculty: 'Prof. Divya Raju', room: 'Design Studio 2', status: 'Active' },
          { time: '10:15 - 11:15', subject: 'Fluid Mechanics', faculty: 'Dr. Priya Menon', room: 'Fluid Lab', status: 'Active' },
          { time: '11:30 - 12:30', subject: 'Thermal Engineering', faculty: 'Dr. Arjun Rao', room: 'Heat Transfer Lab', status: 'Active' },
          { time: '12:30 - 13:30', subject: 'Lunch Break', faculty: 'Campus Cafeteria', room: 'Canteen', status: 'Break' },
          { time: '13:30 - 14:30', subject: 'CAD / CAM', faculty: 'Dr. Suma Nair', room: 'Design Studio 3', status: 'Active' },
          { time: '14:45 - 15:45', subject: 'Materials Engineering', faculty: 'Prof. Rohan Das', room: 'Materials Lab', status: 'Active' },
          { time: '16:00 - 16:30', subject: 'Mentor Guidance', faculty: 'Dr. Arjun Rao', room: 'Mentor Desk', status: 'Active' },
        ],
        Wednesday: [
          { time: '09:00 - 10:00', subject: 'Materials Engineering', faculty: 'Prof. Rohan Das', room: 'Materials Lab', status: 'Active' },
          { time: '10:15 - 11:15', subject: 'Fluid Mechanics', faculty: 'Dr. Priya Menon', room: 'Fluid Lab', status: 'Active' },
          { time: '11:30 - 12:30', subject: 'Manufacturing Technology', faculty: 'Prof. Mohan Verma', room: 'Workshop Hall', status: 'Active' },
          { time: '12:30 - 13:30', subject: 'Lunch Break', faculty: 'Campus Cafeteria', room: 'Canteen', status: 'Break' },
          { time: '13:30 - 14:30', subject: 'Thermal Engineering', faculty: 'Dr. Arjun Rao', room: 'Heat Transfer Lab', status: 'Active' },
          { time: '14:45 - 15:45', subject: 'CAD / CAM', faculty: 'Dr. Suma Nair', room: 'Design Studio 3', status: 'Active' },
          { time: '16:00 - 16:30', subject: 'Mentor Guidance', faculty: 'Dr. Arjun Rao', room: 'Mentor Desk', status: 'Active' },
        ],
        Thursday: [
          { time: '09:00 - 10:00', subject: 'CAD / CAM', faculty: 'Dr. Suma Nair', room: 'Design Studio 3', status: 'Active' },
          { time: '10:15 - 11:15', subject: 'Machine Design', faculty: 'Prof. Divya Raju', room: 'Design Studio 2', status: 'Active' },
          { time: '11:30 - 12:30', subject: 'Materials Engineering', faculty: 'Prof. Rohan Das', room: 'Materials Lab', status: 'Active' },
          { time: '12:30 - 13:30', subject: 'Lunch Break', faculty: 'Campus Cafeteria', room: 'Canteen', status: 'Break' },
          { time: '13:30 - 14:30', subject: 'Fluid Mechanics', faculty: 'Dr. Priya Menon', room: 'Fluid Lab', status: 'Active' },
          { time: '14:45 - 15:45', subject: 'Manufacturing Lab', faculty: 'Prof. Mohan Verma', room: 'Workshop Hall', status: 'Active' },
          { time: '16:00 - 16:30', subject: 'Mentor Guidance', faculty: 'Dr. Arjun Rao', room: 'Mentor Desk', status: 'Active' },
        ],
        Friday: [
          { time: '09:00 - 10:00', subject: 'Thermal Engineering', faculty: 'Dr. Arjun Rao', room: 'Heat Transfer Lab', status: 'Active' },
          { time: '10:15 - 11:15', subject: 'Materials Engineering', faculty: 'Prof. Rohan Das', room: 'Materials Lab', status: 'Active' },
          { time: '11:30 - 12:30', subject: 'Machine Design', faculty: 'Prof. Divya Raju', room: 'Design Studio 2', status: 'Active' },
          { time: '12:30 - 13:30', subject: 'Lunch Break', faculty: 'Campus Cafeteria', room: 'Canteen', status: 'Break' },
          { time: '13:30 - 14:30', subject: 'Manufacturing Technology', faculty: 'Prof. Mohan Verma', room: 'Workshop Hall', status: 'Active' },
          { time: '14:45 - 15:45', subject: 'Project Support', faculty: 'Academic Team', room: 'Innovation Hub', status: 'Active' },
          { time: '16:00 - 16:30', subject: 'Mentor Guidance', faculty: 'Dr. Arjun Rao', room: 'Mentor Desk', status: 'Active' },
        ],
        Saturday: [
          { time: '09:00 - 10:00', subject: 'CAD / CAM', faculty: 'Dr. Suma Nair', room: 'Design Studio 3', status: 'Active' },
          { time: '10:15 - 11:15', subject: 'Fluid Mechanics', faculty: 'Dr. Priya Menon', room: 'Fluid Lab', status: 'Active' },
          { time: '11:30 - 12:30', subject: 'Workshop Practice', faculty: 'Industry Mentor', room: 'Innovation Hub', status: 'Active' },
          { time: '12:30 - 13:30', subject: 'Lunch Break', faculty: 'Campus Cafeteria', room: 'Canteen', status: 'Break' },
          { time: '13:30 - 14:30', subject: 'Thermal Lab', faculty: 'Dr. Arjun Rao', room: 'Heat Transfer Lab', status: 'Active' },
          { time: '14:45 - 15:45', subject: 'Revision Session', faculty: 'Prof. Mohan Verma', room: 'Workshop Hall', status: 'Active' },
        ],
      },
      courseCatalog: [
        { code: 'ME401', subject: 'Thermal Engineering', faculty: 'Dr. Arjun Rao', credits: 4, progress: 81, grade: 'A', status: 'On Track', units: ['Thermodynamics and Cycles', 'Heat Transfer and Boilers', 'Energy Conversion'], description: 'Covers thermal systems, energy transfer, and internal combustion processes.' },
        { code: 'ME402', subject: 'Manufacturing Technology', faculty: 'Prof. Mohan Verma', credits: 4, progress: 78, grade: 'A', status: 'Stable', units: ['Machining and Forming', 'Tool Wear and Metrology', 'Automation in Processes'], description: 'Introduces modern manufacturing methods, machining, and production planning.' },
        { code: 'ME403', subject: 'CAD / CAM', faculty: 'Dr. Suma Nair', credits: 4, progress: 84, grade: 'A', status: 'On Track', units: ['Geometric Modelling', 'Computer Numerical Control', 'Manufacturing Simulation'], description: 'Focuses on digital design, modelling, and automated manufacturing workflows.' },
        { code: 'ME404', subject: 'Fluid Mechanics', faculty: 'Dr. Priya Menon', credits: 4, progress: 79, grade: 'A', status: 'Stable', units: ['Flow Kinematics', 'Pipe Flow and Pumps', 'Boundary Layer and Dimensional Analysis'], description: 'Covers momentum balance, fluid flow, and hydraulic systems.' },
        { code: 'ME405', subject: 'Machine Design', faculty: 'Prof. Divya Raju', credits: 3, progress: 75, grade: 'A', status: 'Stable', units: ['Stress Analysis', 'Power Transmission', 'Design for Safety'], description: 'Focuses on design loads, mechanical strength, and material selection.' },
        { code: 'ME406', subject: 'Materials Engineering', faculty: 'Prof. Rohan Das', credits: 3, progress: 82, grade: 'A', status: 'Excellent', units: ['Material Testing', 'Heat Treatment', 'Fracture and Failure'], description: 'Examines structure-property relationships in engineering materials.' },
      ],
      attendanceList: [
        { code: 'ME401', subject: 'Thermal Engineering', attended: 26, total: 31, percentage: 84, status: 'Eligible' },
        { code: 'ME402', subject: 'Manufacturing Technology', attended: 25, total: 30, percentage: 83, status: 'Eligible' },
        { code: 'ME403', subject: 'CAD / CAM', attended: 27, total: 30, percentage: 90, status: 'Eligible' },
        { code: 'ME404', subject: 'Fluid Mechanics', attended: 24, total: 30, percentage: 80, status: 'Eligible' },
        { code: 'ME405', subject: 'Machine Design', attended: 21, total: 29, percentage: 72, status: 'Below 75%' },
        { code: 'ME406', subject: 'Materials Engineering', attended: 28, total: 30, percentage: 93, status: 'Eligible' },
      ],
      examSchedule: [
        { subject: 'Thermal Engineering', type: 'Internal Assessment', date: '12 Sep 2026', time: '09:00 AM', venue: 'Heat Transfer Lab', status: 'Scheduled' },
        { subject: 'Manufacturing Technology', type: 'Model Examination', date: '14 Sep 2026', time: '11:00 AM', venue: 'Workshop Hall', status: 'Scheduled' },
        { subject: 'CAD / CAM', type: 'Internal Assessment', date: '16 Sep 2026', time: '01:30 PM', venue: 'Design Studio 3', status: 'Scheduled' },
        { subject: 'Fluid Mechanics', type: 'Model Examination', date: '18 Sep 2026', time: '10:00 AM', venue: 'Fluid Lab', status: 'Scheduled' },
        { subject: 'Machine Design', type: 'End Semester Examination', date: '25 Sep 2026', time: '09:00 AM', venue: 'Room M-106', status: 'Scheduled' },
        { subject: 'Materials Engineering', type: 'End Semester Examination', date: '27 Sep 2026', time: '02:00 PM', venue: 'Materials Lab', status: 'Scheduled' },
      ],
      materials: [
        { title: 'Heat Transfer Formula Sheet', subject: 'Thermal Engineering', type: 'PDF', uploadedBy: 'Dr. Arjun Rao', date: '05 Sep 2026', action: 'View / Download' },
        { title: 'Workshop Processes Revision Pack', subject: 'Manufacturing Technology', type: 'Assignment', uploadedBy: 'Prof. Mohan Verma', date: '04 Sep 2026', action: 'View / Download' },
        { title: 'CAM Programming Guide', subject: 'CAD / CAM', type: 'PPT', uploadedBy: 'Dr. Suma Nair', date: '03 Sep 2026', action: 'View / Download' },
      ],
      semesterHistory: [
        { semester: 'Semester 1', sgpa: 8.3, cgpa: 8.3, result: 'Pass', status: 'Completed' },
        { semester: 'Semester 2', sgpa: 8.5, cgpa: 8.4, result: 'Pass', status: 'Completed' },
        { semester: 'Semester 3', sgpa: 8.7, cgpa: 8.6, result: 'Pass', status: 'Completed' },
        { semester: 'Semester 4', sgpa: 8.8, cgpa: 8.7, result: 'Pass', status: 'Completed' },
        { semester: 'Semester 5', sgpa: 8.5, cgpa: 8.6, result: 'Pass', status: 'Completed' },
        { semester: 'Semester 6', sgpa: 8.6, cgpa: 8.6, result: 'In Progress', status: 'Current' },
      ],
    });
  }

  return withFiveCourseUnits({
    timetableByDay: {
      Monday: [
        { time: '09:00 - 10:00', subject: 'Data Structures', faculty: 'Dr. R. Mehta', room: 'CS Lab 1', status: 'Active' },
        { time: '10:15 - 11:15', subject: 'Operating Systems', faculty: 'Dr. K. Sharma', room: 'Room 214', status: 'Active' },
        { time: '11:30 - 12:30', subject: 'Database Management Systems', faculty: 'Prof. S. Iyer', room: 'Room 305', status: 'Active' },
        { time: '12:30 - 13:30', subject: 'Lunch Break', faculty: 'Campus Cafeteria', room: 'Canteen', status: 'Break' },
        { time: '13:30 - 14:30', subject: 'Computer Networks', faculty: 'Dr. P. Nair', room: 'Network Lab', status: 'Active' },
        { time: '14:45 - 15:45', subject: 'AI Lab Practice', faculty: 'Dr. V. Sen', room: 'AI Lab', status: 'Active' },
        { time: '16:00 - 16:30', subject: 'Mentor Guidance', faculty: 'Prof. Anita Verma', room: 'Mentor Desk', status: 'Active' },
      ],
      Tuesday: [
        { time: '09:00 - 10:00', subject: 'Artificial Intelligence', faculty: 'Dr. V. Sen', room: 'AI Lab', status: 'Active' },
        { time: '10:15 - 11:15', subject: 'Database Management Systems', faculty: 'Prof. S. Iyer', room: 'Room 305', status: 'Active' },
        { time: '11:30 - 12:30', subject: 'Cloud Computing', faculty: 'Prof. A. Rao', room: 'Cloud Lab', status: 'Active' },
        { time: '12:30 - 13:30', subject: 'Lunch Break', faculty: 'Campus Cafeteria', room: 'Canteen', status: 'Break' },
        { time: '13:30 - 14:30', subject: 'Seminar', faculty: 'Dr. S. Kumar', room: 'Seminar Hall', status: 'Active' },
        { time: '14:45 - 15:45', subject: 'Data Structures', faculty: 'Dr. R. Mehta', room: 'CS Lab 1', status: 'Active' },
        { time: '16:00 - 16:30', subject: 'Mentor Guidance', faculty: 'Prof. Anita Verma', room: 'Mentor Desk', status: 'Active' },
      ],
      Wednesday: [
        { time: '09:00 - 10:00', subject: 'Operating Systems', faculty: 'Dr. K. Sharma', room: 'Room 214', status: 'Active' },
        { time: '10:15 - 11:15', subject: 'Data Structures', faculty: 'Dr. R. Mehta', room: 'CS Lab 1', status: 'Active' },
        { time: '11:30 - 12:30', subject: 'Computer Networks', faculty: 'Dr. P. Nair', room: 'Room 201', status: 'Active' },
        { time: '12:30 - 13:30', subject: 'Lunch Break', faculty: 'Campus Cafeteria', room: 'Canteen', status: 'Break' },
        { time: '13:30 - 14:30', subject: 'DBMS Lab', faculty: 'Prof. S. Iyer', room: 'DBMS Lab', status: 'Active' },
        { time: '14:45 - 15:45', subject: 'Cloud Computing', faculty: 'Prof. A. Rao', room: 'Cloud Lab', status: 'Active' },
        { time: '16:00 - 16:30', subject: 'Mentor Guidance', faculty: 'Prof. Anita Verma', room: 'Mentor Desk', status: 'Active' },
      ],
      Thursday: [
        { time: '09:00 - 10:00', subject: 'Cloud Computing', faculty: 'Prof. A. Rao', room: 'Cloud Lab', status: 'Active' },
        { time: '10:15 - 11:15', subject: 'Artificial Intelligence', faculty: 'Dr. V. Sen', room: 'AI Lab', status: 'Active' },
        { time: '11:30 - 12:30', subject: 'Data Structures', faculty: 'Dr. R. Mehta', room: 'CS Lab 1', status: 'Active' },
        { time: '12:30 - 13:30', subject: 'Lunch Break', faculty: 'Campus Cafeteria', room: 'Canteen', status: 'Break' },
        { time: '13:30 - 14:30', subject: 'Operating Systems', faculty: 'Dr. K. Sharma', room: 'Room 214', status: 'Active' },
        { time: '14:45 - 15:45', subject: 'Network Lab', faculty: 'Dr. P. Nair', room: 'Network Lab', status: 'Active' },
        { time: '16:00 - 16:30', subject: 'Mentor Guidance', faculty: 'Prof. Anita Verma', room: 'Mentor Desk', status: 'Active' },
      ],
      Friday: [
        { time: '09:00 - 10:00', subject: 'Database Management Systems', faculty: 'Prof. S. Iyer', room: 'Room 305', status: 'Active' },
        { time: '10:15 - 11:15', subject: 'Computer Networks', faculty: 'Dr. P. Nair', room: 'Network Lab', status: 'Active' },
        { time: '11:30 - 12:30', subject: 'Operating Systems', faculty: 'Dr. K. Sharma', room: 'Room 214', status: 'Active' },
        { time: '12:30 - 13:30', subject: 'Lunch Break', faculty: 'Campus Cafeteria', room: 'Canteen', status: 'Break' },
        { time: '13:30 - 14:30', subject: 'AI Seminar', faculty: 'Dr. V. Sen', room: 'AI Lab', status: 'Active' },
        { time: '14:45 - 15:45', subject: 'Project Review', faculty: 'Prof. Anita Verma', room: 'Mentor Desk', status: 'Active' },
        { time: '16:00 - 16:30', subject: 'Mentor Guidance', faculty: 'Prof. Anita Verma', room: 'Mentor Desk', status: 'Active' },
      ],
      Saturday: [
        { time: '09:00 - 10:00', subject: 'Artificial Intelligence', faculty: 'Dr. V. Sen', room: 'AI Lab', status: 'Active' },
        { time: '10:15 - 11:15', subject: 'Cloud Computing', faculty: 'Prof. A. Rao', room: 'Cloud Lab', status: 'Active' },
        { time: '11:30 - 12:30', subject: 'Workshop', faculty: 'Industry Mentor', room: 'Innovation Hub', status: 'Active' },
        { time: '12:30 - 13:30', subject: 'Lunch Break', faculty: 'Campus Cafeteria', room: 'Canteen', status: 'Break' },
        { time: '13:30 - 14:30', subject: 'Project Support', faculty: 'Academic Team', room: 'Project Lab', status: 'Active' },
        { time: '14:45 - 15:45', subject: 'Revision Session', faculty: 'Dr. S. Kumar', room: 'Room 210', status: 'Active' },
      ],
    },
    courseCatalog: [
      { code: 'DS101', subject: 'Data Structures', faculty: 'Dr. R. Mehta', credits: 4, progress: 82, grade: 'A', status: 'On Track', units: ['Arrays, Linked Lists, Stacks and Queues', 'Trees, Heaps, Hashing and Graphs', 'Dynamic Programming and Greedy Algorithms'], description: 'Covers algorithmic thinking, problem solving, and data organization strategies for efficient software design.' },
      { code: 'DBMS201', subject: 'Database Management Systems', faculty: 'Prof. S. Iyer', credits: 4, progress: 78, grade: 'A', status: 'Stable', units: ['ER Models and Relational Design', 'SQL Queries, Indexing and Transactions', 'Normalization and Database Security'], description: 'Focuses on relational data modeling, SQL fundamentals, transaction management, and database optimization.' },
      { code: 'CN301', subject: 'Computer Networks', faculty: 'Dr. P. Nair', credits: 4, progress: 74, grade: 'B+', status: 'Needs Review', units: ['Networking Models and Protocol Layers', 'TCP/IP, Routing and Switching', 'Wireless Networks and Security'], description: 'Introduces communication architectures, network protocols, routing algorithms, and secured data transmission.' },
      { code: 'OS302', subject: 'Operating Systems', faculty: 'Dr. K. Sharma', credits: 4, progress: 80, grade: 'A', status: 'Strong', units: ['Process Management and Scheduling', 'Memory, File Systems and Virtualization', 'Concurrency, Deadlock and Synchronization'], description: 'Examines operating system internals, resource allocation, process synchronization, and system-level coordination.' },
      { code: 'CC401', subject: 'Cloud Computing', faculty: 'Prof. A. Rao', credits: 3, progress: 69, grade: 'B+', status: 'Watchlist', units: ['Cloud Delivery Models and Virtualization', 'Container Orchestration and Deployment', 'Cloud Security and Cost Optimization'], description: 'Explores elastic infrastructure services, distributed systems, cloud architecture, and deployment patterns.' },
      { code: 'AI501', subject: 'Artificial Intelligence', faculty: 'Dr. V. Sen', credits: 4, progress: 88, grade: 'A+', status: 'Excellent', units: ['Search, Knowledge Representation and Reasoning', 'Machine Learning Foundations and Evaluation', 'Neural Networks and Decision Systems'], description: 'Covers intelligent systems, probabilistic modeling, machine learning workflows, and modern AI paradigms.' },
    ],
    attendanceList: [
      { code: 'DS101', subject: 'Data Structures', attended: 28, total: 32, percentage: 88, status: 'Eligible' },
      { code: 'DBMS201', subject: 'Database Management Systems', attended: 26, total: 31, percentage: 84, status: 'Eligible' },
      { code: 'CN301', subject: 'Computer Networks', attended: 23, total: 30, percentage: 77, status: 'Eligible' },
      { code: 'OS302', subject: 'Operating Systems', attended: 24, total: 30, percentage: 80, status: 'Eligible' },
      { code: 'CC401', subject: 'Cloud Computing', attended: 19, total: 28, percentage: 68, status: 'Below 75%' },
      { code: 'AI501', subject: 'Artificial Intelligence', attended: 30, total: 32, percentage: 94, status: 'Eligible' },
    ],
    examSchedule: [
      { subject: 'Data Structures', type: 'Internal Assessment', date: '12 Sep 2026', time: '09:00 AM', venue: 'Room 201', status: 'Scheduled' },
      { subject: 'Database Management Systems', type: 'Model Examination', date: '14 Sep 2026', time: '11:00 AM', venue: 'Room 305', status: 'Scheduled' },
      { subject: 'Computer Networks', type: 'Internal Assessment', date: '16 Sep 2026', time: '01:30 PM', venue: 'Network Lab', status: 'Scheduled' },
      { subject: 'Operating Systems', type: 'Model Examination', date: '18 Sep 2026', time: '10:00 AM', venue: 'Room 214', status: 'Scheduled' },
      { subject: 'Cloud Computing', type: 'End Semester Examination', date: '25 Sep 2026', time: '09:00 AM', venue: 'Cloud Lab', status: 'Scheduled' },
      { subject: 'Artificial Intelligence', type: 'End Semester Examination', date: '27 Sep 2026', time: '02:00 PM', venue: 'AI Lab', status: 'Scheduled' },
    ],
    materials: [
      { title: 'Trees and Binary Heaps Notes', subject: 'Data Structures', type: 'PDF', uploadedBy: 'Dr. R. Mehta', date: '05 Sep 2026', action: 'View / Download' },
      { title: 'SQL Query Practice Sheet', subject: 'Database Management Systems', type: 'Assignment', uploadedBy: 'Prof. S. Iyer', date: '04 Sep 2026', action: 'View / Download' },
      { title: 'TCP-IP Protocol Overview', subject: 'Computer Networks', type: 'PPT', uploadedBy: 'Dr. P. Nair', date: '03 Sep 2026', action: 'View / Download' },
    ],
    semesterHistory: [
      { semester: 'Semester 1', sgpa: 8.7, cgpa: 8.7, result: 'Pass', status: 'Completed' },
      { semester: 'Semester 2', sgpa: 8.9, cgpa: 8.8, result: 'Pass', status: 'Completed' },
      { semester: 'Semester 3', sgpa: 8.8, cgpa: 8.8, result: 'Pass', status: 'Completed' },
      { semester: 'Semester 4', sgpa: 9.0, cgpa: 8.9, result: 'Pass', status: 'Completed' },
      { semester: 'Semester 5', sgpa: 8.6, cgpa: 8.9, result: 'Pass', status: 'Completed' },
      { semester: 'Semester 6', sgpa: 8.9, cgpa: 8.9, result: 'In Progress', status: 'Current' },
    ],
  });
};

export const getDefaultStudentNotifications = (email?: string): StudentNotification[] => {
  const record = getStudentRecord(email);
  const themeLabel = record.department.includes('Computer') ? 'Academic' : record.department.includes('Electronics') ? 'Electronics' : 'Mechanical';
  const accommodationStatus = record.accommodationStatus || (record.studentType === 'DAY_SCHOLAR' ? 'Day Scholar' : 'Hosteller');
  const isHosteller = accommodationStatus === 'Hosteller';

  const notifications: StudentNotification[] = [
    { category: 'Academic', title: `${themeLabel} assignment due for ${record.department.split('&')[0].trim()}`, message: `Your upcoming ${record.department} assignment is due this week. Review the course materials and submit it through the academic portal before the deadline.`, time: '2 hours ago', unread: true, expanded: false, icon: 'BookOpen' },
    { category: 'Examination', title: 'Internal assessment timetable published', message: 'The internal assessment timetable is now available. Check the Examinations section for your subject, venue, and reporting time.', time: 'Today, 9:30 AM', unread: true, expanded: false, icon: 'Clock3', details: [{ label: 'Subject', value: 'Data Structures' }, { label: 'Date', value: '12 Sep 2026' }, { label: 'Time', value: '09:00 AM' }, { label: 'Venue', value: 'Room 201' }] },
    { category: 'Fees', title: 'Fee reminder: hostel charges due', message: 'Please review your fee statement and settle any outstanding hostel charges before the payment deadline.', time: 'Yesterday', unread: false, expanded: false, icon: 'CreditCard' },
    { category: 'Attendance', title: `Attendance threshold alert: ${record.department.split('&')[0].trim()}`, message: `Your attendance in ${record.department.split('&')[0].trim()} requires attention. Review the Attendance page and speak with your faculty mentor if needed.`, time: '2 days ago', unread: true, expanded: false, icon: 'ShieldCheck' },
    { category: 'Hostel', title: 'Hostel mess menu updated for this week', message: 'The weekly mess menu has been updated in the residential services portal.', time: '3 days ago', unread: false, expanded: false, icon: 'Megaphone' },
    { category: 'General', title: 'Campus health and safety advisory', message: 'Please follow current campus health and safety procedures and contact the administration desk if you need assistance.', time: '1 week ago', unread: false, expanded: false, icon: 'Bell' },
  ];

  return notifications.filter((notification) => {
    if (!isHosteller && (notification.category === 'Hostel' || (notification.category === 'Fees' && notification.title.toLowerCase().includes('hostel')))) {
      return false;
    }
    return true;
  });
};

export const normalizeStudentNotifications = (notifications: Partial<StudentNotification>[], email?: string): StudentNotification[] => {
  const defaults = getDefaultStudentNotifications(email);
  return notifications.map((notification, index) => ({
    ...defaults[index % defaults.length],
    ...notification,
    message: notification.message || notification.title || defaults[index % defaults.length].message,
    expanded: notification.expanded || false,
  }));
};

export type LeaveApplication = {
  date: string;
  type: string;
  duration: string;
  status: string;
  approvals: { label: string; status: 'Approved' | 'Declined' | 'Awaiting' }[];
  requestId?: string;
};

export const getDefaultStudentLeaveApplications = (_email?: string): LeaveApplication[] => {
  return [];
};

const isRecentLeaveApplication = (application: Partial<LeaveApplication> | undefined): boolean => {
  if (!application || !application.date) return true;

  const match = application.date.match(/(\d{1,2})\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})/i);
  if (!match) return true;

  const dateValue = new Date(`${match[2]}-${match[1]}-01T00:00:00`);
  if (Number.isNaN(dateValue.getTime())) return true;

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 45);
  return dateValue >= cutoff;
};

export const normalizeStudentLeaveApplications = (applications: Partial<LeaveApplication>[] = [], email?: string): LeaveApplication[] => {
  if (!Array.isArray(applications) || applications.length === 0) {
    return [];
  }

  const defaults = getDefaultStudentLeaveApplications(email);
  const isDayScholar = getStudentRecord(email).studentType === 'DAY_SCHOLAR';
  const labels = isDayScholar ? ['Parent', 'Mentor'] : ['Parent', 'Warden', 'Mentor'];

  return applications
    .filter(isRecentLeaveApplication)
    .map((application, index) => ({
      ...(defaults[index % Math.max(defaults.length, 1)] || {}),
      ...application,
      status: application.status === 'Pending' ? 'Awaiting' : application.status || 'Awaiting',
      approvals: application.approvals?.length ? application.approvals : labels.map((label) => ({ label, status: 'Awaiting' as const })),
      requestId: application.requestId,
    }));
};
