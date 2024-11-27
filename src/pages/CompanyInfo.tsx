import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { toast } from "react-hot-toast";

interface CompanyData {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    country: string;
  };
}

export default function CompanyInfo() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      country: "",
    },
  });

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    if (!auth.currentUser) return;
    try {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      const userData = userDoc.data();

      if (userData?.companyId) {
        const companyDoc = await getDoc(
          doc(db, "companies", userData.companyId)
        );
        if (companyDoc.exists()) {
          setCompanyData(companyDoc.data() as CompanyData);
        }
      }
    } catch (error) {
      toast.error("Failed to fetch company data");
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setIsLoading(true);
    const loadingToast = toast.loading("Updating company information...");

    try {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      const userData = userDoc.data();

      if (userData?.companyId) {
        const companyRef = doc(db, "companies", userData.companyId);
        await updateDoc(companyRef, {
          name: companyData.name,
          email: companyData.email,
          phone: companyData.phone,
          "address.street": companyData.address.street,
          "address.city": companyData.address.city,
          "address.country": companyData.address.country,
        });
        toast.dismiss(loadingToast);
        toast.success("Company information updated successfully");
        setIsEditing(false);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to update company information");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Company Information
        </h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Edit Information
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              required
              disabled={!isEditing || isLoading}
              className="input-field"
              value={companyData.name}
              onChange={(e) =>
                setCompanyData({ ...companyData, name: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Email
            </label>
            <input
              type="email"
              required
              disabled={!isEditing || isLoading}
              className="input-field"
              value={companyData.email}
              onChange={(e) =>
                setCompanyData({ ...companyData, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              required
              disabled={!isEditing || isLoading}
              className="input-field"
              value={companyData.phone}
              onChange={(e) =>
                setCompanyData({ ...companyData, phone: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                required
                disabled={!isEditing || isLoading}
                className="input-field"
                value={companyData.address.country}
                onChange={(e) =>
                  setCompanyData({
                    ...companyData,
                    address: {
                      ...companyData.address,
                      country: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                required
                disabled={!isEditing || isLoading}
                className="input-field"
                value={companyData.address.city}
                onChange={(e) =>
                  setCompanyData({
                    ...companyData,
                    address: { ...companyData.address, city: e.target.value },
                  })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address
            </label>
            <input
              type="text"
              required
              disabled={!isEditing || isLoading}
              className="input-field"
              value={companyData.address.street}
              onChange={(e) =>
                setCompanyData({
                  ...companyData,
                  address: { ...companyData.address, street: e.target.value },
                })
              }
            />
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  fetchCompanyData();
                }}
                disabled={isLoading}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
