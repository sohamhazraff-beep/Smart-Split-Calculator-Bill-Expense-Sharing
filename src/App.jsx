import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { BillDetails } from './components/BillDetails';
import { SplitMethodSelector } from './components/SplitMethodSelector';
import { ParticipantsList } from './components/ParticipantsList';
import { PaymentTracker } from './components/PaymentTracker';
import { SummaryCard } from './components/SummaryCard';
import { SettlementCard } from './components/SettlementCard';
import { ReceiptModal } from './components/ReceiptModal';
import { ConfirmModal } from './components/ConfirmModal';

import {
  calculateBillTotals,
  calculateParticipantShares,
  calculateSettlements
} from './utils/calculator';
import { DEMO_PRESETS } from './utils/sampleData';

export function App() {
  // Theme state with localStorage persistence
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('splitsmart_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('splitsmart_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Currency
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('splitsmart_currency') || 'USD';
  });

  useEffect(() => {
    localStorage.setItem('splitsmart_currency', currency);
  }, [currency]);

  // Bill metadata
  const [title, setTitle] = useState('Dinner at Bistro');
  const [category, setCategory] = useState('Dining');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Bill financial parameters
  const [subtotal, setSubtotal] = useState('120.00');
  const [discount, setDiscount] = useState({ type: 'percent', value: 0 });
  const [tax, setTax] = useState({ type: 'percent', value: 8.5 });
  const [tip, setTip] = useState({ type: 'percent', value: 15 });

  // Split mode
  const [splitMode, setSplitMode] = useState('equal');
  const [prorateExtras, setProrateExtras] = useState(true);

  // Participants
  const [participants, setParticipants] = useState([
    {
      id: 'p-1',
      name: 'Alex (You)',
      avatarColor: '#4f46e5',
      customAmount: 40,
      percentage: 33.3,
      shares: 1,
      paidAmount: 148.17,
      included: true
    },
    {
      id: 'p-2',
      name: 'Sarah',
      avatarColor: '#06b6d4',
      customAmount: 45,
      percentage: 33.3,
      shares: 1,
      paidAmount: 0,
      included: true
    },
    {
      id: 'p-3',
      name: 'Jordan',
      avatarColor: '#10b981',
      customAmount: 35,
      percentage: 33.4,
      shares: 1,
      paidAmount: 0,
      included: true
    }
  ]);

  // Payment Tracking
  const [payerMode, setPayerMode] = useState('single');
  const [singlePayerId, setSinglePayerId] = useState('p-1');

  // Modals
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Derived Calculations
  const billTotals = useMemo(() => {
    return calculateBillTotals({
      subtotal: parseFloat(subtotal) || 0,
      discount,
      tax,
      tip
    });
  }, [subtotal, discount, tax, tip]);

  const participantsWithShares = useMemo(() => {
    return calculateParticipantShares({
      participants,
      splitMode,
      billTotals,
      prorateExtras
    });
  }, [participants, splitMode, billTotals, prorateExtras]);

  const settlementData = useMemo(() => {
    return calculateSettlements({
      participants: participantsWithShares,
      payerMode,
      singlePayerId,
      grandTotal: billTotals.grandTotal
    });
  }, [participantsWithShares, payerMode, singlePayerId, billTotals.grandTotal]);

  // Reset bill handler
  const handleReset = () => {
    setTitle('New Bill');
    setCategory('Dining');
    setDate(new Date().toISOString().split('T')[0]);
    setSubtotal('');
    setDiscount({ type: 'percent', value: 0 });
    setTax({ type: 'percent', value: 8 });
    setTip({ type: 'percent', value: 15 });
    setSplitMode('equal');
    setPayerMode('single');
    setParticipants([
      {
        id: 'p-1',
        name: 'Person 1',
        avatarColor: '#4f46e5',
        customAmount: 0,
        percentage: 50,
        shares: 1,
        paidAmount: 0,
        included: true
      },
      {
        id: 'p-2',
        name: 'Person 2',
        avatarColor: '#10b981',
        customAmount: 0,
        percentage: 50,
        shares: 1,
        paidAmount: 0,
        included: true
      }
    ]);
    setSinglePayerId('p-1');
  };

  // Load demo preset
  const handleLoadDemo = (demo) => {
    setTitle(demo.title);
    setCategory(demo.category);
    setDate(new Date().toISOString().split('T')[0]);
    setSubtotal(demo.subtotal.toString());
    setDiscount(demo.discount);
    setTax(demo.tax);
    setTip(demo.tip);
    setSplitMode(demo.splitMode);
    setPayerMode(demo.payerMode);
    setParticipants(demo.participants);
    setSinglePayerId(demo.singlePayerId);
  };

  return (
    <div className="app-layout">
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        currency={currency}
        setCurrency={setCurrency}
        onReset={() => setShowResetConfirm(true)}
        onLoadDemo={handleLoadDemo}
        onOpenReceipt={() => setShowReceiptModal(true)}
      />

      <main className="main-content">
        <div className="dashboard-grid">
          {/* Left Column: Bill Inputs, Split Method, Participants & Payments */}
          <section className="left-panel">
            <BillDetails
              title={title}
              setTitle={setTitle}
              category={category}
              setCategory={setCategory}
              date={date}
              setDate={setDate}
              subtotal={subtotal}
              setSubtotal={setSubtotal}
              discount={discount}
              setDiscount={setDiscount}
              tax={tax}
              setTax={setTax}
              tip={tip}
              setTip={setTip}
              currency={currency}
              billTotals={billTotals}
            />

            <SplitMethodSelector
              splitMode={splitMode}
              setSplitMode={setSplitMode}
              prorateExtras={prorateExtras}
              setProrateExtras={setProrateExtras}
            />

            <ParticipantsList
              participants={participantsWithShares}
              setParticipants={setParticipants}
              splitMode={splitMode}
              currency={currency}
              billTotals={billTotals}
            />

            <PaymentTracker
              participants={participantsWithShares}
              setParticipants={setParticipants}
              payerMode={payerMode}
              setPayerMode={setPayerMode}
              singlePayerId={singlePayerId}
              setSinglePayerId={setSinglePayerId}
              grandTotal={billTotals.grandTotal}
              currency={currency}
              settlementData={settlementData}
            />
          </section>

          {/* Right Column: Sticky Summary & Settlement breakdown */}
          <aside className="right-panel">
            <div className="sticky-sidebar">
              <SummaryCard
                billTotals={billTotals}
                currency={currency}
                participantsCount={participants.length}
                discount={discount}
                tax={tax}
                tip={tip}
                onOpenReceipt={() => setShowReceiptModal(true)}
              />

              <SettlementCard
                participants={participantsWithShares}
                settlementData={settlementData}
                currency={currency}
                billTotals={billTotals}
                title={title}
                category={category}
                date={date}
              />
            </div>
          </aside>
        </div>
      </main>

      {/* Modals */}
      <ReceiptModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        title={title}
        category={category}
        date={date}
        currency={currency}
        billTotals={billTotals}
        participants={participantsWithShares}
        settlementData={settlementData}
      />

      <ConfirmModal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={handleReset}
      />
    </div>
  );
}
export default App;
