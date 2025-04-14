import React, { useState, useEffect, useContext } from 'react';
import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  Modal,
  TextInput,
  Select,
  LoadingOverlay,
  Alert,
  SimpleGrid,
  Table,
  Title,
  Container,
  Paper,
  Divider
} from '@mantine/core';
import Img from '../../assets/room.jpg'
import { getRooms } from '../../utils/routes/rooms';
import { createReservation } from '../../utils/routes/reservations';
import { getAllGuests } from '../../utils/routes/guests';
import { createPayment } from '../../utils/routes/payments';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch, IconCalendar, IconUser } from '@tabler/icons-react';
import { UserContext } from '../../context/userContext';

export default function CashierDashboard() {
  const { user } = useContext(UserContext);
  const [rooms, setRooms] = useState([]);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formValues, setFormValues] = useState({
    guest_id: '',
    user_id: user?.id || '',
    room_id: '',
    check_in: '',
    check_out: '',
    start_from: new Date().toISOString().split('T')[0],
    total_price: 0,
    status: 'Confirmed',
    payment_method: 'Cash'
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [roomsData, guestsData] = await Promise.all([
          getRooms(),
          getAllGuests()
        ]);
        setRooms(roomsData);
        setGuests(guestsData);
      } catch (err) {
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredRooms = rooms.filter(room =>
    room.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.room_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openReservationModal = (room) => {
    setSelectedRoom(room);
    setFormValues({
      guest_id: '',
      user_id: user?.id || '',
      room_id: room.room_id,
      check_in: '',
      check_out: '',
      start_from: new Date().toISOString().split('T')[0],
      total_price: 0,
      status: 'Confirmed',
      payment_method: 'Cash'
    });
    open();
  };

  const handleInputChange = (name, value) => {
    const updatedValues = {
      ...formValues,
      [name]: value
    };

    if ((name === 'check_in' || name === 'check_out') && selectedRoom) {
      const checkIn = new Date(updatedValues.check_in);
      const checkOut = new Date(updatedValues.check_out);
      
      if (checkOut > checkIn) {
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        updatedValues.total_price = nights * selectedRoom.price;
      } else {
        updatedValues.total_price = 0;
      }
    }

    setFormValues(updatedValues);
  };

  const handleReservation = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Validate all required fields
      if (!formValues.guest_id || !formValues.room_id || 
          !formValues.check_in || !formValues.check_out || 
          !formValues.total_price || !formValues.status) {
        throw new Error('All fields are required');
      }
  
      if (new Date(formValues.check_out) <= new Date(formValues.check_in)) {
        throw new Error('Check-out date must be after check-in date');
      }
  
      const reservationData = {
        guest_id: Number(formValues.guest_id),
        user_id: Number(formValues.user_id),
        room_id: Number(formValues.room_id),
        check_in: formValues.check_in,
        check_out: formValues.check_out,
        start_from: formValues.start_from,
        total_price: Number(formValues.total_price),
        status: formValues.status,
      };
  
      const reservation = await createReservation(reservationData);
      const reservationId = reservation.reservation_id || 
                           (reservation.reservation && reservation.reservation.reservation_id);
      if (!reservationId) throw new Error('Failed to get reservation ID');
      await createPayment({
        reservation_id: reservationId,
        amount_paid: reservationData.total_price,
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: 'Cash',
        status: 'Completed'
      });
  
      close();
      const data = await getRooms();
      setRooms(data);
    } catch (err) {
      console.error('Error:', err);
      setError(
        err.response?.data?.message === 'The room is already booked for this period!' 
          ? 'This room is already booked for the selected dates. Please choose different dates.'
          : err.message || 'Failed to create reservation. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div>
      <Paper withBorder className='p-5'>
        <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />

        <Group justify="space-between" mb="xl">
          <Title order={2}>Available Rooms</Title>
          <TextInput
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftSection={<IconSearch size={16} />}
            style={{ width: 300 }}
          />
        </Group>

        {error && (
          <Alert
            title="Error"
            color="red"
            variant="light"
            mb="md"
            withCloseButton
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {filteredRooms.map((room) => (
            <Card key={room.room_id} withBorder radius="md" shadow="sm">
              <Card.Section>
                <Image
                  src={Img || "https://img.freepik.com/free-photo/hotel-room_1203-1506.jpg"}
                  height={180}
                  alt={room.room_type}
                />
              </Card.Section>

              <Group justify="space-between" mt="md" mb="xs">
                <Text fw={500}>{room.room_type}</Text>
                <Badge color={room.status === 'Available' ? 'green' : 'red'}>
                  {room.status}
                </Badge>
              </Group>

              <Text size="sm" c="dimmed">Room #{room.room_number}</Text>

              <Group gap={8} mt="md" mb="xs">
                {room.features?.split(',').map((feature, index) => (
                  <Badge key={index} variant="light">
                    {feature.trim()}
                  </Badge>
                ))}
              </Group>

              <Group justify="space-between" mt="md">
                <div>
                  <Text fz="xl" fw={700}>
                    {formatPrice(room.price)}
                  </Text>
                  <Text fz="sm" c="dimmed">
                    per night
                  </Text>
                </div>
                
                <Button 
                  radius="md" 
                  onClick={() => openReservationModal(room)}
                  disabled={room.status !== 'Available'}
                  style={{ 
                    opacity: room.status === 'Available' ? 1 : 0.6,
                    transition: 'opacity 0.2s'
                  }}
                >
                  Book Now
                </Button>
              </Group>
            </Card>
          ))}
        </SimpleGrid>

        {filteredRooms.length === 0 && (
          <div className="text-center py-8">
            <Text size="lg" color="dimmed">
              {searchTerm ? 'No rooms match your search' : 'No rooms available'}
            </Text>
          </div>
        )}
      </Paper>

      <Modal 
        opened={opened} 
        onClose={close}
        title={`Reserve Room #${selectedRoom?.room_number}`}
        size="md"
        overlayProps={{ blur: 3 }}
      >
        <div className="space-y-4">
          <Select
            label="Select Guest"
            data={guests.map(guest => ({
              value: guest.guest_id.toString(),
              label: `${guest.name} (${guest.phone})`
            }))}
            value={formValues.guest_id}
            onChange={(value) => handleInputChange('guest_id', value)}
            searchable
            placeholder="Select guest"
            leftSection={<IconUser size={16} />}
            required
          />

          <Divider my="md" />

          <TextInput
            label="Check-In Date"
            type="date"
            value={formValues.check_in}
            onChange={(e) => handleInputChange('check_in', e.target.value)}
            required
            min={new Date().toISOString().split('T')[0]}
            leftSection={<IconCalendar size={16} />}
          />

          <TextInput
            label="Check-Out Date"
            type="date"
            value={formValues.check_out}
            onChange={(e) => handleInputChange('check_out', e.target.value)}
            required
            min={formValues.check_in || new Date().toISOString().split('T')[0]}
            leftSection={<IconCalendar size={16} />}
          />

          <TextInput
            label="Payment Method"
            value="Cash"
            readOnly
            disabled
          />

          {formValues.check_in && formValues.check_out && selectedRoom && (
            <Table withTableBorder withColumnBorders mt="md">
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td>Room Price</Table.Td>
                  <Table.Td>{formatPrice(selectedRoom.price)}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Nights</Table.Td>
                  <Table.Td>
                    {Math.ceil(
                      (new Date(formValues.check_out) - new Date(formValues.check_in)) / 
                      (1000 * 60 * 60 * 24)
                    )}
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td fw={600}>Total</Table.Td>
                  <Table.Td fw={600}>
                    {formatPrice(formValues.total_price)}
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          )}

          {error && (
            <Alert
              title="Error"
              color="red"
              variant="light"
              withCloseButton
              onClose={() => setError(null)}
              mt="md"
            >
              {error}
            </Alert>
          )}

          <Group justify="flex-end" mt="xl">
            <Button
              onClick={close}
              variant="default"
            >
              Cancel
            </Button>
            <Button
              onClick={handleReservation}
              loading={loading}
              disabled={!formValues.guest_id || !formValues.check_in || !formValues.check_out}
            >
              Confirm Reservation
            </Button>
          </Group>
        </div>
      </Modal>
    </div>
  );
}