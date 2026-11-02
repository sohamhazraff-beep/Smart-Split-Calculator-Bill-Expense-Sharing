import React from 'react';
import { Users, DollarSign, Percent, PieChart, Check } from 'lucide-react';

export const SplitMethodSelector = ({
  splitMode,
  setSplitMode,
  prorateExtras,
  setProrateExtras
}) => {
  const modes = [
    {
      id: 'equal',
      label: 'Equal Split',
      desc: 'Divide evenly between all people',
      icon: Users
    },
    {
      id: 'custom',
      label: 'Custom Amounts',
      desc: 'Pay for individual items consumed',
      icon: DollarSign
    },
    {
      id: 'percentage',
      label: 'Percentage Split',
      desc: 'Allocate exact percentages (e.g. 40%, 30%)',
      icon: Percent
    },
    {
      id: 'shares',
      label: 'Shares / Ratio',
      desc: 'Split by units/shares (e.g. 2 drinks, 1 drink)',
      icon: PieChart
    }
  ];

  return (
    <div className="card split-selector-card">
      <div className="card-header-compact">
        <h3 className="section-label">How do you want to split this bill?</h3>
      </div>

      <div className="split-modes-grid">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = splitMode === mode.id;

          return (
            <button
              key={mode.id}
              type="button"
              className={`split-mode-pill ${isActive ? 'active' : ''}`}
              onClick={() => setSplitMode(mode.id)}
            >
              <div className="split-mode-icon-box">
                <Icon size={18} />
              </div>
              <div className="split-mode-text">
                <span className="split-mode-title">{mode.label}</span>
                <span className="split-mode-desc">{mode.desc}</span>
              </div>
              {isActive && (
                <div className="active-check-circle">
                  <Check size={14} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {splitMode === 'custom' && (
        <div className="custom-split-options animate-fadeIn">
          <label className="checkbox-label">
            <input
              type="checkbox"
              className="checkbox-input"
              checked={prorateExtras}
              onChange={(e) => setProrateExtras(e.target.checked)}
            />
            <span className="checkbox-text">
              <strong>Prorate Tax & Tip proportionally</strong> (higher spending pays proportional share of taxes & tips)
            </span>
          </label>
        </div>
      )}
    </div>
  );
};
