import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { EmptyState, Page, Sheet } from '../components/navigation';
import { fieldStyle, Segmented, TransactionItem } from '../components/finance-ui';
import { Button, colors, Icon, s } from '../components/ui';
import { money, Transaction, useFinance } from '../state/finance';

export default function Transactions() {
  const { category } = useLocalSearchParams<{ category?: string }>();
  const { transactions, remove } = useFinance();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState<Transaction>();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const filtered = transactions.filter(t => (!category || t.category === category) && (filter === 'All' || t.type === filter.toLowerCase()) && `${t.note} ${t.category} ${t.amount}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => b.date.localeCompare(a.date));
  const groups = new Map<string, Transaction[]>();
  filtered.forEach(t => { const date = new Date(t.date).toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }); groups.set(date, [...(groups.get(date) || []), t]); });
  return <Page title="Transactions" back actionIcon="add-outline" actionLabel="Add transaction" action={() => router.push('/add-transaction')}>
    <View style={t.search}><Icon name="search-outline" size={17} color={colors.muted} /><TextInput style={t.searchInput} placeholder="Search transactions…" placeholderTextColor="#92978D" accessibilityLabel="Search transactions" value={query} onChangeText={setQuery} /></View>
    <Segmented value={filter} onChange={setFilter} options={['All', 'Expense', 'Income']} />
    <View style={s.row}><Pressable accessibilityRole="button" onPress={() => router.push('/categories')}><Text style={s.link}>View category breakdown</Text></Pressable>{category && <Pressable accessibilityRole="button" accessibilityLabel="Clear category filter" onPress={() => router.setParams({ category: '' })}><Text style={s.link}>{category} ×</Text></Pressable>}</View>
    {filtered.length === 0 && <EmptyState title="No transactions found" body="Try another search or add your first transaction." onAdd={() => router.push('/add-transaction')} />}
    {[...groups.entries()].map(([date, items]) => <View key={date}><Text style={t.dateHeading}>{date}</Text>{items.map(transaction => <TransactionItem key={transaction.id} transaction={transaction} onPress={() => { setSelected(transaction); setConfirmDelete(false); }} />)}</View>)}
    <Sheet visible={!!selected} title={confirmDelete ? 'Delete transaction?' : 'Transaction details'} onClose={() => setSelected(undefined)}>{selected && <><Text style={[s.title, { fontSize: 34 }]}>{money(selected.amount)}</Text><Text style={s.label}>{selected.note || selected.category}</Text><Text style={s.body}>{selected.category} · {selected.type}{'\n'}{new Date(selected.date).toLocaleDateString('en-PH', { dateStyle: 'long' })}</Text>{confirmDelete ? <><Text style={s.body}>This will remove the transaction and update your balance, budgets, and reports.</Text><Button title="Delete transaction" onPress={() => { remove(selected.id); setSelected(undefined); }} /><Button title="Keep transaction" outline onPress={() => setConfirmDelete(false)} /></> : <><Button title="Edit transaction" onPress={() => { const id = selected.id; setSelected(undefined); router.push(`/add-transaction?id=${encodeURIComponent(id)}`); }} /><Button title="Delete transaction" outline onPress={() => setConfirmDelete(true)} /></>}</>}</Sheet>
  </Page>;
}
const t = StyleSheet.create({ search: { flexDirection: 'row', gap: 9, alignItems: 'center', backgroundColor: '#EEEEE8', paddingHorizontal: 14, borderRadius: 13 }, searchInput: { ...fieldStyle, flex: 1, borderWidth: 0, backgroundColor: 'transparent', paddingHorizontal: 0, fontSize: 12 }, dateHeading: { color: colors.dark, fontSize: 12, fontWeight: '500', marginBottom: 4 } });
