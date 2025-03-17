import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import Modal from "../components/Modal";
import { Plus, Calendar, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { Leave, Employee } from "../types";
import LeaveForm from "../components/LeaveForm";
import { useAuthState } from "react-firebase-hooks/auth";

export default function LeaveManagement() {
  const [user] = useAuthState(auth);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userCompanyId, setUserCompanyId] = useState<string | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    if (user) {
      getUserCompanyId();
    }
  }, [user]);

  useEffect(() => {
    if (userCompanyId) {
      fetchLeaves();
      fetchEmployees();
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

  const fetchLeaves = async () => {
    if (!userCompanyId) return;
    try {
      const q = query(
        collection(db, "leaves"),
        where("companyId", "==", userCompanyId)
      );
      const querySnapshot = await getDocs(q);
      const leavesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Leave[];
      setLeaves(leavesData);
    } catch (error) {
      toast.error("Failed to fetch leaves");
      console.error("Error fetching leaves:", error);
    }
  };

  const fetchEmployees = async () => {
    if (!userCompanyId) return;
    try {
      const q = query(
        collection(db, "employees"),
        where("companyId", "==", userCompanyId)
      );
      const querySnapshot = await getDocs(q);
      const employeesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Employee[];
      setEmployees(employeesData);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleAddLeave = async (data: Omit<Leave, "id" | "status" | "createdAt">) => {
    if (!userCompanyId || !user) {
      toast.error("Company ID not found");
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Submitting leave request...");

    try {
      await addDoc(collection(db, "leaves"), {
        ...data,
        status: "pending",
        companyId: userCompanyId,
        createdAt: new Date().toISOString(),
      });
      await fetchLeaves();
      setIsModalOpen(false);
      toast.dismiss(loadingToast);
      toast.success("Leave request submitted successfully");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to submit leave request");
      console.error("Error adding leave:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewLeave = async (status: "approved" | "rejected") => {
    if (!selectedLeave || !user) return;

    setIsLoading(true);
    const loadingToast = toast.loading(`${status === "approved" ? "Approving" : "Rejecting"} leave request...`);

    try {
      const leaveRef = doc(db, "leaves", selectedLeave.id);
      await updateDoc(leaveRef, {
        status,
        remarks,
        reviewedBy: user.uid,
        updatedAt: new Date().toISOString(),
      });
      await fetchLeaves();
      setIsReviewModalOpen(false);
      setSelectedLeave(null);
      setRemarks("");
      toast.dismiss(loadingToast);
      toast.success(`Leave request ${status}`);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(`Failed to ${status} leave request`);
      console.error("Error updating leave:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : "Unknown Employee";
  };

  const getStatusColor = (status: Leave["status"]) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Request Leave</span>
        </button>
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
                  Date Range
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaves.map((leave) => (
                <tr key={leave.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {getEmployeeName(leave.employeeId)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(leave.startDate).toLocaleDateString()} -{" "}
                      {new Date(leave.endDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      leave.isPaid ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}>
                      {leave.isPaid ? "Paid" : "Unpaid"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{leave.reason}</div>
                    {leave.remarks && (
                      <div className="text-xs text-gray-500 mt-1">
                        Remarks: {leave.remarks}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      leave.status
                    )}`}>
                      {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {leave.status === "pending" && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedLeave(leave);
                            setIsReviewModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Review
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Request Leave"
      >
        <LeaveForm
          onSubmit={handleAddLeave}
          employees={employees}
          isLoading={isLoading}
        />
      </Modal>

      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setSelectedLeave(null);
          setRemarks("");
        }}
        title="Review Leave Request"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Remarks
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="input-field mt-1"
              rows={3}
              placeholder="Enter your remarks..."
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => handleReviewLeave("rejected")}
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              disabled={isLoading}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </button>
            <button
              onClick={() => handleReviewLeave("approved")}
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}