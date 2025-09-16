
import React from 'react';
import type { OtherExpense } from '../types';

interface OtherExpenseInputRowProps {
  expense: OtherExpense;
  onUpdate: (id: string, field: keyof OtherExpense, value: string | number) => void;
  onRemove: (id: string) => void;
}

const OtherExpenseInputRow: React.FC<OtherExpenseInputRowProps> = ({ expense, onUpdate, onRemove }) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={expense.name}
        onChange={(e) => onUpdate(expense.id, 'name', e.target.value)}
        placeholder="Expense Name (e.g., Gas)"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
      />
      <input
        type="number"
        value={expense.amount}
        onChange={(e) => onUpdate(expense.id, 'amount', parseFloat(e.target.value) || 0)}
        placeholder="Amount"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-48 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
      />
      <button
        onClick={() => onRemove(expense.id)}
        className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors px-2"
        aria-label="Remove expense"
      >
        <i className="fas fa-trash-alt"></i>
      </button>
    </div>
  );
};

export default OtherExpenseInputRow;
