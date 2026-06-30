import { FaUserMd, FaUserCheck } from "react-icons/fa";

const ProfileCard = ({ user }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md rounded-2xl p-6 text-center transition-colors duration-300">
      {user.avatar ? (
        <img
          src={`http://localhost:5000/uploads/${user.avatar}`}
          alt="avatar"
          className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-blue-500 shadow-lg"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://i.pravatar.cc/200";
          }}
        />
      ) : (
        <div className="w-28 h-28 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-extrabold text-4xl mx-auto border-4 border-blue-500 shadow-lg">
          {user.name.charAt(0).toUpperCase()}
        </div>
      )}

      <h2 className="text-2xl font-bold mt-4 text-slate-800 dark:text-slate-100">
        {user.name}
      </h2>

      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">{user.email}</p>

      <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
        {user.role === "admin" ? (
          <>
            <FaUserMd />
            Admin/Doctor
          </>
        ) : (
          <>
            <FaUserCheck />
            Patient
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;