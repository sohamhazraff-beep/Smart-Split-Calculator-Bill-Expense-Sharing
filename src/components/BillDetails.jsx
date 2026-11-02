import React, { useState } from 'react';
import {
  DollarSign,
  Percent,
  Tag,
  Receipt,
  FileText,
  Calendar,
  Sparkles,
  Layers
} from 'lucide-react';
import { CATEGORIES } from '../utils/sampleData';
import { formatCurrency } from '../utils/currencies';

export const BillDetails = ({
  title,
  setTitle,
  category,
  setCategory,
  date,
  setDate,
  subtotal,
  setSubtotal,
  discount,
  setDiscount,
  tax,
  setTax,
  tip,
  setTip,
  currency,
  billTotals
}) => {
  const [showCustomDiscount, setShowCustomDiscount] = useState(false);
  const [showCustomTax, setShowCustomTax] = useState(false);
  const [showCustomTip, setShowCustomTip] = useState(false);

  const discountPresets = [0, 5, 10, 15, 20];
  const taxPresets = [0, 5, 8, 10, 15, 18];
  const tipPresets = [0, 10, 15, 18, 20, 25];

  const handleSubtotalChange = (e) => {
    const val = e.target.value;
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      setSubtotal(val);
    }
  };

  return (
    <div className="card bill-details-card">
      <div className="card-header">
        <div className="card-title-group">
          <div className="card-icon-pill bg-primary-soft">
            <Receipt size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="card-title">Bill & Expense Details</h2>
            <p className="card-subtitle">Enter bill amount, discounts, taxes & tips</p>
          </div>
        </div>
      </div>

      <div className="card-body">
        {/* Bill Metadata: Title, Category, Date */}
        <div className="meta-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="bill-title">
              <FileText size={15} />
              <span>Bill Name / Memo</span>
            </label>
            <input
              id="bill-title"
              type="text"
              className="form-input"
              placeholder="e.g. Dinner with Friends, Airbnb, Groceries..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="bill-category">
              <Layers size={15} />
              <span>Category</span>
            </label>
            <select
              id="bill-category"
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="bill-date">
              <Calendar size={15} />
              <span>Date</span>
            </label>
            <input
              id="bill-date"
              type="date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* Subtotal input */}
        <div className="subtotal-section">
          <label className="form-label font-semibold" htmlFor="bill-subtotal">
            <span>Subtotal (Base Bill Amount)</span>
          </label>
          <div className="subtotal-input-wrapper">
            <span className="currency-prefix">{currency}</span>
            <input
              id="bill-subtotal"
              type="text"
              inputMode="decimal"
              className="subtotal-input"
              placeholder="0.00"
              value={subtotal}
              onChange={handleSubtotalChange}
            />
          </div>
        </div>

        {/* Tip, Tax, and Discount Sections */}
        <div className="adjustments-grid">
          {/* Tip Section */}
          <div className="adjustment-box">
            <div className="adjustment-header">
              <div className="adjustment-title-row">
                <span className="adjustment-label">Tip</span>
                <span className="adjustment-calc-badge text-accent">
                  +{formatCurrency(billTotals.tipAmount, currency)}
                </span>
              </div>
              <div className="type-toggle-pill">
                <button
                  type="button"
                  className={`toggle-option ${tip.type === 'percent' ? 'active' : ''}`}
                  onClick={() => setTip({ ...tip, type: 'percent' })}
                >
                  %
                </button>
                <button
                  type="button"
                  className={`toggle-option ${tip.type === 'fixed' ? 'active' : ''}`}
                  onClick={() => setTip({ ...tip, type: 'fixed' })}
                >
                  {currency}
                </button>
              </div>
            </div>

            {tip.type === 'percent' ? (
              <div className="preset-buttons-grid">
                {tipPresets.map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    className={`preset-btn ${
                      !showCustomTip && Number(tip.value) === pct ? 'selected' : ''
                    }`}
                    onClick={() => {
                      setShowCustomTip(false);
                      setTip({ type: 'percent', value: pct });
                    }}
                  >
                    {pct}%
                  </button>
                ))}
                <button
                  type="button"
                  className={`preset-btn ${showCustomTip ? 'selected' : ''}`}
                  onClick={() => setShowCustomTip(true)}
                >
                  Custom
                </button>
              </div>
            ) : null}

            {(tip.type === 'fixed' || showCustomTip) && (
              <div className="custom-input-group animate-fadeIn">
                <div className="input-with-symbol">
                  <span className="input-symbol">
                    {tip.type === 'percent' ? '%' : currency}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step={tip.type === 'percent' ? '1' : '0.5'}
                    className="form-input custom-adjust-input"
                    placeholder="Enter custom tip"
                    value={tip.value}
                    onChange={(e) =>
                      setTip({
                        ...tip,
                        value: Math.max(0, parseFloat(e.target.value) || 0)
                      })
                    }
                  />
                </div>
              </div>
            )}
          </div>

          {/* Tax Section */}
          <div className="adjustment-box">
            <div className="adjustment-header">
              <div className="adjustment-title-row">
                <span className="adjustment-label">Tax</span>
                <span className="adjustment-calc-badge text-warning">
                  +{formatCurrency(billTotals.taxAmount, currency)}
                </span>
              </div>
              <div className="type-toggle-pill">
                <button
                  type="button"
                  className={`toggle-option ${tax.type === 'percent' ? 'active' : ''}`}
                  onClick={() => setTax({ ...tax, type: 'percent' })}
                >
                  %
                </button>
                <button
                  type="button"
                  className={`toggle-option ${tax.type === 'fixed' ? 'active' : ''}`}
                  onClick={() => setTax({ ...tax, type: 'fixed' })}
                >
                  {currency}
                </button>
              </div>
            </div>

            {tax.type === 'percent' ? (
              <div className="preset-buttons-grid">
                {taxPresets.map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    className={`preset-btn ${
                      !showCustomTax && Number(tax.value) === pct ? 'selected' : ''
                    }`}
                    onClick={() => {
                      setShowCustomTax(false);
                      setTax({ type: 'percent', value: pct });
                    }}
                  >
                    {pct}%
                  </button>
                ))}
                <button
                  type="button"
                  className={`preset-btn ${showCustomTax ? 'selected' : ''}`}
                  onClick={() => setShowCustomTax(true)}
                >
                  Custom
                </button>
              </div>
            ) : null}

            {(tax.type === 'fixed' || showCustomTax) && (
              <div className="custom-input-group animate-fadeIn">
                <div className="input-with-symbol">
                  <span className="input-symbol">
                    {tax.type === 'percent' ? '%' : currency}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step={tax.type === 'percent' ? '0.5' : '1'}
                    className="form-input custom-adjust-input"
                    placeholder="Enter custom tax"
                    value={tax.value}
                    onChange={(e) =>
                      setTax({
                        ...tax,
                        value: Math.max(0, parseFloat(e.target.value) || 0)
                      })
                    }
                  />
                </div>
              </div>
            )}
          </div>

          {/* Discount Section */}
          <div className="adjustment-box">
            <div className="adjustment-header">
              <div className="adjustment-title-row">
                <span className="adjustment-label">Discount / Promo</span>
                <span className="adjustment-calc-badge text-success">
                  -{formatCurrency(billTotals.discountAmount, currency)}
                </span>
              </div>
              <div className="type-toggle-pill">
                <button
                  type="button"
                  className={`toggle-option ${discount.type === 'percent' ? 'active' : ''}`}
                  onClick={() => setDiscount({ ...discount, type: 'percent' })}
                >
                  %
                </button>
                <button
                  type="button"
                  className={`toggle-option ${discount.type === 'fixed' ? 'active' : ''}`}
                  onClick={() => setDiscount({ ...discount, type: 'fixed' })}
                >
                  {currency}
                </button>
              </div>
            </div>

            {discount.type === 'percent' ? (
              <div className="preset-buttons-grid">
                {discountPresets.map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    className={`preset-btn ${
                      !showCustomDiscount && Number(discount.value) === pct
                        ? 'selected'
                        : ''
                    }`}
                    onClick={() => {
                      setShowCustomDiscount(false);
                      setDiscount({ type: 'percent', value: pct });
                    }}
                  >
                    {pct}%
                  </button>
                ))}
                <button
                  type="button"
                  className={`preset-btn ${showCustomDiscount ? 'selected' : ''}`}
                  onClick={() => setShowCustomDiscount(true)}
                >
                  Custom
                </button>
              </div>
            ) : null}

            {(discount.type === 'fixed' || showCustomDiscount) && (
              <div className="custom-input-group animate-fadeIn">
                <div className="input-with-symbol">
                  <span className="input-symbol">
                    {discount.type === 'percent' ? '%' : currency}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    className="form-input custom-adjust-input"
                    placeholder="Enter discount"
                    value={discount.value}
                    onChange={(e) =>
                      setDiscount({
                        ...discount,
                        value: Math.max(0, parseFloat(e.target.value) || 0)
                      })
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
