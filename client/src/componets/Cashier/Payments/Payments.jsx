import React, { useState, useEffect } from 'react';
import {
  Table,
  TextInput,
  Group,
  Text,
  Title,
  Card,
  Alert,
  LoadingOverlay,
  Badge,
} from '@mantine/core';
import { IconSearch, IconAlertCircle, IconReceipt } from '@tabler/icons-react';
import { getAllPayments } from '../../../utils/routes/payments';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalPayments: 0,
    totalAmount: 0,
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    const results = payments.filter((payment) => {
      const reservationId = payment.reservation_id?.toString() || '';
      const paymentMethod = payment.payment_method?.toLowerCase() || '';
      const status = payment.status?.toLowerCase() || '';
      const search = searchTerm.toLowerCase();

      return (
        reservationId.includes(searchTerm) ||
        paymentMethod.includes(search) ||
        status.includes(search)
      );
    });
    setFilteredPayments(results);
  }, [searchTerm, payments]);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllPayments();
      setPayments(data);
      setFilteredPayments(data);

      // Calculate stats
      const total = data.reduce((sum, payment) => sum + (parseFloat(payment.amount_paid) || 0), 0);
      setStats({
        totalPayments: data.length,
        totalAmount: total,
      });
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('Failed to load payments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return 'green';
      case 'Pending':
        return 'yellow';
      case 'Failed':
        return 'red';
      case 'Refunded':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div>
      <Card withBorder shadow="sm" className="rounded-xl">
        <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <Title order={2} className="text-2xl font-bold text-gray-800">
              Payment Records
            </Title>
            <Text c="dimmed" className="mt-1">
              {stats.totalPayments} records • Total: {formatCurrency(stats.totalAmount)}
            </Text>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <TextInput
              leftSection={<IconSearch size={16} />}
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64"
            />
          </div>
        </div>

        {error && (
          <Alert
            icon={<IconAlertCircle size={18} />}
            title="Error"
            color="red"
            variant="light"
            className="mb-4"
            withCloseButton
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        <div className="overflow-x-auto">
          <Table striped highlightOnHover className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reservation ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.payment_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{payment.reservation_id || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {formatCurrency(payment.amount_paid || 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.payment_date
                      ? new Date(payment.payment_date).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Badge variant="light" color="blue">
                      Cash
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Badge
                      color={getStatusBadge('Completed')}
                      variant="light"
                    >
                      Completed
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <div className="flex flex-col items-center justify-center">
                <IconReceipt size={48} className="text-gray-400 mb-4" />
                <Text size="lg" color="dimmed">
                  {searchTerm ? 'No payments match your search' : 'No payment records available'}
                </Text>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}