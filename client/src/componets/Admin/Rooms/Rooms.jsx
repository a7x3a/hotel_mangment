// components/admin/rooms.jsx
import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  TextInput,
  Select,
  NumberInput,
  Group,
  Text,
  Title,
  ActionIcon,
  Box,
  Badge,
  LoadingOverlay,
  Card,
  Alert,
  Space
} from '@mantine/core';
import { IconEdit, IconTrash, IconPlus, IconSearch, IconAlertCircle } from '@tabler/icons-react';
import { getRooms, createRoom, updateRoom, deleteRoom } from '../../../utils/routes/rooms';

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [opened, setOpened] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formValues, setFormValues] = useState({
    room_number: '',
    room_type: 'Single',
    price: 0,
    status: 'Available',
  });

  // Room type and status options based on your DB schema
  const roomTypeOptions = ['Single', 'Double', 'Suite'];
  const roomStatusOptions = ['Available', 'Reserved', 'Occupied'];

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    const results = rooms.filter(room =>
      room.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.room_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRooms(results);
  }, [searchTerm, rooms]);

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRooms();
      setRooms(data);
      setFilteredRooms(data);
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError('Failed to load rooms. Please try again.');
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
      if (currentRoom) {
        await updateRoom(currentRoom.room_id, formValues);
      } else {
        await createRoom(formValues);
      }
      setOpened(false);
      await fetchRooms();
    } catch (err) {
      console.error('Error saving room:', err);
      setError(err.message || 'Failed to save room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteRoom(id);
      await fetchRooms();
    } catch (err) {
      console.error('Error deleting room:', err);
      setError('Failed to delete room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (room) => {
    setCurrentRoom(room);
    setFormValues({
      room_number: room.room_number,
      room_type: room.room_type,
      price: parseFloat(room.price),
      status: room.status
    });
    setOpened(true);
  };

  const openCreateModal = () => {
    setCurrentRoom(null);
    setFormValues({
      room_number: '',
      room_type: 'Single',
      price: 0,
      status: 'Available'
    });
    setOpened(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'green';
      case 'Reserved': return 'blue';
      case 'Occupied': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="container mx-auto ">
      <Card withBorder shadow="sm" className="rounded-lg">
        <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <Title order={2} className="text-2xl font-bold text-gray-800">
            Room Management
          </Title>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <TextInput
              icon={<IconSearch size={16} />}
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64"
            />
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={openCreateModal}
              className="bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Add Room
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRooms.map((room) => (
                <tr key={room.room_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {room.room_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {room.room_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${parseFloat(room.price).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      color={getStatusColor(room.status)}
                      variant="filled"
                      className="capitalize"
                    >
                      {room.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Group spacing="xs" >
                      <ActionIcon
                        color="blue"
                        onClick={() => openEditModal(room)}
                        variant="light"
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon
                        color="red"
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete room ${room.room_number}?`)) {
                            handleDelete(room.room_id);
                          }
                        }}
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

          {filteredRooms.length === 0 && (
            <div className="text-center py-8">
              <Text size="lg" color="dimmed">
                {searchTerm ? 'No rooms match your search' : 'No rooms available'}
              </Text>
            </div>
          )}
        </div>
      </Card>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={currentRoom ? "Edit Room" : "Create Room"}
        size="md"
        overlayProps={{ blur: 2 }}
      >
        <div className="grid grid-cols-1 gap-4">
          <TextInput
            label="Room Number"
            value={formValues.room_number}
            onChange={(e) => handleInputChange('room_number', e.target.value)}
            required
            maxLength={10}
            description="Maximum 10 characters"
          />

          <Select
            label="Room Type"
            data={roomTypeOptions}
            value={formValues.room_type}
            onChange={(value) => handleInputChange('room_type', value)}
            required
          />

          <NumberInput
            label="Price"
            value={formValues.price}
            onChange={(value) => handleInputChange('price', value)}
            min={0}
            precision={2}
            required
            icon="$"
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            formatter={(value) =>
              !Number.isNaN(parseFloat(value))
                ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : '$ '
            }
          />


          <Select
            label="Status"
            data={roomStatusOptions}
            value={formValues.status}
            onChange={(value) => handleInputChange('status', value)}
            required
            styles={{ input: { whiteSpace: 'normal' }, root: { minWidth: 200 } }}
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

        <Group position="right" mt="xl">
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
            {currentRoom ? "Update Room" : "Create Room"}
          </Button>
        </Group>
      </Modal>
    </div>
  );
}