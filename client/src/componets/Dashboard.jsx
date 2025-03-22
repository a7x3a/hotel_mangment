import React, { useState, useEffect } from 'react';
import { getRooms } from '../utils/routes/rooms'; // Assuming this function exists to fetch room data
import { Card, CardContent, Typography, Grid, Box, Chip } from '@mui/material';

const Dashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState(null);

  // Fetch rooms when the component mounts
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomData = await getRooms(); // Fetch all rooms
        setRooms(roomData); // Store the rooms in state
      } catch (error) {
        setError('Failed to load rooms');
      }
    };

    fetchRooms();
  }, []); // Empty dependency to run only once on mount

  return (
    <Box sx={{ padding: 5 }}>
      <Typography variant="h3" align="center" gutterBottom>
        Dashboard
      </Typography>

      {/* Display Error if there's any */}
      {error && <Typography color="error" variant="h6" align="center">{error}</Typography>}

      <Grid container spacing={4} justifyContent="center">
        {/* Room Cards */}
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <Grid item xs={12} sm={6} md={4} key={room.room_id}>
              <Card sx={{ maxWidth: 345 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {room.room_type} - {room.room_number}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Price: ${room.price}
                  </Typography>
                  <Typography variant="body1" color="textSecondary" mb={2}>
                    Floor: {room.floor}
                  </Typography>

                  <Chip
                    label={room.status}
                    color={room.status === 'Reserved' ? 'error' : 'success'}
                    variant="outlined"
                  />
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" align="center">No rooms available</Typography>
        )}
      </Grid>
    </Box>
  );
};

export default Dashboard;
