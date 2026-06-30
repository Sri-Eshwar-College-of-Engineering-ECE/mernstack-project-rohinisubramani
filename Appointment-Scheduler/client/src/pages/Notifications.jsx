import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Loader from "../components/Loader";
import {
  getNotifications,
  markNotificationAsRead,
  clearAllNotifications,
} from "../services/notificationService";
import { formatDate } from "../utils/formatDate";
import { FaBell, FaTrash, FaCheck, FaInfoCircle } from "react-icons/fa";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchUserNotifications = async () => {
    try {
      setLoading(true);
      const { data } = await getNotifications();
      setNotifications(data);
    } catch (err) {
      setError("Failed to fetch notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      // Update local state to show it is read
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      setError("Failed to update notification.");
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to clear all notifications?")) return;
    try {
      setError("");
      setSuccess("");
      await clearAllNotifications();
      setSuccess("All notifications cleared successfully.");
      setNotifications([]);
    } catch (err) {
      setError("Failed to clear notifications.");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-8 transition-colors duration-300 text-slate-800 dark:text-slate-100">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Notifications</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Stay updated with your appointment bookings and status changes
            </p>
          </div>

          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="bg-slate-100 hover:bg-red-50 hover:text-red-600 dark:bg-slate-800 dark:hover:bg-red-950/20 dark:hover:text-red-400 text-slate-600 dark:text-slate-300 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-800"
            >
              <FaTrash className="text-xs" />
              Clear All
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-4 rounded-xl border border-red-100 dark:border-red-900/40 mb-6 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/40 mb-6 text-sm">
            {success}
          </div>
        )}

        {notifications.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-16 text-center shadow-sm">
            <FaBell className="text-5xl text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">All Caught Up!</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              You have no new notifications at the moment.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((item) => (
              <div
                key={item._id}
                className={`p-5 rounded-2xl border transition-all duration-300 flex justify-between items-start gap-4 ${
                  item.isRead
                    ? "bg-white/40 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800/80 opacity-70"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm"
                }`}
              >
                <div className="flex gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      item.isRead
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-400"
                        : "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    }`}
                  >
                    <FaInfoCircle className="text-lg" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3
                        className={`font-semibold text-base ${
                          item.isRead ? "text-slate-600 dark:text-slate-300" : "text-slate-800 dark:text-slate-100"
                        }`}
                      >
                        {item.title}
                      </h3>
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 inline-block"></span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-1.5">
                      {item.message}
                    </p>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                </div>

                {!item.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(item._id)}
                    className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                    title="Mark as read"
                  >
                    <FaCheck className="text-xs" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;