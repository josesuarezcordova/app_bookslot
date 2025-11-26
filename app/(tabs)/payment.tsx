import React, { useState } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useStripe } from '@stripe/stripe-react-native';


export default function PaymentScreen() {
  const router = useRouter();
  const { id, time, name, email } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const stripe = useStripe();

  const handlePayment = async () => {
    setLoading(true);
    // Fetch client secret from backend
    const response = await fetch('http://192.168.0.16:3000/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 1000 })
    });
    const text = await response.text();
    console.log('PaymentIntent response:', text);
    const { clientSecret } = JSON.parse(text);
    console.log('clientSecret:', clientSecret);
    // Initialize PaymentSheet
    const initSheet = await stripe.initPaymentSheet({ 
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'My BMI App' 
    });
    if (initSheet.error) {
        console.log('Init PaymentSheet error:', initSheet.error);
        setLoading(false);
        setStatus('failure');
        return;
    }

    // Present PaymentSheet
    const presentSheet = await stripe.presentPaymentSheet();
    setLoading(false);
    if (presentSheet.error) {
        console.log('Present PaymentSheet error:', presentSheet.error);
        setStatus('failure');
    } else {
        setStatus('success');
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#fff', justifyContent: 'center' }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>Payment & Confirmation</Text>
      <Text style={{ fontSize: 16, marginBottom: 8 }}>Slot Time: {time}</Text>
      <Text style={{ fontSize: 16, marginBottom: 8 }}>Name: {name}</Text>
      <Text style={{ fontSize: 16, marginBottom: 8 }}>Email: {email}</Text>
      {status === null && (
        <Button title="Pay with Stripe (Test)" onPress={handlePayment} disabled={loading} />
      )}
      {loading && <ActivityIndicator style={{ marginTop: 16 }} size="large" color="#007AFF" />}
      {status === 'success' && (
        <Text style={{ color: 'green', fontSize: 18, marginTop: 16 }}>Payment Successful!</Text>
      )}
      {status === 'failure' && (
        <Text style={{ color: 'red', fontSize: 18, marginTop: 16 }}>Payment Failed. Please try again.</Text>
      )}
    </View>
  );
}
