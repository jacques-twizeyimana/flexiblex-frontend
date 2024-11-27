import { Navigate, Outlet, useLocation } from "react-router-dom";
import { auth } from "../lib/firebase";
import Sidebar from "./Sidebar";
import { useAuthState } from "react-firebase-hooks/auth";

export default function DashboardLayout() {
  const [user, loading] = useAuthState(auth);
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <div className="w-8 h-8 bg-transparent rounded-full border-2 border-green-600 border-b-transparent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="flex bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}
