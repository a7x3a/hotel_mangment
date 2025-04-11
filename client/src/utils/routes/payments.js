// utils/api/payment.js
import API from "../api";

// Get all payments
export const getAllPayments = async () => {
  try {
    const response = await API.get("/payments");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Get a single payment by ID
export const getPaymentById = async (id) => {
  try {
    const response = await API.get(`/payments/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Create a new payment
export const createPayment = async (paymentData) => {
  try {
    const response = await API.post("/payments/create", paymentData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};