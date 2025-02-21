<<<<<<< HEAD
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import { Building2, Lock, Mail } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
=======
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { toast } from "react-hot-toast";
import { Building2 } from "lucide-react";
import logo from '../../T07UGR60XC7-U07UQQCRU22-310cc139bcf3-512.jpeg';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
>>>>>>> d652b5ac2a17ce71a740cb53d155b10b096870cc
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
<<<<<<< HEAD
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/company-setup');
    } catch (error) {
      toast.error('Invalid credentials');
=======
    setIsLoading(true);
    const loadingToast = toast.loading("Signing in...");

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();

      toast.dismiss(loadingToast);
      toast.success("Signed in successfully!");

      console.log("User data:", userData);

      if (!userData?.companyId) {
        navigate("/company-setup");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Invalid credentials");
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
<<<<<<< HEAD
            <Building2 className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-green-600 hover:text-green-500">
=======
            <img src={logo} alt="Logo" className="h-12 w-12" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-green-600 hover:text-green-500"
            >
>>>>>>> d652b5ac2a17ce71a740cb53d155b10b096870cc
              Sign up
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
<<<<<<< HEAD
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
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
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
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
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

=======
          <div>
            <label className="block text-base font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field mt-1"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-base font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field mt-1"
              disabled={isLoading}
            />
          </div>
>>>>>>> d652b5ac2a17ce71a740cb53d155b10b096870cc
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
<<<<<<< HEAD
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
=======
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
>>>>>>> d652b5ac2a17ce71a740cb53d155b10b096870cc
                Remember me
              </label>
            </div>

            <div className="text-sm">
<<<<<<< HEAD
              <a href="#" className="font-medium text-green-600 hover:text-green-500">
=======
              <a
                href="#"
                className="font-medium text-green-600 hover:text-green-500"
              >
>>>>>>> d652b5ac2a17ce71a740cb53d155b10b096870cc
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
<<<<<<< HEAD
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Sign in
=======
              disabled={isLoading}
              className="btn-primary block w-full disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign in"}
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
