<<<<<<< HEAD
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import { Building2, Mail, MapPin, Globe } from 'lucide-react';

export default function CompanySetup() {
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [address, setAddress] = useState('');
  const [timezone, setTimezone] = useState('UTC');
=======
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
>>>>>>> d652b5ac2a17ce71a740cb53d155b10b096870cc
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
<<<<<<< HEAD
      toast.error('Please sign in first');
      return;
    }

    try {
      await setDoc(doc(db, 'companies', auth.currentUser.uid), {
        name: companyName,
        email: companyEmail,
        address,
        timezone,
        createdAt: new Date().toISOString(),
        ownerId: auth.currentUser.uid
      });
      
      navigate('/invite-team');
    } catch (error) {
      toast.error('Failed to create company');
=======
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
>>>>>>> d652b5ac2a17ce71a740cb53d155b10b096870cc
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Building2 className="h-12 w-12 text-green-600" />
          </div>
<<<<<<< HEAD
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Set up your company</h2>
=======
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Set up your company
          </h2>
>>>>>>> d652b5ac2a17ce71a740cb53d155b10b096870cc
          <p className="mt-2 text-sm text-gray-600">
            Tell us about your organization
          </p>
        </div>
<<<<<<< HEAD
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="company-name" className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="company-name"
                  name="company-name"
                  type="text"
                  required
                  className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Your Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="company-email" className="block text-sm font-medium text-gray-700">
                Company Email
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="company-email"
                  name="company-email"
                  type="email"
                  required
                  className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="company@example.com"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Full Address
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  id="address"
                  name="address"
                  required
                  rows={3}
                  className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Complete address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                Timezone
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="timezone"
                  name="timezone"
                  required
                  className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Continue
=======

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
>>>>>>> d652b5ac2a17ce71a740cb53d155b10b096870cc
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}