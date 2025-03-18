const Guest = require('../schema/models/guests')

//Get All of The Guests
exports.getAllGuests = async (req, res) => {
    try {
        const guests = await Guest.findAll();
        res.status(200).json(guests);
    } catch (error) {
        console.error("Error fetching guests:", error);
        res.status(500).json({ message: "Error fetching guests", error });
    }
}

//Delete a Guest By Its ID
exports.deleteGuestById = async (req, res) => {
    const { id } = req.params;
    try {
        const guest = await Guest.findByPk(id);
        if (guest) {
            await guest.destroy();
            res.status(200).json({ message: 'guest deleted successfully' });
        } else {
            res.status(404).json({ message: 'guest not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting guest' });
    }
}

//get A Guest By its ID
exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const guest = await Guest.findByPk(id);
        if (guest) {
            res.json(guest)
        } else {
            res.status(404).json({ message: 'user not found!' })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching guest' });
    }
}


//Adding A new Guest
exports.createGuest = async (req, res) => {
    const { name, phone, document_type, document_number } = req.body;
    try {
        const newGuest = await Guest.create({ name, phone, document_type, document_number });
        res.status(201).json(newGuest);
    } catch (error) {
        console.error("Error creating guest:", error);
        res.status(500).json({ message: "Error creating guest", error });
    }
}

//Updating a guest by sending its id and new Info
exports.updateGuest = async (req, res) => {
    const { id } = req.params;
    const { name, phone, document_type, document_number } = req.body;
    try {
        const guest = await Guest.findByPk(id);
        if (guest) {
            guest.name = name || guest.name;
            guest.phone = phone || guest.phone;
            guest.document_type = document_type || guest.document_type;
            guest.document_number = document_number || guest.document_number;

            await guest.save();
            res.status(200).json(guest);
        } else {
            res.status(404).json({ message: 'Guest not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating guest' });
    }
};