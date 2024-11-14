import React from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import { Calendar, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

const announcements = [
  {
    id: 1,
    title: 'Company Holiday',
    date: '2024-03-15',
    description: 'Office will be closed for spring celebration',
    type: 'Holiday',
  },
  {
    id: 2,
    title: 'Team Building Event',
    date: '2024-03-20',
    description: 'Join us for a day of fun activities',
    type: 'Event',
  },
];

export default function Dashboard() {
  return (
    <div className="flex bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, John!</h1>
              <p className="text-gray-600 mt-1">Here's what's happening with your team today.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Calendar}
              label="Total Leaves Allowed"
              value="21"
              color="text-blue-600"
            />
            <StatCard
              icon={Clock}
              label="Leaves Taken"
              value="7"
              color="text-green-600"
            />
            <StatCard
              icon={AlertCircle}
              label="Pending Requests"
              value="3"
              color="text-yellow-600"
            />
            <StatCard
              icon={CheckCircle2}
              label="Approved Requests"
              value="4"
              color="text-purple-600"
            />
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Announcements</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{announcement.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{announcement.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {announcement.type}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">{announcement.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}