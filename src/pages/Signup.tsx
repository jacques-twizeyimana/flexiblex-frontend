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
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
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
          firstName,
          lastName,
          email,
          role,
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
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-green-600 hover:text-green-500"
            >
              Sign in
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
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

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
