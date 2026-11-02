import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Wand2,
  Minus,
  Plus
} from 'lucide-react';
import { getInitials } from '../utils/helpers';
import { getRandomAvatarColor } from '../utils/sampleData';
import { formatCurrency } from '../utils/currencies';

export const ParticipantsList = ({
  participants,
  setParticipants,
  splitMode,
  currency,
  billTotals
}) => {
  const [newPersonName, setNewPersonName] = useState('');

  const handleAddParticipant = (e) => {
    e?.preventDefault();
    const trimmed = newPersonName.trim();
    const name = trimmed || `Person ${participants.length + 1}`;
    const newId = `p-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

    // Default values depending on split mode
    let defaultCustom = 0;
    let defaultPct = 0;
    let defaultShares = 1;

    if (splitMode === 'percentage' && participants.length > 0) {
      const currentSum = participants.reduce((s, p) => s + (Number(p.percentage) || 0), 0);
      defaultPct = Math.max(0, 100 - currentSum);
    }

    const newPerson = {
      id: newId,
      name,
      avatarColor: getRandomAvatarColor(participants.length),
      customAmount: defaultCustom,
      percentage: defaultPct,
      shares: defaultShares,
      paidAmount: 0,
      included: true
    };

    setParticipants([...participants, newPerson]);
    setNewPersonName('');
  };

  const handleRemoveParticipant = (id) => {
    if (participants.length <= 1) {
      alert('You need at least one participant on the bill.');
      return;
    }
    setParticipants(participants.filter((p) => p.id !== id));
  };

  const handleUpdateParticipant = (id, field, value) => {
    setParticipants(
      participants.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  // Calculations for custom mode validations
  const totalCustomAmount = participants.reduce(
    (sum, p) => sum + (Number(p.customAmount) || 0),
    0
  );
  const customRemaining = Number((billTotals.subtotal - totalCustomAmount).toFixed(2));

  // Calculations for percentage mode validations
  const totalPercentage = participants.reduce(
    (sum, p) => sum + (Number(p.percentage) || 0),
    0
  );
  const pctRemaining = Number((100 - totalPercentage).toFixed(1));

  // Helper: auto-balance custom amount remaining
  const autoBalanceCustomRemaining = () => {
    if (participants.length === 0 || customRemaining <= 0) return;
    const shareEach = Number((customRemaining / participants.length).toFixed(2));
    setParticipants(
      participants.map((p) => ({
        ...p,
        customAmount: Number(((Number(p.customAmount) || 0) + shareEach).toFixed(2))
      }))
    );
  };

  // Helper: auto-balance percentage
  const autoBalancePercentage = () => {
    if (participants.length === 0) return;
    const equalPct = Number((100 / participants.length).toFixed(1));
    setParticipants(
      participants.map((p) => ({
        ...p,
        percentage: equalPct
      }))
    );
  };

  return (
    <div className="card participants-card">
      <div className="card-header">
        <div className="card-title-group">
          <div className="card-icon-pill bg-info-soft">
            <Users size={20} className="text-info" />
          </div>
          <div>
            <h2 className="card-title">
              Participants & Shares
              <span className="count-pill">{participants.length}</span>
            </h2>
            <p className="card-subtitle">Manage who is involved and their split portion</p>
          </div>
        </div>
      </div>

      <div className="card-body">
        {/* Add Participant Input */}
        <form onSubmit={handleAddParticipant} className="add-participant-form">
          <div className="add-input-wrapper">
            <input
              type="text"
              className="form-input add-person-input"
              placeholder="Add friend's name (e.g. Alex, Maria, Bob)..."
              value={newPersonName}
              onChange={(e) => setNewPersonName(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-add-person">
              <UserPlus size={16} />
              <span>Add Person</span>
            </button>
          </div>
        </form>

        {/* Validation / Helper banners for Custom & Percentage modes */}
        {splitMode === 'custom' && (
          <div
            className={`status-banner ${
              Math.abs(customRemaining) < 0.01
                ? 'status-banner-success'
                : customRemaining > 0
                ? 'status-banner-warning'
                : 'status-banner-danger'
            }`}
          >
            <div className="status-banner-text">
              {Math.abs(customRemaining) < 0.01 ? (
                <>
                  <CheckCircle2 size={18} />
                  <span>Custom items add up exactly to subtotal ({formatCurrency(billTotals.subtotal, currency)}).</span>
                </>
              ) : customRemaining > 0 ? (
                <>
                  <AlertCircle size={18} />
                  <span>
                    Items entered: {formatCurrency(totalCustomAmount, currency)} of{' '}
                    {formatCurrency(billTotals.subtotal, currency)} (
                    <strong>{formatCurrency(customRemaining, currency)} unassigned</strong>)
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle size={18} />
                  <span>
                    Items entered: {formatCurrency(totalCustomAmount, currency)} exceeds subtotal by{' '}
                    <strong>{formatCurrency(Math.abs(customRemaining), currency)}</strong>
                  </span>
                </>
              )}
            </div>

            {customRemaining > 0.01 && (
              <button
                type="button"
                className="btn btn-sm btn-ghost"
                onClick={autoBalanceCustomRemaining}
                title="Distribute remaining amount equally"
              >
                <Wand2 size={14} />
                <span>Distribute Remaining</span>
              </button>
            )}
          </div>
        )}

        {splitMode === 'percentage' && (
          <div
            className={`status-banner ${
              Math.abs(pctRemaining) < 0.1
                ? 'status-banner-success'
                : 'status-banner-warning'
            }`}
          >
            <div className="status-banner-text">
              {Math.abs(pctRemaining) < 0.1 ? (
                <>
                  <CheckCircle2 size={18} />
                  <span>Percentages total 100% (Balanced).</span>
                </>
              ) : (
                <>
                  <AlertCircle size={18} />
                  <span>
                    Total: {totalPercentage}% (
                    <strong>
                      {pctRemaining > 0 ? `${pctRemaining}% unassigned` : `${Math.abs(pctRemaining)}% over 100%`}
                    </strong>
                    )
                  </span>
                </>
              )}
            </div>

            {Math.abs(pctRemaining) >= 0.1 && (
              <button
                type="button"
                className="btn btn-sm btn-ghost"
                onClick={autoBalancePercentage}
              >
                <Wand2 size={14} />
                <span>Split 100% Equally</span>
              </button>
            )}
          </div>
        )}

        {/* Participants list */}
        <div className="participants-list">
          {participants.map((person) => {
            const initials = getInitials(person.name);

            return (
              <div
                key={person.id}
                className={`participant-row ${
                  person.included === false ? 'participant-excluded' : ''
                }`}
              >
                {/* Left: Avatar & Name */}
                <div className="participant-info">
                  <div
                    className="avatar-circle"
                    style={{ backgroundColor: person.avatarColor || '#6366f1' }}
                  >
                    {initials}
                  </div>

                  <input
                    type="text"
                    className="participant-name-input"
                    value={person.name}
                    onChange={(e) =>
                      handleUpdateParticipant(person.id, 'name', e.target.value)
                    }
                  />
                </div>

                {/* Middle: Split mode specific control */}
                <div className="participant-control">
                  {splitMode === 'equal' && (
                    <label className="equal-toggle-label" title="Toggle inclusion">
                      <input
                        type="checkbox"
                        checked={person.included !== false}
                        onChange={(e) =>
                          handleUpdateParticipant(person.id, 'included', e.target.checked)
                        }
                      />
                      <span>{person.included !== false ? 'Included' : 'Excluded'}</span>
                    </label>
                  )}

                  {splitMode === 'custom' && (
                    <div className="input-with-symbol compact">
                      <span className="input-symbol">{currency}</span>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        className="form-input participant-input"
                        placeholder="0.00"
                        value={person.customAmount ?? ''}
                        onChange={(e) =>
                          handleUpdateParticipant(
                            person.id,
                            'customAmount',
                            Math.max(0, parseFloat(e.target.value) || 0)
                          )
                        }
                      />
                    </div>
                  )}

                  {splitMode === 'percentage' && (
                    <div className="input-with-symbol compact">
                      <span className="input-symbol">%</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        className="form-input participant-input"
                        placeholder="0"
                        value={person.percentage ?? ''}
                        onChange={(e) =>
                          handleUpdateParticipant(
                            person.id,
                            'percentage',
                            Math.max(0, parseFloat(e.target.value) || 0)
                          )
                        }
                      />
                    </div>
                  )}

                  {splitMode === 'shares' && (
                    <div className="stepper-control">
                      <button
                        type="button"
                        className="stepper-btn"
                        onClick={() =>
                          handleUpdateParticipant(
                            person.id,
                            'shares',
                            Math.max(0, (Number(person.shares) || 1) - 1)
                          )
                        }
                      >
                        <Minus size={14} />
                      </button>
                      <span className="shares-value">
                        {person.shares || 1} {Number(person.shares) === 1 ? 'share' : 'shares'}
                      </span>
                      <button
                        type="button"
                        className="stepper-btn"
                        onClick={() =>
                          handleUpdateParticipant(
                            person.id,
                            'shares',
                            (Number(person.shares) || 1) + 1
                          )
                        }
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Right: Calculated share & Delete action */}
                <div className="participant-share-badge">
                  <span className="share-amount">
                    {formatCurrency(person.totalShare || 0, currency)}
                  </span>
                  <button
                    type="button"
                    className="btn-icon-danger"
                    onClick={() => handleRemoveParticipant(person.id)}
                    title={`Remove ${person.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
