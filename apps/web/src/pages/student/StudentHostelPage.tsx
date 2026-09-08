import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { getStudentRecord } from '../../data/studentData';
import { Home, User, Phone, MapPin, Wrench, CheckCircle2, Plus } from 'lucide-react';

export const StudentHostelPage: React.FC = () => {
  const { user } = useAuth();
  const student = getStudentRecord(user?.email);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState<string | null>(null);

  // Ticket Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('PLUMBING');
  const [priority, setPriority] = useState('MEDIUM');
  const [description, setDescription] = useState('');

  const fetchHostel = async () => {
    if (student.studentType === 'DAY_SCHOLAR') {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await api.get('/hostel/my-room');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load hostel details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostel();
  }, []);

  if (student.studentType === 'DAY_SCHOLAR') {
    return (
      <div className="rounded-2xl border border-lavender-200/80 bg-white p-8 shadow-sm">
        <span className="badge-lavender mb-2 inline-block">Day Scholar</span>
        <h1 className="text-2xl font-extrabold text-slate-900">No hostel allocation</h1>
        <p className="mt-2 text-sm text-slate-500">Residential services are not applicable to this student profile.</p>
      </div>
    );
  }

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    try {
      setIsSubmittingTicket(true);
      const res = await api.post('/infrastructure/tickets', {
        title,
        category,
        location: `${data?.room?.blockName || 'Block 4'}, Room ${data?.room?.roomNumber || '212'}`,
        priority,
        description,
      });

      if (res.data.success) {
        setTicketSuccess(res.data.message);
        setShowTicketModal(false);
        setTitle('');
        setDescription('');
        setTimeout(() => setTicketSuccess(null), 4000);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit maintenance ticket');
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex h-96 items-center justify-center font-serif">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-lavender-700 border-t-transparent" />
          <p className="text-sm font-bold text-slate-700">Loading Hostel Allocation & Residential Details...</p>
        </div>
      </div>
    );
  }

  const room = data?.room || { blockName: student.hostelBlock, roomNumber: student.hostelRoom, floor: 2, capacity: 2, type: 'NON_AC' };
  const warden = data?.warden || { name: 'Col. Virendra Rawat (Retd.)', contact: '+91 98765 11223', office: `${student.hostelBlock} Office` };
  const roommate = data?.roommate || { name: student.roommateName, department: student.roommateDepartment, phone: student.roommatePhone };

  return (
    <div className="space-y-6 font-serif">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="badge-lavender mb-2 inline-block">Campus Residential Services</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Hostel Accommodation & Resident Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Room allocation information, warden assistance, roommate registry, and maintenance requests
            </p>
          </div>

          <button
            onClick={() => setShowTicketModal(true)}
            className="px-4 py-2.5 rounded-xl bg-lavender-700 hover:bg-lavender-800 text-white font-bold text-xs shadow-md shadow-lavender-700/20 flex items-center gap-2 transition"
          >
            <Wrench className="h-4 w-4" />
            <span>Report Facility Issue</span>
          </button>
        </div>
      </div>

      {ticketSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-serif flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          <span>{ticketSuccess}</span>
        </div>
      )}

      {/* Room Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Allocated Room</p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1.5">{room.blockName}</h3>
          <p className="text-xs font-mono font-bold text-lavender-800 mt-2">
            Room #{room.roomNumber} (Floor {room.floor}) • {room.type}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Bed Allocation</p>
          <h3 className="text-2xl font-extrabold text-emerald-700 mt-1.5">{data?.allocation?.bedNumber || student.hostelBed}</h3>
          <p className="text-xs text-slate-500 mt-2">Academic Cycle 2025–2026</p>
        </div>

        <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Chief Warden</p>
          <h3 className="text-lg font-bold text-slate-900 mt-1.5">{warden.name}</h3>
          <p className="text-xs font-mono text-slate-500 mt-2">{warden.contact}</p>
        </div>
      </div>

      {/* Roommate & Warden Contact Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-3 pb-2 border-b border-lavender-100 flex items-center gap-2">
            <User className="h-4 w-4 text-lavender-700" />
            <span>Roommate Information</span>
          </h3>
          <div className="p-4 rounded-xl bg-lavender-50/50 border border-lavender-200 space-y-1.5 text-xs text-slate-700">
            <p className="font-bold text-slate-900 text-sm">{roommate.name}</p>
            <p className="text-slate-500">{roommate.department}</p>
            <p className="font-mono text-lavender-800">Phone: {roommate.phone}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-3 pb-2 border-b border-lavender-100 flex items-center gap-2">
            <Phone className="h-4 w-4 text-lavender-700" />
            <span>Emergency & Facility Contacts</span>
          </h3>
          <div className="p-4 rounded-xl bg-lavender-50/50 border border-lavender-200 space-y-2 text-xs text-slate-700">
            <p><strong>Hostel Control Room:</strong> +91 98450 99001 (24/7 Desk)</p>
            <p><strong>Medical Emergency Dispensary:</strong> +91 98450 99002 (Campus Clinic)</p>
            <p><strong>Electrical / Wi-Fi Support:</strong> Ext. 402 (Admin Office)</p>
          </div>
        </div>
      </div>

      {/* Maintenance Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl border border-lavender-200 shadow-elevated p-6 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Report Hostel Facility Issue</h3>
            <p className="text-xs text-slate-500 mb-4">Submit a dispatch ticket to campus maintenance engineers</p>

            <form onSubmit={handleTicketSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Issue Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-lavender-50/60 border border-slate-200 text-xs font-serif"
                >
                  <option value="PLUMBING">Plumbing / Water Supply</option>
                  <option value="ELECTRICAL">Electrical / Lighting</option>
                  <option value="WIFI">Wi-Fi / Network Connectivity</option>
                  <option value="HVAC">Air Conditioning / Fan</option>
                  <option value="CIVIL">Carpentry / Door Lock</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Issue Summary</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Study table lamp socket not working"
                  className="w-full px-3 py-2 rounded-xl bg-lavender-50/60 border border-slate-200 text-xs font-serif"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-lavender-50/60 border border-slate-200 text-xs font-serif"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High (Within 4 Hours)</option>
                  <option value="URGENT">Urgent (Immediate Safety Hazard)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description / Location Details</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Additional details to help the technician..."
                  className="w-full px-3 py-2 rounded-xl bg-lavender-50/60 border border-slate-200 text-xs font-serif"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowTicketModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingTicket}
                  className="px-5 py-2 rounded-xl bg-lavender-700 hover:bg-lavender-800 text-white font-bold text-xs shadow-sm disabled:opacity-50"
                >
                  {isSubmittingTicket ? 'Submitting...' : 'Dispatch Maintenance Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
