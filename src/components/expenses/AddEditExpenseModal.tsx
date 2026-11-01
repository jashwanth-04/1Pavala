import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { PAYMENT_METHODS } from '../../constants/categories';
import { PaymentMethod } from '../../types';
import { CategoryIcon } from '../common/CategoryIcon';
import { getTodayDateString, formatCurrency } from '../../utils/formatters';
import { PlusCircle, Calendar, CreditCard, FileText, Check } from 'lucide-react';

export const AddEditExpenseModal: React.FC = () => {
  const {
    isExpenseModalOpen,
    closeExpenseModal,
    editingExpense,
    categories,
    settings,
    addExpense,
    updateExpense,
  } = useApp();

  const [amount, setAmount] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [date, setDate] = useState<string>(getTodayDateString());
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('UPI');
  const [note, setNote] = useState<string>('');
  const [errors, setErrors] = useState<{ amount?: string; category?: string; date?: string }>({});

  useEffect(() => {
    if (editingExpense) {
      setAmount(String(editingExpense.amount));
      setCategoryId(editingExpense.categoryId);
      setDate(editingExpense.date);
      setPaymentMethod(editingExpense.paymentMethod || 'UPI');
      setNote(editingExpense.note || '');
    } else {
      // Defaults for new expense
      setAmount('');
      setCategoryId(categories[0]?.id || 'food');
      setDate(getTodayDateString());
      setPaymentMethod('UPI');
      setNote('');
    }
    setErrors({});
  }, [editingExpense, isExpenseModalOpen, categories]);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    const parsedAmount = parseFloat(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }

    if (!categoryId) {
      newErrors.category = 'Please choose a category';
    }

    if (!date) {
      newErrors.date = 'Please select a date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const parsedAmount = parseFloat(amount);

    if (editingExpense) {
      updateExpense(editingExpense.id, {
        amount: parsedAmount,
        categoryId,
        date,
        paymentMethod: paymentMethod ? (paymentMethod as PaymentMethod) : undefined,
        note: note.trim() || undefined,
      });
    } else {
      addExpense({
        amount: parsedAmount,
        categoryId,
        date,
        paymentMethod: paymentMethod ? (paymentMethod as PaymentMethod) : undefined,
        note: note.trim() || undefined,
      });
    }

    closeExpenseModal();
  };

  const setDateShortcut = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() - offsetDays);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    setDate(`${y}-${m}-${day}`);
  };

  return (
    <Modal
      isOpen={isExpenseModalOpen}
      onClose={closeExpenseModal}
      title={editingExpense ? 'Edit Expense' : 'Record New Expense'}
      subtitle={
        editingExpense
          ? 'Modify the details of your recorded transaction'
          : 'Manually track an expense. Stored 100% locally on this device.'
      }
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Amount Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Amount *
          </label>
          <div className="relative rounded-2xl shadow-xs">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 font-bold text-xl">
              {settings.currencySymbol}
            </div>
            <input
              type="number"
              step="any"
              min="1"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }));
              }}
              placeholder="0.00"
              autoFocus
              className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-2xl text-2xl font-extrabold text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 transition-all ${
                errors.amount
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-slate-200 focus:border-brand-500 focus:ring-brand-100'
              }`}
            />
          </div>
          {errors.amount && (
            <p className="text-xs text-red-500 font-medium mt-1.5">{errors.amount}</p>
          )}
        </div>

        {/* Category Selection Grid */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Category *
            </label>
            <span className="text-xs text-slate-400">
              {categories.find((c) => c.id === categoryId)?.name || 'Select'}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2 max-h-44 overflow-y-auto p-1 bg-slate-50/80 rounded-2xl border border-slate-200/80">
            {categories.map((cat) => {
              const isSelected = categoryId === cat.id;
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => {
                    setCategoryId(cat.id);
                    if (errors.category) setErrors((prev) => ({ ...prev, category: undefined }));
                  }}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-white ring-2 ring-brand-500 shadow-md scale-105'
                      : 'hover:bg-white/80 opacity-80 hover:opacity-100'
                  }`}
                >
                  <CategoryIcon category={cat} size="sm" />
                  <span className="text-[11px] font-semibold text-slate-700 mt-1 truncate max-w-[55px] text-center">
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
          {errors.category && (
            <p className="text-xs text-red-500 font-medium mt-1.5">{errors.category}</p>
          )}
        </div>

        {/* Date Field with Quick Buttons */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Date *
            </label>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setDateShortcut(0)}
                className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setDateShortcut(1)}
                className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                Yesterday
              </button>
            </div>
          </div>

          <div className="relative">
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }));
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-100 focus:border-brand-500"
            />
          </div>
          {errors.date && <p className="text-xs text-red-500 font-medium mt-1.5">{errors.date}</p>}
        </div>

        {/* Payment Method Pills (Optional) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Payment Method <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {PAYMENT_METHODS.map((method) => {
              const isSelected = paymentMethod === method;
              return (
                <button
                  type="button"
                  key={method}
                  onClick={() => setPaymentMethod(isSelected ? '' : method)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    isSelected
                      ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {method}
                </button>
              );
            })}
          </div>
        </div>

        {/* Note / Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Note / Description <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Swiggy dinner, Metro recharge, Books"
              maxLength={120}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-100 focus:border-brand-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={closeExpenseModal}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/30 transition-all hover:shadow-lg active:scale-98"
          >
            <Check size={16} strokeWidth={2.5} />
            <span>{editingExpense ? 'Save Changes' : 'Record Expense'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
