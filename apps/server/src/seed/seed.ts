import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ENV } from '../config/env';
import { User } from '../models/User';
import { Profile } from '../models/Profile';
import { Department } from '../models/Department';
import { Course } from '../models/Course';
import { Enrollment } from '../models/Enrollment';
import { AttendanceSession, AttendanceRecord } from '../models/Attendance';
import { MentorAllocation, InterventionLog } from '../models/Mentorship';
import { RiskScore } from '../models/RiskScore';
import { Exam, GradeEntry } from '../models/Exam';
import { TimetableSlot } from '../models/Timetable';
import { StudyMaterial } from '../models/StudyMaterial';
import { FeeInvoice } from '../models/Fee';
import { AdmissionApplication } from '../models/Admission';
import { HostelRoom, HostelAllocation } from '../models/Hostel';
import { InfrastructureDevice, MaintenanceTicket } from '../models/Infrastructure';

export const seedDatabase = async (disconnectAfter = true) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('[Seed] Connecting to database...');
      await mongoose.connect(ENV.MONGODB_URI);
      console.log('[Seed] Connected to MongoDB.');
    }

    // Clear existing collections
    console.log('[Seed] Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Profile.deleteMany({}),
      Department.deleteMany({}),
      Course.deleteMany({}),
      Enrollment.deleteMany({}),
      AttendanceSession.deleteMany({}),
      AttendanceRecord.deleteMany({}),
      MentorAllocation.deleteMany({}),
      InterventionLog.deleteMany({}),
      RiskScore.deleteMany({}),
      Exam.deleteMany({}),
      GradeEntry.deleteMany({}),
      TimetableSlot.deleteMany({}),
      StudyMaterial.deleteMany({}),
      FeeInvoice.deleteMany({}),
      AdmissionApplication.deleteMany({}),
      HostelRoom.deleteMany({}),
      HostelAllocation.deleteMany({}),
      InfrastructureDevice.deleteMany({}),
      MaintenanceTicket.deleteMany({}),
    ]);

    console.log('[Seed] Creating Departments...');
    const cseDept = await Department.create({
      code: 'CSE',
      name: 'Department of Computer Science & Engineering',
      establishedYear: 2008,
      isActive: true,
    });

    const eceDept = await Department.create({
      code: 'ECE',
      name: 'Department of Electronics & Communication Engineering',
      establishedYear: 2010,
      isActive: true,
    });

    const aiDept = await Department.create({
      code: 'AI_DS',
      name: 'Department of Artificial Intelligence & Data Science',
      establishedYear: 2021,
      isActive: true,
    });

    const mechDept = await Department.create({
      code: 'MECH',
      name: 'Department of Mechanical Engineering',
      establishedYear: 2006,
      isActive: true,
    });

    const itDept = await Department.create({
      code: 'IT',
      name: 'Department of Information Technology',
      establishedYear: 2012,
      isActive: true,
    });

    console.log('[Seed] Hashing passwords...');
    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash('Admin@12345', salt);
    const facultyPasswordHash = await bcrypt.hash('Faculty@12345', salt);
    const mentorPasswordHash = await bcrypt.hash('Mentor@12345', salt);
    const studentPasswordHash = await bcrypt.hash('Student@12345', salt);

    console.log('[Seed] Creating Users...');
    // 1. Admin User
    const adminUser = await User.create({
      email: 'admin@edusphere.ai',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      isActive: true,
    });
    await Profile.create({
      user: adminUser._id,
      firstName: 'Dr. Suresh',
      lastName: 'Nambiar',
      registrationNo: 'ADM-2026-001',
      phone: '+91 98450 11223',
      designation: 'Dean of Academic Affairs & Chief Administrator',
      department: cseDept._id,
      cabinNumber: 'Admin Block, Room 101',
    });

    // 2. CSE HOD (Dr. Priya Kumar / faculty@edusphere.ai)
    const priyaHOD = await User.create({
      email: 'priya.kumar@edusphere.ai',
      passwordHash: facultyPasswordHash,
      role: 'FACULTY',
      isActive: true,
    });
    await Profile.create({
      user: priyaHOD._id,
      firstName: 'Dr. Priya',
      lastName: 'Kumar',
      registrationNo: 'FAC-CSE-001',
      phone: '+91 98765 43210',
      designation: 'Professor & Head of Department (CSE)',
      department: cseDept._id,
      cabinNumber: 'Tech Block A, HOD Suite 101',
    });

    const facultyUser = await User.create({
      email: 'faculty@edusphere.ai',
      passwordHash: facultyPasswordHash,
      role: 'FACULTY',
      isActive: true,
    });
    await Profile.create({
      user: facultyUser._id,
      firstName: 'Dr. Priya',
      lastName: 'Kumar',
      registrationNo: 'FAC-CSE-042',
      phone: '+91 98765 43210',
      designation: 'Professor & Head of Department (CSE)',
      department: cseDept._id,
      cabinNumber: 'Tech Block A, HOD Suite 101',
    });

    // 3. CSE Faculty & Mentor (Mr. Arun Kumar)
    const arunFaculty = await User.create({
      email: 'arun.kumar@edusphere.ai',
      passwordHash: facultyPasswordHash,
      role: 'FACULTY',
      isActive: true,
    });
    await Profile.create({
      user: arunFaculty._id,
      firstName: 'Mr. Arun',
      lastName: 'Kumar',
      registrationNo: 'FAC-CSE-014',
      phone: '+91 98765 43211',
      designation: 'Assistant Professor & Mentor (CSE)',
      department: cseDept._id,
      cabinNumber: 'Tech Block A, Cabin 204',
    });

    // 4. IT Faculty & Mentor (Mr. Rohit Sharma)
    const rohitFaculty = await User.create({
      email: 'rohit.sharma@edusphere.ai',
      passwordHash: facultyPasswordHash,
      role: 'FACULTY',
      isActive: true,
    });
    await Profile.create({
      user: rohitFaculty._id,
      firstName: 'Mr. Rohit',
      lastName: 'Sharma',
      registrationNo: 'FAC-IT-008',
      phone: '+91 98765 43214',
      designation: 'Assistant Professor & Mentor (IT)',
      department: itDept._id,
      cabinNumber: 'IT Block, Cabin 302',
    });

    // 5. IT HOD (Dr. Rajesh Venkat)
    const itHOD = await User.create({
      email: 'hod.it@edusphere.ai',
      passwordHash: facultyPasswordHash,
      role: 'FACULTY',
      isActive: true,
    });
    await Profile.create({
      user: itHOD._id,
      firstName: 'Dr. Rajesh',
      lastName: 'Venkat',
      registrationNo: 'FAC-IT-001',
      phone: '+91 98765 43215',
      designation: 'Professor & Head of Department (IT)',
      department: itDept._id,
      cabinNumber: 'IT Block, HOD Suite 201',
    });

    // 6. Campus Hostel Warden (Mr. K. Narayanan)
    const wardenUser = await User.create({
      email: 'warden@edusphere.ai',
      passwordHash: facultyPasswordHash,
      role: 'FACULTY',
      isActive: true,
    });
    await Profile.create({
      user: wardenUser._id,
      firstName: 'Mr. K.',
      lastName: 'Narayanan',
      registrationNo: 'STF-HST-001',
      phone: '+91 98765 43220',
      designation: 'Chief Hostel Warden & Residential Administrator',
      department: cseDept._id,
      cabinNumber: 'Hostel Block 4, Warden Office',
    });

    // 7. Mentor User (Anita Verma - legacy support)
    const mentorUser = await User.create({
      email: 'mentor@edusphere.ai',
      passwordHash: mentorPasswordHash,
      role: 'MENTOR',
      isActive: true,
    });
    await Profile.create({
      user: mentorUser._id,
      firstName: 'Prof. Anita',
      lastName: 'Verma',
      registrationNo: 'MNT-CSE-018',
      phone: '+91 97654 32109',
      designation: 'Senior Academic Counselor & Faculty Mentor',
      department: cseDept._id,
      cabinNumber: 'Mentorship Center, Desk 04',
    });

    // 4. Primary Student User (Aarav Patel)
    const studentUser = await User.create({
      email: 'aarav@edusphere.ai',
      passwordHash: studentPasswordHash,
      role: 'STUDENT',
      isActive: true,
    });
    await Profile.create({
      user: studentUser._id,
      firstName: 'Aarav',
      lastName: 'Patel',
      registrationNo: '22CS084',
      phone: '+91 91234 56789',
      department: cseDept._id,
      batchYear: 2022,
      currentSemester: 6,
      section: 'A',
      parentName: 'Ramesh Patel',
      parentPhone: '+91 98111 22334',
      parentEmail: 'ramesh.patel@example.com',
      address: 'Hostel Block 4, Room 212',
      studentType: 'RESIDENTIAL',
    });

    // 5. Additional Students (Priya & Rohit)
    const student2 = await User.create({
      email: 'priya.sharma@edusphere.ai',
      passwordHash: studentPasswordHash,
      role: 'STUDENT',
      isActive: true,
    });
    await Profile.create({
      user: student2._id,
      firstName: 'Priya',
      lastName: 'Sharma',
      registrationNo: '22CS091',
      phone: '+91 92345 67890',
      department: cseDept._id,
      batchYear: 2022,
      currentSemester: 6,
      section: 'A',
      parentName: 'Sunil Sharma',
      parentPhone: '+91 98222 33445',
    });

    const student3 = await User.create({
      email: 'rohit.kumar@edusphere.ai',
      passwordHash: studentPasswordHash,
      role: 'STUDENT',
      isActive: true,
    });
    await Profile.create({
      user: student3._id,
      firstName: 'Rohit',
      lastName: 'Kumar',
      registrationNo: '22CS105',
      phone: '+91 93456 78901',
      department: cseDept._id,
      batchYear: 2022,
      currentSemester: 6,
      section: 'A',
      parentName: 'Mahesh Kumar',
      parentPhone: '+91 98333 44556',
    });

    const student4 = await User.create({
      email: 'nisha.kulkarni@edusphere.ai',
      passwordHash: studentPasswordHash,
      role: 'STUDENT',
      isActive: true,
    });
    await Profile.create({
      user: student4._id,
      firstName: 'Nisha',
      lastName: 'Kulkarni',
      registrationNo: '23AI042',
      phone: '+91 90123 45678',
      department: aiDept._id,
      batchYear: 2023,
      currentSemester: 4,
      section: 'A',
      parentName: 'Meena Kulkarni',
      parentPhone: '+91 99880 11223',
      studentType: 'DAY_SCHOLAR',
      address: '44, Lake View Apartments, Indiranagar, Bengaluru, Karnataka 560038',
    });

    console.log('[Seed] Creating Courses...');
    const course1 = await Course.create({
      code: 'CS401',
      title: 'Design & Analysis of Algorithms',
      description: 'Asymptotic notation, divide-and-conquer, dynamic programming, graph algorithms, and NP-completeness.',
      credits: 4,
      semester: 6,
      department: cseDept._id,
      assignedFaculty: facultyUser._id,
      syllabusTopics: [
        { unit: 1, title: 'Foundations & Recurrences', hours: 8, topics: ['Big O, Omega, Theta', 'Master Theorem', 'Substitution Method'] },
        { unit: 2, title: 'Greedy & Dynamic Programming', hours: 10, topics: ['Knapsack Problem', 'LCS', 'Matrix Chain Multiplication', 'Bellman-Ford'] },
        { unit: 3, title: 'Graph Algorithms & Flow', hours: 10, topics: ['Dijkstra Algorithm', 'Floyd-Warshall', 'Ford-Fulkerson Max Flow'] },
        { unit: 4, title: 'Tractable & Intractable Problems', hours: 8, topics: ['P vs NP Complexity', 'NP-Hard Reductions', 'Approximation Algorithms'] },
      ],
    });

    const course2 = await Course.create({
      code: 'CS402',
      title: 'Database Management Systems',
      description: 'Relational model, SQL/NoSQL architectures, query optimization, ACID transactions and concurrency control.',
      credits: 4,
      semester: 6,
      department: cseDept._id,
      assignedFaculty: facultyUser._id,
      syllabusTopics: [
        { unit: 1, title: 'Relational Data Model & Schema', hours: 8, topics: ['ER Diagrams', 'Relational Algebra', 'Tuple Calculus'] },
        { unit: 2, title: 'Normalization & Storage Indexing', hours: 10, topics: ['1NF to BCNF', 'B+ Trees', 'Hashing Techniques'] },
        { unit: 3, title: 'Transaction Management & Concurrency', hours: 8, topics: ['ACID Properties', '2PL Concurrency Control', 'Deadlock Recovery'] },
      ],
    });

    const course3 = await Course.create({
      code: 'CS403',
      title: 'Artificial Intelligence & Machine Learning',
      description: 'Search algorithms, supervised and unsupervised learning, deep learning primitives and evaluation metrics.',
      credits: 4,
      semester: 6,
      department: cseDept._id,
      assignedFaculty: facultyUser._id,
      syllabusTopics: [
        { unit: 1, title: 'Heuristic Search & Knowledge Representation', hours: 8, topics: ['A* Search', 'Alpha-Beta Pruning', 'Propositional Logic'] },
        { unit: 2, title: 'Supervised Learning Frameworks', hours: 10, topics: ['Linear Regression', 'Decision Trees', 'Random Forests', 'XGBoost'] },
        { unit: 3, title: 'Neural Networks & Deep Learning', hours: 10, topics: ['Backpropagation', 'CNN Architectures', 'SHAP Explainability'] },
      ],
    });

    console.log('[Seed] Creating Course Enrollments...');
    await Enrollment.create([
      {
        student: studentUser._id,
        course: course1._id,
        academicYear: '2025-2026',
        semester: 6,
        status: 'ENROLLED',
        attendancePercentage: 92,
        totalClasses: 26,
        attendedClasses: 24,
        internalScore: 28,
      },
      {
        student: studentUser._id,
        course: course2._id,
        academicYear: '2025-2026',
        semester: 6,
        status: 'ENROLLED',
        attendancePercentage: 88,
        totalClasses: 25,
        attendedClasses: 22,
        internalScore: 27,
      },
      {
        student: studentUser._id,
        course: course3._id,
        academicYear: '2025-2026',
        semester: 6,
        status: 'ENROLLED',
        attendancePercentage: 85,
        totalClasses: 20,
        attendedClasses: 17,
        internalScore: 26,
      },
      // Student 2 (Priya)
      {
        student: student2._id,
        course: course1._id,
        academicYear: '2025-2026',
        semester: 6,
        status: 'ENROLLED',
        attendancePercentage: 72,
        totalClasses: 26,
        attendedClasses: 19,
        internalScore: 23,
      },
      // Student 3 (Rohit - Shortage)
      {
        student: student3._id,
        course: course1._id,
        academicYear: '2025-2026',
        semester: 6,
        status: 'ENROLLED',
        attendancePercentage: 58,
        totalClasses: 26,
        attendedClasses: 15,
        internalScore: 18,
      },
    ]);

    console.log('[Seed] Creating Timetable Slots...');
    const days: ('MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY')[] = [
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
    ];

    const slotConfigs = [
      { periodNumber: 1, startTime: '09:00 AM', endTime: '10:00 AM', course: course1._id, room: 'Lab 302 (Computing Center)' },
      { periodNumber: 2, startTime: '10:15 AM', endTime: '11:15 AM', course: course2._id, room: 'Lecture Hall B-204' },
      { periodNumber: 3, startTime: '11:30 AM', endTime: '12:30 PM', course: course3._id, room: 'AI Research Lab 1' },
      { periodNumber: 4, startTime: '01:30 PM', endTime: '02:30 PM', course: course1._id, room: 'Tech Block Room 105' },
    ];

    for (const day of days) {
      for (const slot of slotConfigs) {
        await TimetableSlot.create({
          department: cseDept._id,
          course: slot.course,
          faculty: facultyUser._id,
          semester: 6,
          section: 'A',
          dayOfWeek: day,
          periodNumber: slot.periodNumber,
          startTime: slot.startTime,
          endTime: slot.endTime,
          room: slot.room,
          academicYear: '2025-2026',
        });
      }
    }

    console.log('[Seed] Creating Study Materials...');
    await StudyMaterial.create([
      {
        course: course1._id,
        title: 'Dynamic Programming & Graph Algorithms Master Notes',
        description: 'Comprehensive study lecture notes covering Knapsack, LCS, Matrix Chain Multiplication, and Dijkstra algorithms with step-by-step proofs.',
        unitNumber: 2,
        fileUrl: '/materials/cs401-dp-graph-notes.pdf',
        fileSizeBytes: 3565158, // 3.4 MB
        fileType: 'PDF',
        uploadedBy: facultyUser._id,
        downloadCount: 142,
        tags: ['Algorithms', 'Dynamic Programming', 'Graph Theory'],
      },
      {
        course: course2._id,
        title: 'Relational Indexing, B+ Trees & Query Optimization Slides',
        description: 'Complete slide deck for Module 2: B+ Tree indexing architectures, hash tables, and SQL query execution plans.',
        unitNumber: 2,
        fileUrl: '/materials/cs402-indexing-bplus-trees.pdf',
        fileSizeBytes: 5347737, // 5.1 MB
        fileType: 'PDF',
        uploadedBy: facultyUser._id,
        downloadCount: 128,
        tags: ['DBMS', 'Indexing', 'B+ Trees'],
      },
      {
        course: course3._id,
        title: 'Deep Learning & Neural Network Lab Experiment Manual',
        description: 'Hands-on laboratory manual containing Python PyTorch implementations for CNNs, Backpropagation, and Model Interpretability with SHAP.',
        unitNumber: 3,
        fileUrl: '/materials/cs403-deep-learning-lab-manual.pdf',
        fileSizeBytes: 2936012, // 2.8 MB
        fileType: 'PDF',
        uploadedBy: facultyUser._id,
        downloadCount: 115,
        tags: ['AI', 'Machine Learning', 'Lab Manual'],
      },
    ]);

    console.log('[Seed] Creating Examinations & Grade Entries...');
    const exam1 = await Exam.create({
      course: course1._id,
      examType: 'MID_TERM',
      title: 'Mid-Term Examination 1: Design & Analysis of Algorithms',
      maxMarks: 50,
      weightagePercent: 30,
      examDate: new Date('2026-03-14T09:30:00Z'),
      durationMinutes: 120,
      room: 'Main Examination Hall 03',
      isPublished: true,
    });

    const exam2 = await Exam.create({
      course: course2._id,
      examType: 'MID_TERM',
      title: 'Mid-Term Examination 1: Database Management Systems',
      maxMarks: 50,
      weightagePercent: 30,
      examDate: new Date('2026-03-18T09:30:00Z'),
      durationMinutes: 120,
      room: 'Main Examination Hall 01',
      isPublished: true,
    });

    const exam3 = await Exam.create({
      course: course3._id,
      examType: 'MID_TERM',
      title: 'Mid-Term Examination 1: AI & Machine Learning Theory',
      maxMarks: 50,
      weightagePercent: 30,
      examDate: new Date('2026-03-22T14:00:00Z'),
      durationMinutes: 120,
      room: 'AI Lab Complex 02',
      isPublished: true,
    });

    // Grade Entries
    await GradeEntry.create([
      {
        exam: exam1._id,
        course: course1._id,
        student: studentUser._id,
        marksObtained: 46,
        percentage: 92,
        gradeLetter: 'O',
        feedback: 'Outstanding grasp of graph algorithm complexities.',
        gradedBy: facultyUser._id,
      },
      {
        exam: exam2._id,
        course: course2._id,
        student: studentUser._id,
        marksObtained: 44,
        percentage: 88,
        gradeLetter: 'A+',
        feedback: 'Well-structured SQL relational schema queries.',
        gradedBy: facultyUser._id,
      },
      {
        exam: exam3._id,
        course: course3._id,
        student: studentUser._id,
        marksObtained: 45,
        percentage: 90,
        gradeLetter: 'O',
        feedback: 'Excellent explainability formulation.',
        gradedBy: facultyUser._id,
      },
      // Student 3 (Rohit)
      {
        exam: exam1._id,
        course: course1._id,
        student: student3._id,
        marksObtained: 18,
        percentage: 36,
        gradeLetter: 'F',
        feedback: 'Needs remedial practice on Dynamic Programming.',
        gradedBy: facultyUser._id,
      },
    ]);

    console.log('[Seed] Creating Attendance Sessions & Records...');
    const session1 = await AttendanceSession.create({
      course: course1._id,
      faculty: facultyUser._id,
      date: new Date(),
      slotTime: '09:00 AM - 10:00 AM',
      topicCovered: 'Dynamic Programming - Matrix Chain Multiplication Proofs',
      totalStudents: 3,
      presentCount: 2,
      absentCount: 1,
    });

    await AttendanceRecord.create([
      {
        session: session1._id,
        course: course1._id,
        student: studentUser._id,
        date: session1.date,
        status: 'PRESENT',
        remarks: 'Active participant in derivation',
      },
      {
        session: session1._id,
        course: course1._id,
        student: student2._id,
        date: session1.date,
        status: 'PRESENT',
        remarks: '',
      },
      {
        session: session1._id,
        course: course1._id,
        student: student3._id,
        date: session1.date,
        status: 'ABSENT',
        remarks: 'Absent without leave notification',
      },
    ]);

    console.log('[Seed] Creating Mentor Allocations & Risk Scores...');
    await MentorAllocation.create([
      { mentor: mentorUser._id, student: studentUser._id, isActive: true },
      { mentor: mentorUser._id, student: student2._id, isActive: true },
      { mentor: mentorUser._id, student: student3._id, isActive: true },
    ]);

    await RiskScore.create([
      {
        student: studentUser._id,
        semester: 6,
        academicYear: '2025-2026',
        riskLevel: 'LOW',
        riskScore: 14,
        predictedAttendance: 90,
        predictedGpa: 8.6,
        primaryFactors: [
          { factor: 'High Class Attendance', impactScore: -12, description: 'Maintained 88%+ attendance across all 3 active courses' },
          { factor: 'Consistent Internal Marks', impactScore: -10, description: 'Averaging 27/30 in mid-term evaluations' },
        ],
        recommendedActions: [
          'Nominate for Advanced Machine Learning Research Track',
          'Eligible for Dean Honor Roll Award',
        ],
      },
      {
        student: student2._id,
        semester: 6,
        academicYear: '2025-2026',
        riskLevel: 'MODERATE',
        riskScore: 48,
        predictedAttendance: 74,
        predictedGpa: 6.9,
        primaryFactors: [
          { factor: 'Attendance Borderline Alert', impactScore: 25, description: 'Attendance in Algorithms dropped to 72%' },
          { factor: 'Assignment Delay', impactScore: 15, description: '2 lab submissions submitted after deadline' },
        ],
        recommendedActions: [
          'Schedule 1-on-1 counseling session before mid-term 2',
          'Provide Algorithms DP practice sheet',
        ],
      },
      {
        student: student3._id,
        semester: 6,
        academicYear: '2025-2026',
        riskLevel: 'CRITICAL',
        riskScore: 82,
        predictedAttendance: 58,
        predictedGpa: 5.2,
        primaryFactors: [
          { factor: 'Severe Attendance Deficit', impactScore: 45, description: 'Missed 8 consecutive lab sessions in CS401 and CS402' },
          { factor: 'Internal Assessment Failure', impactScore: 35, description: 'Scored 18/50 in Mid-term 1 test' },
        ],
        recommendedActions: [
          'URGENT: Issue Parent Notification Letter',
          'Mandatory remedial tutorial attendance 4:00 PM - 5:00 PM',
        ],
      },
    ]);

    await InterventionLog.create({
      mentor: mentorUser._id,
      student: student3._id,
      concernType: 'ATTENDANCE_DROP',
      title: 'Urgent Attendance & Internal Deficit Counseling',
      notes: 'Student reported health issues during the last month. Provided medical leave form guidelines.',
      actionPlan: 'Enrolled in 2-week remedial classes. Follow-up meeting scheduled on Friday.',
      status: 'OPEN',
      parentNotified: true,
    });

    console.log('[Seed] Creating Fee Invoices (Phase 3)...');
    await FeeInvoice.create([
      {
        student: studentUser._id,
        academicYear: '2025-2026',
        semester: 6,
        tuitionFee: 45000,
        laboratoryFee: 12000,
        hostelFee: 28000,
        libraryFee: 3500,
        totalAmount: 88500,
        paidAmount: 88500,
        balanceAmount: 0,
        status: 'PAID',
        dueDate: new Date('2026-03-31'),
        transactions: [
          {
            transactionId: 'TXN-EDU-984511',
            amount: 88500,
            paymentMethod: 'ONLINE_UPI',
            paidAt: new Date('2026-01-12'),
            receiptNumber: 'REC-2026-084-7812',
          },
        ],
      },
      {
        student: student3._id,
        academicYear: '2025-2026',
        semester: 6,
        tuitionFee: 45000,
        laboratoryFee: 12000,
        hostelFee: 28000,
        libraryFee: 3500,
        totalAmount: 88500,
        paidAmount: 31500,
        balanceAmount: 57000,
        status: 'PARTIAL',
        dueDate: new Date('2026-03-31'),
        transactions: [
          {
            transactionId: 'TXN-EDU-882211',
            amount: 31500,
            paymentMethod: 'NET_BANKING',
            paidAt: new Date('2026-01-15'),
            receiptNumber: 'REC-2026-105-3301',
          },
        ],
      },
    ]);

    console.log('[Seed] Creating Admission Applications (Phase 3)...');
    await AdmissionApplication.create([
      {
        applicationNumber: 'APP-2026-CSE-0041',
        candidateName: 'Aryan Gupta',
        email: 'aryan.gupta@gmail.com',
        phone: '+91 98101 22334',
        entranceExam: 'JEE_MAIN',
        entranceScore: 97.6,
        qualifyingMarksPercentage: 94.2,
        appliedBranch: 'CSE',
        allocatedQuota: 'GENERAL',
        status: 'ADMITTED',
        department: cseDept._id,
      },
      {
        applicationNumber: 'APP-2026-CSE-0067',
        candidateName: 'Neha Singh',
        email: 'neha.singh@gmail.com',
        phone: '+91 93201 55667',
        entranceExam: 'JEE_ADVANCED',
        entranceScore: 95.1,
        qualifyingMarksPercentage: 91.8,
        appliedBranch: 'CSE',
        allocatedQuota: 'OBC',
        status: 'VERIFIED',
        department: cseDept._id,
      },
      {
        applicationNumber: 'APP-2026-AI-0019',
        candidateName: 'Karan Mehta',
        email: 'karan.mehta@gmail.com',
        phone: '+91 90011 44223',
        entranceExam: 'JEE_MAIN',
        entranceScore: 91.4,
        qualifyingMarksPercentage: 88.5,
        appliedBranch: 'AI_DS',
        allocatedQuota: 'SC',
        status: 'UNDER_REVIEW',
        department: aiDept._id,
      },
    ]);

    console.log('[Seed] Creating Hostel Rooms & Allocations (Phase 3)...');
    const block4Room = await HostelRoom.create({
      blockName: 'Block 4 - Aryabhata',
      roomNumber: '212',
      floor: 2,
      capacity: 2,
      currentOccupancy: 2,
      type: 'NON_AC',
      status: 'OCCUPIED',
      annualFee: 28000,
    });

    await HostelRoom.create([
      { blockName: 'Block 1 - Ramanujan', roomNumber: '101', floor: 1, capacity: 3, currentOccupancy: 3, type: 'NON_AC', status: 'OCCUPIED', annualFee: 24000 },
      { blockName: 'Block 2 - Einstein', roomNumber: '105', floor: 1, capacity: 2, currentOccupancy: 1, type: 'AC', status: 'AVAILABLE', annualFee: 36000 },
      { blockName: 'Block 3 - APJ Kalam', roomNumber: '201', floor: 2, capacity: 2, currentOccupancy: 2, type: 'NON_AC', status: 'OCCUPIED', annualFee: 24000 },
      { blockName: 'Block 5 - Tesla', roomNumber: '301', floor: 3, capacity: 1, currentOccupancy: 0, type: 'AC', status: 'AVAILABLE', annualFee: 42000 },
    ]);

    await HostelAllocation.create({
      student: studentUser._id,
      room: block4Room._id,
      bedNumber: 'Bed-A (Window Side)',
      allocationDate: new Date('2025-08-01'),
      academicYear: '2025-2026',
      isActive: true,
      emergencyContact: '+91 98111 22334',
    });

    console.log('[Seed] Creating Infrastructure Devices & Tickets (Phase 4)...');
    await InfrastructureDevice.create([
      { deviceName: 'Campus AP-Main-Block', category: 'WIFI', location: 'Main Academic Block', status: 'OPERATIONAL', telemetryValue: 98, metricUnit: '%', lastPing: new Date(), ipAddress: '192.168.1.10' },
      { deviceName: 'Campus AP-Hostel-4', category: 'WIFI', location: 'Hostel Block 4', status: 'OPERATIONAL', telemetryValue: 98.4, metricUnit: '%', lastPing: new Date(), ipAddress: '192.168.1.15' },
      { deviceName: 'Grid-Main-Transformer', category: 'POWER', location: 'Main Power Substation', status: 'OPERATIONAL', telemetryValue: 73, metricUnit: '% Grid Capacity', lastPing: new Date(), ipAddress: '192.168.2.1' },
      { deviceName: 'Solar-Array-Roof', category: 'POWER', location: 'Admin Block Terrace', status: 'OPERATIONAL', telemetryValue: 32, metricUnit: 'kW Output', lastPing: new Date(), ipAddress: '192.168.2.2' },
      { deviceName: 'Water-Tank-Primary', category: 'WATER', location: 'Campus Overhead Tank 1', status: 'OPERATIONAL', telemetryValue: 100, metricUnit: '% Tank Level', lastPing: new Date(), ipAddress: '192.168.3.1' },
    ]);

    await MaintenanceTicket.create([
      {
        ticketNumber: 'TCK-826441',
        reportedBy: studentUser._id,
        title: 'Wi-Fi signal dropping intermittently in Lab 302 Computing Center',
        category: 'WIFI',
        location: 'Tech Block B, Floor 3, Lab 302',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        assignedTechnician: 'Ramesh Sharma (IT Infrastructure Team)',
        description: 'Connection drops every 15 minutes during GPU lab sessions.',
      },
      {
        ticketNumber: 'TCK-819002',
        reportedBy: studentUser._id,
        title: 'Tube light not working in Hostel Block 4, Corridor B',
        category: 'ELECTRICAL',
        location: 'Hostel Block 4, Floor 2, Corridor B',
        priority: 'LOW',
        status: 'OPEN',
        assignedTechnician: 'Campus Facility Engineer',
        description: 'Tube light has been flickering for 3 days.',
      },
    ]);

    console.log('====================================================');
    console.log('✅ EduSphere AI — ALL 6 PHASES SEEDED SUCCESSFULLY!');
    console.log('----------------------------------------------------');
    console.log('Phase 1: Authentication, RBAC, Profiles ✓');
    console.log('Phase 2: Academics, Attendance, Exams, Timetable, Materials, Mentorship ✓');
    console.log('Phase 3: Fees, Admissions, Hostel Management ✓');
    console.log('Phase 4: Infrastructure Telemetry, OR-Tools Timetable Solver ✓');
    console.log('Phase 5: XGBoost Risk Engine, Gemini AI Academic Advisor ✓');
    console.log('Phase 6: Docker, nginx, docker-compose, .env.example ✓');
    console.log('----------------------------------------------------');
    console.log('Demo Credentials:');
    console.log('👑 Admin:   admin@edusphere.ai   | Admin@12345');
    console.log('👨‍🏫 Faculty: faculty@edusphere.ai | Faculty@12345');
    console.log('🧭 Mentor:  mentor@edusphere.ai  | Mentor@12345');
    console.log('🎓 Student: aarav@edusphere.ai | Student@12345');
    console.log('🎓 Day Scholar: nisha.kulkarni@edusphere.ai | Student@12345');
    console.log('====================================================');

    if (disconnectAfter) {
      await mongoose.disconnect();
      process.exit(0);
    }
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
    if (disconnectAfter) {
      process.exit(1);
    }
  }
};

if (require.main === module) {
  seedDatabase(true);
}

