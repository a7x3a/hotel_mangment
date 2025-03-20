const { Op } = require('sequelize');
const { Reservation } = require('../schema/index'); 

//returning all reservation recordds
exports.getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.findAll();
        if(reservations.length > 0) {
            res.status(200).json(reservations); // Send all reservations in response
        } else {
            res.status(404).json({ message: 'No reservations found!' }); // No records found
        }
    } catch (error) {
        console.error('Error fetching reservations:', error);
        res.status(500).json({ message: 'Error fetching reservations', error });
    }
}

//return reservation records accordning to its id
exports.getReservationById = async (req,res) => {
    const {id} = req.params;
    try {
            const reservation = await Reservation.findByPk(id);
            if(reservation){
                return res.status(200).json(reservation);
            }else{
                return res.status(404).json({message : 'no reservation found with this id!'});
            }
    } catch (error) {
        console.error(error);
        return res.status(500).json({message : error});
    }
}

//delete reservation record accordning to its id
exports.deleteReservationById = async (req, res) => {
    const { id } = req.params;
    try {
        const reservation = await Reservation.findByPk(id);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found!' });
        }
        await reservation.destroy();
        res.status(200).json({ message: 'Reservation deleted successfully!' });
    } catch (error) {
        console.error("Error deleting reservation:", error);
        res.status(500).json({ message: "Error deleting reservation", error });
    }
};

//Create New Reservation
exports.createReservation = async (req, res) => {
    const {
        guest_id,
        user_id,
        room_id,
        check_in,
        check_out,
        start_from,
        total_price,
        status
    } = req.body;

    try {
        // Check if all required fields are provided
        if (!guest_id || !user_id || !room_id || !check_in || !check_out || !start_from || !total_price || !status) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        // Check if the room is available for the given period
        const conflictingReservation = await Reservation.findOne({
            where: {
                room_id: room_id,
                status: 'Confirmed',
                [Op.or]: [
                    { check_in: { [Op.between]: [check_in, check_out] } },
                    { check_out: { [Op.between]: [check_in, check_out] } },
                    { [Op.and]: [{ check_in: { [Op.lte]: check_in } }, { check_out: { [Op.gte]: check_out } }] }
                ]
            }
        });

        if (conflictingReservation) {
            return res.status(400).json({ message: "The room is already booked for this period!" });
        }

        // Create the reservation
        const newReservation = await Reservation.create({
            guest_id,
            user_id,
            room_id,
            check_in,
            check_out,
            start_from,
            total_price,
            status
        });

        return res.status(201).json({ message: "Reservation created successfully!", reservation: newReservation });
    } catch (error) {
        console.error("Error creating reservation:", error);
        return res.status(500).json({ message: "Error creating reservation", error });
    }
};

//Update Reservation Based On Its ID
exports.updateReservationById = async (req, res) => {
    const { id } = req.params;
    const { check_in, check_out, start_from, total_price, status } = req.body;

    try {
        // Find the reservation by ID
        const reservation = await Reservation.findByPk(id);

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found!' });
        }

        // Update reservation details
        reservation.check_in = check_in || reservation.check_in;
        reservation.check_out = check_out || reservation.check_out;
        reservation.start_from = start_from || reservation.start_from;
        reservation.total_price = total_price || reservation.total_price;
        reservation.status = status || reservation.status;

        // Save the updated reservation
        await reservation.save();

        // Return the updated reservation details
        res.status(200).json({ message: 'Reservation updated successfully!', reservation });
    } catch (error) {
        console.error("Error updating reservation:", error);
        res.status(500).json({ message: "Error updating reservation", error });
    }
};

