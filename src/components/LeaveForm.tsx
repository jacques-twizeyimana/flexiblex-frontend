import React, { useState } from "react";
import { Leave, Employee } from "../types";

interface LeaveFormProps {
  onSubmit: (data: Omit<Leave, "id" | "status" | "createdAt">) => void;
  employees: Employee[];
  isLoading?: boolean;
}

const LeaveForm: React.FC<LeaveFormProps> = ({
  onSubmit,
  employees,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    employeeId: "",
    startDate: "",
    endDate: "",
    reason: "",
    isPaid: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Employee
        </label>
        <select
          name="employeeId"
          value={formData.employeeId}
          onChange={handleChange}
          className="input-field mt-1"
          required
        >
          <option value="">Select Employee</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.firstName} {employee.lastName}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="input-field mt-1"
            required
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="input-field mt-1"
            required
            min={formData.startDate || new Date().toISOString().split("T")[0]}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Reason for Leave
        </label>
        <textarea
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          className="input-field mt-1"
          rows={3}
          required
          placeholder="Please provide a reason for your leave request..."
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="isPaid"
          id="isPaid"
          checked={formData.isPaid}
          onChange={handleChange}
          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
        />
        <label htmlFor="isPaid" className="ml-2 block text-sm text-gray-900">
          Paid Leave
        </label>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit Leave Request"}
        </button>
      </div>
    </form>
  );
};

export default LeaveForm;