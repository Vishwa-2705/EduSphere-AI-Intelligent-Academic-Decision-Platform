import { Request, Response, NextFunction } from 'express';
import { Department } from '../models/Department';
import { Course } from '../models/Course';
import { Enrollment } from '../models/Enrollment';
import { Profile } from '../models/Profile';
import { User } from '../models/User';

export const getDepartments = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const departments = await Department.find({ isActive: true }).populate('headOfDepartment', 'email');
    
    // Fetch stats for each department
    const deptWithStats = await Promise.all(
      departments.map(async (d) => {
        const studentCount = await Profile.countDocuments({ department: d._id });
        const courseCount = await Course.countDocuments({ department: d._id });
        return {
          _id: d._id,
          code: d.code,
          name: d.name,
          establishedYear: d.establishedYear,
          isActive: d.isActive,
          studentCount,
          courseCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: deptWithStats,
    });
  } catch (error) {
    next(error);
  }
};

export const createDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { code, name, establishedYear } = req.body;
    if (!code || !name) {
      res.status(400).json({ success: false, message: 'Department code and name are required' });
      return;
    }

    const existing = await Department.findOne({ code: code.toUpperCase() });
    if (existing) {
      res.status(400).json({ success: false, message: 'Department code already exists' });
      return;
    }

    const department = await Department.create({
      code: code.toUpperCase(),
      name,
      establishedYear: establishedYear || new Date().getFullYear(),
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

export const getCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { departmentId, semester, search } = req.query;
    const filter: any = { isActive: true };

    if (departmentId) filter.department = departmentId;
    if (semester) filter.semester = Number(semester);
    if (search) {
      filter.$or = [
        { code: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
      ];
    }

    const courses = await Course.find(filter)
      .populate('department')
      .populate('assignedFaculty', 'email');

    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

export const getCourseById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId)
      .populate('department')
      .populate('assignedFaculty', 'email');

    if (!course) {
      res.status(404).json({ success: false, message: 'Course not found' });
      return;
    }

    const enrollmentCount = await Enrollment.countDocuments({ course: course._id, status: 'ENROLLED' });

    res.status(200).json({
      success: true,
      data: {
        ...course.toObject(),
        enrolledStudentsCount: enrollmentCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { code, title, description, credits, semester, departmentId, facultyId, syllabusTopics } = req.body;
    if (!code || !title || !departmentId || !semester) {
      res.status(400).json({ success: false, message: 'Course code, title, department, and semester are required' });
      return;
    }

    const existing = await Course.findOne({ code: code.toUpperCase() });
    if (existing) {
      res.status(400).json({ success: false, message: 'Course code already exists' });
      return;
    }

    const course = await Course.create({
      code: code.toUpperCase(),
      title,
      description: description || '',
      credits: credits || 4,
      semester: Number(semester),
      department: departmentId,
      assignedFaculty: facultyId || null,
      syllabusTopics: syllabusTopics || [
        { unit: 1, title: 'Introduction & Foundations', hours: 8, topics: ['Overview', 'Fundamentals'] },
        { unit: 2, title: 'Core Theoretical Paradigms', hours: 10, topics: ['Methodologies', 'Architectures'] },
        { unit: 3, title: 'Applications & Case Studies', hours: 10, topics: ['Practical Design', 'System Integration'] },
        { unit: 4, title: 'Advanced Analysis & Future Trends', hours: 8, topics: ['Performance Evaluation', 'Research Frontiers'] },
      ],
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role;

    if (role === 'STUDENT') {
      const enrollments = await Enrollment.find({ student: userId, status: 'ENROLLED' })
        .populate({
          path: 'course',
          populate: [
            { path: 'department' },
            { path: 'assignedFaculty', select: 'email' },
          ],
        });

      // Get faculty profile info for each course
      const formatted = await Promise.all(
        enrollments.map(async (en) => {
          const course = en.course as any;
          let facultyProfile = null;
          if (course?.assignedFaculty?._id) {
            facultyProfile = await Profile.findOne({ user: course.assignedFaculty._id });
          }
          return {
            enrollmentId: en._id,
            courseId: course?._id,
            code: course?.code,
            title: course?.title,
            description: course?.description,
            credits: course?.credits,
            semester: course?.semester,
            department: course?.department?.name || 'Computer Science',
            facultyName: facultyProfile?.fullName || 'Dr. Rajesh Sharma',
            facultyEmail: course?.assignedFaculty?.email || 'faculty@edusphere.ai',
            attendancePercentage: en.attendancePercentage,
            attendedClasses: en.attendedClasses,
            totalClasses: en.totalClasses,
            internalScore: en.internalScore,
            syllabusTopics: course?.syllabusTopics || [],
          };
        })
      );

      res.status(200).json({
        success: true,
        data: formatted,
      });
      return;
    }

    if (role === 'FACULTY') {
      const courses = await Course.find({ assignedFaculty: userId, isActive: true })
        .populate('department');

      const formatted = await Promise.all(
        courses.map(async (c) => {
          const studentCount = await Enrollment.countDocuments({ course: c._id, status: 'ENROLLED' });
          return {
            courseId: c._id,
            code: c.code,
            title: c.title,
            description: c.description,
            credits: c.credits,
            semester: c.semester,
            department: (c.department as any)?.name || 'Computer Science',
            enrolledStudentsCount: studentCount,
            syllabusTopics: c.syllabusTopics || [],
          };
        })
      );

      res.status(200).json({
        success: true,
        data: formatted,
      });
      return;
    }

    // Default for Admin / Mentor
    const allCourses = await Course.find({ isActive: true }).populate('department').populate('assignedFaculty', 'email');
    res.status(200).json({
      success: true,
      data: allCourses,
    });
  } catch (error) {
    next(error);
  }
};
