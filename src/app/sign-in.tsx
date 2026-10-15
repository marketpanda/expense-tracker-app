import { useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Brand, Button, colors, Icon, Screen, s } from '../components/ui';

export default function SignIn() {
  const [notice, setNotice] = useState('');
  return <Screen scroll><View style={a.header}><Brand small /><Text style={[s.body, { textAlign: 'center' }]}>A little direction for your money.</Text></View>
    <Image source={require('../../assets/panda-trail.png')} style={a.art} resizeMode="cover" />
    <View style={{ gap: 12 }}>
      {(['Google', 'Apple', 'Email'] as const).map(provider => <Pressable key={provider} accessibilityRole="button" onPress={() => setNotice(`${provider} sign-in`)} style={({ pressed }) => [a.provider, { opacity: pressed ? 0.6 : 1 }]}><Icon name={provider === 'Google' ? 'logo-google' : provider === 'Apple' ? 'logo-apple' : 'mail-outline'} color={provider === 'Google' ? '#4285F4' : colors.dark} /><Text style={a.providerText}>Continue with {provider}</Text><View style={{ width: 22 }} /></Pressable>)}
    </View>
    <View style={{ gap: 12, marginTop: 'auto', paddingTop: 8 }}><Button title="Explore the demo" onPress={() => router.replace('/home')} /><Text style={[s.body, a.fine]}>By continuing, you agree to our</Text><Pressable accessibilityRole="button" onPress={() => setNotice('Terms and privacy')}><Text style={[s.link, a.fine]}>Terms and Privacy Policy</Text></Pressable></View>
    <Modal visible={!!notice} transparent animationType="fade" onRequestClose={() => setNotice('')}><View style={a.overlay}><View style={a.modal}><Icon name="leaf-outline" size={34} /><Text style={s.title}>{notice}</Text><Text style={s.body}>{notice === 'Terms and privacy' ? 'This is a frontend preview. No account is created and no financial information is sent to a server. Transactions are kept in memory and reset when the app reloads.' : 'This is a frontend preview. Account sign-in is not connected yet. Explore CashCompass with sample data.'}</Text><Button title="Explore the demo" onPress={() => { setNotice(''); router.replace('/home'); }} /><Button title="Back" outline onPress={() => setNotice('')} /></View></View></Modal>
  </Screen>;
}
const a = StyleSheet.create({ header: { alignItems: 'center', gap: 14, paddingTop: 20 }, art: { width: '100%', height: 235, borderRadius: 24 }, provider: { minHeight: 54, padding: 15, borderRadius: 15, borderWidth: 1, borderColor: colors.line, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, providerText: { color: colors.dark, fontWeight: '600', fontSize: 14 }, fine: { fontSize: 11, textAlign: 'center', lineHeight: 16 }, overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#142C2466' }, modal: { width: '100%', maxWidth: 390, backgroundColor: colors.cream, borderRadius: 26, padding: 26, gap: 20 } });
