import { Request, Response, NextFunction } from 'express';
import { InfrastructureDevice, MaintenanceTicket } from '../models/Infrastructure';
import { Profile } from '../models/Profile';

export const getInfrastructureStatus = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const devices = await InfrastructureDevice.find();

    const wifiDevices = devices.filter((d) => d.category === 'WIFI');
    const wifiAvg = wifiDevices.length > 0
      ? Number((wifiDevices.reduce((acc, curr) => acc + curr.telemetryValue, 0) / wifiDevices.length).toFixed(1))
      : 98.2;

    const powerDevices = devices.filter((d) => d.category === 'POWER');
    const powerAvg = powerDevices.length > 0
      ? Number((powerDevices.reduce((acc, curr) => acc + curr.telemetryValue, 0) / powerDevices.length).toFixed(1))
      : 73.0;

    const waterDevices = devices.filter((d) => d.category === 'WATER');
    const waterAvg = waterDevices.length > 0
      ? Number((waterDevices.reduce((acc, curr) => acc + curr.telemetryValue, 0) / waterDevices.length).toFixed(1))
      : 100.0;

    const openTicketsCount = await MaintenanceTicket.countDocuments({ status: { $ne: 'RESOLVED' } });

    res.status(200).json({
      success: true,
      data: {
        telemetry: {
          wifiCoverage: { value: wifiAvg, unit: '%', status: wifiAvg >= 95 ? 'OPTIMAL' : 'DEGRADED' },
          powerLoad: { value: powerAvg, unit: '% Grid Capacity', status: powerAvg <= 85 ? 'NORMAL' : 'HIGH_LOAD' },
          waterSupply: { value: waterAvg, unit: '% Tank Reserves', status: 'FULL_SUPPLY' },
          openTickets: openTicketsCount,
        },
        devices,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMaintenanceTickets = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tickets = await MaintenanceTicket.find()
      .populate('reportedBy', 'email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
};

export const createMaintenanceTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { title, category, location, priority, description } = req.body;

    if (!title || !category || !location) {
      res.status(400).json({ success: false, message: 'title, category, and location are required' });
      return;
    }

    const ticketNo = `TCK-${Date.now().toString().slice(-6)}`;

    const ticket = await MaintenanceTicket.create({
      ticketNumber: ticketNo,
      reportedBy: userId,
      title,
      category,
      location,
      priority: priority || 'MEDIUM',
      status: 'OPEN',
      description: description || '',
    });

    res.status(201).json({
      success: true,
      message: `Maintenance dispatch #${ticketNo} logged successfully`,
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};
