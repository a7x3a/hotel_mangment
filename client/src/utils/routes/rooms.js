// utils/api/rooms.js
import API from "../api";

// Get all rooms
export const getRooms = async () => {
  try {
    const response = await API.get("/rooms");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Get a room by id
export const getRoomById = async (id) => {
  try {
    const response = await API.get(`/rooms/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Create a new room (Admin only)
export const createRoom = async (roomData) => {
  try {
    const response = await API.post("/rooms/create", roomData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Update a room (Admin only)
export const updateRoom = async (id, roomData) => {
  try {
    const response = await API.put(`/rooms/update/${id}`, roomData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Delete a room (Admin only)
export const deleteRoom = async (id) => {
  try {
    const response = await API.delete(`/rooms/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
