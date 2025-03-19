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