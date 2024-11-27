import Sidebar from "@/components/Sidebar";
import { Briefcase, Wallet, Clock3, CalendarCheck2, UserRound, Mail, Smartphone, Globe  } from "lucide-react";


const info = [
    { icon: Briefcase, label: 'Admin & HRM', title: 'Department', color: 'black' },
    { icon: Wallet, label: '$ 80,000', title: 'Salary', color: 'text-green-600' },
    { icon: Clock3, label: 'Regular', title: 'Work Shift', color: 'black' },
    { icon: CalendarCheck2, label: '10 May 2023', title: 'Joining Date', color: 'black' }
  ];

const contacts = [
    { icon: Mail, label: 'a.wesebebe@alustudent.com', title: 'Email', color: 'black' },
    { icon: Smartphone, label: '+254712345678', title: 'Phone', color: '' },
    { icon: Globe, label: 'https://github.com/ashina', title: 'Website', color: 'text-blue-600' }
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
                        <div className="grid grid-cols-3 px-6 py-4 mt-3">
                            <UserRound className="h-12 w-12 bg-gray-100 rounded-3xl p-1 ml-4" />
                            <div>
                                <p className={"text-sm font-bold mt-1"}>Ashina Cecilia</p>
                                <p className="text-sm text-gray-600">UX Designer</p>
                            </div>
                        </div>
                        <div className="px-6 py-4">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Info</h2>
                            { info.map((item) =>
                            <div className="grid grid-cols-3 mt-3" key={item.label}>
                                <item.icon className="h-8 w-8 bg-gray-100 rounded-lg p-1 ml-4" />
                                <div>
                                    <p className="text-sm text-gray-600">{item.title}</p>
                                    <p className={`text-sm font-semibold mt-1 ${item.color}`}>{item.label}</p>
                                </div>
                            </div>)}
                        </div>
                        <div className="px-6 py-4">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contacts</h2>
                            { contacts.map((item) =>
                            <div className="grid grid-cols-3 mt-3" key={item.label}>
                                <item.icon className="h-8 w-8 bg-gray-100 rounded-lg p-1 ml-4" />
                                <div>
                                    <p className={`text-sm mt-1 ${item.color}`}>{item.label}</p>
                                    <p className="text-sm text-gray-600">{item.title}</p>
                                </div>
                            </div>)}
                        </div>
                    </div>
                    <div className="col-span-2 bg-white rounded-lg">
                        fghjk
                    </div>
                </div>
            </div>
        </main>
    </div>
    );
}
