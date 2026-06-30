import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProfileCard from "../components/ProfileCard";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import { FaUser, FaEnvelope, FaPhone, FaCamera } from "react-icons/fa";

const Profile = () => {
  const { user, updateUserInContext } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
      if (user.avatar) {
        setPreviewUrl(`http://localhost:5000/uploads/${user.avatar}`);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name || !formData.email) {
      setError("Name and Email are required fields.");
      return;
    }

    try {
      setLoading(true);
      const dataToSend = new FormData();
      dataToSend.append("name", formData.name);
      dataToSend.append("email", formData.email);
      dataToSend.append("phone", formData.phone);

      if (avatarFile) {
        dataToSend.append("avatar", avatarFile);
      }

      const { data } = await API.put("/users/profile", dataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Profile updated successfully!");
      updateUserInContext(data.user);
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : "Failed to update profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-8 transition-colors duration-300 text-slate-800 dark:text-slate-100 flex justify-center items-center">
      <div className="w-full max-w-4xl grid md:grid-cols-3 gap-8">
        {/* Profile Card Summary Panel */}
        <div className="md:col-span-1 flex flex-col gap-6">
          <ProfileCard user={user} />

          {/* Quick Info Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm text-xs text-slate-500 space-y-2">
            <p>
              <span className="font-bold uppercase text-slate-400 dark:text-slate-600 block mb-0.5">
                Account ID:
              </span>
              {user._id}
            </p>
            <p>
              <span className="font-bold uppercase text-slate-400 dark:text-slate-600 block mb-0.5">
                Role Type:
              </span>
              <span className="capitalize font-semibold text-blue-600 dark:text-blue-400">
                {user.role}
              </span>
            </p>
          </div>
        </div>

        {/* Update Form Panel */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-md p-8 transition-colors duration-300">
          <h2 className="text-2xl font-extrabold mb-2 tracking-tight">Update Profile Details</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            Modify your credentials, contact phone, and account picture
          </p>

          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm mb-6 border border-red-100 dark:border-red-900/40">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl text-sm mb-6 border border-emerald-100 dark:border-emerald-900/40">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Avatar Image Input */}
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80">
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 flex-shrink-0 flex items-center justify-center border border-slate-300 dark:border-slate-700">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <FaUser className="text-slate-400 text-2xl" />
                )}
                <label
                  htmlFor="avatar-file-input"
                  className="absolute inset-0 bg-black/40 hover:bg-black/55 text-white flex items-center justify-center cursor-pointer transition-colors opacity-0 hover:opacity-100"
                >
                  <FaCamera className="text-xs" />
                </label>
              </div>

              <div>
                <span className="text-sm font-semibold block text-slate-700 dark:text-slate-200">
                  Profile Avatar
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
                  Click the camera icon to upload a JPG, PNG, or WEBP file
                </span>
                <input
                  type="file"
                  id="avatar-file-input"
                  name="avatar"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
                  <FaUser className="text-slate-400" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3.5 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
                  <FaEnvelope className="text-slate-400" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3.5 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
                  <FaPhone className="text-slate-400" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="1234567890"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3.5 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white p-3.5 rounded-xl font-semibold shadow-lg shadow-blue-500/20 active:scale-98 transition-all cursor-pointer mt-6 flex justify-center items-center"
              disabled={loading}
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                "Save Profile Changes"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;