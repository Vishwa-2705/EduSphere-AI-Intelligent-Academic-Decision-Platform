import React from 'react';

export const StudentMaterialsPage: React.FC = () => {
  return (
    <div className="space-y-6 font-serif">
      <div className="bg-white rounded-2xl border border-lavender-200/80 p-6 shadow-sm sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="badge-lavender mb-2 inline-block">Study Materials</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Materials</h1>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-lavender-200/80 shadow-sm p-10 text-center">
        <p className="text-sm text-slate-500">No study materials are available in this view.</p>
      </div>
    </div>
  );
};
