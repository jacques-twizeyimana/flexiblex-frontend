import { useState } from 'react';
import { ChevronLeft} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import userPic from "../assets/user.jpg"

interface UserData {
  id: string;
  name: string;
  date: string;
  duration: string;
  department: string;
  type: string;
  attachment: string;
}

const UserTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 100;

  const userData: UserData[] = [
    {
      id: '1',
      name: 'Jeremy Neigh',
      date: '8/23/16',
      duration: '15h 40m',
      department: 'Finance',
      type: 'Design',
      attachment: 'DebiNotesMoke.jpg'
    },
    {
      id: '2',
      name: 'Annette Black',
      date: '7/27/13',
      duration: '11h 45m',
      department: 'Accounting',
      type: 'Product',
      attachment: 'debimoke_2310.xlsx'
    },
    {
      id: '3',
      name: 'Theresa Webb',
      date: '11/7/16',
      duration: '10h 25m',
      department: 'Front Desk',
      type: 'Marketing',
      attachment: 'McKeeDebi01.pdf'
    },
    {
      id: '4',
      name: 'Kathryn Murphy',
      date: '6/19/14',
      duration: '16h 55m',
      department: 'Houseman',
      type: 'Support',
      attachment: 'debisheet2020.pdf'
    },
    {
      id: '5',
      name: 'Courtney Henry',
      date: '7/11/19',
      duration: '15h 45m',
      department: 'Laundry',
      type: 'Operations',
      attachment: 'debimoke_march.pdf'
    },
    {
      id: '6',
      name: 'Jane Cooper',
      date: '8/2/19',
      duration: '10h 45m',
      department: 'Legal',
      type: 'HR',
      attachment: 'debisheet_march.xlsx'
    }
  ];

  return (
    <div className="w-full mt-6">
      <div className="rounded-lg border bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Profile</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Date & Time</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Duration</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Department</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Type</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Attachment</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {userData.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                      <img 
                        src={userPic}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{user.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-500">{user.date}</td>
                <td className="py-3 px-4 text-sm text-gray-500">{user.duration}</td>
                <td className="py-3 px-4 text-sm text-gray-500">{user.department}</td>
                <td className="py-3 px-4 text-sm text-gray-500">{user.type}</td>
                <td className="py-3 px-4 text-sm text-gray-500">{user.attachment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="ml-2">Prev</span>
          </Button>
          <Button
            variant="default"
            size="sm"
            className="bg-green-600"
          >
            Next
          </Button>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Page:</span>
          <input
            type="number"
            value={currentPage}
            onChange={(e) => setCurrentPage(Number(e.target.value))}
            className="w-12 rounded-md border px-2 py-1 text-center"
            min={1}
            max={totalPages}
          />
          <span>of {totalPages}</span>
          <Select defaultValue="10">
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default UserTable;