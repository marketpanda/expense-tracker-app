import { useEffect } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Brand, Button, colors, Screen, s } from '../components/ui';

const trail = require('../../assets/panda-trail.png');
const summit = require('../../assets/panda-summit.png');
export function SplashScreen() {
  useEffect(() => { const timer = setTimeout(() => router.replace('/onboarding?step=0'), 2500); return () => clearTimeout(timer); }, []);
  return <Screen><Pressable accessibilityLabel="Start CashCompass" accessibilityRole="button" onPress={() => router.replace('/onboarding?step=0')} style={w.splash}>
    <Image source={trail} style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]} resizeMode="cover" />
    <View style={w.splashBrand}><Brand /><Text style={w.tagline}>Track today.{"\n"}For a brighter tomorrow.</Text></View>
    <Text style={w.splashHint}>YOUR NEXT CHAPTER STARTS HERE</Text>
  </Pressable></Screen>;
}
const slides = [
  { eyebrow: 'A LITTLE CLARITY, EVERY DAY', title: 'Know where\nyour money goes', body: 'Easily track your expenses\nand build better habits.' },
  { eyebrow: 'SMALL STEPS. BIG POSSIBILITIES.', title: 'Reach your\ngoals faster', body: 'Set budgets, save for what matters,\nand make progress every day.' },
  { eyebrow: 'MAKE ROOM FOR WHAT MATTERS', title: 'A happier\nfinancial you', body: 'Small steps today.\nBig adventures tomorrow.' },
];
export function OnboardingScreen() {
  const { step } = useLocalSearchParams<{ step?: string }>();
  const index = Math.max(0, Math.min(2, Number(step) || 0));
  const slide = slides[index];
  return <Screen><View style={w.onboarding}>
    <View style={w.copy}><Text style={w.eyebrow}>{slide.eyebrow}</Text><Text accessibilityRole="header" style={[s.title, w.center]}>{slide.title}</Text><Text style={[s.body, w.center, { marginTop: 14 }]}>{slide.body}</Text></View>
    <View style={w.artWrap}><Image source={index === 1 ? summit : trail} style={w.art} resizeMode="contain" />{index === 1 && <View style={w.goalBadge}><Text style={{ fontSize: 18 }}>⚑</Text><Text style={s.link}>One step closer</Text></View>}</View>
    <View style={w.controls}><View style={w.dots}>{slides.map((_, i) => <Pressable key={i} accessibilityRole="button" accessibilityLabel={`Onboarding page ${i + 1}`} onPress={() => router.setParams({ step: String(i) })} hitSlop={12}><View style={[w.dot, i === index && w.activeDot]} /></Pressable>)}</View>
      <Button title={index === 2 ? 'Get Started' : 'Next'} onPress={() => index === 2 ? router.replace('/sign-in') : router.setParams({ step: String(index + 1) })} />
      <Pressable accessibilityRole="button" onPress={() => router.replace('/sign-in')} style={w.skip}><Text style={s.body}>{index === 2 ? 'Your adventure starts here' : 'Skip'}</Text></Pressable>
    </View>
  </View></Screen>;
}
const w = StyleSheet.create({
  splash: { flex: 1, justifyContent: 'space-between', alignItems: 'center', minHeight: 500 },
  splashBrand: { alignItems: 'center', paddingTop: 55, gap: 20 }, tagline: { color: colors.dark, fontSize: 17, lineHeight: 25, textAlign: 'center' },
  splashHint: { color: '#294A33', fontSize: 10, fontWeight: '700', letterSpacing: 1.8, marginBottom: 24 },
  onboarding: { flex: 1 }, copy: { paddingTop: 28, paddingHorizontal: 22, alignItems: 'center', gap: 10 },
  eyebrow: { color: colors.green, fontWeight: '700', letterSpacing: 1.5, fontSize: 9 }, center: { textAlign: 'center' },
  artWrap: { flex: 1, marginTop: 20, overflow: 'hidden', minHeight: 160 }, art: { width: '100%', height: '100%' },
  goalBadge: { position: 'absolute', bottom: 20, right: 24, backgroundColor: colors.cream, padding: 12, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 8 },
  controls: { paddingHorizontal: 24, paddingBottom: 8 }, dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, paddingVertical: 23 },
  dot: { width: 6, height: 6, borderRadius: 4, backgroundColor: '#D9DFD5' }, activeDot: { backgroundColor: colors.green, width: 19 }, skip: { padding: 15, alignItems: 'center' },
});
