import React, { useState, useEffect, useContext } from 'react';
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
  Space,
  NumberInput,
  Divider
} from '@mantine/core';
import { IconEdit, IconTrash, IconPlus, IconSearch, IconAlertCircle, IconReceipt } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../context/userContext';
import {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation
} from '../../../utils/routes/reservations';
import { getAllGuests } from '../../../utils/routes/guests';
import { getRooms } from '../../../utils/routes/rooms';
import { createPayment, getPaymentsByReservationId, updatePayment, deletePayment } from '../../../utils/routes/payments';

export default function Reservations() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  
  // State management
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [opened, setOpened] = useState(false);
  const [currentReservation, setCurrentReservation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [guests, setGuests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [payment, setPayment] = useState(null);
  
  const [formValues, setFormValues] = useState({
    guest_id: '',
    user_id: user?.id || '',
    room_id: '',
    check_in: '',
    check_out: '',
    start_from: new Date().toISOString().split('T')[0],
    total_price: 0,
    status: 'Pending'
  });

  const [paymentForm, setPaymentForm] = useState({
    amount_paid: 0,
    payment_method: 'Cash',
    payment_date: new Date().toISOString().split('T')[0],
  });

  const statusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Confirmed', label: 'Confirmed' },
    { value: 'Cancelled', label: 'Cancelled' }
  ];

  const paymentMethodOptions = [
    { value: 'Cash', label: 'Cash' },
  ];


  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const results = reservations.filter(reservation =>
      reservation.guest_id?.toString().includes(searchTerm.toLowerCase()) ||
      reservation.room_id?.toString().includes(searchTerm.toLowerCase()) ||
      reservation.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredReservations(results);
  }, [searchTerm, reservations]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchReservations(),
        fetchGuests(),
        fetchRooms()
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
      setError("Failed to load initial data");
    } finally {
      setLoading(false);
    }
  };

  const fetchReservations = async () => {
    try {
      const data = await getAllReservations();
      setReservations(data);
      setFilteredReservations(data);
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setError('Failed to load reservations. Please try again.');
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/login');
      }
    }
  };

  const fetchGuests = async () => {
    try {
      const data = await getAllGuests();
      setGuests(data);
    } catch (err) {
      console.error('Error fetching guests:', err);
      setError('Failed to load guests. Please try again.');
    }
  };

  const fetchRooms = async () => {
    try {
      const data = await getRooms();
      setRooms(data);
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError('Failed to load rooms. Please try again.');
    }
  };

  const fetchPayment = async (reservationId) => {
    try {
      const data = await getPaymentsByReservationId(reservationId);
      if (data) {
        setPayment(data);
        setPaymentForm({
          amount_paid: data.amount_paid,
          payment_method: data.payment_method,
          payment_date: formatDateForInput(data.payment_date),
          status: data.status
        });
      } else {
        setPayment(null);
      }
    } catch (err) {
      console.error('Error fetching payment:', err);
      setPayment(null);
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateDaysBetweenDates = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const diffTime = Math.abs(new Date(checkOut) - new Date(checkIn));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleInputChange = (name, value) => {
    const updatedValues = {
      ...formValues,
      [name]: value
    };

    // Recalculate total price when room or dates change
    if (name === 'room_id' || name === 'check_in' || name === 'check_out') {
      const room = rooms.find(r => r.room_id === parseInt(updatedValues.room_id));
      const days = calculateDaysBetweenDates(updatedValues.check_in, updatedValues.check_out);
      
      if (room && days > 0) {
        updatedValues.total_price = (days * room.price).toFixed(2);
        setPaymentForm(prev => ({
          ...prev,
          amount_paid: (days * room.price).toFixed(2)
        }));
      } else {
        updatedValues.total_price = 0;
        setPaymentForm(prev => ({
          ...prev,
          amount_paid: 0
        }));
      }
    }

    setFormValues(updatedValues);
  };

  const handlePaymentInputChange = (name, value) => {
    setPaymentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Validate all required fields
      if (!formValues.guest_id || !formValues.room_id || 
          !formValues.check_in || !formValues.check_out || 
          !formValues.total_price || !formValues.status) {
        throw new Error('All fields are required');
      }

      // Validate dates
      if (new Date(formValues.check_out) <= new Date(formValues.check_in)) {
        throw new Error('Check-out date must be after check-in date');
      }

      let reservation;
      if (currentReservation) {
        // Update existing reservation
        reservation = await updateReservation(currentReservation.reservation_id, formValues);
        
        // Update payment if exists
        if (payment) {
          await updatePayment(payment.payment_id, {
            ...paymentForm,
            amount_paid: formValues.total_price
          });
        } else {
          // Create payment if doesn't exist
          await createPayment({
            reservation_id: currentReservation.reservation_id,
            amount_paid: formValues.total_price,
            payment_method: paymentForm.payment_method,
            payment_date: paymentForm.payment_date,
          });
        }
      } else {
        // Create new reservation
        reservation = await createReservation(formValues);
        
        // Create initial payment record
        await createPayment({
          reservation_id: reservation.reservation_id,
          amount_paid: formValues.total_price,
          payment_method: paymentForm.payment_method,
          payment_date: paymentForm.payment_date,
        });
      }
      
      setOpened(false);
      await fetchReservations();
    } catch (err) {
      console.error('Error saving reservation:', err);
      setError(err.message || 'Failed to save reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError(null);
    try {
      if (window.confirm('Are you sure you want to delete this reservation and its payment?')) {
        // First delete payment if exists
        const paymentToDelete = await getPaymentsByReservationId(id);
        if (paymentToDelete) {
          await deletePayment(paymentToDelete.payment_id);
        }
        
        // Then delete reservation
        await deleteReservation(id);
        await fetchReservations();
      }
    } catch (err) {
      console.error('Error deleting reservation:', err);
      setError(err.message || 'Failed to delete reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = async (reservation) => {
    setCurrentReservation(reservation);
    setFormValues({
      guest_id: reservation.guest_id,
      user_id: reservation.user_id,
      room_id: reservation.room_id,
      check_in: formatDateForInput(reservation.check_in),
      check_out: formatDateForInput(reservation.check_out),
      start_from: formatDateForInput(reservation.start_from),
      total_price: reservation.total_price,
      status: reservation.status
    });
    
    // Fetch payment data when opening modal
    await fetchPayment(reservation.reservation_id);
    setOpened(true);
  };

  const openCreateModal = () => {
    setCurrentReservation(null);
    setPayment(null);
    setFormValues({
      guest_id: '',
      user_id: user?.id || '',
      room_id: '',
      check_in: '',
      check_out: '',
      start_from: new Date().toISOString().split('T')[0],
      total_price: 0,
      status: 'Pending'
    });
    setPaymentForm({
      amount_paid: 0,
      payment_method: 'Cash',
      payment_date: new Date().toISOString().split('T')[0],
    });
    setOpened(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed': return 'green';
      case 'Pending': return 'yellow';
      case 'Cancelled': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="container">
      <Card withBorder shadow="sm" className="rounded-lg">
        <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <Title order={2} className="text-2xl font-bold text-gray-800">
            Reservation Management
          </Title>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <TextInput
              leftSection={<IconSearch size={16} />}
              placeholder="Search reservations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64"
            />
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={openCreateModal}
              className="bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              New Reservation
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reservation ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-In</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-Out</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReservations.map((reservation) => {
                const guest = guests.find(g => g.guest_id === reservation.guest_id);
                const room = rooms.find(r => r.room_id === reservation.room_id);
                const days = calculateDaysBetweenDates(reservation.check_in, reservation.check_out);
                
                return (
                  <tr key={reservation.reservation_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reservation.reservation_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Text size="sm" className="font-medium text-gray-900">
                        {guest ? guest.name : `Guest ID: ${reservation.guest_id}`}
                      </Text>
                      <Text size="xs" className="text-gray-500">
                        ID: {reservation.guest_id}
                      </Text>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {room ? (
                        <>
                          <Text size="sm" className="font-medium text-gray-900">
                            Room {room.room_number}
                          </Text>
                          <Text size="xs" className="text-gray-500">
                            {formatCurrency(room.price)}/night
                          </Text>
                        </>
                      ) : (
                        `ID: ${reservation.room_id}`
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateForInput(reservation.check_in)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateForInput(reservation.check_out)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Text size="sm" className="font-medium text-gray-900">
                        {formatCurrency(reservation.total_price)}
                      </Text>
                      <Text size="xs" className="text-gray-500">
                        {days} day(s)
                      </Text>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        color={getStatusBadge(reservation.status)}
                        variant="filled"
                        className="capitalize"
                      >
                        {reservation.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Group gap="xs" wrap="nowrap">
                        <ActionIcon
                          color="blue"
                          onClick={() => openEditModal(reservation)}
                          variant="light"
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon
                          color="red"
                          onClick={() => handleDelete(reservation.reservation_id)}
                          variant="light"
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          {filteredReservations.length === 0 && (
            <div className="text-center py-8">
              <Text size="lg" color="dimmed">
                {searchTerm ? 'No reservations match your search' : 'No reservations available'}
              </Text>
            </div>
          )}
        </div>
      </Card>

      {/* Reservation Modal */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={currentReservation ? "Edit Reservation" : "Create Reservation"}
        size="xl"
        overlayProps={{ blur: 3 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Guest"
            data={guests.map(guest => ({
              value: guest.guest_id.toString(),
              label: `${guest.name} (ID: ${guest.guest_id})`
            }))}
            value={formValues.guest_id?.toString() || ''}
            onChange={(value) => handleInputChange('guest_id', parseInt(value))}
            searchable
            required
            nothingFoundMessage="No guests found"
          />

          <Select
            label="Room"
            data={rooms.map(room => ({
              value: room.room_id.toString(),
              label: `Room ${room.room_number} (${room.room_type}, ${formatCurrency(room.price)}/night)`
            }))}
            value={formValues.room_id?.toString() || ''}
            onChange={(value) => handleInputChange('room_id', parseInt(value))}
            searchable
            required
            nothingFoundMessage="No rooms available"
          />

          <TextInput
            label="Check-In Date"
            type="date"
            value={formValues.check_in}
            onChange={(e) => handleInputChange('check_in', e.target.value)}
            required
            min={new Date().toISOString().split('T')[0]}
          />

          <TextInput
            label="Check-Out Date"
            type="date"
            value={formValues.check_out}
            onChange={(e) => handleInputChange('check_out', e.target.value)}
            required
            min={formValues.check_in || new Date().toISOString().split('T')[0]}
          />

          <TextInput
            label="Reservation Date"
            type="date"
            value={formValues.start_from}
            onChange={(e) => handleInputChange('start_from', e.target.value)}
            disabled
          />

          <TextInput
            label="Total Price"
            value={formatCurrency(formValues.total_price)}
            disabled
          />

          <div className="md:col-span-2">
            <Select
              label="Status"
              data={statusOptions}
              value={formValues.status}
              onChange={(value) => handleInputChange('status', value)}
              required
            />
          </div>

          {/* Payment Information Section */}
          <div className="md:col-span-2 space-y-4">
            <Divider my="md" />
            <Text size="lg" weight={500}>Payment Information</Text>
            
            <NumberInput
              label="Amount Paid"
              value={paymentForm.amount_paid}
              onChange={(value) => handlePaymentInputChange('amount_paid', value)}
              precision={2}
              min={0}
              required
            />

            <Select
              label="Payment Method"
              data={paymentMethodOptions}
              value={paymentForm.payment_method}
              onChange={(value) => handlePaymentInputChange('payment_method', value)}
              required
            />

            <TextInput
              label="Payment Date"
              type="date"
              value={paymentForm.payment_date}
              onChange={(e) => handlePaymentInputChange('payment_date', e.target.value)}
              required
            />
          </div>
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
            {currentReservation ? "Update Reservation" : "Create Reservation"}
          </Button>
        </Group>
      </Modal>
    </div>
  );
}