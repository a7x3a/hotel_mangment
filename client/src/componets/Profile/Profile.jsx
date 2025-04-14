import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  TextInput,
  Select,
  Button,
  Text,
  Title,
  Group,
  ActionIcon,
  Alert,
  LoadingOverlay,
  Badge,
  Space,
  Modal,
  PasswordInput
} from '@mantine/core';
import { IconEdit, IconTrash, IconAlertCircle, IconCheck, IconX } from '@tabler/icons-react';
import { UserContext } from '../../context/userContext';
import { getUser, updateUser, deleteUser, logoutUser } from '../../utils/routes/users';

export default function Profile() {
  const { user, setUser, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formValues, setFormValues] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const roleOptions = ['Admin', 'Cashier'];

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await getUser(user.id || user.user_id);
        setProfile(response);
        setFormValues({
          name: response.name,
          username: response.username,
          password: '',
          confirmPassword: ''
        });
      } catch (err) {
        setError(err.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleInputChange = (name, value) => {
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    if (formValues.password && formValues.password !== formValues.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        name: formValues.name,
        username: formValues.username,
        ...(formValues.password && { password: formValues.password })
      };
      const response = await updateUser(user.id || user.user_id, userData);
      setProfile(response.user);
      setUser(response.user); 
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
      setOpened(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await deleteUser(user.id);
      await logoutUser();
      logout();
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      logout(); // Use context logout
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Failed to logout');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = () => {
    setFormValues({
      name: profile.name,
      username: profile.username,
      password: '',
      confirmPassword: ''
    });
    setOpened(true);
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'Admin': return 'red';
      case 'Cashier': return 'blue';
      default: return 'gray';
    }
  };

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingOverlay visible={true} overlayProps={{ blur: 2 }} />
      </div>
    );
  }

  return (
<div className="max-w-4xl mx-auto p-4">
  <Card 
    withBorder 
    shadow="sm" 
    className="rounded-xl min-h-[calc(100dvh-2rem)] flex flex-col"
    padding="lg"
  >
    <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />

    <div className="flex-1 flex flex-col">
      <div className="text-center mb-8">
        <Title order={2} className="text-3xl font-bold text-gray-800">
          User Profile
        </Title>
        <Text c="dimmed" className="mt-2">Manage your account information</Text>
      </div>

      {error && (
        <Alert
          icon={<IconAlertCircle size={18} />}
          title="Error"
          color="red"
          variant="light"
          className="mb-6"
          withCloseButton
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          icon={<IconCheck size={18} />}
          title="Success"
          color="teal"
          variant="light"
          className="mb-6"
          withCloseButton
          onClose={() => setSuccess('')}
        >
          {success}
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <Text size="sm" c="dimmed" className="mb-1">Name</Text>
          <Text size="lg" fw={500}>{profile.name}</Text>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <Text size="sm" c="dimmed" className="mb-1">Username</Text>
          <Text size="lg" fw={500}>{profile.username}</Text>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <Text size="sm" c="dimmed" className="mb-1">Role</Text>
          <Badge
            color={getRoleBadge(profile.role)}
            variant="light"
            size="lg"
            radius="sm"
            className="text-sm"
          >
            {profile.role}
          </Badge>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <Text size="sm" c="dimmed" className="mb-1">User ID</Text>
          <Text size="lg" fw={500} className="font-mono">{profile.user_id}</Text>
        </div>
      </div>

      <div className="mt-auto">
        <Group justify="center" gap="md" grow className="flex-col sm:flex-row">
          <Button
            onClick={openEditModal}
            leftSection={<IconEdit size={16} />}
            variant="light"
            size="md"
            className="hover:bg-blue-50"
          >
            Edit Profile
          </Button>
          <Button
            onClick={handleLogout}
            variant="outline"
            color="gray"
            size="md"
          >
            Logout
          </Button>
          <Button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                handleDeleteAccount();
              }
            }}
            leftSection={<IconTrash size={16} />}
            variant="outline"
            color="red"
            size="md"
          >
            Delete Account
          </Button>
        </Group>
      </div>
    </div>
  </Card>

  <Modal
    opened={opened}
    onClose={() => setOpened(false)}
    title={<Text fw={600} size="lg">Edit Profile</Text>}
    size="md"
    overlayProps={{ blur: 3 }}
    radius="md"
  >
    <div className="space-y-4">
      <TextInput
        label="Full Name"
        value={formValues.name}
        onChange={(e) => handleInputChange('name', e.target.value)}
        required
        radius="md"
        size="md"
      />

      <TextInput
        label="Username"
        value={formValues.username}
        onChange={(e) => handleInputChange('username', e.target.value)}
        required
        radius="md"
        size="md"
      />

      <PasswordInput
        label="New Password (leave blank to keep current)"
        value={formValues.password}
        onChange={(e) => handleInputChange('password', e.target.value)}
        radius="md"
        size="md"
      />

      {formValues.password && (
        <PasswordInput
          label="Confirm New Password"
          value={formValues.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          radius="md"
          size="md"
        />
      )}
    </div>

    {error && (
      <Alert
        icon={<IconAlertCircle size={18} />}
        title="Error"
        color="red"
        variant="light"
        className="mt-4"
        withCloseButton
        onClose={() => setError('')}
      >
        {error}
      </Alert>
    )}

    <Group justify="flex-end" mt="xl" gap="sm">
      <Button
        onClick={() => setOpened(false)}
        variant="default"
        radius="md"
        size="md"
      >
        Cancel
      </Button>
      <Button
        onClick={handleSubmit}
        loading={loading}
        leftSection={!loading && <IconCheck size={16} />}
        radius="md"
        size="md"
        className="bg-blue-600 hover:bg-blue-700"
      >
        Save Changes
      </Button>
    </Group>
  </Modal>
</div>
  );
}