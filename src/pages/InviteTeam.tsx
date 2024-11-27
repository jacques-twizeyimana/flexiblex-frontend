<<<<<<< HEAD
import React, { useState } from 'react';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import { Building2, Users, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function InviteTeam() {
  const [emails, setEmails] = useState<string[]>(['']);
=======
import React, { useState } from "react";
import { doc, addDoc, getDoc, collection } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { toast } from "react-hot-toast";
import { Building2, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function InviteTeam() {
  const [emails, setEmails] = useState<string[]>([""]);
>>>>>>> d652b5ac2a17ce71a740cb53d155b10b096870cc
  const navigate = useNavigate();

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const addEmailField = () => {
<<<<<<< HEAD
    setEmails([...emails, '']);
=======
    setEmails([...emails, ""]);
>>>>>>> d652b5ac2a17ce71a740cb53d155b10b096870cc
  };

  const removeEmailField = (index: number) => {
    const newEmails = emails.filter((_, i) => i !== index);
    setEmails(newEmails);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
<<<<<<< HEAD
      toast.error('Please sign in first');
=======
      toast.error("Please sign in first");
>>>>>>> d652b5ac2a17ce71a740cb53d155b10b096870cc
      return;
    }

    try {
<<<<<<< HEAD
      const validEmails = emails.filter((email) => email.trim() !== '');
      await updateDoc(doc(db, 'companies', auth.currentUser.uid), {
        invitedMembers: arrayUnion(...validEmails),
      });

      toast.success('Team members invited successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to send invitations');
=======
      // get current user information
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      const companyId = userDoc.data()?.companyId;

      const validEmails = emails.filter((email) => email.trim() !== "");

      // insert into invitations collection
      for (const email of validEmails) {
        await addDoc(collection(db, "invitations"), {
          email,
          companyId,
          invitedBy: auth.currentUser.uid,
          createdAt: new Date().toISOString(),
        });
      }

      toast.success("Team members invited successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to send invitations");
      console.error(error);
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
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Invite Your Team
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Add team members to get started
          </p>
        </div>

<<<<<<< HEAD
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {emails.map((email, index) => (
              <div key={index} className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                    placeholder="team@example.com"
                    value={email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                  />
                </div>
=======
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {emails.map((email, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="email"
                  required
                  className="input-field"
                  placeholder="team@example.com"
                  value={email}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                />
>>>>>>> d652b5ac2a17ce71a740cb53d155b10b096870cc
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeEmailField(index)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div>
            <button
              type="button"
              onClick={addEmailField}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Email
            </button>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Send Invitations
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
