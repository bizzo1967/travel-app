import { useState } from 'react';
import { useTrip } from '../../context/TripContext.jsx';
import { formatCurrency } from '../../utils/formatters.js';

const emptyCost = {
  title: '',
  category: 'other',
  amount: '',
  date: '',
  notes: ''
};

const costCategoryOptions = [
  { value: 'hotel', label: 'Hotel' },
  { value: 'transport', label: 'Trasporto' },
  { value: 'flight', label: 'Volo' },
  { value: 'food', label: 'Cibo' },
  { value: 'ticket', label: 'Ticket' },
  { value: 'other', label: 'Altro' }
];

function getCostCategoryLabel(category) {
  return costCategoryOptions.find((option) => option.value === category)?.label || 'Altro';
}

function getCostCategoryCode(category) {
  switch (category) {
    case 'hotel':
      return 'HOTEL';
    case 'transport':
      return 'TRANSPORT';
    case 'flight':
      return 'FLIGHT';
    case 'food':
      return 'FOOD';
    case 'ticket':
      return 'TICKET';
    default:
      return 'OTHER';
  }
}

function CostTypeIcon({ category }) {
  const commonProps = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.8',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    width: 18,
    height: 18
  };

  if (category === 'hotel') {
    return (
      <svg {...commonProps}>
        <rect x="6" y="4" width="12" height="16" rx="2" />
        <path d="M9 8h.01M12 8h.01M15 8h.01M9 11h.01M12 11h.01M15 11h.01M12 20v-4" />
      </svg>
    );
  }

  if (category === 'transport') {
    return (
      <svg {...commonProps}>
        <path d="M5 14l1.5-4h11L19 14" />
        <path d="M4 14h16v3a1 1 0 0 1-1 1h-1" />
        <path d="M6 18H5a1 1 0 0 1-1-1v-3" />
        <circle cx="7.5" cy="16.5" r="1.5" />
        <circle cx="16.5" cy="16.5" r="1.5" />
      </svg>
    );
  }

  if (category === 'flight') {
    return (
      <svg {...commonProps}>
        <path d="M2 16l20-8-8 20-2-9-10-3z" />
      </svg>
    );
  }

  if (category === 'food') {
    return (
      <svg {...commonProps}>
        <path d="M6 3v8" />
        <path d="M10 3v8" />
        <path d="M8 3v18" />
        <path d="M15 3c2 2 2 6 0 8v10" />
      </svg>
    );
  }

  if (category === 'ticket') {
    return (
      <svg {...commonProps}>
        <path d="M7 7h10a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V9a2 2 0 0 1 2-2z" />
        <path d="M12 8v8" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="M12 1v22" />
      <path d="M17 5a4 4 0 0 0-8 0c0 4 8 4 8 8a4 4 0 0 1-8 0" />
    </svg>
  );
}

function SmallCalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 9h16" />
    </svg>
  );
}

function SmallTagIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 13l-7 7-9-9V4h7l9 9z" />
      <circle cx="8.5" cy="8.5" r="1.5" />
    </svg>
  );
}

function CostDetailRow({ icon, label, value }) {
  if (!value) return null;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '14px auto 1fr',
        gap: 8,
        alignItems: 'start',
        fontSize: 12,
        lineHeight: 1.45,
        color: 'var(--text)'
      }}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--muted)',
          marginTop: 1
        }}
      >
        {icon}
      </span>

      <span
        style={{
          fontWeight: 700,
          color: 'var(--muted)',
          whiteSpace: 'nowrap'
        }}
      >
        {label}
      </span>

      <span>{value}</span>
    </div>
  );
}

