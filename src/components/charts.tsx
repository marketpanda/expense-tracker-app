import { Text, View } from 'react-native';
import Svg, { Circle, Line, Rect } from 'react-native-svg';
import { colors } from './ui';
import { compactMoney, Transaction } from '../state/finance';

export function Donut({ data, total }: { data: { color: string; amount: number }[]; total: number }) {
  const radius = 82; const circumference = 2 * Math.PI * radius;
  const segments = data.filter(item => item.amount > 0);
  return <View accessibilityLabel={`Category breakdown, total ${compactMoney(total)}`} style={{ alignSelf: 'center', width: 224, height: 224, alignItems: 'center', justifyContent: 'center' }}><Svg width={224} height={224} viewBox="0 0 224 224" style={{ position: 'absolute' }}><Circle cx={112} cy={112} r={radius} stroke="#E9ECE2" strokeWidth={37} fill="none" />{segments.map((item, index) => { const length = total ? item.amount / total * circumference : 0; const start = total ? segments.slice(0, index).reduce((sum, segment) => sum + segment.amount, 0) / total * circumference : 0; return <Circle key={index} cx={112} cy={112} r={radius} stroke={item.color} strokeWidth={37} strokeDasharray={`${length} ${circumference}`} strokeDashoffset={-start} transform="rotate(-90 112 112)" fill="none" />; })}</Svg><Text style={{ fontSize: 23, fontWeight: '800', color: colors.dark }}>{compactMoney(total)}</Text><Text style={{ fontSize: 11, color: colors.muted, marginTop: 6 }}>This Month</Text></View>;
}
export function SpendingBars({ transactions }: { transactions: Transaction[] }) {
  const buckets = [0, 0, 0, 0]; transactions.forEach(t => { buckets[Math.min(3, Math.floor((new Date(t.date).getDate() - 1) / 8))] += t.amount; });
  const max = Math.max(...buckets, 1);
  return <View accessibilityLabel={buckets.map((value, index) => `Week ${index + 1}: ${compactMoney(value)}`).join(', ')}><Svg width="100%" height={158} viewBox="0 0 320 158">{[15, 55, 95, 135].map(y => <Line key={y} x1={12} x2={308} y1={y} y2={y} stroke="#ECEEE7" strokeWidth={1} />)}{buckets.map((value, index) => <Rect key={index} x={32 + index * 73} y={135 - value / max * 120} width={37} height={value / max * 120} rx={6} fill="#62A678" />)}</Svg><View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>{buckets.map((_, index) => <Text key={index} style={{ color: colors.muted, fontSize: 10 }}>Week {index + 1}</Text>)}</View></View>;
}
