import { useState } from 'react';
import { useTrip } from '../../context/TripContext.jsx';
import { formatCurrency } from '../../utils/formatters.js';

const emptyFlight = {
  from: '',
  to: '',
  date: '',
  departure: '',
  arrival: '',
  airline: '',
  flightNumber: '',
  price: '',
  notes: ''
};

function FlightTypeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 16l20-8-8 20-2-9-10-3z" />
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

function SmallClockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v5l3 2" />
    </svg>
  );
}

function SmallPlaneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 16l20-8-8 20-2-9-10-3z" />
    </svg>
  );
}

function FlightDetailRow({ icon, label, value }) {
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

function getFlightTimeRange(flight) {
  if (flight.departure && flight.arrival) {
    return `${flight.departure} → ${flight.arrival}`;
  }

  if (flight.departure) {
    return `Partenza ${flight.departure}`;
  }

  if (flight.arrival) {
    return `Arrivo ${flight.arrival}`;
  }

  return '';
}

function FlightsPanel() {
  const { trip, mode, addFlight, updateFlight, removeFlight } = useTrip();
  const [form, setForm] = useState(emptyFlight);

  const handleSubmit = (e) => {
    e.preventDefault();
    addFlight(form);
    setForm(emptyFlight);
  };

  return (
    <section className="page-section">
      <section className="panel-card">
        <div className="panel-card__header">
          <h2 className="section-title">Voli</h2>
        </div>

        <div className="stack">
          {trip.flights.map((flight) => (
            <article
              key={flight.id}
              className="flight-card"
              style={{
                borderRadius: 22,
                padding: 14,
                boxShadow: mode === 'travel' ? 'var(--shadow)' : 'none'
              }}
            >
              {mode === 'organizer' ? (
                <div className="editor-card no-shadow">
                  <div className="form-grid">
                    <label>
                      <span>Da</span>
                      <input
                        type="text"
                        value={flight.from}
                        onChange={(e) => updateFlight(flight.id, { from: e.target.value })}
                      />
                    </label>

                    <label>
                      <span>A</span>
                      <input
                        type="text"
                        value={flight.to}
                        onChange={(e) => updateFlight(flight.id, { to: e.target.value })}
                      />
                    </label>

                    <label>
                      <span>Data</span>
                      <input
                        type="date"
                        value={flight.date}
                        onChange={(e) => updateFlight(flight.id, { date: e.target.value })}
                      />
                    </label>

                    <label>
                      <span>Partenza</span>
                      <input
                        type="time"
                        value={flight.departure}
                        onChange={(e) => updateFlight(flight.id, { departure: e.target.value })}
                      />
                    </label>

                    <label>
                      <span>Arrivo</span>
                      <input
                        type="time"
                        value={flight.arrival}
                        onChange={(e) => updateFlight(flight.id, { arrival: e.target.value })}
                      />
                    </label>

                    <label>
                      <span>Compagnia</span>
                      <input
                        type="text"
                        value={flight.airline}
                        onChange={(e) => updateFlight(flight.id, { airline: e.target.value })}
                      />
                    </label>

                    <label>
                      <span>Numero volo</span>
                      <input
                        type="text"
                        value={flight.flightNumber}
                        onChange={(e) => updateFlight(flight.id, { flightNumber: e.target.value })}
                      />
                    </label>

                    <label>
                      <span>Prezzo</span>
                      <input
                        type="number"
                        value={flight.price ?? ''}
                        onChange={(e) =>
                          updateFlight(flight.id, {
                            price: e.target.value === '' ? '' : Number(e.target.value)
                          })
                        }
                      />
                    </label>

                    <label className="wide">
                      <span>Note</span>
                      <textarea
                        rows="3"
                        value={flight.notes}
                        onChange={(e) => updateFlight(flight.id, { notes: e.target.value })}
                      />
                    </label>
                  </div>

                  <div className="inline-actions">
                    <button
                      type="button"
                      className="mini-button danger"
                      onClick={() => removeFlight(flight.id)}
                    >
                      Elimina volo
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
                      <FlightTypeIcon />
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
                        {(flight.from || 'Partenza') + ' → ' + (flight.to || 'Arrivo')}
                      </strong>

                      {flight.airline ? (
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
                          {flight.airline}
                        </div>
                      ) : null}
                    </div>

                    {flight.flightNumber ? (
                      <div
                        style={{
                          textAlign: 'right',
                          minWidth: 72
                        }}
                      >
                        <div
                          style={{
                            fontSize: 9,
                            fontWeight: 800,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            color: 'var(--muted)',
                            marginBottom: 2
                          }}
                        >
                          Volo
                        </div>

                        <div
                          style={{
                            fontSize: 12,
                            lineHeight: 1.2,
                            fontWeight: 800,
                            color: '#6d5f3d',
                            wordBreak: 'break-word'
                          }}
                        >
                          {flight.flightNumber}
                        </div>
                      </div>
                    ) : (
                      <div />
                    )}
                  </div>

                  {(flight.date || getFlightTimeRange(flight) || flight.airline || flight.notes?.trim()) && (
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
                      <FlightDetailRow
                        icon={<SmallCalendarIcon />}
                        label="Data:"
                        value={flight.date}
                      />

                      <FlightDetailRow
                        icon={<SmallClockIcon />}
                        label="Orari:"
                        value={getFlightTimeRange(flight)}
                      />

                      <FlightDetailRow
                        icon={<SmallPlaneIcon />}
                        label="Compagnia:"
                        value={flight.airline}
                      />

                      {flight.notes?.trim() ? (
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
                          {flight.notes}
                        </div>
                      ) : null}
                    </div>
                  )}

                  {flight.price !== '' && flight.price !== null && flight.price !== undefined ? (
                    <div
                      style={{
                        marginTop: 10,
                        fontSize: 17,
                        fontWeight: 800,
                        color: 'var(--accent)'
                      }}
                    >
                      {formatCurrency(Number(flight.price || 0), trip.meta.currency)}
                    </div>
                  ) : null}
                </>
              )}
            </article>
          ))}
        </div>
      </section>

      {mode === 'organizer' && (
        <section className="panel-card">
          <div className="panel-card__header">
            <h3>Aggiungi volo</h3>
          </div>

          <form className="editor-card no-shadow" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label>
                <span>Da</span>
                <input
                  type="text"
                  value={form.from}
                  onChange={(e) => setForm((prev) => ({ ...prev, from: e.target.value }))}
                />
              </label>

              <label>
                <span>A</span>
                <input
                  type="text"
                  value={form.to}
                  onChange={(e) => setForm((prev) => ({ ...prev, to: e.target.value }))}
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

              <label>
                <span>Partenza</span>
                <input
                  type="time"
                  value={form.departure}
                  onChange={(e) => setForm((prev) => ({ ...prev, departure: e.target.value }))}
                />
              </label>

              <label>
                <span>Arrivo</span>
                <input
                  type="time"
                  value={form.arrival}
                  onChange={(e) => setForm((prev) => ({ ...prev, arrival: e.target.value }))}
                />
              </label>

              <label>
                <span>Compagnia</span>
                <input
                  type="text"
                  value={form.airline}
                  onChange={(e) => setForm((prev) => ({ ...prev, airline: e.target.value }))}
                />
              </label>

              <label>
                <span>Numero volo</span>
                <input
                  type="text"
                  value={form.flightNumber}
                  onChange={(e) => setForm((prev) => ({ ...prev, flightNumber: e.target.value }))}
                />
              </label>

              <label>
                <span>Prezzo</span>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
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
              Aggiungi volo
            </button>
          </form>
        </section>
      )}
    </section>
  );
}

export default FlightsPanel;