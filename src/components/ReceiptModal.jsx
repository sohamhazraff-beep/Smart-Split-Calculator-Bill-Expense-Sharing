import React from 'react';
import { X, Printer, Receipt, Check, Calendar, Tag, Users } from 'lucide-react';
import { formatCurrency } from '../utils/currencies';

export const ReceiptModal = ({
  isOpen,
  onClose,
  title,
  category,
  date,
  currency,
  billTotals,
  participants,
  settlementData
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const { subtotal, discountAmount, taxAmount, tipAmount, grandTotal } = billTotals;
  const { participantsWithPaid, transactions } = settlementData;

  return (
    <div className="modal-backdrop animate-fadeIn" onClick={onClose}>
      <div
        className="modal-content receipt-modal-box animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="receipt-modal-actions no-print">
          <button
            type="button"
            className="btn btn-secondary btn-icon-text"
            onClick={handlePrint}
          >
            <Printer size={16} />
            <span>Print Receipt</span>
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-icon"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Printable Receipt Paper */}
        <div className="receipt-paper" id="printable-receipt">
          <div className="receipt-header-center">
            <div className="receipt-logo-circle">
              <Receipt size={24} />
            </div>
            <h2 className="receipt-brand">SplitSmart</h2>
            <p className="receipt-type">OFFICIAL EXPENSE STATEMENT</p>
          </div>

          <div className="receipt-dashed-line" />

          <div className="receipt-meta-rows">
            <div className="receipt-meta-row">
              <span className="receipt-meta-label">Title:</span>
              <span className="receipt-meta-val font-semibold">
                {title || 'General Expense'}
              </span>
            </div>
            <div className="receipt-meta-row">
              <span className="receipt-meta-label">Category:</span>
              <span className="receipt-meta-val">{category || 'General'}</span>
            </div>
            <div className="receipt-meta-row">
              <span className="receipt-meta-label">Date:</span>
              <span className="receipt-meta-val">
                {date || new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="receipt-dashed-line" />

          {/* Line items summary */}
          <div className="receipt-items-table">
            <div className="receipt-table-row">
              <span>Bill Subtotal</span>
              <span className="font-mono">{formatCurrency(subtotal, currency)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="receipt-table-row text-success">
                <span>Discount Savings</span>
                <span className="font-mono">-{formatCurrency(discountAmount, currency)}</span>
              </div>
            )}

            {taxAmount > 0 && (
              <div className="receipt-table-row">
                <span>Tax</span>
                <span className="font-mono">+{formatCurrency(taxAmount, currency)}</span>
              </div>
            )}

            {tipAmount > 0 && (
              <div className="receipt-table-row">
                <span>Tip / Gratuity</span>
                <span className="font-mono">+{formatCurrency(tipAmount, currency)}</span>
              </div>
            )}

            <div className="receipt-dashed-line" />

            <div className="receipt-table-row receipt-total-row">
              <span className="font-bold">TOTAL AMOUNT</span>
              <span className="font-bold font-mono">
                {formatCurrency(grandTotal, currency)}
              </span>
            </div>
          </div>

          <div className="receipt-dashed-line" />

          {/* Participant Breakdown */}
          <div className="receipt-section-heading">PARTICIPANT BREAKDOWN</div>
          <div className="receipt-participants-list">
            {participantsWithPaid.map((p) => (
              <div key={p.id} className="receipt-p-row">
                <span className="receipt-p-name">{p.name}</span>
                <div className="receipt-p-numbers font-mono">
                  <span>Share: {formatCurrency(p.totalShare, currency)}</span>
                  <span className="receipt-p-status">
                    {p.balance > 0.01
                      ? `(Gets back ${formatCurrency(p.balance, currency)})`
                      : p.balance < -0.01
                      ? `(Owes ${formatCurrency(Math.abs(p.balance), currency)})`
                      : '(Settled)'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Transfers */}
          {transactions.length > 0 && (
            <>
              <div className="receipt-dashed-line" />
              <div className="receipt-section-heading">PAYMENT TRANSFERS</div>
              <div className="receipt-tx-list">
                {transactions.map((tx, idx) => (
                  <div key={idx} className="receipt-tx-row font-mono">
                    <span>
                      {tx.fromName} ➔ {tx.toName}
                    </span>
                    <span className="font-bold">
                      {formatCurrency(tx.amount, currency)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="receipt-dashed-line" />

          {/* Fake Barcode Graphic */}
          <div className="receipt-barcode-container">
            <div className="barcode-bars">
              {[...Array(32)].map((_, i) => (
                <span
                  key={i}
                  className="barcode-bar"
                  style={{
                    width: i % 3 === 0 ? '3px' : i % 2 === 0 ? '2px' : '1px'
                  }}
                />
              ))}
            </div>
            <p className="barcode-number">SPLITSMART-{Date.now().toString().slice(-8)}</p>
          </div>

          <p className="receipt-footer-text">
            Thank you for splitting smart with SplitSmart! ⚡
          </p>
        </div>
      </div>
    </div>
  );
};
