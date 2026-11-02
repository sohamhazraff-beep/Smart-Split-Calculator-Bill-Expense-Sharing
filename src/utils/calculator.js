/**
 * SplitSmart Financial & Split Calculation Utilities
 */

export const calculateBillTotals = ({
  subtotal = 0,
  tip = { type: 'percent', value: 15 },
  tax = { type: 'percent', value: 8 },
  discount = { type: 'percent', value: 0 }
}) => {
  const sub = Math.max(0, Number(subtotal) || 0);

  // Discount
  const discountVal = Number(discount?.value) || 0;
  const discountAmount =
    discount?.type === 'percent'
      ? (sub * Math.max(0, discountVal)) / 100
      : Math.min(sub, Math.max(0, discountVal));

  const discountedSubtotal = Math.max(0, sub - discountAmount);

  // Tax on discounted subtotal
  const taxVal = Number(tax?.value) || 0;
  const taxAmount =
    tax?.type === 'percent'
      ? (discountedSubtotal * Math.max(0, taxVal)) / 100
      : Math.max(0, taxVal);

  // Tip on discounted subtotal
  const tipVal = Number(tip?.value) || 0;
  const tipAmount =
    tip?.type === 'percent'
      ? (discountedSubtotal * Math.max(0, tipVal)) / 100
      : Math.max(0, tipVal);

  const grandTotal = discountedSubtotal + taxAmount + tipAmount;

  return {
    subtotal: sub,
    discountAmount: Number(discountAmount.toFixed(2)),
    discountedSubtotal: Number(discountedSubtotal.toFixed(2)),
    taxAmount: Number(taxAmount.toFixed(2)),
    tipAmount: Number(tipAmount.toFixed(2)),
    grandTotal: Number(grandTotal.toFixed(2))
  };
};

/**
 * Calculates individual participant shares according to the chosen split mode.
 */
export const calculateParticipantShares = ({
  participants = [],
  splitMode = 'equal',
  billTotals,
  prorateExtras = true
}) => {
  if (!participants.length) return [];

  const { subtotal, discountAmount, taxAmount, tipAmount, grandTotal } = billTotals;
  const extraFees = taxAmount + tipAmount - discountAmount;

  switch (splitMode) {
    case 'equal': {
      const activeList = participants.filter((p) => p.included !== false);
      const count = activeList.length;

      if (count === 0) {
        return participants.map((p) => ({
          ...p,
          baseShare: 0,
          taxShare: 0,
          tipShare: 0,
          discountShare: 0,
          totalShare: 0
        }));
      }

      const equalShare = Number((grandTotal / count).toFixed(2));
      const equalBase = Number((subtotal / count).toFixed(2));
      const equalTax = Number((taxAmount / count).toFixed(2));
      const equalTip = Number((tipAmount / count).toFixed(2));
      const equalDiscount = Number((discountAmount / count).toFixed(2));

      return participants.map((p) => {
        if (p.included === false) {
          return {
            ...p,
            baseShare: 0,
            taxShare: 0,
            tipShare: 0,
            discountShare: 0,
            totalShare: 0
          };
        }
        return {
          ...p,
          baseShare: equalBase,
          taxShare: equalTax,
          tipShare: equalTip,
          discountShare: equalDiscount,
          totalShare: equalShare
        };
      });
    }

    case 'custom': {
      // Exact item/bill amounts per person
      const totalCustomBase = participants.reduce(
        (sum, p) => sum + (Number(p.customAmount) || 0),
        0
      );

      return participants.map((p) => {
        const customAmt = Math.max(0, Number(p.customAmount) || 0);
        let taxShare = 0;
        let tipShare = 0;
        let discountShare = 0;

        if (totalCustomBase > 0 && prorateExtras) {
          const ratio = customAmt / totalCustomBase;
          taxShare = Number((taxAmount * ratio).toFixed(2));
          tipShare = Number((tipAmount * ratio).toFixed(2));
          discountShare = Number((discountAmount * ratio).toFixed(2));
        } else if (participants.length > 0) {
          // split extras equally
          taxShare = Number((taxAmount / participants.length).toFixed(2));
          tipShare = Number((tipAmount / participants.length).toFixed(2));
          discountShare = Number((discountAmount / participants.length).toFixed(2));
        }

        const personTotal = Number(
          Math.max(0, customAmt - discountShare + taxShare + tipShare).toFixed(2)
        );

        return {
          ...p,
          baseShare: customAmt,
          taxShare,
          tipShare,
          discountShare,
          totalShare: personTotal
        };
      });
    }

    case 'percentage': {
      // Exact percentage per person
      return participants.map((p) => {
        const pct = Math.max(0, Number(p.percentage) || 0);
        const ratio = pct / 100;
        const personTotal = Number((grandTotal * ratio).toFixed(2));

        return {
          ...p,
          baseShare: Number((subtotal * ratio).toFixed(2)),
          taxShare: Number((taxAmount * ratio).toFixed(2)),
          tipShare: Number((tipAmount * ratio).toFixed(2)),
          discountShare: Number((discountAmount * ratio).toFixed(2)),
          totalShare: personTotal
        };
      });
    }

    case 'shares': {
      // Ratio of shares (e.g. 1 share, 2 shares)
      const totalShares = participants.reduce(
        (sum, p) => sum + Math.max(0, Number(p.shares) || 0),
        0
      );

      return participants.map((p) => {
        const sharesCount = Math.max(0, Number(p.shares) || 0);
        const ratio = totalShares > 0 ? sharesCount / totalShares : 0;
        const personTotal = Number((grandTotal * ratio).toFixed(2));

        return {
          ...p,
          baseShare: Number((subtotal * ratio).toFixed(2)),
          taxShare: Number((taxAmount * ratio).toFixed(2)),
          tipShare: Number((tipAmount * ratio).toFixed(2)),
          discountShare: Number((discountAmount * ratio).toFixed(2)),
          totalShare: personTotal
        };
      });
    }

    default:
      return participants;
  }
};

