# ⚡ SplitSmart – Smart Bill Split Calculator

[![React](https://img.shields.io/badge/React-18.3-61dafb.svg?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, visually stunning, fintech-grade bill splitting web application built with **React.js**, **HTML5**, **CSS3**, and **JavaScript**. 

**SplitSmart** makes group expenses effortless — whether dining out with friends, sharing vacation rental costs, dividing road trip gas, or managing apartment utilities. It accurately calculates tips, taxes, discounts, supports custom spending allocations, and features an intelligent **"Who Owes Who"** debt settlement engine.

---

## ✨ Features at a Glance

- 👥 **Dynamic Group Splitting**: Add and remove unlimited participants dynamically with personalized avatar colors and initials.
- 🎛️ **4 Flexible Split Modes**:
  1. **Equal Split**: Automatically divide the bill evenly among active participants.
  2. **Custom Item Amounts**: Enter exact amounts each person consumed (e.g. food items), with live balance tracking and 1-click auto-distribution of unassigned funds.
  3. **Percentage Split**: Allocate precise custom percentage shares (e.g. 40%, 35%, 25%) with instant 100% balance validation.
  4. **Shares / Ratio**: Split expenses by unit counts (e.g., 2 drinks vs 1 drink).
- 🏷️ **Fair Pro-Rata Tax & Tip Distribution**: Choose whether taxes and tips are pro-rated proportionally to individual spend or split equally.
- 💵 **Tips, Taxes & Discounts**:
  - Quick-preset percentage buttons (0%, 5%, 10%, 15%, 18%, 20%, 25%) or custom inputs.
  - Switch between **percentage (%)** and **fixed amount ($)** for all fees.
- 💳 **Payment & Settlement Tracking**:
  - **Single Payer**: Track who paid the entire check at the venue.
  - **Multiple Payers**: Track multiple people chipping in with card and cash.
- 🔄 **Smart Debt Simplification ("Who Owes Who")**:
  - Uses an optimal greedy debt simplification algorithm to minimize transactions.
  - Interactive **"Mark Paid"** checkmarks with celebration confetti effects.
- 📊 **Visual Expense Dashboard & Receipt**:
  - Real-time proportional color bar displaying breakdown of Subtotal vs Tax vs Tip.
  - Official digital receipt modal with barcode, printable via `Ctrl+P` / `Cmd+P`.
  - 1-click **Copy to WhatsApp / Telegram / Chat** summary generator.
- 🌓 **Dark & Light Mode**: Seamless theme switching with persistent local storage.
- 🌍 **Multi-Currency Support**: USD ($), EUR (€), GBP (£), INR (₹), CAD ($), AUD ($), JPY (¥), SGD ($), AED, CHF, and BRL.
- 🔄 **Reset & Preset Demos**: 1-click reset confirmation modal and built-in preset scenarios (*Dinner at Bistro*, *Weekend Roadtrip*).

---

## 📁 Project Structure

```text
Smart-Split-Calculator-Bill-Expense-Sharing/
├── index.html                     # HTML entry point with Google Fonts
├── package.json                   # Project dependencies and npm scripts
├── vite.config.js                 # Vite bundler configuration
├── src/
│   ├── main.jsx                   # React root entry point
│   ├── App.jsx                    # State orchestration & main dashboard
│   ├── components/                # Reusable React components
│   │   ├── Header.jsx             # Top bar, currency picker, theme toggle, demo menu
│   │   ├── BillDetails.jsx        # Subtotal, tip, tax, discount inputs & presets
│   │   ├── SplitMethodSelector.jsx# Split mode selector pills & prorate options
│   │   ├── ParticipantsList.jsx   # Add/remove friends, custom item inputs, validators
│   │   ├── PaymentTracker.jsx     # Single & multiple payer tracking
│   │   ├── SummaryCard.jsx        # Hero total, average per person, proportion bar
│   │   ├── SettlementCard.jsx     # Who owes who flow, net balances, WhatsApp copy
│   │   ├── ReceiptModal.jsx       # Printable itemized digital receipt
│   │   └── ConfirmModal.jsx       # Safe reset confirmation dialog
│   ├── utils/                     # Pure business logic and utilities
│   │   ├── calculator.js          # Bill math, shares calculation, greedy debt solver
│   │   ├── currencies.js          # Currency formatting and locales
│   │   ├── helpers.js             # Formatter for social sharing & initials
│   │   └── sampleData.js          # Realistic demo presets and avatar palettes
│   └── styles/                    # Modern CSS design system
│       ├── index.css              # Design tokens (colors, dark/light themes, typography)
│       ├── App.css                # Layout grid, header, print media queries
│       └── components.css         # Component-level styling, cards, animations
```

---

## 🚀 Getting Started Locally

Follow these step-by-step instructions to run SplitSmart on your local computer:

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (version 18 or newer) installed. Check with:
```bash
node -v
npm -v
```

### 2. Clone the Repository
```bash
git clone https://github.com/sohamhazraff-beep/Smart-Split-Calculator-Bill-Expense-Sharing.git
cd Smart-Split-Calculator-Bill-Expense-Sharing
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start the Local Development Server
```bash
npm run dev
```
Open your browser and navigate to the local URL (usually `http://localhost:3000` or `http://localhost:5173`).

### 5. Build for Production
To create an optimized production build:
```bash
npm run build
```
The compiled assets will be placed in the `dist/` directory, ready to deploy.

---

## 🧮 How the Calculations Work

1. **Discounts**:
   - If percentage: $\text{Discount} = \text{Subtotal} \times \frac{\text{Discount \%}}{100}$
   - Discounted Subtotal: $\text{Base} = \max(0, \text{Subtotal} - \text{Discount})$
2. **Taxes & Tips**:
   - Calculated on the discounted subtotal so customers only pay tax & tip on the actual bill amount.
3. **Pro-Rata Fee Sharing**:
   - When using **Custom Amounts**, each person's tax and tip shares are weighted proportionally based on their meal spend:
     $$\text{Share Ratio}_i = \frac{\text{Person Amount}_i}{\sum \text{Custom Amounts}}$$
     $$\text{Person Total}_i = \text{Person Amount}_i + \text{Share Ratio}_i \times (\text{Tax} + \text{Tip} - \text{Discount})$$
4. **Greedy Debt Minimization**:
   - Each person's net balance is $\text{Paid} - \text{Share}$.
   - Creditors ($\text{Balance} > 0$) and Debtors ($\text{Balance} < 0$) are matched greedily by maximum debt to reduce the number of total transactions needed to square the bill.

---

## 📤 How to Push and Update on GitHub

If you make modifications and want to push your updates:

```bash
# 1. Check changed files
git status

# 2. Stage all changes
git add .

# 3. Commit with a meaningful message
git commit -m "feat: enhance SplitSmart calculator UI and features"

# 4. Push to GitHub main branch
git push origin main
```

---

## 🌐 Free 1-Click Deployment Options

### Deploy to Vercel:
1. Visit [Vercel](https://vercel.com/) and connect your GitHub account.
2. Click **Add New Project** and select `Smart-Split-Calculator-Bill-Expense-Sharing`.
3. Framework Preset: **Vite**.
4. Click **Deploy**. Vercel will build and give you a live HTTPS link in seconds!

### Deploy to Netlify:
1. Visit [Netlify](https://www.netlify.com/).
2. Select **Add new site > Import an existing project**.
3. Choose your repository. Build command: `npm run build`, publish directory: `dist`.
4. Click **Deploy Site**.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
