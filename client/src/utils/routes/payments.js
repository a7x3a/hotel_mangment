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

//delete payment
export const deletePayment = async (id) => {
  try {
    const response = await API.delete(`/payments/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};  

//get payment by user id
export const getPaymentsByReservationId = async (reservationId) => {
  try {
    const response = await API.get(`/payments/reservation/${reservationId}`);
    return response.data;

  }
  catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}

//update payment
export const updatePayment = async (id, paymentData) => {
  try {
    // Validate required fields before sending
    if (!paymentData.amount_paid || !paymentData.payment_date || 
        !paymentData.payment_method || !paymentData.status) {
      throw new Error('All payment fields are required');
    }

    const response = await API.put(`/payments/${id}`, paymentData);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error updating payment:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message,
      error: error.response?.data?.error || error.message
    };
  }
};