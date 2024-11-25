import React, { useState, useEffect } from "react";
import { Employee } from "../types";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface EmployeeFormProps {
  onSubmit: (data: Omit<Employee, "id">) => void;
  initialData?: Employee;
  isLoading?: boolean;
}

interface Benefit {
  id: string;
  name: string;
  type: "fixed" | "percentage";
  value: number;
}

interface Deduction {
  id: string;
  name: string;
  type: "fixed" | "percentage";
  value: number;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const [step, setStep] = useState(1);
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [deductions, setDeductions] = useState<Deduction[]>([]);
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);
  const [selectedDeductions, setSelectedDeductions] = useState<string[]>([]);

  const [formData, setFormData] = React.useState<Omit<Employee, "id">>({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    position: initialData?.position || "",
    department: initialData?.department || "",
    startDate: initialData?.startDate || "",
    salary: initialData?.salary || 0,
    paymentRate: initialData?.paymentRate || "monthly",
    status: initialData?.status || "active",
    employmentType: initialData?.employmentType || "full-time",
  });

  useEffect(() => {
    const fetchBenefitsAndDeductions = async () => {
      if (!auth.currentUser) return;
      try {
        const [benefitsSnap, deductionsSnap] = await Promise.all([
          getDocs(collection(db, `companies/${auth.currentUser.uid}/benefits`)),
          getDocs(collection(db, `companies/${auth.currentUser.uid}/deductions`)),
        ]);

        setBenefits(
          benefitsSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Benefit[]
        );

        setDeductions(
          deductionsSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Deduction[]
        );
      } catch (error) {
        console.error("Error fetching benefits and deductions:", error);
      }
    };

    fetchBenefitsAndDeductions();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    onSubmit({
      ...formData,
      benefits: selectedBenefits,
      deductions: selectedDeductions,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "salary" ? Number(value) : value,
    }));
  };

  const handleBenefitToggle = (benefitId: string) => {
    setSelectedBenefits((prev) =>
      prev.includes(benefitId)
        ? prev.filter((id) => id !== benefitId)
        : [...prev, benefitId]
    );
  };

  const handleDeductionToggle = (deductionId: string) => {
    setSelectedDeductions((prev) =>
      prev.includes(deductionId)
        ? prev.filter((id) => id !== deductionId)
        : [...prev, deductionId]
    );
  };

  if (step === 1) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              placeholder="John"
              value={formData.firstName}
              onChange={handleChange}
              className="input-field mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
              className="input-field mt-1"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="johndoe@gmail.com"
              value={formData.email}
              onChange={handleChange}
              className="input-field mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input-field mt-1"
              required
              placeholder="1234567890"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Position
            </label>
            <input
              type="text"
              name="position"
              placeholder="Software Engineer"
              value={formData.position}
              onChange={handleChange}
              className="input-field mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="input-field mt-1"
              required
            >
              <option value="">Select Department</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Operations">Operations</option>
              <option value="Customer Service">Customer Service</option>
              <option value="Logistics">Logistics</option>
              <option value="Legal">Legal</option>
              <option value="Research And Development">
                Research and Development
              </option>
              <option value="Procurement">Procurement</option>
              <option value="Quality Assurance">Quality Assurance</option>
              <option value="Public Relations">Public Relations</option>
              <option value="Administration">Administration</option>
              <option value="Product Management">Product Management</option>
            </select>
          </div>
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
              Employment Type
            </label>
            <select
              name="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
              className="input-field mt-1"
              required
            >
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="seasonal">Seasonal</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="btn-primary inline-flex items-center"
            disabled={isLoading}
          >
            Next Step
            <ChevronRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Compensation</h3>
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-3">
            <label className="block text-sm font-medium text-gray-700">
              {formData.paymentRate === "monthly"
                ? "Monthly Salary (RWF)"
                : "Hourly Rate (RWF)"}
            </label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="input-field mt-1"
              required
              min="0"
              step={formData.paymentRate === "monthly" ? "1000" : "100"}
              placeholder={formData.paymentRate === "monthly" ? "300000" : "2000"}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Payment Rate
            </label>
            <select
              name="paymentRate"
              value={formData.paymentRate}
              onChange={handleChange}
              className="input-field mt-1"
              required
            >
              <option value="monthly">Monthly</option>
              <option value="hourly">Hourly</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Benefits</h3>
        <div className="grid grid-cols-2 gap-4">
          {benefits.map((benefit) => (
            <label
              key={benefit.id}
              className="relative flex items-start p-4 rounded-lg border cursor-pointer focus:outline-none"
            >
              <div className="min-w-0 flex-1 text-sm">
                <div className="font-medium text-gray-900">{benefit.name}</div>
                <p className="text-gray-500">
                  {benefit.type === "fixed"
                    ? `${benefit.value.toLocaleString()} RWF`
                    : `${benefit.value}% of salary`}
                </p>
              </div>
              <div className="ml-3 flex h-5 items-center">
                <input
                  type="checkbox"
                  checked={selectedBenefits.includes(benefit.id)}
                  onChange={() => handleBenefitToggle(benefit.id)}
                  className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Deductions</h3>
        <div className="grid grid-cols-2 gap-4">
          {deductions.map((deduction) => (
            <label
              key={deduction.id}
              className="relative flex items-start p-4 rounded-lg border cursor-pointer focus:outline-none"
            >
              <div className="min-w-0 flex-1 text-sm">
                <div className="font-medium text-gray-900">{deduction.name}</div>
                <p className="text-gray-500">
                  {deduction.type === "fixed"
                    ? `${deduction.value.toLocaleString()} RWF`
                    : `${deduction.value}% of salary`}
                </p>
              </div>
              <div className="ml-3 flex h-5 items-center">
                <input
                  type="checkbox"
                  checked={selectedDeductions.includes(deduction.id)}
                  onChange={() => handleDeductionToggle(deduction.id)}
                  className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="btn-secondary inline-flex items-center"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous Step
        </button>
        <button
          type="submit"
          className="btn-primary inline-flex items-center"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : initialData ? "Update Employee" : "Add Employee"}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;