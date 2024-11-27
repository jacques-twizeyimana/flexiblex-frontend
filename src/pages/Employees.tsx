import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import Modal from "../components/Modal";
import toast from "react-hot-toast";
import { Employee } from "../types";
import EmployeeForm from "../components/EmployeeForm";
import { useAuthState } from "react-firebase-hooks/auth";

const EmployeeManagement = () => {
  const [user] = useAuthState(auth);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [userCompanyId, setUserCompanyId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      getUserCompanyId();
    }
  }, [user]);

  useEffect(() => {
    if (userCompanyId) {
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

  const fetchEmployees = async () => {
    if (!userCompanyId) return;
    try {
      const q = query(
        collection(db, "employees"),
        where("companyId", "==", userCompanyId)
      );
      const querySnapshot = await getDocs(q);
      const employeeData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Employee[];
      setEmployees(employeeData);
    } catch (error) {
      toast.error("Failed to fetch employees");
      console.error("Error fetching employees:", error);
    }
  };

  const handleAddEmployee = async (data: Omit<Employee, "id">) => {
    if (!userCompanyId) {
      toast.error("Company ID not found");
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Adding employee...");

    try {
      await addDoc(collection(db, "employees"), {
        ...data,
        companyId: userCompanyId,
        createdAt: new Date().toISOString(),
      });
      await fetchEmployees();
      setIsModalOpen(false);
      toast.dismiss(loadingToast);
      toast.success("Employee added successfully");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to add employee");
      console.error("Error adding employee:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateEmployee = async (data: Omit<Employee, "id">) => {
    if (!selectedEmployee) return;

    setIsLoading(true);
    const loadingToast = toast.loading("Updating employee...");

    try {
      const employeeRef = doc(db, "employees", selectedEmployee.id);
      await updateDoc(employeeRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
      await fetchEmployees();
      setIsModalOpen(false);
      setSelectedEmployee(null);
      toast.dismiss(loadingToast);
      toast.success("Employee updated successfully");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to update employee");
      console.error("Error updating employee:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;

    const loadingToast = toast.loading("Deleting employee...");

    try {
      await deleteDoc(doc(db, "employees", id));
      await fetchEmployees();
      toast.dismiss(loadingToast);
      toast.success("Employee deleted successfully");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to delete employee");
      console.error("Error deleting employee:", error);
    }
  };

  const filteredEmployees = employees.filter((employee) =>
    `${employee.firstName} ${employee.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (!userCompanyId) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Loading company information...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Employee Management
        </h1>
        <button
          onClick={() => {
            setSelectedEmployee(null);
            setIsModalOpen(true);
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Employee</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search employees..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                {/* phone */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
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
              {filteredEmployees.map((employee) => (
                <tr key={employee.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
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
                          {employee.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {employee.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {employee.position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {employee.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs uppercase leading-5 font-semibold rounded-full ${
                        employee.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedEmployee(employee);
                          setIsModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(employee.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEmployee(null);
        }}
        title={selectedEmployee ? "Edit Employee" : "Add New Employee"}
      >
        <EmployeeForm
          onSubmit={selectedEmployee ? handleUpdateEmployee : handleAddEmployee}
          initialData={selectedEmployee || undefined}
          isLoading={isLoading}
        />
      </Modal>
    </div>
  );
};

export default EmployeeManagement;
