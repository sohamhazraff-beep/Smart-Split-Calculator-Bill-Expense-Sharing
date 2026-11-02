/**
 * Helper utilities for formatting and social sharing
 */

export const getInitials = (name = '') => {
  if (!name.trim()) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const generateShareText = ({
  title,
  date,
  category,
  subtotal,
  discountAmount,
  taxAmount,
  tipAmount,
  grandTotal,
  currency,
  participants,
  transactions,
  formatCurrencyFn
}) => {
  let text = `🧾 *SplitSmart Expense Summary*\n`;
  if (title) text += `📌 *${title}* (${category || 'General'})\n`;
  text += `📅 ${date || new Date().toLocaleDateString()}\n`;
  text += `─────────────────────\n`;
  text += `Subtotal: ${formatCurrencyFn(subtotal, currency)}\n`;
  if (discountAmount > 0) text += `Discount: -${formatCurrencyFn(discountAmount, currency)}\n`;
  if (taxAmount > 0) text += `Tax: +${formatCurrencyFn(taxAmount, currency)}\n`;
  if (tipAmount > 0) text += `Tip: +${formatCurrencyFn(tipAmount, currency)}\n`;
  text += `💰 *Grand Total: ${formatCurrencyFn(grandTotal, currency)}*\n`;
  text += `─────────────────────\n\n`;

  text += `👥 *Individual Breakdown:*\n`;
  participants.forEach((p) => {
    text += `• ${p.name}: ${formatCurrencyFn(p.totalShare, currency)}`;
    if (p.balance > 0.01) {
      text += ` (Gets back ${formatCurrencyFn(p.balance, currency)})`;
    } else if (p.balance < -0.01) {
      text += ` (Owes ${formatCurrencyFn(Math.abs(p.balance), currency)})`;
    } else {
      text += ` (Settled)`;
    }
    text += `\n`;
  });

  if (transactions && transactions.length > 0) {
    text += `\n🔄 *Settlement Plan (Who Pays Who):*\n`;
    transactions.forEach((tx) => {
      text += `👉 *${tx.fromName}* owes *${tx.toName}*: ${formatCurrencyFn(tx.amount, currency)}\n`;
    });
  }

  text += `\nCalculated with SplitSmart ⚡`;
  return text;
};
