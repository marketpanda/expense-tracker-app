import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FinanceProvider } from '../state/finance';
import { colors } from '../components/ui';

export default function RootLayout() {
  return <SafeAreaProvider><FinanceProvider><StatusBar style="dark" /><Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.cream }, animation: 'fade' }} /></FinanceProvider></SafeAreaProvider>;
}
