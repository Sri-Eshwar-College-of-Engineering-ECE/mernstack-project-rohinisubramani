import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCalendarCheck, FaUserShield, FaBell } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  // Redirect if already logged in
  if (user) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex flex-col justify-between">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center flex-1 px-6 py-20">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-extrabold tracking-tight"
        >
          Appointment Scheduler
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg md:text-xl mt-6 max-w-2xl text-blue-100 font-light"
        >
          Book, manage, and track appointments with an elegant, secure, and user-friendly dashboard. Built for doctors and patients.
        </motion.p>

        <div className="mt-10 flex gap-6">
          <Link
            to="/login"
            className="bg-white text-blue-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-slate-100 transition-all shadow-lg hover:shadow-white/20 active:scale-95"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-yellow-400 text-slate-900 px-8 py-3.5 rounded-xl font-semibold hover:bg-yellow-300 transition-all shadow-lg hover:shadow-yellow-400/20 active:scale-95"
          >
            Register
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 px-10 pb-16 max-w-7xl mx-auto w-full">
        <div className="bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-2xl p-6 text-center shadow-xl hover:translate-y-[-5px] transition-transform duration-300">
          <div className="bg-white/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCalendarCheck className="text-2xl text-yellow-300" />
          </div>
          <h2 className="text-xl font-bold">Easy Booking</h2>
          <p className="mt-2 text-sm text-blue-100">
            Schedule appointments in seconds with real-time slot availability.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-2xl p-6 text-center shadow-xl hover:translate-y-[-5px] transition-transform duration-300">
          <div className="bg-white/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUserShield className="text-2xl text-green-300" />
          </div>
          <h2 className="text-xl font-bold">Secure Access</h2>
          <p className="mt-2 text-sm text-blue-100">
            Robust JWT-based role authorization protects sensitive details.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-2xl p-6 text-center shadow-xl hover:translate-y-[-5px] transition-transform duration-300">
          <div className="bg-white/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaBell className="text-2xl text-red-300" />
          </div>
          <h2 className="text-xl font-bold">Notifications</h2>
          <p className="mt-2 text-sm text-blue-100">
            Get instant updates when appointments are approved or rescheduled.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;