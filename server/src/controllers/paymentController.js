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
    const { reservationId } = req.params;
    try {
        const payments = await Payment.findAll({
            where: { reservation_id: reservationId }
        });

        if (!payments || payments.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No payments found for reservation ID ${reservationId}`
            });
        }

        await Payment.destroy({
            where: { reservation_id: reservationId }
        });

        return res.status(200).json({
            success: true,
            message: `Payment(s) deleted successfully`,
            data: { reservationId, count: payments.length }
        });
    } catch (error) {
        console.error(`Error deleting payments:`, error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete payment(s)',
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