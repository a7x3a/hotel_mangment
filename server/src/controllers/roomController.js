const { Room } = require('../schema/index');

//returning all room records
exports.getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.findAll();
        if (rooms.length > 0) {
            return res.json(rooms)
        } else {
           return res.status(400).json({ message: 'no room records found' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({message : error})
    }
}
//getting a room record by its id
exports.getRoomById = async (req,res) => {
    const {id} = req.params;
    try {
            const room = await Room.findByPk(id);
            if(room){
                return res.status(200).json(room);
            }else{
                return res.status(404).json({message : 'no room found with this id!'});
            }
    } catch (error) {
        console.error(error);
        return res.status(500).json({message : error});
    }
}
//creating a room
exports.createRoom = async(req,res) =>{
    try {
        const { room_number, room_type, price, status } = req.body;
        if (!room_number || !room_type || !price || !status) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const newRoom = await Room.create({
            room_number,
            room_type,
            price,
            status
        });
        return res.status(201).json({ message: "Room created successfully", room: newRoom });
    } catch (error) {
        console.error("Error creating room:", error);
        return res.status(500).json({ message: "Error creating room", error });
    }
}
//deleting a room by its id
exports.deleteRoomById = async(req,res) =>{
    const {id} = req.params;
    try {
        const room = await Room.findByPk(id);
        if(room){
            await room.destroy();
            return res.status(200).json({ message: 'room deleted successfully' });
        }else{
            return res.status(404).json({message : 'no room found with this id!'});
        }
    } catch (error) {
        console.error("Error deleteing room:", error);
        return res.status(500).json({ message: "Error deleting room", error });
    }
}
//updating a room by its id and new values
exports.updateRoomById = async (req, res) => {
    const { id } = req.params;
    const { room_number, room_type, price, status } = req.body;
    try {
        const room = await Room.findByPk(id); 
        if (!room) {
            return res.status(404).json({ message: 'No room found with this ID!' });
        }
        await room.update({
            room_number: room_number || room.room_number,
            room_type: room_type || room.room_type,
            price: price || room.price,
            status: status || room.status,
        });
        res.status(200).json({ message: 'Room updated successfully!', room });
    } catch (error) {
        console.error("Error updating room:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};
