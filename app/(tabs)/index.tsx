import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';

interface Slot {
  id: number;
  time: string;
  booked: number;
}

const API_URL = 'http://192.168.0.16:3000/api/appointments';

export default function HomeScreen() {
  const router = useRouter();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setSlots(data.slots || []);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch slots');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#007AFF" />;
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red', fontSize: 18 }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' }}>
        Available Appointment Slots
      </Text>
      <FlatList
        data={slots}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }: { item: Slot }) => (
          <Pressable
            onPress={() => router.push(`/booking?id=${item.id}&time=${encodeURIComponent(item.time)}`)}
            style={{ padding: 12, marginVertical: 8, backgroundColor: '#f2f2f2', borderRadius: 8 }}
          >
            <Text style={{ fontSize: 16 }}>Time: {item.time}</Text>
            <Text style={{ fontSize: 16 }}>Booked: {item.booked ? 'Yes' : 'No'}</Text>
          </Pressable>
        )}
        ListEmptyComponent={<Text>No slots available.</Text>}
      />
    </View>
  );
}
