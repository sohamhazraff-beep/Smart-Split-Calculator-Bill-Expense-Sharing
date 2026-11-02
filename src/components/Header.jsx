import React, { useState } from 'react';
import {
  Sun,
  Moon,
  RotateCcw,
  Sparkles,
  Receipt,
  HelpCircle
} from 'lucide-react';
import { CURRENCIES } from '../utils/currencies';
import { DEMO_PRESETS } from '../utils/sampleData';

export const Header = ({
  theme,
  toggleTheme,
  currency,
  setCurrency,
  onReset,
  onLoadDemo,
  onOpenReceipt
}) => {
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="brand-group">
          <div className="brand-icon-wrapper">
            <Receipt className="brand-icon" size={28} />
          </div>
          <div className="brand-text">
            <div className="brand-title-row">
              <h1 className="brand-title">SplitSmart</h1>
              <span className="brand-badge">PRO</span>
            </div>
            <p className="brand-tagline">Smart Bill Split & Expense Settlement</p>
          </div>
        </div>

        <div className="header-actions">
          {/* Currency selector */}
          <div className="currency-selector-wrapper">
            <select
              className="currency-dropdown"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              title="Select Currency"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.symbol} {c.code} ({c.name})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Demo loader */}
          <div className="demo-menu-container">
            <button
              type="button"
              className="btn btn-secondary btn-icon-text"
              onClick={() => setShowDemoMenu(!showDemoMenu)}
              title="Load realistic example bill"
            >
              <Sparkles size={16} className="text-accent" />
              <span className="hide-mobile">Demo</span>
            </button>

            {showDemoMenu && (
              <div className="dropdown-menu demo-dropdown animate-fadeIn">
                <div className="dropdown-header">Load Preset Scenario</div>
                {DEMO_PRESETS.map((demo) => (
                  <button
                    key={demo.id}
                    type="button"
                    className="dropdown-item"
                    onClick={() => {
                      onLoadDemo(demo);
                      setShowDemoMenu(false);
                    }}
                  >
                    <span className="dropdown-item-title">{demo.title}</span>
                    <span className="dropdown-item-sub">
                      {demo.category} • {demo.participants.length} people
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View Receipt button */}
          <button
            type="button"
            className="btn btn-secondary btn-icon"
            onClick={onOpenReceipt}
            title="View Formatted Receipt"
          >
            <Receipt size={18} />
          </button>

          {/* Theme toggle */}
          <button
            type="button"
            className="btn btn-secondary btn-icon theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun size={18} className="theme-icon sun" />
            ) : (
              <Moon size={18} className="theme-icon moon" />
            )}
          </button>

          {/* Reset button */}
          <button
            type="button"
            className="btn btn-danger-outline btn-icon-text"
            onClick={onReset}
            title="Reset bill and participants"
          >
            <RotateCcw size={16} />
            <span className="hide-mobile">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
