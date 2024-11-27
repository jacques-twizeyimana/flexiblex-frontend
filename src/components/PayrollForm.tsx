import React, { useState } from "react";
import { startOfMonth, endOfMonth, format } from "date-fns";

interface PayrollFormProps {
  onSubmit: (data: {
    title: string;
    startDate: string;
    endDate: string;
  }) => void;
  isLoading?: boolean;
}

export default function PayrollForm({ onSubmit, isLoading = false }: PayrollFormProps) {
  const [formData, setFormData] = useState({
    title: `Payroll - ${format(new Date(), "MMMM yyyy")}`,
    startDate: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    endDate: format(endOfMonth(new Date()), "yyyy-MM-dd"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Payroll Title
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="input-field mt-1"
          required
        />
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
            min={formData.startDate}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="btn-primary"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Process Payroll"}
        </button>
      </div>
    </form>
  );
}