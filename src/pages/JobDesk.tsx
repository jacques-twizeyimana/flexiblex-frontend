import Sidebar from "@/components/Sidebar";
import { Briefcase, Wallet, Clock3, CalendarCheck2  } from "lucide-react";


const info = [
    { icon: Briefcase, label: 'Admin & HRM', title: '/Department' },
    { icon: Wallet, label: '$ 80,000', title: '/Salary' },
    { icon: Clock3, label: 'Regular', title: '/Work Shift' },
    { icon: CalendarCheck2, label: '10 May 2023', title: '/Joining Date' }
  ];

export default function JobDesk(){
    return (
    <div className="flex bg-gray-50">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <p className="text-gray-600 mt-1">Job desk &gt; <span className="text-green-400">
                            Attendance</span>
                        </p><br />
                        <h3 className="text-2xl font-bold text-gray-900">Job Desk</h3>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg">
                        <div className="px-6 py-4">
                            <h2 className="text-lg text-gray-900">Info</h2>
                            <div className="grid">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
    );
}
