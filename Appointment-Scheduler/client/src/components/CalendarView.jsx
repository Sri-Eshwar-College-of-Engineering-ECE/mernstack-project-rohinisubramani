import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CalendarView = ({ value, onChange, appointments = [] }) => {
  const getAppointmentsForDate = (date) => {
    return appointments.filter((app) => {
      const appDate = new Date(app.appointmentDate);
      return (
        appDate.getDate() === date.getDate() &&
        appDate.getMonth() === date.getMonth() &&
        appDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const apps = getAppointmentsForDate(date);
      if (apps.length > 0) {
        return (
          <div className="flex justify-center gap-1 mt-1">
            {apps.map((app, idx) => {
              let dotColor = "bg-yellow-400";
              if (app.status === "Approved") dotColor = "bg-blue-500";
              if (app.status === "Completed") dotColor = "bg-green-500";
              if (app.status === "Cancelled") dotColor = "bg-red-500";
              return (
                <span
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full ${dotColor}`}
                  title={`${app.doctor} - ${app.appointmentTime} (${app.status})`}
                ></span>
              );
            })}
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-md p-6 transition-colors duration-300">
      <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">
        Interactive Schedule Calendar
      </h2>
      <div className="flex justify-center custom-calendar-wrapper">
        <Calendar
          value={value}
          onChange={onChange}
          tileContent={tileContent}
          className="w-full border-none max-w-full dark:bg-slate-900 dark:text-white"
        />
      </div>
    </div>
  );
};

export default CalendarView;