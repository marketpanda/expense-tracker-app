import { ComponentProps, PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text, View, Platform, ScrollView, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export const colors = { cream: '#FAF8F2', green: '#2F7154', dark: '#17251F', muted: '#717970', sage: '#EFF3E8', line: '#E5E7DF', gold: '#D6AD49' };
export type IconName = ComponentProps<typeof Ionicons>['name'];
export function Icon({ name, size = 22, color = colors.green }: { name: IconName; size?: number; color?: string }) { return <Ionicons name={name} size={size} color={color} />; }
export function Screen({ children, scroll = false }: PropsWithChildren<{ scroll?: boolean }>) {
  return <View style={s.desktop}><SafeAreaView style={s.phone} edges={['top', 'bottom']}>
    {scroll ? <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>{children}</ScrollView> : children}
  </SafeAreaView></View>;
}
export function Button({ title, onPress, outline = false, disabled = false }: { title: string; onPress: () => void; outline?: boolean; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [{ opacity: disabled ? 0.5 : pressed ? 0.8 : 1 }, s.buttonOuter]}>
    {outline ? <View style={[s.button, s.outline]}><Text style={s.outlineText}>{title}</Text></View> : <LinearGradient colors={['#397E5E', '#2F694F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.button}><Text style={s.buttonText}>{title}</Text></LinearGradient>}
  </Pressable>;
}
export function Brand({ small = false }: { small?: boolean }) {
  return <View style={{ alignItems: 'center', gap: 10 }}><View style={[s.compass, small && { width: 48, height: 48 }]}><Icon name="compass-outline" size={small ? 44 : 64} /></View><Text style={[s.brand, small && { fontSize: 27 }]}>Cash<Text style={{ color: colors.green }}>Compass</Text></Text></View>;
}
export function Card({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) { return <View style={[s.card, style]}>{children}</View>; }
export const s = StyleSheet.create({
  desktop: { flex: 1, backgroundColor: '#E8EDE6', alignItems: 'center' },
  phone: { flex: 1, width: '100%', maxWidth: 460, backgroundColor: colors.cream, overflow: 'hidden', ...(Platform.OS === 'web' ? { boxShadow: '0 0 60px #263e2010' } : {}) },
  scroll: { flexGrow: 1, padding: 24, gap: 22 },
  buttonOuter: { width: '100%' }, button: { minHeight: 52, padding: 15, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#FFF', fontSize: 15, fontWeight: '700' }, outline: { borderWidth: 1, borderColor: colors.green, backgroundColor: 'transparent' }, outlineText: { color: colors.green, fontWeight: '700', fontSize: 15 },
  compass: { width: 72, height: 72, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-12deg' }] },
  brand: { fontSize: 34, fontWeight: '800', color: colors.dark, letterSpacing: -1.4 },
  card: { padding: 18, borderRadius: 20, backgroundColor: '#FFFDF9', borderWidth: 1, borderColor: '#F0EFE8', boxShadow: '0 3px 12px #22392906' },
  title: { fontSize: 28, fontWeight: '800', lineHeight: 34, color: colors.dark, letterSpacing: -0.8 },
  body: { color: colors.muted, fontSize: 14, lineHeight: 23 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { color: colors.dark, fontWeight: '700', fontSize: 15 },
  link: { color: colors.green, fontWeight: '700', fontSize: 13 },
});
