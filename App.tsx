
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Member, OtherExpense } from './types';
import Header from './components/Header';
import ExpenseCalculator from './components/ExpenseCalculator';
import GroceryCalendar from './components/GroceryCalendar';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [members, setMembers] = useState<Member[]>(() => {
    try {
      const savedMembers = localStorage.getItem('messMembers');
      return savedMembers ? JSON.parse(savedMembers) : [
        { id: '1', name: 'Alice', spending: 2500, meals: 75 },
        { id: '2', name: 'Bob', spending: 1500, meals: 60 },
        { id: '3', name: 'Charlie', spending: 2000, meals: 80 },
      ];
    } catch (error) {
      return [];
    }
  });
  
  const [otherExpenses, setOtherExpenses] = useState<OtherExpense[]>(() => {
     try {
      const savedExpenses = localStorage.getItem('messOtherExpenses');
      return savedExpenses ? JSON.parse(savedExpenses) : [
        { id: 'gas', name: 'Gas Bill', amount: 500 },
        { id: 'electricity', name: 'Electricity', amount: 1200 },
      ];
    } catch (error) {
      return [];
    }
  });

  const [calendarData, setCalendarData] = useState<{ [date: string]: string }>(() => {
    try {
      const savedCalendar = localStorage.getItem('messCalendarData');
      return savedCalendar ? JSON.parse(savedCalendar) : {};
    } catch (error) {
      return {};
    }
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('messMembers', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('messOtherExpenses', JSON.stringify(otherExpenses));
  }, [otherExpenses]);
  
  useEffect(() => {
    localStorage.setItem('messCalendarData', JSON.stringify(calendarData));
  }, [calendarData]);

  const handleAddMember = useCallback(() => {
    setMembers(prev => [...prev, { id: Date.now().toString(), name: '', spending: 0, meals: 0 }]);
  }, []);

  const handleUpdateMember = useCallback((id: string, field: keyof Member, value: string | number) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  }, []);

  const handleRemoveMember = useCallback((id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  }, []);

  const handleAddOtherExpense = useCallback(() => {
    setOtherExpenses(prev => [...prev, { id: Date.now().toString(), name: '', amount: 0 }]);
  }, []);

  const handleUpdateOtherExpense = useCallback((id: string, field: keyof OtherExpense, value: string | number) => {
    setOtherExpenses(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));
  }, []);

  const handleRemoveOtherExpense = useCallback((id: string) => {
    setOtherExpenses(prev => prev.filter(e => e.id !== id));
  }, []);

  const calculations = useMemo(() => {
    const totalGrocerySpending = members.reduce((sum, member) => sum + Number(member.spending), 0);
    const totalOtherExpenses = otherExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
    const totalMonthlyExpenses = totalGrocerySpending + totalOtherExpenses;
    const totalMeals = members.reduce((sum, member) => sum + Number(member.meals), 0);
    const costPerMeal = totalMeals > 0 ? totalMonthlyExpenses / totalMeals : 0;

    const memberBalances = members.map(member => {
      const individualMealCost = costPerMeal * Number(member.meals);
      const balance = Number(member.spending) - individualMealCost;
      return { ...member, balance };
    });

    return {
      totalGrocerySpending,
      totalOtherExpenses,
      totalMonthlyExpenses,
      totalMeals,
      costPerMeal,
      memberBalances,
    };
  }, [members, otherExpenses]);

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <ExpenseCalculator
              members={members}
              otherExpenses={otherExpenses}
              calculations={calculations}
              onAddMember={handleAddMember}
              onUpdateMember={handleUpdateMember}
              onRemoveMember={handleRemoveMember}
              onAddOtherExpense={handleAddOtherExpense}
              onUpdateOtherExpense={handleUpdateOtherExpense}
              onRemoveOtherExpense={handleRemoveOtherExpense}
            />
          </div>
          <div className="lg:col-span-2">
            <GroceryCalendar 
              members={members}
              calendarData={calendarData}
              setCalendarData={setCalendarData}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
