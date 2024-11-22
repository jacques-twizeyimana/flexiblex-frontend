import Sidebar from "../components/Sidebar"
import { Button } from "@/components/ui/button";
import { LogOut, Settings, Download } from 'lucide-react';
import PageWithTabs from "@/components/Tabnavigation";
import Table from "../components/Table"
const Attendance = () => {
    // const tabs = [
    //     { id: 'apply', label: 'Apply between' },
    //     { id: 'department', label: 'Department' }
    const tabs = [
        { id: 'apply', label: 'Apply between' },
        { id: 'department', label: 'Department' },
        { id: 'workshift', label: 'Work shift' },
        { id: 'rejected', label: 'Rejected' },
        { id: 'duration', label: 'Duration' }
      ];
    //   const data = [
    //     {
    //       behavior: "DebitNoteMcKee.jpg",
    //       behaviorFile: "/files/DebitNoteMcKee.jpg",
    //       totalHours: "Busy",
    //     },
    //     // Add more rows as needed
    //   ];
    const data = [
        {
          name: "Jeremy Neigh",
          profilePicture: "https://via.placeholder.com/40",
          punchIn: "9/23/16",
          geolocation: "15h 40m",
          punchedOut: "Design",
          behavior: "DebitNoteMcKee.jpg",
          behaviorFile: "/files/DebitNoteMcKee.jpg",
          totalHours: "Busy",
        },
        // Add more rows as needed
      ];

    return (
        <div>
            <Sidebar/>
            <main className="flex-1 ml-64 p-8">
            <div>
                    <h6>Attendance &gt; <span className="text-green-600">Daily log</span></h6>
                    <div className="text-2xl pt-4 flex justify-between">
                        <h2>Daily Log</h2>
                       <div className="space-x-4">
                       <Button className="bg-green-600 hover:bg-green-700"> 
                            <LogOut/>        
                        Add attendance
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700"> 
                            <Download/>        
                        Import
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700"> 
                            <LogOut/>        
                        Export
                    </Button>
                    <Button className="bg-white hover:bg-white border-2 border-slate-300 text-gray-700 mb-4"> 
                        <Settings/>        
                        Setting
                    </Button>
                       </div>
                    </div>
                </div>

                <div className="bg-white rounded-md p-6 mt-10">
                    <div className="flex justify-between items-center mb-4">
                    <PageWithTabs tabs={tabs} />
                    </div>
                    <Table data={data} />
                </div>
            </main>
        </div>
    )
}

export default Attendance