/**
 * Calculates net balances and smart settlements (who pays whom).
 */
export const calculateSettlements = ({
  participants = [],
  payerMode = 'single',
  singlePayerId,
  grandTotal = 0
}) => {
  // Step 1: Assign paid amounts
  const participantsWithPaid = participants.map((p) => {
    let paid = 0;
    if (payerMode === 'single') {
      paid = p.id === singlePayerId ? grandTotal : 0;
    } else {
      paid = Number(p.paidAmount) || 0;
    }

    const share = Number(p.totalShare) || 0;
    const balance = Number((paid - share).toFixed(2));

    return {
      ...p,
      paidAmount: paid,
      balance // positive = is owed money; negative = owes money
    };
  });

  // Step 2: Separate debtors and creditors for greedy settlement
  const debtors = [];
  const creditors = [];

  participantsWithPaid.forEach((p) => {
    if (p.balance < -0.009) {
      debtors.push({
        id: p.id,
        name: p.name,
        avatarColor: p.avatarColor,
        amount: Math.abs(p.balance)
      });
    } else if (p.balance > 0.009) {
      creditors.push({
        id: p.id,
        name: p.name,
        avatarColor: p.avatarColor,
        amount: p.balance
      });
    }
  });

  // Sort descending to optimize and minimize transfers
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const transactions = [];
  let dIndex = 0;
  let cIndex = 0;

  while (dIndex < debtors.length && cIndex < creditors.length) {
    const debtor = debtors[dIndex];
    const creditor = creditors[cIndex];

    const transferAmount = Number(
      Math.min(debtor.amount, creditor.amount).toFixed(2)
    );

    if (transferAmount > 0) {
      transactions.push({
        id: `tx-${debtor.id}-${creditor.id}-${transactions.length}`,
        fromId: debtor.id,
        fromName: debtor.name,
        fromColor: debtor.avatarColor,
        toId: creditor.id,
        toName: creditor.name,
        toColor: creditor.avatarColor,
        amount: transferAmount
      });
    }

    debtor.amount = Number((debtor.amount - transferAmount).toFixed(2));
    creditor.amount = Number((creditor.amount - transferAmount).toFixed(2));

    if (debtor.amount <= 0.009) {
      dIndex++;
    }
    if (creditor.amount <= 0.009) {
      cIndex++;
    }
  }

  const totalPaid = participantsWithPaid.reduce(
    (sum, p) => sum + (Number(p.paidAmount) || 0),
    0
  );

  return {
    participantsWithPaid,
    transactions,
    totalPaid: Number(totalPaid.toFixed(2)),
    isBalanced: Math.abs(totalPaid - grandTotal) < 0.05
  };
};
