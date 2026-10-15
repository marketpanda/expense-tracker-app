import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SpendingBars } from '../components/charts';
import { CategoryIcon, fieldStyle } from '../components/finance-ui';
import { Page, Sheet } from '../components/navigation';
import { Button, Card, colors, Icon, s } from '../components/ui';
import { categoryInfo, compactMoney, useFinance } from '../state/finance';

export default function Insights() {
  const { transactions } = useFinance(); const [period, setPeriod] = useState(0); const [selecting, setSelecting] = useState(false); const [fullReport, setFullReport] = useState(false);
  const now = new Date(); const start = new Date(now.getFullYear(), now.getMonth() - period, 1); const end = new Date(now.getFullYear(), now.getMonth() - period + 1, 1);
  const monthTransactions = transactions.filter(t => new Date(t.date) >= start && new Date(t.date) < end);
  const expenses = monthTransactions.filter(t => t.type === 'expense'); const total = expenses.reduce((sum, t) => sum + t.amount, 0); const income = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const previousStart = new Date(start.getFullYear(), start.getMonth() - 1, 1); const previous = transactions.filter(t => t.type === 'expense' && new Date(t.date) >= previousStart && new Date(t.date) < start).reduce((sum, t) => sum + t.amount, 0);
  const change = previous ? (total - previous) / previous * 100 : null;
  const breakdown = categoryInfo.map(info => ({ ...info, amount: expenses.filter(t => t.category === info.name).reduce((sum, t) => sum + t.amount, 0) })).sort((a, b) => b.amount - a.amount);
  return <Page title="Insights" back><Pressable accessibilityRole="button" onPress={() => setSelecting(true)} style={[fieldStyle, s.row]}><Text style={{ color: colors.dark, fontSize: 13 }}>{period === 0 ? 'This Month' : start.toLocaleDateString('en-PH', { month: 'long', year: 'numeric' })}</Text><Icon name="chevron-forward" size={17} color={colors.muted} /></Pressable>
    <Card style={{ gap: 22 }}><View style={s.row}><View style={{ gap: 8 }}><Text style={s.body}>Total Spending</Text><Text style={[s.title, { fontSize: 30 }]}>{compactMoney(total)}</Text></View><View style={{ alignItems: 'flex-end', gap: 6 }}>{change === null ? <Text style={{ color: colors.muted, fontSize: 10 }}>No prior month data</Text> : <><View style={{ padding: 7, borderRadius: 9, backgroundColor: change <= 0 ? '#E4F1DE' : '#FBE9E1' }}><Text style={{ color: change <= 0 ? colors.green : '#B34B3E', fontSize: 12, fontWeight: '700' }}>{change <= 0 ? '↓' : '↑'} {Math.abs(change).toFixed(0)}%</Text></View><Text style={{ color: colors.muted, fontSize: 9 }}>vs last month</Text></>}</View></View><SpendingBars transactions={expenses} /></Card>
    <View style={s.row}><Text style={s.label}>Top Categories</Text><Pressable accessibilityRole="button" onPress={() => router.push('/categories')}><Text style={s.link}>See all</Text></Pressable></View><View>{breakdown.slice(0, 3).map(item => <View key={item.name} style={[s.row, { paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: colors.line, gap: 12 }]}><CategoryIcon category={item.name} size={17} /><Text style={{ color: colors.dark, fontSize: 12, flex: 1 }}>{item.name}</Text><Text style={{ color: colors.dark, fontWeight: '600', fontSize: 12 }}>{compactMoney(item.amount)}</Text><Text style={{ color: colors.muted, fontSize: 10, width: 30, textAlign: 'right' }}>{total ? Math.round(item.amount / total * 100) : 0}%</Text></View>)}</View>
    <Button title="View Full Report" outline onPress={() => setFullReport(true)} />
    <Sheet title="Choose a month" visible={selecting} onClose={() => setSelecting(false)}>{[0, 1, 2].map(offset => <Button key={offset} title={new Date(now.getFullYear(), now.getMonth() - offset, 1).toLocaleDateString('en-PH', { month: 'long', year: 'numeric' })} outline={period !== offset} onPress={() => { setPeriod(offset); setSelecting(false); }} />)}</Sheet>
    <Sheet title="Monthly report" visible={fullReport} onClose={() => setFullReport(false)}><Text style={s.body}>{start.toLocaleDateString('en-PH', { month: 'long', year: 'numeric' })}</Text>{[{ label: 'Income', amount: income }, { label: 'Expenses', amount: total }, { label: 'Net cash flow', amount: income - total }].map(item => <View style={s.row} key={item.label}><Text style={s.label}>{item.label}</Text><Text style={s.link}>{compactMoney(item.amount)}</Text></View>)}{breakdown.map(item => <View style={s.row} key={item.name}><Text style={s.body}>{item.name}</Text><Text style={s.label}>{compactMoney(item.amount)}</Text></View>)}<Text style={[s.body, { fontSize: 11 }]}>{monthTransactions.length} transactions · PHP · Demo session</Text><Button title="Done" onPress={() => setFullReport(false)} /></Sheet>
  </Page>;
}
