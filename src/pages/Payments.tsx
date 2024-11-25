import { useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Plus } from "lucide-react";
import Modal from "../components/Modal";
import PayrollForm from "../components/PayrollForm";
import { toast } from "react-hot-toast";
import { Benefit, Deduction, Employee } from "../types";
import { useNavigate } from "react-router-dom";

interface PayrollData {
  title: string;
  startDate: string;
  endDate: string;
  employees: EmployeePayment[];
}

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

  const processPayroll = async (
    data: Pick<PayrollData, "title" | "startDate" | "endDate">
  ) => {
    if (!user) return;

    setIsProcessing(true);
    const loadingToast = toast.loading("Processing payroll...");

    try {
      // Get company ID
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const companyId = userDoc.data()?.companyId;

      if (!companyId) {
        throw new Error("Company ID not found");
      }

      // Fetch employees
      const employeesQuery = query(
        collection(db, "employees"),
        where("companyId", "==", companyId),
        where("status", "==", "active")
      );
      const employeesSnapshot = await getDocs(employeesQuery);
      const employees = employeesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Employee[];

      // Fetch benefits and deductions
      const [benefitsSnapshot, deductionsSnapshot] = await Promise.all([
        getDocs(collection(db, `companies/${auth.currentUser?.uid}/benefits`)),
        getDocs(
          collection(db, `companies/${auth.currentUser?.uid}/deductions`)
        ),
      ]);

      const benefits: Benefit[] = benefitsSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          type: data.type,
          value: data.value,
          description: data.description,
        };
      });

      const deductions: Deduction[] = deductionsSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          type: data.type,
          value: data.value,
          description: data.description,
        };
      });

      // Calculate payments for each employee
      const employeePayments: EmployeePayment[] = employees.map((employee) => {
        const baseSalary =
          employee.paymentRate === "monthly"
            ? employee.salary
            : employee.salary * 8 * 22; // Assuming 22 working days per month

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
        companyId,
        createdAt: new Date().toISOString(),
        createdBy: user.uid,
      });

      toast.dismiss(loadingToast);
      toast.success("Payroll processed successfully");
      setIsModalOpen(false);

      // Navigate to the payroll details page
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
