<<<<<<< HEAD
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Users, Calendar, Clock, Settings } from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Briefcase, label: 'Job Desk', path: '/job-desk' },
  { icon: Users, label: 'Employees', path: '/employees' },
  { icon: Calendar, label: 'Leave', path: '/leave' },
  { icon: Clock, label: 'Attendance', path: '/attendance' },
  { icon: Settings, label: 'Settings', path: '/settings' },
=======
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Clock,
  Building2,
  Heart,
  Calculator,
  CalendarCheck,
  DollarSign,
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Employees", path: "/dashboard/employees" },
  { icon: CalendarCheck, label: "Attendance", path: "/dashboard/attendance" },
  { icon: Clock, label: "Leave", path: "/dashboard/leave" },
  { icon: DollarSign, label: "Payments", path: "/dashboard/payments" },
  { icon: Building2, label: "Company Info", path: "/dashboard/company-info" },
  { icon: Heart, label: "Benefits", path: "/dashboard/benefits" },
  { icon: Calculator, label: "Deductions", path: "/dashboard/deductions" },
>>>>>>> d652b5ac2a17ce71a740cb53d155b10b096870cc
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 fixed left-0 top-0">
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <h1 className="text-xl font-bold text-green-600">FlexibleX</h1>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
<<<<<<< HEAD
          const isActive = location.pathname === item.path;
          
=======
          const isActive = location.pathname.endsWith(item.path);

>>>>>>> d652b5ac2a17ce71a740cb53d155b10b096870cc
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-sm ${
                isActive
<<<<<<< HEAD
                  ? 'text-green-600 bg-green-50 border-r-2 border-green-600'
                  : 'text-gray-600 hover:bg-gray-50'
=======
                  ? "text-green-600 bg-green-50 border-r-2 border-green-600"
                  : "text-gray-600 hover:bg-gray-50"
>>>>>>> d652b5ac2a17ce71a740cb53d155b10b096870cc
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> d652b5ac2a17ce71a740cb53d155b10b096870cc
