
import React, { useRef } from 'react';
import type { Member, OtherExpense } from '../types';
import MemberInputRow from './MemberInputRow';
import OtherExpenseInputRow from './OtherExpenseInputRow';

// Explicitly declare jsPDF and html2canvas from window object
declare const jsPDF: any;
declare const html2canvas: any;

interface ExpenseCalculatorProps {
  members: Member[];
  otherExpenses: OtherExpense[];
  calculations: {
    totalGrocerySpending: number;
    totalOtherExpenses: number;
    totalMonthlyExpenses: number;
    totalMeals: number;
    costPerMeal: number;
    memberBalances: (Member & { balance: number })[];
  };
  onAddMember: () => void;
  onUpdateMember: (id: string, field: keyof Member, value: string | number) => void;
  onRemoveMember: (id: string) => void;
  onAddOtherExpense: () => void;
  onUpdateOtherExpense: (id: string, field: keyof OtherExpense, value: string | number) => void;
  onRemoveOtherExpense: (id: string) => void;
}

const ExpenseCalculator: React.FC<ExpenseCalculatorProps> = ({
  members,
  otherExpenses,
  calculations,
  onAddMember,
  onUpdateMember,
  onRemoveMember,
  onAddOtherExpense,
  onUpdateOtherExpense,
  onRemoveOtherExpense,
}) => {
  const { totalGrocerySpending, totalOtherExpenses, totalMonthlyExpenses, totalMeals, costPerMeal, memberBalances } = calculations;
  const reportRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = () => {
    const input = reportRef.current;
    if (input) {
      // Temporarily change background for capture
      const originalBg = input.style.backgroundColor;
      const isDark = document.documentElement.classList.contains('dark');
      input.style.backgroundColor = isDark ? '#1f2937' : 'white';
      
      html2canvas(input, {
        scale: 2, // Increase scale for better resolution
        useCORS: true,
        backgroundColor: isDark ? '#1f2937' : '#ffffff'
      }).then((canvas: HTMLCanvasElement) => {
        // Restore original background
        input.style.backgroundColor = originalBg;

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF.jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`mess-report-${new Date().toISOString().slice(0, 10)}.pdf`);
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Member Expenses */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <i className="fa-solid fa-users mr-3 text-primary-500"></i> Member Details
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-4 py-3">Name</th>
                <th scope="col" className="px-4 py-3">Grocery Spending (Taka)</th>
                <th scope="col" className="px-4 py-3">Total Meals</th>
                <th scope="col" className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {members.map(member => (
                <MemberInputRow
                  key={member.id}
                  member={member}
                  onUpdate={onUpdateMember}
                  onRemove={onRemoveMember}
                />
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={onAddMember}
          className="mt-4 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 transition-colors"
        >
          <i className="fa-solid fa-plus mr-2"></i> Add Member
        </button>
      </div>
      
      {/* Other Expenses */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <i className="fa-solid fa-receipt mr-3 text-primary-500"></i> Other Monthly Expenses
        </h2>
        <div className="space-y-3">
          {otherExpenses.map(expense => (
            <OtherExpenseInputRow 
              key={expense.id}
              expense={expense}
              onUpdate={onUpdateOtherExpense}
              onRemove={onRemoveOtherExpense}
            />
          ))}
        </div>
        <button
          onClick={onAddOtherExpense}
          className="mt-4 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 transition-colors"
        >
          <i className="fa-solid fa-plus mr-2"></i> Add Expense
        </button>
      </div>

      {/* Report Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div ref={reportRef} className="p-4 rounded-md">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <i className="fa-solid fa-file-invoice-dollar mr-3 text-primary-500"></i> Monthly Report
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Expenses</p>
                <p className="text-xl font-bold">৳{totalMonthlyExpenses.toFixed(2)}</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Grocery</p>
                <p className="text-xl font-bold">৳{totalGrocerySpending.toFixed(2)}</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Other Costs</p>
                <p className="text-xl font-bold">৳{totalOtherExpenses.toFixed(2)}</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Cost Per Meal</p>
                <p className="text-xl font-bold">৳{costPerMeal.toFixed(2)}</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-4 py-3">Name</th>
                    <th scope="col" className="px-4 py-3">Spent</th>
                    <th scope="col" className="px-4 py-3">Meals</th>
                    <th scope="col" className="px-4 py-3">Meal Cost</th>
                    <th scope="col" className="px-4 py-3">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {memberBalances.map(member => (
                    <tr key={member.id} className="border-b dark:border-gray-700">
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{member.name}</td>
                      <td className="px-4 py-3">৳{Number(member.spending).toFixed(2)}</td>
                      <td className="px-4 py-3">{member.meals}</td>
                      <td className="px-4 py-3">৳{(costPerMeal * member.meals).toFixed(2)}</td>
                      <td className={`px-4 py-3 font-bold ${member.balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {member.balance >= 0 ? `Receives ৳${member.balance.toFixed(2)}` : `Owes ৳${Math.abs(member.balance).toFixed(2)}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>
        <button
            onClick={handleDownloadPdf}
            className="mt-6 w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 transition-colors"
          >
            <i className="fa-solid fa-file-pdf mr-2"></i> Download Report (PDF)
        </button>
      </div>

    </div>
  );
};

export default ExpenseCalculator;
