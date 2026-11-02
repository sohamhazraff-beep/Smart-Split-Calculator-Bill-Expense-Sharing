import React from 'react';
import {
  CreditCard,
  UserCheck,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { formatCurrency } from '../utils/currencies';
import { getInitials } from '../utils/helpers';

export const PaymentTracker = ({
  participants,
  setParticipants,
  payerMode,
  setPayerMode,
  singlePayerId,
  setSinglePayerId,
  grandTotal,
  currency,
  settlementData
}) => {
  const { totalPaid, isBalanced } = settlementData;
  const difference = Number((grandTotal - totalPaid).toFixed(2));

  const handlePaidChange = (id, amount) => {
    setParticipants(
      participants.map((p) =>
        p.id === id ? { ...p, paidAmount: Math.max(0, amount) } : p
      )
    );
  };

  return (
    <div className="card payment-tracker-card">
      <div className="card-header">
        <div className="card-title-group">
          <div className="card-icon-pill bg-purple-soft">
            <CreditCard size={20} className="text-purple" />
          </div>
          <div>
            <h2 className="card-title">Who Paid The Bill?</h2>
            <p className="card-subtitle">Track payment source to calculate who owes who</p>
          </div>
        </div>

        {/* Payer Mode Toggle: Single vs Multiple */}
        <div className="segmented-toggle">
          <button
            type="button"
            className={`seg-btn ${payerMode === 'single' ? 'active' : ''}`}
            onClick={() => setPayerMode('single')}
          >
            <UserCheck size={14} />
            <span>One Person Paid</span>
          </button>
          <button
            type="button"
            className={`seg-btn ${payerMode === 'multiple' ? 'active' : ''}`}
            onClick={() => setPayerMode('multiple')}
          >
            <Users size={14} />
            <span>Multiple People Paid</span>
          </button>
        </div>
      </div>

      <div className="card-body">
        {payerMode === 'single' ? (
          <div className="single-payer-selection">
            <label className="form-label font-semibold">
              Select the person who covered the full amount ({formatCurrency(grandTotal, currency)}):
            </label>
            <div className="payer-pills-grid">
              {participants.map((p) => {
                const isSelected = p.id === singlePayerId;
                const initials = getInitials(p.name);

                return (
                  <button
                    key={p.id}
                    type="button"
                    className={`payer-select-pill ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSinglePayerId(p.id)}
                  >
                    <div
                      className="avatar-circle-sm"
                      style={{ backgroundColor: p.avatarColor || '#6366f1' }}
                    >
                      {initials}
                    </div>
                    <span className="payer-name">{p.name}</span>
                    {isSelected && <span className="payer-badge">Payer</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="multiple-payers-section animate-fadeIn">
            <div className="multi-payer-header">
              <label className="form-label font-semibold">
                Enter amount paid by each person:
              </label>
              <div
                className={`paid-status-badge ${
                  isBalanced ? 'status-ok' : 'status-warning'
                }`}
              >
                {isBalanced ? (
                  <>
                    <CheckCircle2 size={15} />
                    <span>Total Paid Matches Bill ({formatCurrency(totalPaid, currency)})</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle size={15} />
                    <span>
                      Paid: {formatCurrency(totalPaid, currency)} / Bill:{' '}
                      {formatCurrency(grandTotal, currency)} (
                      {difference > 0
                        ? `${formatCurrency(difference, currency)} unrecorded`
                        : `${formatCurrency(Math.abs(difference), currency)} overpaid`}
                      )
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="multi-payer-inputs-grid">
              {participants.map((p) => {
                const initials = getInitials(p.name);
                return (
                  <div key={p.id} className="multi-payer-row">
                    <div className="multi-payer-identity">
                      <div
                        className="avatar-circle-sm"
                        style={{ backgroundColor: p.avatarColor || '#6366f1' }}
                      >
                        {initials}
                      </div>
                      <span className="multi-payer-name">{p.name}</span>
                    </div>

                    <div className="input-with-symbol compact">
                      <span className="input-symbol">{currency}</span>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        className="form-input multi-payer-input"
                        placeholder="0.00"
                        value={p.paidAmount ?? ''}
                        onChange={(e) =>
                          handlePaidChange(
                            p.id,
                            parseFloat(e.target.value) || 0
                          )
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
