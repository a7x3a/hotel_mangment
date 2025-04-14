import React, { useState, useEffect } from 'react';
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
  LoadingOverlay,
  Badge,
  Space
} from '@mantine/core';
import { IconEdit, IconTrash, IconPlus, IconSearch, IconAlertCircle } from '@tabler/icons-react';
import {
  getAllGuests,
  getGuestById,
  createGuest,
  updateGuest,
  deleteGuest
} from '../../../utils/routes/guests';

export default function Guests() {
  const [guests, setGuests] = useState([]);
  const [filteredGuests, setFilteredGuests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [opened, setOpened] = useState(false);
  const [currentGuest, setCurrentGuest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formValues, setFormValues] = useState({
    name: '',
    phone: '',
    document_type: 'ID Card',
    document_number: ''
  });

  const documentTypeOptions = ['ID Card', 'SSN'];

  useEffect(() => {
    fetchGuests();
  }, []);

  useEffect(() => {
    const results = guests.filter(guest =>
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.document_number.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredGuests(results);
  }, [searchTerm, guests]);

  const fetchGuests = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllGuests();
      setGuests(data);
      setFilteredGuests(data);
    } catch (err) {
      console.error('Error fetching guests:', err);
      setError('Failed to load guests. Please try again.');
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
      if (currentGuest) {
        await updateGuest(currentGuest.guest_id, formValues);
      } else {
        await createGuest(formValues);
      }
      setOpened(false);
      await fetchGuests();
    } catch (err) {
      console.error('Error saving guest:', err);
      setError(err.message || 'Failed to save guest. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError(null);
    try {
      if (confirm('Are you sure you want to delete this guest?')) {
        await deleteGuest(id);
        await fetchGuests();
      }
    } catch (err) {
      console.error('Error deleting guest:', err);
      setError(err.message || 'Failed to delete guest. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (guest) => {
    setCurrentGuest(guest);
    setFormValues({
      name: guest.name,
      phone: guest.phone,
      document_type: guest.document_type,
      document_number: guest.document_number
    });
    setOpened(true);
  };

  const openCreateModal = () => {
    setCurrentGuest(null);
    setFormValues({
      name: '',
      phone: '',
      document_type: 'ID Card',
      document_number: ''
    });
    setOpened(true);
  };

  const getDocumentBadge = (type) => {
    switch (type) {
      case 'ID Card': return 'blue';
      case 'SSN': return 'green';
      default: return 'gray';
    }
  };

  return (
    <div>
      <Card withBorder shadow="sm" className="rounded-lg">
        <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <Title order={2} className="text-2xl font-bold text-gray-800">
            Guest Management
          </Title>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <TextInput
              leftSection={<IconSearch size={16} />}
              placeholder="Search guests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64"
            />
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={openCreateModal}
              className="bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Add Guest
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGuests.map((guest) => (
                <tr key={guest.guest_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {guest.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {guest.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Badge
                      color={getDocumentBadge(guest.document_type)}
                      variant="filled"
                    >
                      {guest.document_type}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {guest.document_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Group gap="xs" wrap="nowrap">
                      <ActionIcon
                        color="blue"
                        onClick={() => openEditModal(guest)}
                        variant="light"
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon
                        color="red"
                        onClick={() => handleDelete(guest.guest_id)}
                        variant="light"
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {filteredGuests.length === 0 && (
            <div className="text-center py-8">
              <Text size="lg" color="dimmed">
                {searchTerm ? 'No guests match your search' : 'No guests available'}
              </Text>
            </div>
          )}
        </div>
      </Card>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={currentGuest ? "Edit Guest" : "Create Guest"}
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
            label="Phone Number"
            value={formValues.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            required
          />

          <Select
            label="Document Type"
            data={documentTypeOptions}
            value={formValues.document_type}
            onChange={(value) => handleInputChange('document_type', value)}
            required
          />

          <TextInput
            label="Document Number"
            value={formValues.document_number}
            onChange={(e) => handleInputChange('document_number', e.target.value)}
            required
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
            {currentGuest ? "Update Guest" : "Create Guest"}
          </Button>
        </Group>
      </Modal>
    </div>
  );
}