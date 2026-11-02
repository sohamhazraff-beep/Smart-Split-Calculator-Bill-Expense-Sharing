import React from 'react';
import {
  TrendingUp,
  CreditCard,
  Users,
  Percent,
  Receipt,
  Sparkles,
  Award
} from 'lucide-react';
import { formatCurrency } from '../utils/currencies';

export const SummaryCard = ({
  billTotals,
  currency,
  participantsCount,
  discount,
  tax,
  tip,
  onOpenReceipt
}) => {
  const { subtotal, discountAmount, discountedSubtotal, taxAmount, tipAmount, grandTotal } =
    billTotals;

  const averagePerPerson =
    participantsCount > 0 ? Number((grandTotal / participantsCount).toFixed(2)) : 0;

  // Visual breakdown percentages
  const totalPositive = (discountedSubtotal || 0) + (taxAmount || 0) + (tipAmount || 0);
  const subPct = totalPositive > 0 ? ((discountedSubtotal / totalPositive) * 100).toFixed(1) : 0;
  const taxPct = totalPositive > 0 ? ((taxAmount / totalPositive) * 100).toFixed(1) : 0;
  const tipPct = totalPositive > 0 ? ((tipAmount / totalPositive) * 100).toFixed(1) : 0;

  return (
    <div className="card summary-card glow-effect">
      <div className="summary-hero">
        <div className="summary-hero-content">
          <span className="summary-hero-label">Total Amount Due</span>
          <div className="summary-hero-amount">
            {formatCurrency(grandTotal, currency)}
          </div>
          <div className="summary-hero-meta">
            <span className="summary-avg-badge">
              <Users size={14} />
              <span>
                Avg: {formatCurrency(averagePerPerson, currency)} / person ({participantsCount} people)
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Visual Proportion Bar */}
      {grandTotal > 0 && (
        <div className="proportion-bar-container">
          <div className="proportion-bar">
            <div
              className="prop-segment prop-subtotal"
              style={{ width: `${subPct}%` }}
              title={`Subtotal: ${subPct}%`}
            />
            <div
              className="prop-segment prop-tax"
              style={{ width: `${taxPct}%` }}
              title={`Tax: ${taxPct}%`}
            />
            <div
              className="prop-segment prop-tip"
              style={{ width: `${tipPct}%` }}
              title={`Tip: ${tipPct}%`}
            />
          </div>
          <div className="prop-legend">
            <span className="legend-item">
              <span className="dot dot-subtotal" /> Food & Items ({subPct}%)
            </span>
            {taxAmount > 0 && (
              <span className="legend-item">
                <span className="dot dot-tax" /> Tax ({taxPct}%)
              </span>
            )}
            {tipAmount > 0 && (
              <span className="legend-item">
                <span className="dot dot-tip" /> Tip ({tipPct}%)
              </span>
            )}
          </div>
        </div>
      )}

      {/* Itemized Table Breakdown */}
      <div className="summary-breakdown">
        <div className="breakdown-row">
          <span className="breakdown-label">Bill Subtotal</span>
          <span className="breakdown-value font-mono">
            {formatCurrency(subtotal, currency)}
          </span>
        </div>

        {discountAmount > 0 && (
          <div className="breakdown-row text-success">
            <span className="breakdown-label">
              Discount Savings ({discount.type === 'percent' ? `${discount.value}%` : 'Fixed'})
            </span>
            <span className="breakdown-value font-mono">
              -{formatCurrency(discountAmount, currency)}
            </span>
          </div>
        )}

        {discountAmount > 0 && (
          <div className="breakdown-row muted">
            <span className="breakdown-label">Discounted Subtotal</span>
            <span className="breakdown-value font-mono">
              {formatCurrency(discountedSubtotal, currency)}
            </span>
          </div>
        )}

        <div className="breakdown-row">
          <span className="breakdown-label">
            Tax ({tax.type === 'percent' ? `${tax.value}%` : 'Fixed'})
          </span>
          <span className="breakdown-value font-mono text-warning">
            +{formatCurrency(taxAmount, currency)}
          </span>
        </div>

        <div className="breakdown-row">
          <span className="breakdown-label">
            Tip ({tip.type === 'percent' ? `${tip.value}%` : 'Fixed'})
          </span>
          <span className="breakdown-value font-mono text-accent">
            +{formatCurrency(tipAmount, currency)}
          </span>
        </div>

        <div className="breakdown-divider" />

        <div className="breakdown-row grand-total-row">
          <span className="breakdown-label font-bold">Grand Total</span>
          <span className="breakdown-value font-bold font-mono text-primary">
            {formatCurrency(grandTotal, currency)}
          </span>
        </div>
      </div>

      <button
        type="button"
        className="btn btn-outline-primary btn-block mt-3"
        onClick={onOpenReceipt}
      >
        <Receipt size={16} />
        <span>View Itemized Digital Receipt</span>
      </button>
    </div>
  );
};
