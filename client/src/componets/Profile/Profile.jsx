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
    <div className="container">
      <Card withBorder shadow="sm" className="rounded-lg">
        <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />

        <Title order={2} className="text-2xl font-bold text-gray-800 mb-6">
          User Profile
        </Title>

        {error && (
          <>
            <Alert
              icon={<IconAlertCircle size={18} />}
              title="Error"
              color="red"
              variant="outline"
              className="mb-4"
            >
              {error}
            </Alert>
            <Space h="md" />
          </>
        )}

        {success && (
          <>
            <Alert
              icon={<IconCheck size={18} />}
              title="Success"
              color="green"
              variant="outline"
              className="mb-4"
            >
              {success}
            </Alert>
            <Space h="md" />
          </>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <Text size="sm" c="dimmed">Name</Text>
            <Text size="lg">{profile.name}</Text>
          </div>
          <div>
            <Text size="sm" c="dimmed">Username</Text>
            <Text size="lg">{profile.username}</Text>
          </div>
          <div>
            <Text size="sm" c="dimmed">Role</Text>
            <Badge
              color={getRoleBadge(profile.role)}
              variant="filled"
              size="lg"
            >
              {profile.role}
            </Badge>
          </div>
          <div>
            <Text size="sm" c="dimmed">User ID</Text>
            <Text size="lg">{profile.user_id}</Text>
          </div>
        </div>

        <Group gap="sm" mt="xl">
          <Button
            onClick={openEditModal}
            leftSection={<IconEdit size={16} />}
            variant="light"
          >
            Edit Profile
          </Button>
          <Button
            onClick={handleLogout}
            variant="outline"
            color="gray"
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
          >
            Delete Account
          </Button>
        </Group>
      </Card>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Edit Profile"
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
          />



          <PasswordInput
            label="New Password (leave blank to keep current)"
            value={formValues.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
          />

          {formValues.password && (
            <PasswordInput
              label="Confirm New Password"
              value={formValues.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            />
          )}
        </div>

        {error && (
          <>
            <Space h="md" />
            <Alert
              icon={<IconAlertCircle size={18} />}
              title="Error"
              color="red"
              variant="outline"
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
            leftSection={<IconCheck size={16} />}
          >
            Save Changes
          </Button>
        </Group>
      </Modal>
    </div>
  );
}