import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Download, ArrowLeft } from "lucide-react";
import Modal from "../components/Modal";
import PaymentSlip from "../components/PaymentSlip";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import html2pdf from "html2pdf.js";
import { Payment, PayrollData } from "../types";

export default function PayrollDetails() {
  const { id } = useParams();

  const [payrollData, setPayrollData] = useState<PayrollData | null>(null);
  const [selectedPayslip, setSelectedPayslip] = useState<Payment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPayrollData();
  }, [id]);

  const fetchPayrollData = async () => {
    if (!id) return;
    try {
      const payrollDoc = await getDoc(doc(db, "payrolls", id));
      if (payrollDoc.exists()) {
        setPayrollData(payrollDoc.data() as PayrollData);
      }
    } catch (error) {
      console.error("Error fetching payroll:", error);
      toast.error("Failed to fetch payroll details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById("payment-slip");
    if (!element) return;

    const opt = {
      margin: 1,
      filename: `payslip-${selectedPayslip?.employee?.firstName}-${selectedPayslip?.employee?.lastName}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
      </div>
    );
  }

  if (!payrollData) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Payroll not found
          </h2>
          <Link
            to="/dashboard/payments"
            className="text-green-600 hover:text-green-700"
          >
            Back to Payments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard/payments"
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {payrollData.title}
            </h1>
            <p className="text-sm text-gray-500">
              {format(new Date(payrollData.startDate), "MMMM d, yyyy")} -{" "}
              {format(new Date(payrollData.endDate), "MMMM d, yyyy")}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Base Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Benefits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deductions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Pay
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payrollData.employees.map((payment) => (
                <tr key={payment.employee.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {payment.employee.firstName[0]}
                            {payment.employee.lastName[0]}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.employee.firstName}{" "}
                          {payment.employee.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.employee.position}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.baseSalary.toLocaleString()} RWF
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    +{payment.totalBenefits.toLocaleString()} RWF
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    -{payment.totalDeductions.toLocaleString()} RWF
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {payment.netPay.toLocaleString()} RWF
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedPayslip(payment)}
                      className="text-green-600 hover:text-green-900"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={!!selectedPayslip}
        onClose={() => setSelectedPayslip(null)}
        title="Payment Slip"
      >
        <div>
          <div id="payment-slip">
            {selectedPayslip && (
              <PaymentSlip
                payment={selectedPayslip}
                payrollPeriod={{
                  title: payrollData.title,
                  startDate: payrollData.startDate,
                  endDate: payrollData.endDate,
                }}
              />
            )}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleDownloadPDF}
              className="btn-primary flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
