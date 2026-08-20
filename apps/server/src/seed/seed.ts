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

    // 2. Faculty User
    const facultyUser = await User.create({
      email: 'faculty@edusphere.ai',
      passwordHash: facultyPasswordHash,
      role: 'FACULTY',
      isActive: true,
    });
    await Profile.create({
      user: facultyUser._id,
      firstName: 'Dr. Rajesh',
      lastName: 'Sharma',
      registrationNo: 'FAC-CSE-042',
      phone: '+91 98765 43210',
      designation: 'Associate Professor & Algorithm Lab Lead',
      department: cseDept._id,
      cabinNumber: 'Tech Block B, Cabin 304',
    });

    // 3. Mentor User
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

    // 4. Primary Student User
    const studentUser = await User.create({
      email: 'student@edusphere.ai',
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
    });

    // 5. Additional Students for Mentor Roster testing
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
        { unit: 1, title: 'Foundations & Recurrences', hours: 8, topics: ['Big O, Omega, Theta', 'Master Theorem'] },
        { unit: 2, title: 'Greedy & Dynamic Programming', hours: 10, topics: ['Knapsack', 'LCS', 'Matrix Chain Multiplication'] },
        { unit: 3, title: 'Graph Algorithms', hours: 10, topics: ['Dijkstra', 'Bellman-Ford', 'Network Flow'] },
        { unit: 4, title: 'Tractable & Intractable Problems', hours: 8, topics: ['P vs NP', 'NP-Hard Reductions'] },
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
        { unit: 1, title: 'Relational Data Model', hours: 8, topics: ['ER Diagrams', 'Relational Algebra'] },
        { unit: 2, title: 'Normalization & Indexing', hours: 10, topics: ['1NF to BCNF', 'B+ Trees', 'Hashing'] },
        { unit: 3, title: 'Transaction Management', hours: 8, topics: ['ACID Properties', '2PL Concurrency Control'] },
      ],
    });

    const course3 = await Course.create({
      code: 'CS403',
      title: 'Artificial Intelligence & Machine Learning',
      description: 'Search algorithms, supervised and unsupervised learning, deep learning primitives and evaluation metrics.',
      credits: 3,
      semester: 6,
      department: cseDept._id,
      assignedFaculty: facultyUser._id,
      syllabusTopics: [
        { unit: 1, title: 'Search & Knowledge Representation', hours: 8, topics: ['A* Search', 'Heuristics'] },
        { unit: 2, title: 'Supervised Learning', hours: 10, topics: ['Regression', 'Decision Trees', 'SVM'] },
        { unit: 3, title: 'Neural Networks & Deep Learning', hours: 10, topics: ['Backpropagation', 'CNNs', 'Transformers'] },
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
    ]);

    console.log('[Seed] Creating Mentor Allocations & Risk Scores...');
    // Allocations
    await MentorAllocation.create([
      { mentor: mentorUser._id, student: studentUser._id, isActive: true },
      { mentor: mentorUser._id, student: student2._id, isActive: true },
      { mentor: mentorUser._id, student: student3._id, isActive: true },
    ]);

    // Risk Scores for Demo
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
          { factor: 'Internal Assessment Failure', impactScore: 35, description: 'Scored 9/30 in Mid-term 1 test' },
        ],
        recommendedActions: [
          'URGENT: Issue Parent Notification Letter',
          'Mandatory remedial tutorial attendance 4:00 PM - 5:00 PM',
        ],
      },
    ]);

    // Sample Intervention
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

    console.log('====================================================');
    console.log('✅ EduSphere AI Database Seeded Successfully!');
    console.log('----------------------------------------------------');
    console.log('Demo Credentials for Testing:');
    console.log('👑 Admin:   admin@edusphere.ai   | Admin@12345');
    console.log('👨‍🏫 Faculty: faculty@edusphere.ai | Faculty@12345');
    console.log('🧭 Mentor:  mentor@edusphere.ai  | Mentor@12345');
    console.log('🎓 Student: student@edusphere.ai | Student@12345');
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
