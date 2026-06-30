import API from "./api";

export const getAppointments = async () => {
    return await API.get("/appointments");
};

export const createAppointment = async (data) => {
    return await API.post("/appointments", data);
};

export const updateAppointment = async (id, data) => {
    return await API.put(`/appointments/${id}`, data);
};

export const deleteAppointment = async (id) => {
    return await API.delete(`/appointments/${id}`);
};