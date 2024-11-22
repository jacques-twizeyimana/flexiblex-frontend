import Sidebar from "@/components/Sidebar"
import { LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import StatCard from '../components/StatCard';
import { Calendar, Clock, User, ArrowDownRight, Search } from 'lucide-react';
import PageWithTabs from "@/components/Tabnavigation";
import { Input } from "@/components/ui/input";
import UserTable from "../components/UserTable"

const Leave  = () => {
    const tabs = [
        { id: 'department', label: 'Department' },
        { id: 'workshift', label: 'Work shift' },
        { id: 'leave-duration', label: 'Leave duration' },
        { id: 'users', label: 'Users' }
      ];

    return(
        <div>
            <Sidebar/>
            <main className="flex-1 ml-64 p-8">
                <div>
                    <h6>Leave &gt; <span className="text-green-600">Leave Status</span></h6>
                    <div className="text-2xl pt-4 flex justify-between">
                        <h2>Leave Status</h2>
                        <Button className="bg-green-600 hover:bg-green-700"> 
                            <LogOut/>        
                        Assign Leave
                    </Button>
                    </div>
                </div>

                <div className="bg-white rounded-md p-6 mt-10">
                    <div className="flex justify-between items-center mb-4">
                              <PageWithTabs tabs={tabs} />
                    <Button className="bg-white hover:bg-white border-2 border-slate-300 text-gray-700 mb-4"> 
                        <Calendar/>        
                        Select date
                    </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <StatCard
              icon={User}
              label="Leave Employee"
              value="12"
              color="text-green-600"
            />
            <StatCard
              icon={Clock}
              label="Total Leave hour"
              value="24"
              color="text-green-600"
            />
            <StatCard
              icon={ArrowDownRight}
              label="On Leave"
              value="06"
              color="text-green-600"
            />
                    </div>

            <div className="flex gap-4">
        <Input 
          placeholder="Search..."
          className="pl-4"
        />
         <Button size="icon" type="submit" className="bg-green-700">
        <Search className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </Button>
      </div>

      <UserTable/>
                </div>
            </main>
        </div>
    )
}

export default Leave