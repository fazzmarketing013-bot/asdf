
import React from 'react';
import type { Member } from '../types';

interface MemberInputRowProps {
  member: Member;
  onUpdate: (id: string, field: keyof Member, value: string | number) => void;
  onRemove: (id: string) => void;
}

const MemberInputRow: React.FC<MemberInputRowProps> = ({ member, onUpdate, onRemove }) => {
  return (
    <tr className="border-b dark:border-gray-700">
      <td className="px-4 py-2">
        <input
          type="text"
          value={member.name}
          onChange={(e) => onUpdate(member.id, 'name', e.target.value)}
          placeholder="Member Name"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
        />
      </td>
      <td className="px-4 py-2">
        <input
          type="number"
          value={member.spending}
          onChange={(e) => onUpdate(member.id, 'spending', parseFloat(e.target.value) || 0)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
        />
      </td>
      <td className="px-4 py-2">
        <input
          type="number"
          value={member.meals}
          onChange={(e) => onUpdate(member.id, 'meals', parseInt(e.target.value, 10) || 0)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
        />
      </td>
      <td className="px-4 py-2 text-right">
        <button
          onClick={() => onRemove(member.id)}
          className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
          aria-label="Remove member"
        >
          <i className="fas fa-trash-alt"></i>
        </button>
      </td>
    </tr>
  );
};

export default MemberInputRow;
