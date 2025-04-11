// utils/api/guest.js
import API from "../api";

// Get all guests
export const getAllGuests = async () => {
  try {
    const response = await API.get("/guests");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Get single guest by ID
export const getGuestById = async (id) => {
  try {
    const response = await API.get(`/guests/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Create new guest
export const createGuest = async (guestData) => {
  try {
    const response = await API.post("/guests/create", guestData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Update guest
export const updateGuest = async (id, updateData) => {
  try {
    const response = await API.put(`/guests/update/${id}`, updateData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Delete guest
export const deleteGuest = async (id) => {
  try {
    const response = await API.delete(`/guests/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};