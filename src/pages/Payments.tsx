import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
  orderBy,
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Plus, Calendar } from "lucide-react";
import Modal from "../components/Modal";
import PayrollForm from "../components/PayrollForm";
import { toast } from "react-hot-toast";
import { format, parseISO, differenceInDays, isWithinInterval } from "date-fns";
import {
  Benefit,
  Deduction,
  Employee,
  Leave,
  Attendance,
  PayrollData,
} from "../types";
import { useNavigate } from "react-router-dom";

interface EmployeePayment {
  employee: Employee;
  baseSalary: number;
  benefits: {
    id: string;
    name: string;
    amount: number;
  }[];
  deductions: {
    id: string;
    name: string;
    amount: number;
  }[];
  totalBenefits: number;
  totalDeductions: number;
  netPay: number;
}

export default function Payments() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pastPayrolls, setPastPayrolls] = useState<PayrollData[]>([]);
  const [userCompanyId, setUserCompanyId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      getUserCompanyId();
    }
  }, [user]);

  useEffect(() => {
    if (userCompanyId) {
      fetchPastPayrolls();
    }
  }, [userCompanyId]);

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

  const fetchPastPayrolls = async () => {
    if (!userCompanyId) return;
    try {
      const q = query(
        collection(db, "payrolls"),
        where("companyId", "==", userCompanyId),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const payrolls = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PayrollData[];
      setPastPayrolls(payrolls);
    } catch (error) {
      console.error("Error fetching past payrolls:", error);
      toast.error("Failed to fetch payroll history");
    }
  };

  const calculateWorkingDays = (
    startDate: string,
    endDate: string,
    leaves: Leave[]
  ) => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const totalDays = differenceInDays(end, start) + 1;

    const unpaidLeaveDays = leaves
      .filter(
        (leave) =>
          !leave.isPaid &&
          leave.status === "approved" &&
          isWithinInterval(parseISO(leave.startDate), { start, end }) &&
          isWithinInterval(parseISO(leave.endDate), { start, end })
      )
      .reduce((total, leave) => {
        return (
          total +
          differenceInDays(parseISO(leave.endDate), parseISO(leave.startDate)) +
          1
        );
      }, 0);

    return totalDays - unpaidLeaveDays;
  };

  const calculateTotalHours = (
    startDate: string,
    endDate: string,
    attendance: Attendance[]
  ) => {
    return attendance
      .filter(
        (record) =>
          isWithinInterval(parseISO(record.date), {
            start: parseISO(startDate),
            end: parseISO(endDate),
          }) && record.present
      )
      .reduce((total, record) => total + record.hoursWorked, 0);
  };

  const processPayroll = async (
    data: Pick<PayrollData, "title" | "startDate" | "endDate">
  ) => {
    if (!user || !userCompanyId) return;

    setIsProcessing(true);
    const loadingToast = toast.loading("Processing payroll...");

    try {
      // Fetch all required data
      const [
        employeesSnapshot,
        benefitsSnapshot,
        deductionsSnapshot,
        leavesSnapshot,
        attendanceSnapshot,
      ] = await Promise.all([
        getDocs(
          query(
            collection(db, "employees"),
            where("companyId", "==", userCompanyId),
            where("status", "==", "active")
          )
        ),
        getDocs(collection(db, `companies/${user.uid}/benefits`)),
        getDocs(collection(db, `companies/${user.uid}/deductions`)),
        getDocs(
          query(
            collection(db, "leaves"),
            where("companyId", "==", userCompanyId),
            where("status", "==", "approved")
          )
        ),
        getDocs(
          query(
            collection(db, "attendance"),
            where("companyId", "==", userCompanyId)
          )
        ),
      ]);

      const employees = employeesSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Employee)
      );
      const benefits = benefitsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Benefit[];
      const deductions = deductionsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Deduction[];
      const leaves = leavesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Leave[];
      const attendance = attendanceSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Attendance[];

      // Calculate payments for each employee
      const employeePayments: EmployeePayment[] = employees.map((employee) => {
        // Calculate base salary based on payment rate and attendance/leave
        let baseSalary = 0;
        if (employee.paymentRate === "monthly") {
          const workingDays = calculateWorkingDays(
            data.startDate,
            data.endDate,
            leaves.filter((leave) => leave.employeeId === employee.id)
          );
          const totalDays =
            differenceInDays(parseISO(data.endDate), parseISO(data.startDate)) +
            1;
          baseSalary = (employee.salary * workingDays) / totalDays;
        } else {
          // Hourly rate
          const totalHours = calculateTotalHours(
            data.startDate,
            data.endDate,
            attendance.filter((record) => record.employeeId === employee.id)
          );
          baseSalary = employee.salary * totalHours;
        }

        // Calculate benefits
        const employeeBenefits = benefits
          .filter((benefit) => employee.benefits?.includes(benefit.id))
          .map((benefit) => ({
            id: benefit.id,
            name: benefit.name,
            amount:
              benefit.type === "fixed"
                ? benefit.value
                : (baseSalary * benefit.value) / 100,
          }));

        // Calculate deductions
        const employeeDeductions = deductions
          .filter((deduction) => employee.deductions?.includes(deduction.id))
          .map((deduction) => ({
            id: deduction.id,
            name: deduction.name,
            amount:
              deduction.type === "fixed"
                ? deduction.value
                : (baseSalary * deduction.value) / 100,
          }));

        const totalBenefits = employeeBenefits.reduce(
          (sum, b) => sum + b.amount,
          0
        );
        const totalDeductions = employeeDeductions.reduce(
          (sum, d) => sum + d.amount,
          0
        );
        const netPay = baseSalary + totalBenefits - totalDeductions;

        return {
          employee,
          baseSalary,
          benefits: employeeBenefits,
          deductions: employeeDeductions,
          totalBenefits,
          totalDeductions,
          netPay,
        };
      });

      // Save payroll to database
      const payrollRef = await addDoc(collection(db, "payrolls"), {
        ...data,
        employees: employeePayments,
        companyId: userCompanyId,
        createdAt: new Date().toISOString(),
        createdBy: user.uid,
      });

      await fetchPastPayrolls();
      toast.dismiss(loadingToast);
      toast.success("Payroll processed successfully");
      setIsModalOpen(false);
      navigate(`/dashboard/payments/${payrollRef.id}`);
    } catch (error) {
      console.error("Error processing payroll:", error);
      toast.dismiss(loadingToast);
      toast.error("Failed to process payroll");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-sm text-gray-500">
            Process and manage employee payroll
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Process New Payroll
        </button>
      </div>

      {/* Past Payrolls */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="overflow-x-auto mt-14 bg-blue-300">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Processed On
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employees
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pastPayrolls.map((payroll) => (
                <tr
                  key={payroll.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/dashboard/payments/${payroll.id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {payroll.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {format(parseISO(payroll.startDate), "MMM d, yyyy")} -{" "}
                      {format(parseISO(payroll.endDate), "MMM d, yyyy")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {format(parseISO(payroll.createdAt), "MMM d, yyyy")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {payroll.employees.length} employees
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/dashboard/payments/${payroll.id}`);
                      }}
                      className="text-green-600 hover:text-green-900"
                    >
                      <Calendar className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {pastPayrolls.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No payroll history found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Process New Payroll"
      >
        <PayrollForm onSubmit={processPayroll} isLoading={isProcessing} />
      </Modal>
    </div>
  );
}
