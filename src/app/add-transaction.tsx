import { PropsWithChildren, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, colors, Icon, IconName, Screen, s } from '../components/ui';
import { useFinance } from '../state/finance';

const categories: { label: string; short: string; icon: IconName }[] = [
  { label: 'Food & Drink', short: 'Food', icon: 'restaurant-outline' }, { label: 'Transportation', short: 'Transport', icon: 'car-outline' },
  { label: 'Shopping', short: 'Shopping', icon: 'bag-outline' }, { label: 'Bills', short: 'Bills', icon: 'receipt-outline' },
  { label: 'Travel', short: 'Travel', icon: 'airplane-outline' }, { label: 'Health', short: 'Health', icon: 'heart-outline' },
  { label: 'Entertainment', short: 'Entertainment', icon: 'ticket-outline' }, { label: 'Others', short: 'Others', icon: 'grid-outline' },
];
export default function AddTransaction() {
  const params = useLocalSearchParams<{ type?: string; id?: string }>();
  const { add, edit, transactions } = useFinance();
  const existing = transactions.find(t => t.id === params.id);
  const [type, setType] = useState<'expense' | 'income'>(existing?.type || (params.type === 'income' ? 'income' : 'expense'));
  const [amount, setAmount] = useState(existing ? String(existing.amount) : '250');
  const [category, setCategory] = useState(existing?.category || (params.type === 'income' ? 'Salary' : 'Transportation'));
  const [note, setNote] = useState(existing?.note || '');
  const today = existing ? new Date(existing.date) : new Date();
  const [date, setDate] = useState(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  function save() {
    if (saving) return;
    const value = Number(amount.replace(/,/g, ''));
    if (!/^\d+(\.\d{1,2})?$/.test(amount.replace(/,/g, '')) || !Number.isFinite(value) || value <= 0 || value > 999999999) { setError('Enter an amount from ₱0.01 to ₱999,999,999 with up to two decimal places.'); return; }
    const parsed = new Date(`${date}T12:00:00`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(parsed.getTime()) || parsed.getFullYear() !== Number(date.slice(0, 4)) || parsed.getMonth() + 1 !== Number(date.slice(5, 7)) || parsed.getDate() !== Number(date.slice(8, 10))) { setError('Enter a valid date as YYYY-MM-DD.'); return; }
    setSaving(true);
    const input = { amount: value, type, category, note: note.trim(), date: parsed.toISOString() };
    if (existing) { edit(existing.id, input); router.replace('/transactions'); }
    else { add(input); router.replace('/transaction-added'); }
  }
  return <Screen><KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}><ScreenContent>
    <View style={s.row}><Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => router.replace(existing ? '/transactions' : '/home')} hitSlop={14}><Icon name="arrow-back" color={colors.dark} /></Pressable><Text style={s.label}>{existing ? 'Edit Transaction' : 'Add Transaction'}</Text><View style={{ width: 22 }} /></View>
    <View style={f.segment}>{(['expense', 'income'] as const).map(value => <Pressable accessibilityRole="button" accessibilityState={{ selected: value === type }} key={value} onPress={() => { setType(value); setCategory(value === 'income' ? 'Salary' : 'Transportation'); }} style={[f.segmentButton, type === value && f.selectedSegment]}><Text style={[f.segmentText, type === value && { color: '#FFF' }]}>{value === 'expense' ? 'Expense' : 'Income'}</Text></Pressable>)}</View>
    <View><Text style={f.fieldLabel}>Amount</Text><View style={f.amountBox}><Text style={f.currency}>₱</Text><TextInput accessibilityLabel="Amount in Philippine pesos" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" selectTextOnFocus style={f.amount} placeholder="0.00" placeholderTextColor="#AAB0A5" /></View></View>
    <View><Text style={f.fieldLabel}>Category</Text><View style={f.grid}>{(type === 'expense' ? categories : [{ label: 'Salary', short: 'Salary', icon: 'briefcase-outline' as const }, { label: 'Freelance', short: 'Freelance', icon: 'laptop-outline' as const }, { label: 'Gift', short: 'Gift', icon: 'gift-outline' as const }, { label: 'Others', short: 'Others', icon: 'grid-outline' as const }]).map(item => <Pressable key={item.label} accessibilityRole="button" accessibilityState={{ selected: category === item.label }} onPress={() => setCategory(item.label)} style={[f.category, category === item.label && f.categorySelected]}><View style={[f.categoryIcon, category === item.label && { backgroundColor: '#E1EEDC' }]}><Icon name={item.icon} color={category === item.label ? colors.green : '#81867D'} size={24} /></View><Text numberOfLines={1} style={[f.categoryText, category === item.label && { color: colors.green, fontWeight: '700' }]}>{item.short}</Text></Pressable>)}</View></View>
    <View style={{ marginTop: 'auto', gap: 19, paddingTop: 15 }}><View><Text style={f.fieldLabel}>Date</Text><View style={f.inputRow}><TextInput accessibilityLabel="Transaction date, YYYY-MM-DD" value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" style={f.dateInput} maxLength={10} /><Icon name="calendar-outline" size={19} color={colors.muted} /></View><Text style={f.hint}>YYYY-MM-DD</Text></View><View><Text style={f.fieldLabel}>Note <Text style={{ color: colors.muted, fontWeight: '400' }}>(optional)</Text></Text><TextInput accessibilityLabel="Transaction note" style={f.input} value={note} onChangeText={setNote} placeholder={type === 'expense' ? 'e.g. Grab to office' : 'e.g. October salary'} placeholderTextColor="#9B9F95" maxLength={120} /></View></View>
    {!!error && <Text accessibilityRole="alert" style={f.error}>{error}</Text>}<Button title="Save transaction" disabled={saving} onPress={save} /><View style={f.secure}><Icon name="lock-closed-outline" size={12} color={colors.muted} /><Text style={f.hint}>Demo data stays in this session</Text></View>
  </ScreenContent></KeyboardAvoidingView></Screen>;
}
function ScreenContent({ children }: PropsWithChildren) { return <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={f.content}>{children}</ScrollView>; }
const f = StyleSheet.create({ content: { flexGrow: 1, padding: 24, gap: 24 }, segment: { flexDirection: 'row', padding: 4, borderRadius: 13, backgroundColor: '#EEEFE8' }, segmentButton: { flex: 1, alignItems: 'center', padding: 12, borderRadius: 10 }, selectedSegment: { backgroundColor: colors.green }, segmentText: { color: colors.muted, fontSize: 13, fontWeight: '600' }, fieldLabel: { color: colors.dark, fontSize: 12, fontWeight: '600', marginBottom: 9 }, amountBox: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FFFDF9', borderWidth: 1, borderColor: colors.line, borderRadius: 15, paddingHorizontal: 18 }, currency: { fontSize: 27, color: colors.dark }, amount: { flex: 1, fontSize: 32, fontWeight: '700', color: colors.dark, paddingVertical: 17 }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, category: { width: '23%', flexGrow: 1, alignItems: 'center', paddingVertical: 12, paddingHorizontal: 2, gap: 8, borderWidth: 1, borderColor: 'transparent', borderRadius: 15 }, categorySelected: { borderColor: colors.green, backgroundColor: '#F1F5E9' }, categoryIcon: { padding: 10, borderRadius: 12, backgroundColor: '#F0F1EB' }, categoryText: { fontSize: 9, color: colors.muted }, input: { backgroundColor: '#FFFDF9', borderWidth: 1, borderColor: colors.line, borderRadius: 13, padding: 15, fontSize: 14, color: colors.dark }, inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFDF9', borderWidth: 1, borderColor: colors.line, borderRadius: 13, paddingHorizontal: 15 }, dateInput: { flex: 1, paddingVertical: 15, fontSize: 14, color: colors.dark }, hint: { color: colors.muted, fontSize: 10, marginTop: 5 }, error: { color: '#AD4236', fontSize: 12, lineHeight: 18 }, secure: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: -13 } });
