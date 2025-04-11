// utils/api/reservations.js
import API from "../api";

// Get all reservations
export const getAllReservations = async () => {
  try {
    const response = await API.get("/reservations");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Get a single reservation by ID
export const getReservationById = async (id) => {
  try {
    const response = await API.get(`/reservations/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Create a new reservation
export const createReservation = async (reservationData) => {
  try {
    const response = await API.post("/reservations/create", reservationData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Update a reservation
export const updateReservation = async (id, updateData) => {
  try {
    const response = await API.put(`/reservations/update/${id}`, updateData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Delete a reservation
export const deleteReservation = async (id) => {
  try {
    const response = await API.delete(`/reservations/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};