function CostsPanel() {
  const { trip, mode, addCost, updateCost, removeCost } = useTrip();
  const [form, setForm] = useState(emptyCost);

  const handleSubmit = (e) => {
    e.preventDefault();
    addCost(form);
    setForm(emptyCost);
  };

  return (
    <section className="page-section">
      <section className="panel-card">
        <div className="panel-card__header">
          <h2 className="section-title">Costi</h2>
        </div>

        <div className="stack">
          {trip.costs.map((cost) => (
            <article
              key={cost.id}
              className="cost-card"
              style={{
                borderRadius: 22,
                padding: 14,
                boxShadow: mode === 'travel' ? 'var(--shadow)' : 'none'
              }}
            >
              {mode === 'organizer' ? (
                <div className="editor-card no-shadow">
                  <div className="form-grid">
                    <label className="wide">
                      <span>Titolo</span>
                      <input
                        type="text"
                        value={cost.title}
                        onChange={(e) => updateCost(cost.id, { title: e.target.value })}
                      />
                    </label>

                    <label>
                      <span>Categoria</span>
                      <select
                        value={cost.category}
                        onChange={(e) => updateCost(cost.id, { category: e.target.value })}
                      >
                        {costCategoryOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label>
                      <span>Importo</span>
                      <input
                        type="number"
                        value={cost.amount ?? ''}
                        onChange={(e) =>
                          updateCost(cost.id, {
                            amount: e.target.value === '' ? '' : Number(e.target.value)
                          })
                        }
                      />
                    </label>

                    <label>
                      <span>Data</span>
                      <input
                        type="date"
                        value={cost.date}
                        onChange={(e) => updateCost(cost.id, { date: e.target.value })}
                      />
                    </label>

                    <label className="wide">
                      <span>Note</span>
                      <textarea
                        rows="3"
                        value={cost.notes}
                        onChange={(e) => updateCost(cost.id, { notes: e.target.value })}
                      />
                    </label>
                  </div>

                  <div className="inline-actions">
                    <button
                      type="button"
                      className="mini-button danger"
                      onClick={() => removeCost(cost.id)}
                    >
                      Elimina costo
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '34px minmax(0, 1fr) auto',
                      gap: 12,
                      alignItems: 'start'
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 999,
                        background: '#f2eee7',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#665f51',
                        flexShrink: 0
                      }}
                    >
                      <CostTypeIcon category={cost.category} />
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <strong
                        style={{
                          display: 'block',
                          fontSize: 18,
                          lineHeight: 1.2,
                          color: '#1f2937',
                          fontWeight: 800
                        }}
                      >
                        {cost.title || 'Costo'}
                      </strong>

                      <div
                        style={{
                          marginTop: 4,
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: '0.03em',
                          textTransform: 'uppercase',
                          color: 'var(--muted)'
                        }}
                      >
                        {getCostCategoryCode(cost.category)}
                      </div>
                    </div>

                    {cost.amount !== '' && cost.amount !== null && cost.amount !== undefined ? (
                      <div
                        style={{
                          textAlign: 'right',
                          fontSize: 16,
                          lineHeight: 1.2,
                          fontWeight: 800,
                          color: 'var(--accent)',
                          minWidth: 86
                        }}
                      >
                        {formatCurrency(Number(cost.amount || 0), trip.meta.currency)}
                      </div>
                    ) : (
                      <div />
                    )}
                  </div>

                  {(cost.category || cost.date || cost.notes?.trim()) && (
                    <div
                      style={{
                        marginTop: 12,
                        padding: 12,
                        background: '#faf8f5',
                        border: '1px solid var(--border)',
                        borderRadius: 14,
                        display: 'grid',
                        gap: 8
                      }}
                    >
                      <CostDetailRow
                        icon={<SmallTagIcon />}
                        label="Categoria:"
                        value={getCostCategoryLabel(cost.category)}
                      />

                      <CostDetailRow
                        icon={<SmallCalendarIcon />}
                        label="Data:"
                        value={cost.date}
                      />

                      {cost.notes?.trim() ? (
                        <div
                          style={{
                            marginTop: 2,
                            paddingTop: 8,
                            borderTop: '1px solid #e8e1d8',
                            fontSize: 10.5,
                            lineHeight: 1.45,
                            color: '#8b857b',
                            fontStyle: 'italic',
                            whiteSpace: 'pre-wrap'
                          }}
                        >
                          {cost.notes}
                        </div>
                      ) : null}
                    </div>
                  )}
                </>
              )}
            </article>
          ))}
        </div>
      </section>

      {mode === 'organizer' && (
        <section className="panel-card">
          <div className="panel-card__header">
            <h3>Aggiungi costo</h3>
          </div>

          <form className="editor-card no-shadow" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label className="wide">
                <span>Titolo</span>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                />
              </label>

              <label>
                <span>Categoria</span>
                <select
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                >
                  {costCategoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Importo</span>
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
                />
              </label>

              <label>
                <span>Data</span>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                />
              </label>

              <label className="wide">
                <span>Note</span>
                <textarea
                  rows="3"
                  value={form.notes}
                  onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                />
              </label>
            </div>

            <button type="submit" className="primary-button">
              Aggiungi costo
            </button>
          </form>
        </section>
      )}
    </section>
  );
}

export default CostsPanel;