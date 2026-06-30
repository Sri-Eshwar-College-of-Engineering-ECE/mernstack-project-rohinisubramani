import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-slate-100">

      {/* Admin Navbar */}
      <Navbar />

      <div className="flex">

        {/* Sidebar */}
        <Sidebar />

        {/* Admin Content */}
        <main className="flex-1 p-8 overflow-y-auto">

          <div className="bg-white rounded-xl shadow-lg p-6">

            <h1 className="text-3xl font-bold mb-6 text-blue-700">
              Admin Panel
            </h1>

            <Outlet />

          </div>

        </main>

      </div>

      <Footer />

    </div>
  );
};

export default AdminLayout;