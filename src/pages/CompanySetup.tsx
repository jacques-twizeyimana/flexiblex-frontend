import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { toast } from "react-hot-toast";
import { Building2 } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

export default function CompanySetup() {
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      toast.error("Please sign in first");
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Setting up your company...");

    try {
      // Generate a new company ID
      const companyId = uuidv4();

      // Create company document
      await setDoc(doc(db, "companies", companyId), {
        name: companyName,
        email: companyEmail,
        phone: phoneNumber,
        address: {
          street: address,
          city,
          country,
        },
        createdAt: new Date().toISOString(),
        ownerId: auth.currentUser.uid,
      });

      // Update user with company ID
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        companyId,
        role: "admin" // Set as admin since they're creating the company
      });

      toast.dismiss(loadingToast);
      toast.success("Company created successfully!");
      navigate("/invite-team");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to create company");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Building2 className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Set up your company
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Tell us about your organization
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input
              id="company-name"
              name="company-name"
              type="text"
              required
              className="input-field"
              placeholder="Paper Inc."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Email
            </label>
            <input
              id="company-email"
              name="company-email"
              type="email"
              required
              className="input-field"
              placeholder="contact@paper.co"
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              id="phone-number"
              name="phone-number"
              type="tel"
              required
              className="input-field"
              placeholder="+1 234 567 890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                id="country"
                name="country"
                type="text"
                required
                className="input-field"
                placeholder="Rwanda"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                required
                className="input-field"
                placeholder="Kigali"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address
            </label>
            <input
              id="address"
              name="address"
              required
              className="input-field"
              placeholder="123 Main St"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {isLoading ? "Creating Company..." : "Continue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}