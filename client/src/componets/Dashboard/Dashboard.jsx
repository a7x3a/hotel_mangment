import { IconGasStation, IconGauge, IconManualGearbox, IconUsers } from '@tabler/icons-react';
import { Badge, Button, Card, Center, Group, Image, Text } from '@mantine/core';
import classes from './FeaturesCard.module.css';

const mockdata = [
  { label: '4 passengers', icon: IconUsers },
  { label: '100 km/h in 4 seconds', icon: IconGauge },
  { label: 'Automatic gearbox', icon: IconManualGearbox },
  { label: 'Electric', icon: IconGasStation },
];

export default function Dashboard() {
  const features = mockdata.map((feature) => (
    <Center key={feature.label}>
      <feature.icon size={16} className={classes.icon} stroke={1.5} />
      <Text size="xs">{feature.label}</Text>
    </Center>
  ));

  return (
    <div className='h-fit grid sm:grid-cols-2 grid-rows-1 gap-2 p-4'> 
     <Card withBorder radius="md" className={classes.card}>
  <Card.Section className={classes.imageSection}>
    <Image src="https://img.freepik.com/free-photo/room-interior-hotel-bedroom_23-2150683419.jpg?t=st=1744066527~exp=1744070127~hmac=124fc2cc62794e1f3d39d01e6919ac7d6d0d50df8202b695bb56813f36ee175a&w=1380" alt="Luxury Hotel Room" />
  </Card.Section>

  <Group justify="space-between" mt="md">
    <div>
      <Text fw={500}>Deluxe King Room</Text>
      <Text fz="xs" c="dimmed">
        Room ID: #305
      </Text>
    </div>
    <Badge variant="outline">15% off</Badge>
  </Group>

  <Card.Section className={classes.section} mt="md">
    <Text fz="sm" c="dimmed" className={classes.label}>
      Room features
    </Text>

    <Group gap={8} mb={-8}>
      <Badge variant="light">King Bed</Badge>
      <Badge variant="light">Ocean View</Badge>
      <Badge variant="light">Free WiFi</Badge>
    </Group>
  </Card.Section>

  <Card.Section className={classes.section}>
    <Group gap={30}>
      <div>
        <Text fz="xl" fw={700} style={{ lineHeight: 1 }}>
          $249.00
        </Text>
        <Text fz="sm" c="dimmed" fw={500} style={{ lineHeight: 1 }} mt={3}>
          per night
        </Text>
      </div>

      <Button radius="xl" style={{ flex: 1 }}>
        Book now
      </Button>
    </Group>
  </Card.Section>
</Card>
<Card withBorder radius="md" className={classes.card}>
  <Card.Section className={classes.imageSection}>
    <Image src="https://img.freepik.com/free-photo/room-interior-hotel-bedroom_23-2150683419.jpg?t=st=1744066527~exp=1744070127~hmac=124fc2cc62794e1f3d39d01e6919ac7d6d0d50df8202b695bb56813f36ee175a&w=1380" alt="Luxury Hotel Room" />
  </Card.Section>

  <Group justify="space-between" mt="md">
    <div>
      <Text fw={500}>Deluxe King Room</Text>
      <Text fz="xs" c="dimmed">
        Room ID: #305
      </Text>
    </div>
    <Badge variant="outline">15% off</Badge>
  </Group>

  <Card.Section className={classes.section} mt="md">
    <Text fz="sm" c="dimmed" className={classes.label}>
      Room features
    </Text>

    <Group gap={8} mb={-8}>
      <Badge variant="light">King Bed</Badge>
      <Badge variant="light">Ocean View</Badge>
      <Badge variant="light">Free WiFi</Badge>
    </Group>
  </Card.Section>

  <Card.Section className={classes.section}>
    <Group gap={30}>
      <div>
        <Text fz="xl" fw={700} style={{ lineHeight: 1 }}>
          $249.00
        </Text>
        <Text fz="sm" c="dimmed" fw={500} style={{ lineHeight: 1 }} mt={3}>
          per night
        </Text>
      </div>

      <Button radius="xl" style={{ flex: 1 }}>
        Book now
      </Button>
    </Group>
  </Card.Section>
</Card>
<Card withBorder radius="md" className={classes.card}>
  <Card.Section className={classes.imageSection}>
    <Image src="https://img.freepik.com/free-photo/room-interior-hotel-bedroom_23-2150683419.jpg?t=st=1744066527~exp=1744070127~hmac=124fc2cc62794e1f3d39d01e6919ac7d6d0d50df8202b695bb56813f36ee175a&w=1380" alt="Luxury Hotel Room" />
  </Card.Section>

  <Group justify="space-between" mt="md">
    <div>
      <Text fw={500}>Deluxe King Room</Text>
      <Text fz="xs" c="dimmed">
        Room ID: #305
      </Text>
    </div>
    <Badge variant="outline">15% off</Badge>
  </Group>

  <Card.Section className={classes.section} mt="md">
    <Text fz="sm" c="dimmed" className={classes.label}>
      Room features
    </Text>

    <Group gap={8} mb={-8}>
      <Badge variant="light">King Bed</Badge>
      <Badge variant="light">Ocean View</Badge>
      <Badge variant="light">Free WiFi</Badge>
    </Group>
  </Card.Section>

  <Card.Section className={classes.section}>
    <Group gap={30}>
      <div>
        <Text fz="xl" fw={700} style={{ lineHeight: 1 }}>
          $249.00
        </Text>
        <Text fz="sm" c="dimmed" fw={500} style={{ lineHeight: 1 }} mt={3}>
          per night
        </Text>
      </div>

      <Button radius="xl" style={{ flex: 1 }}>
        Book now
      </Button>
    </Group>
  </Card.Section>
</Card>
<Card withBorder radius="md" className={classes.card}>
  <Card.Section className={classes.imageSection}>
    <Image src="https://img.freepik.com/free-photo/room-interior-hotel-bedroom_23-2150683419.jpg?t=st=1744066527~exp=1744070127~hmac=124fc2cc62794e1f3d39d01e6919ac7d6d0d50df8202b695bb56813f36ee175a&w=1380" alt="Luxury Hotel Room" />
  </Card.Section>

  <Group justify="space-between" mt="md">
    <div>
      <Text fw={500}>Deluxe King Room</Text>
      <Text fz="xs" c="dimmed">
        Room ID: #305
      </Text>
    </div>
    <Badge variant="outline">15% off</Badge>
  </Group>

  <Card.Section className={classes.section} mt="md">
    <Text fz="sm" c="dimmed" className={classes.label}>
      Room features
    </Text>

    <Group gap={8} mb={-8}>
      <Badge variant="light">King Bed</Badge>
      <Badge variant="light">Ocean View</Badge>
      <Badge variant="light">Free WiFi</Badge>
    </Group>
  </Card.Section>

  <Card.Section className={classes.section}>
    <Group gap={30}>
      <div>
        <Text fz="xl" fw={700} style={{ lineHeight: 1 }}>
          $249.00
        </Text>
        <Text fz="sm" c="dimmed" fw={500} style={{ lineHeight: 1 }} mt={3}>
          per night
        </Text>
      </div>

      <Button radius="xl" style={{ flex: 1 }}>
        Book now
      </Button>
    </Group>
  </Card.Section>
</Card>
<Card withBorder radius="md" className={classes.card}>
  <Card.Section className={classes.imageSection}>
    <Image src="https://img.freepik.com/free-photo/room-interior-hotel-bedroom_23-2150683419.jpg?t=st=1744066527~exp=1744070127~hmac=124fc2cc62794e1f3d39d01e6919ac7d6d0d50df8202b695bb56813f36ee175a&w=1380" alt="Luxury Hotel Room" />
  </Card.Section>

  <Group justify="space-between" mt="md">
    <div>
      <Text fw={500}>Deluxe King Room</Text>
      <Text fz="xs" c="dimmed">
        Room ID: #305
      </Text>
    </div>
    <Badge variant="outline">15% off</Badge>
  </Group>

  <Card.Section className={classes.section} mt="md">
    <Text fz="sm" c="dimmed" className={classes.label}>
      Room features
    </Text>

    <Group gap={8} mb={-8}>
      <Badge variant="light">King Bed</Badge>
      <Badge variant="light">Ocean View</Badge>
      <Badge variant="light">Free WiFi</Badge>
    </Group>
  </Card.Section>

  <Card.Section className={classes.section}>
    <Group gap={30}>
      <div>
        <Text fz="xl" fw={700} style={{ lineHeight: 1 }}>
          $249.00
        </Text>
        <Text fz="sm" c="dimmed" fw={500} style={{ lineHeight: 1 }} mt={3}>
          per night
        </Text>
      </div>

      <Button radius="xl" style={{ flex: 1 }}>
        Book now
      </Button>
    </Group>
  </Card.Section>
</Card>
<Card withBorder radius="md" className={classes.card}>
  <Card.Section className={classes.imageSection}>
    <Image src="https://img.freepik.com/free-photo/room-interior-hotel-bedroom_23-2150683419.jpg?t=st=1744066527~exp=1744070127~hmac=124fc2cc62794e1f3d39d01e6919ac7d6d0d50df8202b695bb56813f36ee175a&w=1380" alt="Luxury Hotel Room" />
  </Card.Section>

  <Group justify="space-between" mt="md">
    <div>
      <Text fw={500}>Deluxe King Room</Text>
      <Text fz="xs" c="dimmed">
        Room ID: #305
      </Text>
    </div>
    <Badge variant="outline">15% off</Badge>
  </Group>

  <Card.Section className={classes.section} mt="md">
    <Text fz="sm" c="dimmed" className={classes.label}>
      Room features
    </Text>

    <Group gap={8} mb={-8}>
      <Badge variant="light">King Bed</Badge>
      <Badge variant="light">Ocean View</Badge>
      <Badge variant="light">Free WiFi</Badge>
    </Group>
  </Card.Section>

  <Card.Section className={classes.section}>
    <Group gap={30}>
      <div>
        <Text fz="xl" fw={700} style={{ lineHeight: 1 }}>
          $249.00
        </Text>
        <Text fz="sm" c="dimmed" fw={500} style={{ lineHeight: 1 }} mt={3}>
          per night
        </Text>
      </div>

      <Button radius="xl" style={{ flex: 1 }}>
        Book now
      </Button>
    </Group>
  </Card.Section>
</Card>
    </div>
   
  );
}