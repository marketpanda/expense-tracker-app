import { createContext, PropsWithChildren, useContext, useState } from 'react';

export type Transaction = { id: string; amount: number; type: 'expense' | 'income'; category: string; note: string; date: string };
export type Goal = { id: string; name: string; target: number; saved: number; image: 'mountain' | 'japan' };
export const categoryInfo = [
  { name: 'Food & Drink', icon: 'restaurant-outline', color: '#FAA52A', tint: '#FDEBD7', budget: 8000 },
  { name: 'Transportation', icon: 'car-outline', color: '#387C59', tint: '#DFEDDE', budget: 5000 },
  { name: 'Shopping', icon: 'bag-outline', color: '#BC77D5', tint: '#F3E2F7', budget: 5000 },
  { name: 'Bills', icon: 'receipt-outline', color: '#569AE6', tint: '#E4EAFD', budget: 4000 },
  { name: 'Travel', icon: 'airplane-outline', color: '#4ABDA8', tint: '#E1F3EC', budget: 2000 },
  { name: 'Entertainment', icon: 'ticket-outline', color: '#9270BA', tint: '#F3E0F5', budget: 3000 },
  { name: 'Health', icon: 'heart-outline', color: '#F07587', tint: '#FCE2E7', budget: 1500 },
  { name: 'Others', icon: 'grid-outline', color: '#88859B', tint: '#EBEAF0', budget: 500 },
] as const;
function sampleDate(offset: number) { const now = new Date(); return new Date(now.getFullYear(), now.getMonth(), Math.max(1, now.getDate() - offset), 8, 24).toISOString(); }
const seeds: [string, number, string, string, number][] = [
  ['coffee', 120, 'Food & Drink', 'Coffee', 0], ['grab', 250, 'Transportation', 'Grab', 0],
  ['groceries', 1230, 'Shopping', 'Groceries', 1], ['salary', 45000, 'Salary', 'Salary', 1],
  ['netflix', 549, 'Entertainment', 'Netflix', 2], ['gym', 699, 'Health', 'Gym', 2],
  ['food', 5080, 'Food & Drink', 'Meals & groceries', 3], ['commute', 3070, 'Transportation', 'Daily commute', 4],
  ['shopping', 1720, 'Shopping', 'Everyday essentials', 5], ['bills', 2580, 'Bills', 'Utilities & internet', 6],
  ['travel', 1450, 'Travel', 'Weekend getaway', 7], ['entertainment', 871, 'Entertainment', 'Movie night & music', 8],
  ['health', 381, 'Health', 'Pharmacy', 9], ['others', 450, 'Others', 'Little extras', 10],
];
const initial: Transaction[] = seeds.map(([id, amount, category, note, offset]) => ({ id, amount, category, note, type: id === 'salary' ? 'income' : 'expense', date: sampleDate(offset) }));
export function isThisMonth(date: string) { const value = new Date(date); const now = new Date(); return value.getFullYear() === now.getFullYear() && value.getMonth() === now.getMonth(); }
type Finance = {
  transactions: Transaction[]; last?: Transaction; balance: number; spent: number;
  add: (transaction: Omit<Transaction, 'id'>) => void; edit: (id: string, transaction: Omit<Transaction, 'id'>) => void; remove: (id: string) => void;
  budgets: Record<string, number>; setBudget: (category: string, amount: number) => void;
  goals: Goal[]; addGoal: (goal: Omit<Goal, 'id' | 'saved'>) => void; contribute: (id: string, amount: number) => void;
  profile: { name: string; email: string }; setProfile: (profile: { name: string; email: string }) => void;
};
const Context = createContext<Finance | null>(null);
export function FinanceProvider({ children }: PropsWithChildren) {
  const [transactions, setTransactions] = useState(initial);
  const [last, setLast] = useState<Transaction>();
  const [budgets, updateBudgets] = useState<Record<string, number>>(Object.fromEntries(categoryInfo.map(item => [item.name, item.budget])));
  const [goals, setGoals] = useState<Goal[]>([{ id: 'pulag', name: 'Mt. Pulag Hike', target: 12000, saved: 8500, image: 'mountain' }, { id: 'japan', name: 'Japan Trip 2026', target: 120000, saved: 65000, image: 'japan' }]);
  const [profile, setProfile] = useState({ name: 'Jones Dollesin', email: 'jones@email.com' });
  const signed = (t: Pick<Transaction, 'amount' | 'type'>) => t.type === 'income' ? t.amount : -t.amount;
  const balance = 42350 + transactions.reduce((sum, t) => sum + signed(t), 0) - initial.reduce((sum, t) => sum + signed(t), 0);
  const spent = transactions.filter(t => t.type === 'expense' && isThisMonth(t.date)).reduce((sum, t) => sum + t.amount, 0);
  function add(input: Omit<Transaction, 'id'>) {
    const transaction = { ...input, id: `${Date.now()}-${Math.random()}` };
    setTransactions(previous => [transaction, ...previous]);
    setLast(transaction);
  }
  function edit(id: string, input: Omit<Transaction, 'id'>) { setTransactions(previous => previous.map(t => t.id === id ? { ...input, id } : t)); }
  function remove(id: string) { setTransactions(previous => previous.filter(t => t.id !== id)); }
  function setBudget(category: string, amount: number) { updateBudgets(previous => ({ ...previous, [category]: amount })); }
  function addGoal(goal: Omit<Goal, 'id' | 'saved'>) { setGoals(previous => [...previous, { ...goal, saved: 0, id: `${Date.now()}` }]); }
  function contribute(id: string, amount: number) { setGoals(previous => previous.map(goal => goal.id === id ? { ...goal, saved: Math.min(goal.target, goal.saved + amount) } : goal)); }
  return <Context.Provider value={{ transactions, last, balance, spent, add, edit, remove, budgets, setBudget, goals, addGoal, contribute, profile, setProfile }}>{children}</Context.Provider>;
}
export function useFinance() { const value = useContext(Context); if (!value) throw new Error('FinanceProvider is missing'); return value; }
export const money = (value: number) => `₱ ${value.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const compactMoney = (value: number) => `₱ ${value.toLocaleString('en-PH', { maximumFractionDigits: 0 })}`;
