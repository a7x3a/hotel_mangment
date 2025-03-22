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
        localStorage.removeItem("token");
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// Register function
export const registerUser = async (name, username, password, role) => {
    try {
        const response = await API.post("/users/register", { name, username, password, role });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
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

//Update a User 
export const updateUser = async (id, name, username, password, role) => {
    try {
        const response = await API.put(`/users/update/${id}`, { name, username, password, role });
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
