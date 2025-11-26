import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { StripeProvider } from '@stripe/stripe-react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <StripeProvider publishableKey="pk_test_51SWdX8DJRL7UaXTmIgKhgoeorFjIfyS8jGpKdXAe5feSAOrIHh5Iij6i8zxwJgcNVXN2HBnjdxnH3Wzu16NLMbTB00PB7RN94a">
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </StripeProvider>
  );
}
