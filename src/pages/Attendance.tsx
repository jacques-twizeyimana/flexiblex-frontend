import React, { useState, useEffect } from "react";
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  addWeeks,
  subWeeks,
  isSameDay,
} from "date-fns";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { toast } from "react-hot-toast";
import { Employee } from "../types";

interface AttendanceRecord {
  id?: string;
  employeeId: string;
  date: string;
  present: boolean;
  hoursWorked: number;
  companyId: string;
}

export default function Attendance() {
  const [user] = useAuthState(auth);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [userCompanyId, setUserCompanyId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentWeek, { weekStartsOn: 1 }),
    end: endOfWeek(currentWeek, { weekStartsOn: 1 }),
  });

  useEffect(() => {
    if (user) {
      getUserCompanyId();
    }
  }, [user]);

  useEffect(() => {
    if (userCompanyId) {
      fetchEmployees();
      fetchAttendance();
    }
  }, [userCompanyId, currentWeek]);

  const getUserCompanyId = async () => {
    if (!user) return;
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();
      if (userData?.companyId) {
        setUserCompanyId(userData.companyId);
      }
    } catch (error) {
      console.error("Error fetching user company ID:", error);
    }
  };

  const fetchEmployees = async () => {
    if (!userCompanyId) return;
    try {
      const q = query(
        collection(db, "employees"),
        where("companyId", "==", userCompanyId),
        where("status", "==", "active")
      );
      const querySnapshot = await getDocs(q);
      const employeesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Employee[];
      setEmployees(employeesData);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to fetch employees");
    }
  };

  const fetchAttendance = async () => {
    if (!userCompanyId) return;
    try {
      const startDate = format(weekDays[0], "yyyy-MM-dd");
      const endDate = format(weekDays[6], "yyyy-MM-dd");

      const q = query(
        collection(db, "attendance"),
        where("companyId", "==", userCompanyId),
        where("date", ">=", startDate),
        where("date", "<=", endDate)
      );

      const querySnapshot = await getDocs(q);
      const attendanceData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AttendanceRecord[];

      setAttendance(attendanceData);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      toast.error("Failed to fetch attendance records");
    }
  };

  const handlePreviousWeek = () => setCurrentWeek(subWeeks(currentWeek, 1));
  const handleNextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));

  const getAttendanceForDay = (employeeId: string, date: Date) => {
    return attendance.find(
      (record) =>
        record.employeeId === employeeId &&
        isSameDay(new Date(record.date), date)
    );
  };

  const handleAttendanceChange = async (
    employeeId: string,
    date: Date,
    present: boolean,
    paymentRate: "hourly" | "monthly"
  ) => {
    if (!userCompanyId) return;

    let hoursWorked = 8; // Default for monthly employees

    if (paymentRate === "hourly" && present) {
      const hours = prompt("Enter hours worked (default: 8):", "8");
      if (hours === null) return; // User cancelled
      hoursWorked = Number(hours) || 8;
    }

    try {
      const attendanceRecord: AttendanceRecord = {
        employeeId,
        date: format(date, "yyyy-MM-dd"),
        present,
        hoursWorked: present ? hoursWorked : 0,
        companyId: userCompanyId,
      };

      await addDoc(collection(db, "attendance"), attendanceRecord);
      await fetchAttendance();
      toast.success("Attendance recorded successfully");
    } catch (error) {
      console.error("Error recording attendance:", error);
      toast.error("Failed to record attendance");
    }
  };

  const handleSubmitWeek = async () => {
    if (!userCompanyId || isSubmitting) return;

    setIsSubmitting(true);
    const loadingToast = toast.loading("Submitting attendance...");

    try {
      const records: AttendanceRecord[] = [];

      for (const employee of employees) {
        for (const day of weekDays) {
          const existingRecord = getAttendanceForDay(employee.id, day);
          if (!existingRecord) {
            records.push({
              employeeId: employee.id,
              date: format(day, "yyyy-MM-dd"),
              present: false,
              hoursWorked: 0,
              companyId: userCompanyId,
            });
          }
        }
      }

      // Batch create missing records
      for (const record of records) {
        await addDoc(collection(db, "attendance"), record);
      }

      await fetchAttendance();
      toast.dismiss(loadingToast);
      toast.success("Week attendance submitted successfully");
    } catch (error) {
      console.error("Error submitting week attendance:", error);
      toast.dismiss(loadingToast);
      toast.error("Failed to submit week attendance");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Attendance Management
        </h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePreviousWeek}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg font-medium">
            {format(weekDays[0], "MMM d")} - {format(weekDays[6], "MMM d, yyyy")}
          </span>
          <button
            onClick={handleNextWeek}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50">
                Employee
              </th>
              {weekDays.map((day) => (
                <th
                  key={day.toString()}
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]"
                >
                  {format(day, "EEE")}{" "}
                  <span className="block text-gray-400">
                    {format(day, "MMM d")}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-600 font-medium">
                          {employee.firstName[0]}
                          {employee.lastName[0]}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {employee.firstName} {employee.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {employee.position}
                      </div>
                    </div>
                  </div>
                </td>
                {weekDays.map((day) => {
                  const record = getAttendanceForDay(employee.id, day);
                  return (
                    <td
                      key={day.toString()}
                      className="px-6 py-4 whitespace-nowrap text-center"
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            checked={record?.present || false}
                            onChange={(e) =>
                              handleAttendanceChange(
                                employee.id,
                                day,
                                e.target.checked,
                                employee.paymentRate
                              )
                            }
                            className="form-checkbox h-5 w-5 text-green-600 rounded border-gray-300 focus:ring-green-500"
                          />
                        </label>
                        {record?.present && (
                          <span className="inline-flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            {record.hoursWorked}h
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmitWeek}
          disabled={isSubmitting}
          className="btn-primary"
        >
          {isSubmitting ? "Submitting..." : "Submit Week"}
        </button>
      </div>
    </div>
  );
}