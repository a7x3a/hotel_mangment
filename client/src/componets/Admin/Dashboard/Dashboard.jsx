// components/admin/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import {
  Card,
  Group,
  Text,
  Title,
  Badge,
  LoadingOverlay,
  RingProgress,
  Center
} from '@mantine/core';
import { IconBed, IconUser, IconCalendar, IconCash, IconReceipt  } from '@tabler/icons-react';
import { getAllReservations } from '../../../utils/routes/reservations';
import { getUsers } from '../../../utils/routes/users';
import { getRooms } from '../../../utils/routes/rooms';
import { getAllPayments } from '../../../utils/routes/payments';

const StatCard = ({ icon, title, value, description, color }) => {
  const colorMap = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    orange: 'bg-orange-600',
    red: 'bg-red-600',
    teal: 'bg-teal-600',
    yellow: 'bg-yellow-600'
  };

  return (
    <Card withBorder shadow="sm" p="lg" radius="md" className="h-full">
      <Group>
        <Center className={`${colorMap[color]} rounded-md text-white w-12 h-12`}>
          {icon}
        </Center>
        <div>
          <Text color="dimmed" size="sm" transform="uppercase" weight={700}>
            {title}
          </Text>
          <Text size="xl" weight={700}>
            {value}
          </Text>
          <Text size="xs" color="dimmed">
            {description}
          </Text>
        </div>
      </Group>
    </Card>
  );
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    roomTypes: {},
    totalCashiers: 0,
    totalReservations: 0,
    totalPayments: 0,
    totalRevenue: 0,
    outstandingBalance: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [rooms, reservations, users, payments] = await Promise.all([
          getRooms(),
          getAllReservations(),
          getUsers(),
          getAllPayments()
        ]);

        const available = rooms.filter(r => r.status === 'Available').length;
        const occupied = rooms.filter(r => r.status === 'Occupied').length;

        const types = {};
        rooms.forEach(room => {
          types[room.room_type] = (types[room.room_type] || 0) + 1;
        });

        const cashiers = users.filter(user => user.role === 'Cashier').length;
        const totalRevenue = payments.reduce((sum, payment) => {
          const amount = Number(payment.amount_paid) || 0;
          return sum + amount;
        }, 0);
        setStats({
          totalRooms: rooms.length,
          availableRooms: available,
          occupiedRooms: occupied,
          roomTypes: types,
          totalCashiers: cashiers,
          totalReservations: reservations.length,
          totalPayments: payments.length,
          totalRevenue: totalRevenue,
          paymentRecords: payments.length
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="relative p-8">
      <LoadingOverlay visible={loading} />

      <Title order={2} className="pb-8">Admin Dashboard</Title>
      <hr className='mb-8' />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={<IconBed size={24} />}
          title="Total Rooms"
          value={stats.totalRooms}
          description={`${stats.availableRooms} available`}
          color="blue"
        />

        <StatCard
          icon={<IconUser size={24} />}
          title="Cashiers"
          value={stats.totalCashiers}
          description="Active staff"
          color="green"
        />

        <StatCard
          icon={<IconCalendar size={24} />}
          title="Bookings"
          value={stats.totalReservations}
          description="Total reservations"
          color="orange"
        />

        <StatCard
          icon={<IconBed size={24} />}
          title="Occupied Rooms"
          value={stats.occupiedRooms}
          description={`${Math.round((stats.occupiedRooms / stats.totalRooms) * 100)}% occupancy`}
          color="red"
        />

        <StatCard
          icon={<IconCash size={24} />}
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          description="All payments"
          color="teal"
        />

        <StatCard
          icon={<IconReceipt size={24} />}
          title="Payment Records"
          value={stats.paymentRecords}
          description="Total transactions"
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card withBorder p="lg" radius="md">
          <Text size="lg" weight={500} className="mb-4">Room Types</Text>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats.roomTypes).map(([type, count]) => (
              <Badge
                key={type}
                variant="filled"
                size="lg"
                className="mb-2"
              >
                {type}: {count}
              </Badge>
            ))}
          </div>
        </Card>

        <Card withBorder p="lg" radius="md">
          <Text size="lg" weight={500} className="mb-4">Occupancy Rate</Text>
          <Center>
            <RingProgress
              size={160}
              thickness={12}
              roundCaps
              sections={[
                {
                  value: stats.totalRooms > 0
                    ? Math.round((stats.occupiedRooms / stats.totalRooms) * 100)
                    : 0,
                  color: 'red'
                }
              ]}
              label={
                <Text color="red" weight={700} align="center" size="xl">
                  {stats.totalRooms > 0
                    ? `${Math.round((stats.occupiedRooms / stats.totalRooms) * 100)}%`
                    : '0%'}
                </Text>
              }
            />
          </Center>
        </Card>
      </div>
    </div>
  );
}