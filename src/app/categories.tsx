import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Donut } from '../components/charts';
import { Segmented } from '../components/finance-ui';
import { EmptyState, Page } from '../components/navigation';
import { colors, s } from '../components/ui';
import { categoryInfo, compactMoney, isThisMonth, useFinance } from '../state/finance';

export default function Categories() {
  const { transactions } = useFinance(); const [type, setType] = useState('Expense');
  const filtered = transactions.filter(t => t.type === type.toLowerCase() && isThisMonth(t.date));
  const names = type === 'Expense' ? categoryInfo.map(item => item.name) : [...new Set(filtered.map(t => t.category))];
  const data = names.map((name, index) => ({ name, color: categoryInfo.find(item => item.name === name)?.color || ['#387C59', '#FAA52A', '#569AE6', '#BC77D5'][index % 4], amount: filtered.filter(t => t.category === name).reduce((sum, t) => sum + t.amount, 0) }));
  const total = data.reduce((sum, item) => sum + item.amount, 0);
  return <Page title="Categories" back><Segmented value={type} onChange={setType} /><Donut data={data} total={total} />{total === 0 && <EmptyState title="A fresh start" body="Add transactions to see where your money goes." />}
    <View style={{ gap: 20 }}>{data.map(item => <Pressable key={item.name} accessibilityRole="button" onPress={() => router.push(`/transactions?category=${encodeURIComponent(item.name)}`)} style={[s.row, { gap: 10 }]}><View style={{ width: 12, height: 12, borderRadius: 5, backgroundColor: item.color }} /><Text style={{ flex: 1, color: colors.dark, fontSize: 12 }}>{item.name}</Text><Text style={{ color: colors.muted, fontSize: 11, width: 34, textAlign: 'right' }}>{total ? Math.round(item.amount / total * 100) : 0}%</Text><Text style={{ color: colors.dark, fontSize: 12, fontWeight: '600', width: 75, textAlign: 'right' }}>{compactMoney(item.amount)}</Text></Pressable>)}</View>
    <Text style={[s.body, { fontSize: 10, textAlign: 'center' }]}>Tap a category to explore its transactions.</Text>
  </Page>;
}
