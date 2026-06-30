import API from "./api";

export const getAdminStats = async () => {
  return await API.get("/admin/dashboard");
};

export const getAllUsers = async () => {
  return await API.get("/admin/users");
};

export const deleteUser = async (id) => {
  return await API.delete(`/admin/users/${id}`);
};

export const getAllAppointments = async () => {
  return await API.get("/admin/appointments");
};
