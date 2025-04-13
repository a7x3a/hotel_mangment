const { Payment } = require('../schema/index');

//Get All Payment Records
exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.findAll();
        if (payments.length > 0) {
            return res.json(payments);
        }else{
            return res.status(404).json({message : 'no payment record found!'});
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error fetching payments' });
    }
}
//Getting Payment Record By reservation id
exports.getPaymentByReservationId = async (req, res) => {
    const { reservation_id } = req.params;
    try {   
        const payment = await Payment.findOne({ where: { reservation_id } });
        if (payment) {
            return res.json(payment);
        } else {
            return res.status(404).json({ message: 'No payment record found for this reservation ID' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error fetching payment' });
    }
}
//Getting Payment Record By its Id
exports.getPaymentById = async (req, res) => {
    const {id} = req.params;
    try {
        const payment = await Payment.findByPk(id)
        if(payment){
            return res.json(payment);
        }else{
            return res.status(404).json('no payment record found for this id!')
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error fetching payment' });
    }
}
//Creating payment
exports.createPayment = async (req, res) => {
    const { reservation_id, amount_paid, payment_date } = req.body;
    try {
        const newPayment = await Payment.create({ reservation_id, amount_paid, payment_date });
        return res.status(201).json(newPayment);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error creating payment' })
    }
}

// Delete Payment
exports.deletePayment = async (req, res) => {
    const { id } = req.params;
    try {
        const payment = await Payment.findByPk(id);
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: `Payment with ID ${id} not found`
            });
        }

        await payment.destroy();

        return res.status(200).json({
            success: true,
            message: `Payment with ID ${id} deleted successfully`
        });
    } catch (error) {
        console.error(`Error deleting payment ${id}:`, error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete payment',
            error: error.message
        });
    }
};

// Update Payment
exports.updatePayment = async (req, res) => {
    const { id } = req.params;
    const { amount_paid, payment_date, payment_method, status } = req.body;
    
    try {
        // Validate required fields
        if (!amount_paid || !payment_date || !payment_method || !status) {
            return res.status(400).json({ 
                success: false,
                message: 'All payment fields are required' 
            });
        }

        const payment = await Payment.findByPk(id);
        
        if (!payment) {
            return res.status(404).json({ 
                success: false,
                message: 'Payment not found' 
            });
        }

        // Update payment with new data
        const updatedPayment = await payment.update({
            amount_paid,
            payment_date,
            payment_method,
            status
        });

        res.status(200).json({ 
            success: true,
            message: 'Payment updated successfully',
            data: updatedPayment
        });
    } catch (error) {
        console.error("Error updating payment:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to update payment",
            error: error.message
        });
    }
};