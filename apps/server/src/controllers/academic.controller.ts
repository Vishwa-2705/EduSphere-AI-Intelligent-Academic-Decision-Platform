import { Request, Response, NextFunction } from 'express';
import { Department } from '../models/Department';
import { Course } from '../models/Course';
import { Enrollment } from '../models/Enrollment';

export const getDepartments = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const departments = await Department.find({ isActive: true }).populate('headOfDepartment', 'email');
    res.status(200).json({
      success: true,
      data: departments,
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
    const { departmentId, semester } = req.query;
    const filter: any = { isActive: true };

    if (departmentId) filter.department = departmentId;
    if (semester) filter.semester = Number(semester);

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
