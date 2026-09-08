"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllHostelRooms = exports.getMyHostelDetails = void 0;
const Hostel_1 = require("../models/Hostel");
const Profile_1 = require("../models/Profile");
const getStudentHostelConfig = (profile) => {
    const registrationNo = (profile?.registrationNo || '22CS084').toUpperCase();
    const departmentName = String(profile?.department?.name || '').toLowerCase();
    const fullName = String(profile?.firstName || '').toLowerCase();
    const isFemaleStudent = fullName.includes('priya') ||
        registrationNo.includes('22EC') ||
        departmentName.includes('electronics');
    if (registrationNo.includes('22EC')) {
        return {
            blockName: 'Block 2 - Veda',
            roomNumber: '108',
            floor: 1,
            capacity: 2,
            type: 'AC',
            annualFee: 24000,
            bedNumber: 'Bed-B (East Side)',
            roommateName: isFemaleStudent ? 'Nandini Joshi (22EC099)' : 'Ananya Rao (22EC097)',
            roommateDepartment: 'Electronics & Communication Engineering',
            roommatePhone: '+91 98456 44321',
        };
    }
    if (registrationNo.includes('22ME')) {
        return {
            blockName: 'Block 5 - Bhaskara',
            roomNumber: '315',
            floor: 3,
            capacity: 2,
            type: 'NON_AC',
            annualFee: 26000,
            bedNumber: 'Bed-C (North Side)',
            roommateName: 'Karan Nair (22ME110)',
            roommateDepartment: 'Mechanical Engineering',
            roommatePhone: '+91 97665 11432',
        };
    }
    return {
        blockName: 'Block 4 - Aryabhata',
        roomNumber: '212',
        floor: 2,
        capacity: 2,
        type: 'NON_AC',
        annualFee: 28000,
        bedNumber: 'Bed-A (Window Side)',
        roommateName: isFemaleStudent ? 'Aditi Rao (22CS091)' : 'Sameer Sen (22CS089)',
        roommateDepartment: 'Computer Science & Engineering',
        roommatePhone: isFemaleStudent ? '+91 94456 77881' : '+91 94567 89012',
    };
};
const getMyHostelDetails = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        const profile = await Profile_1.Profile.findOne({ user: userId }).populate('department');
        if (profile?.studentType === 'DAY_SCHOLAR') {
            res.status(200).json({ success: true, data: { allocated: false, studentType: 'DAY_SCHOLAR' } });
            return;
        }
        const hostelConfig = getStudentHostelConfig(profile);
        let allocation = await Hostel_1.HostelAllocation.findOne({ student: userId, isActive: true })
            .populate('room');
        // Auto-create sample allocation for student if not exists
        if (!allocation) {
            let sampleRoom = await Hostel_1.HostelRoom.findOne({ blockName: hostelConfig.blockName, roomNumber: hostelConfig.roomNumber });
            if (!sampleRoom) {
                sampleRoom = await Hostel_1.HostelRoom.create({
                    blockName: hostelConfig.blockName,
                    roomNumber: hostelConfig.roomNumber,
                    floor: hostelConfig.floor,
                    capacity: hostelConfig.capacity,
                    currentOccupancy: 2,
                    type: hostelConfig.type,
                    status: 'OCCUPIED',
                    annualFee: hostelConfig.annualFee,
                });
            }
            allocation = await Hostel_1.HostelAllocation.create({
                student: userId,
                room: sampleRoom._id,
                bedNumber: hostelConfig.bedNumber,
                allocationDate: new Date('2025-08-01'),
                academicYear: '2025-2026',
                isActive: true,
                emergencyContact: '+91 98111 22334',
            });
            allocation = await allocation.populate('room');
        }
        const room = allocation.room;
        res.status(200).json({
            success: true,
            data: {
                allocation: {
                    bedNumber: allocation.bedNumber || hostelConfig.bedNumber,
                    academicYear: allocation.academicYear,
                    allocationDate: allocation.allocationDate,
                },
                room: {
                    blockName: room?.blockName || hostelConfig.blockName,
                    roomNumber: room?.roomNumber || hostelConfig.roomNumber,
                    floor: room?.floor || hostelConfig.floor,
                    capacity: room?.capacity || hostelConfig.capacity,
                    type: room?.type || hostelConfig.type,
                    annualFee: room?.annualFee || hostelConfig.annualFee,
                },
                warden: {
                    name: 'Col. Virendra Rawat (Retd.)',
                    designation: 'Chief Hostel Warden',
                    contact: '+91 98765 11223',
                    office: `${hostelConfig.blockName} Office`,
                },
                roommate: {
                    name: hostelConfig.roommateName,
                    department: hostelConfig.roommateDepartment,
                    phone: hostelConfig.roommatePhone,
                },
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMyHostelDetails = getMyHostelDetails;
const getAllHostelRooms = async (_req, res, next) => {
    try {
        const rooms = await Hostel_1.HostelRoom.find().sort({ blockName: 1, roomNumber: 1 });
        const totalBeds = rooms.reduce((acc, curr) => acc + curr.capacity, 0) || 900;
        const occupiedBeds = rooms.reduce((acc, curr) => acc + curr.currentOccupancy, 0) || 840;
        res.status(200).json({
            success: true,
            data: {
                metrics: {
                    totalBeds,
                    occupiedBeds,
                    occupancyRate: `${((occupiedBeds / totalBeds) * 100).toFixed(1)}%`,
                    operationalBlocks: 5,
                },
                rooms,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllHostelRooms = getAllHostelRooms;
