import API from "./api";

export const getNotifications = async () => {
  return await API.get("/notifications");
};

export const markNotificationAsRead = async (id) => {
  return await API.put(`/notifications/${id}`);
};

export const clearAllNotifications = async () => {
  return await API.delete("/notifications");
};
