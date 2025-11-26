import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function BookingScreen() {
  const router = useRouter();
  const { id, time } = useLocalSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleBooking = () => {
    if (!name || !email) {
      Alert.alert('Error', 'Please enter your name and email.');
      return;
    }
    // Navigate to payment screen with slot, name, and email
    router.push(`/payment?id=${id}&time=${encodeURIComponent(time as string)}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`);
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>Book Appointment</Text>
      <Text style={{ fontSize: 16, marginBottom: 8 }}>Slot Time: {time}</Text>
      <TextInput
        placeholder="Your Name"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 12 }}
      />
      <TextInput
        placeholder="Your Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 12 }}
      />
      <Button title="Proceed to Payment" onPress={handleBooking} />
    </View>
  );
}
