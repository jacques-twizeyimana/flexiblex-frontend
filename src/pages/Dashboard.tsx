import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import StatCard from "../components/StatCard";
import { Building2, Users, Heart, Calculator } from "lucide-react";

interface UserData {
  firstName: string;
  lastName: string;
}

interface Stats {
  totalEmployees: number;
  totalBenefits: number;
  totalDeductions: number;
  pendingRequests: number;
}

const announcements = [
  {
    id: 1,
    title: "Company Holiday",
    date: "2024-03-15",
    description: "Office will be closed for spring celebration",
    type: "Holiday",
  },
  {
    id: 2,
    title: "Team Building Event",
    date: "2024-03-20",
    description: "Join us for a day of fun activities",
    type: "Event",
  },
];

export default function Dashboard() {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalEmployees: 0,
    totalBenefits: 0,
    totalDeductions: 0,
    pendingRequests: 0,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      try {
        const userDoc = await getDocs(collection(db, "users"));
        userDoc.forEach((doc) => {
          if (doc.id === user.uid) {
            setUserData(doc.data() as UserData);
          }
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchStats = async () => {
      if (!user) return;
      try {
        const [employeesSnap, benefitsSnap, deductionsSnap] = await Promise.all(
          [
            getDocs(collection(db, "users")),
            getDocs(collection(db, `companies/${user.uid}/benefits`)),
            getDocs(collection(db, `companies/${user.uid}/deductions`)),
          ]
        );

        setStats({
          totalEmployees: employeesSnap.size,
          totalBenefits: benefitsSnap.size,
          totalDeductions: deductionsSnap.size,
          pendingRequests: 0, // This will be updated when we implement the requests feature
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchUserData();
    fetchStats();
  }, [user]);

  if (!user || !userData) {
    return (
      <main className="flex-1 ml-64 p-8">
        <div className="animate-pulse flex space-x-4">
          <div className="h-8 w-48 bg-gray-200 rounded"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {userData.firstName}!
            </h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening with your team today.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            label="Total Employees"
            value={stats.totalEmployees}
            color="text-blue-600"
          />
          <StatCard
            icon={Heart}
            label="Active Benefits"
            value={stats.totalBenefits}
            color="text-green-600"
          />
          <StatCard
            icon={Calculator}
            label="Active Deductions"
            value={stats.totalDeductions}
            color="text-yellow-600"
          />
          <StatCard
            icon={Building2}
            label="Pending Requests"
            value={stats.pendingRequests}
            color="text-purple-600"
          />
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Announcements
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {announcement.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {announcement.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {announcement.type}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">
                      {announcement.date}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
