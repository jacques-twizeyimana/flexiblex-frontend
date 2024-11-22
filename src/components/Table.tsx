import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import userPic from "../assets/user.jpg";

const AttendanceTable = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 100;

  return (
    <div className="w-full mt-6">
      <div className="rounded-lg border bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Profile</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Punch In</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Geolocation</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Punched Out</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Behavior</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Total Hours</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                      <img
                        src={userPic}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-500">{item.punchIn}</td>
                <td className="py-3 px-4 text-sm text-gray-500">{item.geolocation}</td>
                <td className="py-3 px-4 text-sm text-gray-500">{item.punchedOut}</td>
                <td className="py-3 px-4 text-sm text-gray-500">
                  <a
                    href={item.behaviorFile}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.behavior}
                  </a>
                </td>
                <td className="py-3 px-4 text-sm text-gray-500">{item.totalHours}</td>
                <td className="py-3 px-4 text-sm text-gray-500">
                  <div className="relative">
                    <button className="text-gray-700 hover:text-black focus:outline-none">
                      •••
                    </button>
                  </div>
                </td>
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
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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

export default AttendanceTable;
