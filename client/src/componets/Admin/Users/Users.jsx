// components/admin/users.jsx
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../../context/userContext';
import {
  Table,
  Button,
  Modal,
  TextInput,
  Select,
  Group,
  Text,
  Title,
  ActionIcon,
  Card,
  Alert,
  PasswordInput,
  Space,
  LoadingOverlay,
  Badge
} from '@mantine/core';
import { IconEdit, IconTrash, IconPlus, IconSearch, IconAlertCircle } from '@tabler/icons-react';
import { getUsers, deleteUser, updateUser, registerUser } from '../../../utils/routes/users';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [opened, setOpened] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user: loggedInUser } = useContext(UserContext);
  const [formValues, setFormValues] = useState({
    name: '',
    username: '',
    password: '',
    role: 'Cashier'
  });


  const roleOptions = ['Admin', 'Cashier'];

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const results = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name, value) => {
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      if (currentUser) {
        const updateData = {
          name: String(formValues.name),
          username: String(formValues.username),
          role: String(formValues.role)
        };
        if (formValues.password) {
          updateData.password = String(formValues.password);
        }
        const response = await updateUser(currentUser.user_id, updateData);
        if (response.error) {
          throw new Error(response.error);
        }
      } else {
        const createData = {
          name: String(formValues.name),
          username: String(formValues.username),
          password: String(formValues.password),
          role: String(formValues.role)
        };
        const response = await registerUser(createData);
        if (response.error) {
          throw new Error(response.error);
        }
      }
      setOpened(false);
      await fetchUsers();
    } catch (err) {
      console.error('Error saving user:', err);
      setError(err.message || 'Failed to save user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError(null);
    try {
      if (confirm('Are you sure you want to delete this user?')) {
        const response = await deleteUser(id);
        if (response.error) {
          throw new Error(response.error);
        }
        await fetchUsers();
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.message || 'Failed to delete user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (user) => {
    setCurrentUser(user);
    setFormValues({
      name: user.name,
      username: user.username,
      password: '',
      role: user.role
    });
    setOpened(true);
  };

  const openCreateModal = () => {
    setCurrentUser(null);
    setFormValues({
      name: '',
      username: '',
      password: '',
      role: 'cashier'
    });
    setOpened(true);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'red';
      case 'cashier': return 'blue';
      default: return 'gray';
    }
  };

  return (
    <div className="container">
      <Card withBorder shadow="sm" className="rounded-lg">
        <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <Title order={2} className="text-2xl font-bold text-gray-800">
            User Management
          </Title>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <TextInput
              leftSection={<IconSearch size={16} />}
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64"
            />
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={openCreateModal}
              className="bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Add User
            </Button>
          </div>
        </div>

        {error && (
          <>
            <Alert
              icon={<IconAlertCircle size={18} />}
              title="Error"
              color="red"
              variant="outline"
              className="mb-4"
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
            <Space h="md" />
          </>
        )}

        <div className="overflow-x-auto">
          <Table striped highlightOnHover className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.user_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.name} {user.user_id === loggedInUser.id && "(You)"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      color={getRoleColor(user.role)}
                      variant="filled"
                      className="capitalize"
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Group gap="xs" wrap="nowrap">
                      <ActionIcon
                        color="blue"
                        onClick={() => openEditModal(user)}
                        variant="light"
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon
                        color="red"
                        onClick={() => handleDelete(user.user_id)}
                        variant="light"
                        disabled={user.user_id === loggedInUser.id}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <Text size="lg" color="dimmed">
                {searchTerm ? 'No users match your search' : 'No users available'}
              </Text>
            </div>
          )}
        </div>
      </Card>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={currentUser ? "Edit User" : "Create User"}
        size="md"
        overlayProps={{ blur: 3 }}
      >
        <div className="grid grid-cols-1 gap-4">
          <TextInput
            label="Full Name"
            value={formValues.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
          />

          <TextInput
            label="Username"
            value={formValues.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            required
            disabled={currentUser !== null}
          />

          <PasswordInput
            label="Password"
            value={formValues.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            required={!currentUser}
            description={currentUser ? "Leave blank to keep current password" : ""}
          />
          <Select
            label="Role"
            data={roleOptions}
            value={formValues.role}
            onChange={(value) => handleInputChange('role', value)}
            required
            disabled={currentUser?.user_id === loggedInUser.id}
          />
        </div>

        {error && (
          <>
            <Space h="md" />
            <Alert
              icon={<IconAlertCircle size={18} />}
              title="Error"
              color="red"
              variant="outline"
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          </>
        )}

        <Group justify="flex-end" mt="xl">
          <Button
            onClick={() => setOpened(false)}
            variant="default"
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            loading={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {currentUser ? "Update User" : "Create User"}
          </Button>
        </Group>
      </Modal>
    </div>
  );
}