<<<<<<< HEAD
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import { Building2, Lock, Mail, User, Briefcase } from 'lucide-react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('');
=======
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { toast } from "react-hot-toast";
import { Building2 } from "lucide-react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
>>>>>>> d652b5ac2a17ce71a740cb53d155b10b096870cc
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
<<<<<<< HEAD
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      if (user) {
        await setDoc(doc(db, 'users', user.uid), {
=======
    setIsLoading(true);
    const loadingToast = toast.loading("Creating your account...");

    try {
      // Check for invitation
      const invitationsRef = collection(db, "invitations");
      const q = query(invitationsRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);
      let companyId = null;

      if (!querySnapshot.empty) {
        companyId = querySnapshot.docs[0].data().companyId;
      }

      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (user) {
        await setDoc(doc(db, "users", user.uid), {
>>>>>>> d652b5ac2a17ce71a740cb53d155b10b096870cc
          firstName,
          lastName,
          email,
          role,
<<<<<<< HEAD
          createdAt: new Date().toISOString()
        });

        toast.success('Account created successfully!');
        navigate('/company-setup');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to create account');
=======
          companyId,
          createdAt: new Date().toISOString(),
        });

        toast.dismiss(loadingToast);
        toast.success("Account created successfully!");

        if (companyId) {
          navigate("/dashboard");
        } else {
          navigate("/company-setup");
        }
      }
    } catch (error: unknown) {
      console.error("Signup error:", error);
      toast.dismiss(loadingToast);
      toast.error((error as Error).message || "Failed to create account");
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
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
=======
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-green-600 hover:text-green-500"
            >
>>>>>>> d652b5ac2a17ce71a740cb53d155b10b096870cc
              Sign in
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
<<<<<<< HEAD
          <div className="rounded-md shadow-sm space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <div className="relative">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role at Company
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="role"
                  name="role"
                  type="text"
                  required
                  className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="HR Manager, CEO"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>
=======
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                className="input-field mt-1"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                className="input-field mt-1"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Profession
            </label>
            <select
              className="input-field mt-1"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={isLoading}
            >
              <option value="">Select a profession</option>
              <option value="doctor">Doctor</option>
              <option value="engineer">Engineer</option>
              <option value="teacher">Teacher</option>
              <option value="chef">Chef</option>
              <option value="police_officer">Police Officer</option>
              <option value="software_developer">Software Developer</option>
              <option value="nurse">Nurse</option>
              <option value="accountant">Accountant</option>
              <option value="architect">Architect</option>
              <option value="electrician">Electrician</option>
              <option value="mechanic">Mechanic</option>
              <option value="graphic_designer">Graphic Designer</option>
              <option value="photographer">Photographer</option>
              <option value="lawyer">Lawyer</option>
              <option value="journalist">Journalist</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="input-field mt-1"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="input-field mt-1"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
>>>>>>> d652b5ac2a17ce71a740cb53d155b10b096870cc

          <div>
            <button
              type="submit"
<<<<<<< HEAD
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Create Account
=======
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
>>>>>>> d652b5ac2a17ce71a740cb53d155b10b096870cc
            </button>
          </div>
        </form>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> d652b5ac2a17ce71a740cb53d155b10b096870cc
