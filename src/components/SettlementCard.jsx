import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle,
  Copy,
  Check,
  Share2,
  Sparkles,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Circle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCurrency } from '../utils/currencies';
import { getInitials, generateShareText } from '../utils/helpers';

export const SettlementCard = ({
  participants,
  settlementData,
  currency,
  billTotals,
  title,
  category,
  date
}) => {
  const { participantsWithPaid, transactions } = settlementData;
  const [settledTxIds, setSettledTxIds] = useState(new Set());
  const [copied, setCopied] = useState(false);

  const toggleTxSettled = (id) => {
    const next = new Set(settledTxIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
      // Trigger a small burst of confetti when marking a debt paid!
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.85 }
      });
    }
    setSettledTxIds(next);
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleCopySummary = async () => {
    const text = generateShareText({
      title,
      date,
      category,
      subtotal: billTotals.subtotal,
      discountAmount: billTotals.discountAmount,
      taxAmount: billTotals.taxAmount,
      tipAmount: billTotals.tipAmount,
      grandTotal: billTotals.grandTotal,
      currency,
      participants: participantsWithPaid,
      transactions,
      formatCurrencyFn: formatCurrency
    });

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="card settlement-card">
      <div className="card-header">
        <div className="card-title-group">
          <div className="card-icon-pill bg-success-soft">
            <Share2 size={20} className="text-success" />
          </div>
          <div>
            <h2 className="card-title">Settlement & Who Owes Who</h2>
            <p className="card-subtitle">
              Net balances and simplified transfers between friends
            </p>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-icon-text"
          onClick={triggerCelebration}
          title="Celebrate bill settled"
        >
          <Sparkles size={16} className="text-accent" />
          <span>Celebrate</span>
        </button>
      </div>

      <div className="card-body">
        {/* Net Balances Grid */}
        <h3 className="section-label mb-2">Participant Balance Status</h3>
        <div className="balance-grid">
          {participantsWithPaid.map((p) => {
            const initials = getInitials(p.name);
            const isCreditor = p.balance > 0.009;
            const isDebtor = p.balance < -0.009;
            const isSettled = !isCreditor && !isDebtor;

            return (
              <div
                key={p.id}
                className={`balance-card ${
                  isCreditor ? 'card-creditor' : isDebtor ? 'card-debtor' : 'card-settled'
                }`}
              >
                <div className="balance-card-header">
                  <div
                    className="avatar-circle-sm"
                    style={{ backgroundColor: p.avatarColor || '#6366f1' }}
                  >
                    {initials}
                  </div>
                  <span className="balance-person-name">{p.name}</span>
                </div>

                <div className="balance-card-details">
                  <div className="detail-line">
                    <span className="muted-text">Share:</span>
                    <span className="font-mono">{formatCurrency(p.totalShare, currency)}</span>
                  </div>
                  <div className="detail-line">
                    <span className="muted-text">Paid:</span>
                    <span className="font-mono">{formatCurrency(p.paidAmount, currency)}</span>
                  </div>
                </div>

                <div className="balance-status-badge">
                  {isCreditor && (
                    <span className="status-badge badge-creditor">
                      <ArrowDownLeft size={14} /> Gets back {formatCurrency(p.balance, currency)}
                    </span>
                  )}
                  {isDebtor && (
                    <span className="status-badge badge-debtor">
                      <ArrowUpRight size={14} /> Owes {formatCurrency(Math.abs(p.balance), currency)}
                    </span>
                  )}
                  {isSettled && (
                    <span className="status-badge badge-settled">
                      <CheckCircle size={14} /> Settled
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Simplified Settlement Transfers */}
        <div className="settlement-transfers-section mt-4">
          <div className="settlement-section-header">
            <div>
              <h3 className="section-label">Smart Payment Directions</h3>
              <p className="card-subtitle">
                {transactions.length === 0
                  ? 'All balances are settled! No payments needed.'
                  : `Minimum ${transactions.length} transfer${
                      transactions.length > 1 ? 's' : ''
                    } to settle all debts:`}
              </p>
            </div>
          </div>

          {transactions.length > 0 ? (
            <div className="transfers-list">
              {transactions.map((tx) => {
                const isPaid = settledTxIds.has(tx.id);

                return (
                  <div
                    key={tx.id}
                    className={`transfer-row ${isPaid ? 'transfer-settled' : ''}`}
                  >
                    <div className="transfer-party from-party">
                      <div
                        className="avatar-circle-xs"
                        style={{ backgroundColor: tx.fromColor || '#6366f1' }}
                      >
                        {getInitials(tx.fromName)}
                      </div>
                      <span className="transfer-name">{tx.fromName}</span>
                    </div>

                    <div className="transfer-arrow-block">
                      <span className="transfer-action">pays</span>
                      <div className="transfer-arrow-line">
                        <ArrowRight size={16} />
                      </div>
                      <span className="transfer-amount font-mono">
                        {formatCurrency(tx.amount, currency)}
                      </span>
                    </div>

                    <div className="transfer-party to-party">
                      <div
                        className="avatar-circle-xs"
                        style={{ backgroundColor: tx.toColor || '#10b981' }}
                      >
                        {getInitials(tx.toName)}
                      </div>
                      <span className="transfer-name">{tx.toName}</span>
                    </div>

                    <button
                      type="button"
                      className={`btn-check-settle ${isPaid ? 'checked' : ''}`}
                      onClick={() => toggleTxSettled(tx.id)}
                      title={isPaid ? 'Mark as unpaid' : 'Mark as paid'}
                    >
                      {isPaid ? (
                        <>
                          <CheckCircle2 size={16} className="text-success" />
                          <span>Paid</span>
                        </>
                      ) : (
                        <>
                          <Circle size={16} />
                          <span>Mark Paid</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-settlements-box">
              <CheckCircle2 size={32} className="text-success mb-2" />
              <p className="font-semibold">Everyone is completely squared away!</p>
              <p className="text-muted text-sm">
                No debts or remaining payments among participants.
              </p>
            </div>
          )}
        </div>

        {/* Share & Copy Action */}
        <div className="share-actions-bar mt-4">
          <button
            type="button"
            className="btn btn-primary btn-icon-text btn-block"
            onClick={handleCopySummary}
          >
            {copied ? (
              <>
                <Check size={18} />
                <span>Copied Breakdown to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy size={18} />
                <span>Copy Summary for WhatsApp / Chat</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
