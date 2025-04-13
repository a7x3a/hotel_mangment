import API from "../api";

// Login function
export const loginUser = async (username, password) => {
    try {
        const response = await API.post("/users/login", { username, password });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// Logout function
export const logoutUser = async () => {
    try {
        await API.post("/users/logout");
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// utils/routes/users.js
export const updateUser = async (id, userData) => {
    try {
        const response = await API.put(`/users/update/${id}`, userData);
        return response.data;
    } catch (error) {
        // Handle specific error cases
        if (error.response) {
            if (error.response.status === 404) {
                throw new Error('User not found');
            }
            if (error.response.data && error.response.data.error) {
                throw new Error(error.response.data.error);
            }
        }
        throw new Error(error.message || 'Failed to update user');
    }
};
//Delete a User only if the user is an admin
export const deleteUser = async (id) => {
    try {
        const response = await API.delete(`/users/delete/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

//register a User 
export const registerUser = async (userData) => {
    try {
      const response = await API.post("/users/register", userData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  };

//Get all Users
export const getUsers = async () => {
    try {
        const response = await API.get("/users");
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

//Get a User by ID
export const getUser = async (id) => {
    try {
        const response = await API.get(`/users/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};
