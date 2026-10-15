import { useState } from 'react';
import { Image, Pressable, Text, TextInput, View } from 'react-native';
import { FieldLabel, fieldStyle, Progress, Segmented } from '../components/finance-ui';
import { Page, Sheet } from '../components/navigation';
import { Button, Card, colors, Icon, s } from '../components/ui';
import { compactMoney, Goal, useFinance } from '../state/finance';

const images = { mountain: require('../../assets/goal-mountain.png'), japan: require('../../assets/goal-japan.png') };
export default function Goals() {
  const { goals, addGoal, contribute } = useFinance();
  const [creating, setCreating] = useState(false); const [selectedId, setSelectedId] = useState('');
  const selected = goals.find(goal => goal.id === selectedId);
  const [name, setName] = useState(''); const [amount, setAmount] = useState(''); const [image, setImage] = useState('Mountain'); const [error, setError] = useState('');
  const close = () => { setCreating(false); setSelectedId(''); setError(''); };
  function save() { const value = Number(amount); if (!/^\d+(\.\d{1,2})?$/.test(amount) || !Number.isFinite(value) || value <= 0 || value > 999999999) { setError('Enter a positive amount with up to two decimal places.'); return; } if (creating) { if (!name.trim()) { setError('Give your goal a name.'); return; } addGoal({ name: name.trim(), target: value, image: image.toLowerCase() as Goal['image'] }); } else if (selected) { if (value > selected.target - selected.saved) { setError(`Only ${compactMoney(selected.target - selected.saved)} left to reach this goal.`); return; } contribute(selected.id, value); } close(); }
  const openCreate = () => { setCreating(true); setName(''); setAmount(''); setError(''); };
  return <Page title="Goals" action={openCreate} actionLabel="Create savings goal">
    {goals.map(goal => { const percent = Math.round(goal.saved / goal.target * 100); return <Pressable key={goal.id} accessibilityRole="button" accessibilityLabel={`${goal.name}, ${percent}% saved. Add contribution`} onPress={() => { setSelectedId(goal.id); setAmount(''); setError(''); }}><Card style={{ padding: 0, overflow: 'hidden' }}><Image source={images[goal.image]} style={{ width: '100%', height: 142 }} resizeMode="cover" /><View style={{ padding: 17, gap: 11 }}><View style={s.row}><Text style={[s.label, { fontSize: 17 }]}>{goal.name}</Text>{percent >= 100 && <Icon name="checkmark-circle" />}</View><Text style={{ color: colors.muted, fontSize: 13 }}><Text style={{ color: colors.dark, fontWeight: '700' }}>{compactMoney(goal.saved)}</Text> / {compactMoney(goal.target)}</Text><View style={{ flexDirection: 'row', alignItems: 'center', gap: 13 }}><View style={{ flex: 1 }}><Progress value={percent} /></View><Text style={{ fontSize: 11, fontWeight: '600', color: colors.dark }}>{percent}%</Text></View></View></Card></Pressable>; })}
    <Button title="New Goal" outline onPress={openCreate} /><Text style={[s.body, { fontSize: 11, textAlign: 'center' }]}>Big adventures begin with a little saving.</Text>
    <Sheet title={creating ? 'A new adventure' : selected?.name || 'Add contribution'} visible={creating || !!selected} onClose={close}>{creating ? <><FieldLabel>Goal name</FieldLabel><TextInput accessibilityLabel="Savings goal name" style={fieldStyle} value={name} onChangeText={setName} placeholder="What are you saving for?" maxLength={50} /><FieldLabel>Cover image</FieldLabel><Segmented options={['Mountain', 'Japan']} value={image} onChange={setImage} /></> : <><Text style={s.body}>{selected && `${compactMoney(selected.saved)} of ${compactMoney(selected.target)} saved`}</Text><Text style={[s.body, { fontSize: 12 }]}>Record savings you’ve already set aside. Contributions update goal progress without counting as an expense or moving money.</Text></>}<FieldLabel>{creating ? 'Target amount (PHP)' : 'Contribution (PHP)'}</FieldLabel><TextInput accessibilityLabel={creating ? 'Target amount' : 'Contribution amount'} style={fieldStyle} value={amount} onChangeText={setAmount} keyboardType="decimal-pad" placeholder="0.00" />{!!error && <Text accessibilityRole="alert" style={{ color: '#AD4938', fontSize: 12 }}>{error}</Text>}<Button title={creating ? 'Create Goal' : selected && selected.saved >= selected.target ? 'Goal completed!' : 'Record contribution'} disabled={!!selected && selected.saved >= selected.target} onPress={save} /></Sheet>
  </Page>;
}
