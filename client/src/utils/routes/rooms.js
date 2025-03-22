import API from "../api";

// Get all rooms
export const getRooms = async () => {
  try {
    const response = await API.get("/rooms");
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Get a room by id
export const getRoom = async (id) => {
  try {
    const response = await API.get(`/rooms/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// The user must be an admin to create a room
export const createRoom = async (name, description, capacity, floor) => {
  try {
    const response = await API.post("/rooms", { name, description, capacity, floor });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};