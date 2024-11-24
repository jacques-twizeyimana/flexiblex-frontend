import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import Modal from "../components/Modal";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface Benefit {
  id: string;
  name: string;
  type: "fixed" | "percentage";
  value: number;
  description: string;
}

type NewBenefit = Omit<Benefit, "id" | "createdAt">;

export default function Benefits() {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBenefit, setNewBenefit] = useState<NewBenefit>({
    name: "",
    type: "fixed" as const,
    value: 0,
    description: "",
  });

  useEffect(() => {
    fetchBenefits();
  }, []);

  const fetchBenefits = async () => {
    if (!auth.currentUser) return;
    try {
      const querySnapshot = await getDocs(
        collection(db, `companies/${auth.currentUser.uid}/benefits`)
      );
      const benefitsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Benefit[];
      setBenefits(benefitsData);
    } catch (error) {
      toast.error("Failed to fetch benefits");
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      toast.error("Please sign in first");
      return;
    }

    try {
      await addDoc(
        collection(db, `companies/${auth.currentUser.uid}/benefits`),
        {
          ...newBenefit,
          createdAt: new Date().toISOString(),
        }
      );

      setIsModalOpen(false);
      setNewBenefit({ name: "", type: "fixed", value: 0, description: "" });
      toast.success("Benefit added successfully");
      fetchBenefits();
    } catch (error) {
      toast.error("Failed to add benefit");
      console.error(error);
    }
  };

  const deleteBenefit = async (id: string) => {
    if (!auth.currentUser) return;
    try {
      await deleteDoc(
        doc(db, `companies/${auth.currentUser.uid}/benefits/${id}`)
      );
      toast.success("Benefit deleted successfully");
      fetchBenefits();
    } catch (error) {
      toast.error("Failed to delete benefit");
      console.error(error);
    }
  };

  return (
    <div>
      <main className="flex-1 p-8">
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Benefits Management
            </h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Benefit
            </button>
          </div>

          <div className="bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {benefits.map((benefit) => (
                  <tr key={benefit.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {benefit.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {benefit.type === "fixed" ? "Fixed Amount" : "Percentage"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {benefit.type === "fixed"
                        ? `${benefit.value.toLocaleString()} RWF`
                        : `${benefit.value}%`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {benefit.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => deleteBenefit(benefit.id)}
                        className="text-red-600 hover:text-red-900 ml-4"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Benefit"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Benefit Name
            </label>
            <input
              type="text"
              name="benefitName"
              placeholder="Home Internet"
              className="input-field"
              value={newBenefit.name}
              onChange={(e) =>
                setNewBenefit({ ...newBenefit, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="benefitDescription"
              rows={3}
              placeholder="Internet package for all employees"
              className="input-field"
              value={newBenefit.description}
              onChange={(e) =>
                setNewBenefit({ ...newBenefit, description: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Type
            </label>
            <select
              name="benefitType"
              className="input-field"
              value={newBenefit.type}
              onChange={(e) =>
                setNewBenefit({
                  ...newBenefit,
                  type: e.target.value as "fixed" | "percentage",
                })
              }
              required
            >
              <option value="fixed">Fixed Amount</option>
              <option value="percentage">Percentage</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {newBenefit.type === "fixed"
                ? "Amount (RWF)"
                : "Percentage (of salary)"}
            </label>
            <input
              type="number"
              name="benefitValue"
              placeholder="1000"
              className="input-field"
              value={newBenefit.value}
              onChange={(e) =>
                setNewBenefit({
                  ...newBenefit,
                  value: parseFloat(e.target.value),
                })
              }
              max={newBenefit.type === "fixed" ? Infinity : 100}
              required
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Benefit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
