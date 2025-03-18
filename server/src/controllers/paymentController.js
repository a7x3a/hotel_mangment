const Payment = require('../schema/models/payment')

//Get All Payment Records
exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.findAll();
        if (payments) {
            res.json(payments)
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching payments' });
    }
}
//Getting Payment Record By its Id
exports.getPaymentById = async (req, res) => {
    const {id} = req.params;
    try {
        const payment = await Payment.findByPk(id)
        if(payment){
            res.json(payment);
        }else{
            res.json('no payment record found for this id!')
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching payment' });
    }
}
//Creating payment
exports.createPayment = async (req, res) => {
    const { reservation_id, amount_paid, payment_date } = req.body;
    try {
        const newPayment = await Payment.create({ reservation_id, amount_paid, payment_date });
        res.status(201).json(newPayment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating payment' })
    }
}