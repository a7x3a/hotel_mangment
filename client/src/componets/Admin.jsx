import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser } from '../utils/routes/users'; // Assuming these functions exist
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState(null);

  // Fetch all users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers(); // Assuming this fetches all users
        setUsers(usersData);
      } catch (error) {
        setError('Failed to load users');
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId); // Assuming this function deletes the user
      setUsers(users.filter(user => user.user_id !== userId)); // Remove the deleted user from the state
      setOpenDialog(false); // Close the dialog
    } catch (error) {
      setError('Failed to delete user');
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleOpenDialog = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard - Manage Users
      </Typography>

      {error && <Typography color="error">{error}</Typography>}

      {/* User Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.user_id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  {/* Actions for editing or deleting */}
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    onClick={() => handleOpenDialog(user)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Confirming Deletion */}
      {selectedUser && (
        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>Delete User</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              Are you sure you want to delete the user {selectedUser.name} ({selectedUser.username})?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={() => handleDelete(selectedUser.user_id)} color="secondary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default Admin;
