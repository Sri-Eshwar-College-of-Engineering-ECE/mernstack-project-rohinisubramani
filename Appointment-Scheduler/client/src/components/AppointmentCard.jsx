import { useState } from "react";
import { FaClock, FaUserMd, FaNotesMedical, FaCalendarAlt, FaEdit, FaTimesCircle } from "react-icons/fa";
import { formatDate } from "../utils/formatDate";

const AppointmentCard = ({ appointment, onCancel, onReschedule }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("09:00");

  const timeslots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
  ];

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    if (!newDate || !newTime) return;
    onReschedule(appointment._id, newDate, newTime);
    setIsEditing(false);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Approved":
        return "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/40";
      case "Pending":
        return "bg-yellow-50 dark:bg-yellow-950/40 text-yellow-600 dark:text-yellow-400 border-yellow-100 dark:border-yellow-900/40";
      case "Completed":
        return "bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900/40";
      case "Cancelled":
        return "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/40";
      default:
        return "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700";
    }
  };

  const isActive = appointment.status === "Pending" || appointment.status === "Approved";

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between hover:shadow-lg">
      <div>
        <div className="flex justify-between items-start mb-4">
          <span
            className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${getStatusStyle(
              appointment.status
            )}`}
          >
            {appointment.status}
          </span>
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-100 dark:border-slate-800">
            <FaClock className="text-blue-500" />
            {appointment.appointmentTime}
          </span>
        </div>

        <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
          <FaUserMd className="text-blue-600 dark:text-blue-400 text-xl" />
          {appointment.doctor}
        </h3>

        <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2 mb-3">
          <FaCalendarAlt className="text-slate-400" />
          <span className="font-medium">{formatDate(appointment.appointmentDate)}</span>
        </p>

        <p className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2 mb-4 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
          <FaNotesMedical className="text-slate-400 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-3">Reason: {appointment.reason}</span>
        </p>
      </div>

      {isEditing ? (
        <form onSubmit={handleRescheduleSubmit} className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
              Select New Date
            </label>
            <input
              type="date"
              required
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-sm"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
              Select Timeslot
            </label>
            <select
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-sm"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
            >
              {timeslots.map((time, idx) => (
                <option key={idx} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors text-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        isActive && (
          <div className="flex gap-3 border-t border-slate-100 dark:border-slate-800 mt-4 pt-4">
            {onReschedule && (
              <button
                onClick={() => {
                  const formattedDate = new Date(appointment.appointmentDate).toISOString().split("T")[0];
                  setNewDate(formattedDate);
                  setNewTime(appointment.appointmentTime);
                  setIsEditing(true);
                }}
                className="flex-1 flex justify-center items-center gap-1.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-800 dark:hover:bg-slate-700 py-2.5 rounded-xl text-xs font-bold transition-all text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                <FaEdit />
                Reschedule
              </button>
            )}
            {onCancel && (
              <button
                onClick={() => onCancel(appointment._id)}
                className="flex-1 flex justify-center items-center gap-1.5 bg-slate-50 hover:bg-red-50 hover:text-red-600 dark:bg-slate-800 dark:hover:bg-slate-700 py-2.5 rounded-xl text-xs font-bold transition-all text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                <FaTimesCircle className="text-red-500" />
                Cancel Visit
              </button>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default AppointmentCard;