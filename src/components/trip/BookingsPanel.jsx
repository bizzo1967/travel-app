import { useState } from 'react';
import { useTrip } from '../../context/TripContext.jsx';
import { formatCurrency } from '../../utils/formatters.js';

const emptyBooking = {
  type: 'hotel',
  title: '',
  code: '',
  date: '',
  startDate: '',
  endDate: '',
  location: '',
  amount: '',
  notes: ''
};

const bookingTypeOptions = [
  { value: 'hotel', label: 'Hotel' },
  { value: 'car', label: 'Noleggio auto' },
  { value: 'parking', label: 'Parcheggio' },
  { value: 'ticket', label: 'Ticket' },
  { value: 'other', label: 'Altro' }
];

function getBookingTypeLabel(type) {
  const found = bookingTypeOptions.find((option) => option.value === type);
  return found ? found.label : 'Altro';
}

function getBookingStartDate(booking) {
  return booking.startDate || booking.date || '';
}

function getBookingDateRange(booking) {
  const startDate = booking.startDate || booking.date || '';
  const endDate = booking.endDate || '';

  if (startDate && endDate) {
    return `${startDate} → ${endDate}`;
  }

  if (startDate) {
    return startDate;
  }

  return '';
}

function getTypeCodeLabel(type) {
  switch (type) {
    case 'hotel':
      return 'HOTEL';
    case 'car':
      return 'CAR';
    case 'parking':
      return 'PARKING';
    case 'ticket':
      return 'TICKET';
    default:
      return 'ALTRO';
  }
}

function BookingTypeIcon({ type }) {
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

  if (type === 'hotel') {
    return (
      <svg {...commonProps}>
        <rect x="6" y="4" width="12" height="16" rx="2" />
        <path d="M9 8h.01M12 8h.01M15 8h.01M9 11h.01M12 11h.01M15 11h.01M12 20v-4" />
      </svg>
    );
  }

  if (type === 'car') {
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

  if (type === 'parking') {
    return (
      <svg {...commonProps}>
        <circle cx="12" cy="12" r="9" />
        <path d="M10 16V8h3a2.5 2.5 0 0 1 0 5h-3" />
      </svg>
    );
  }

  if (type === 'ticket') {
    return (
      <svg {...commonProps}>
        <path d="M7 7h10a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V9a2 2 0 0 1 2-2z" />
        <path d="M12 8v8" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <rect x="5" y="4" width="14" height="16" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  );
}

function BookingDetailRow({ icon, label, value }) {
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

function SmallCalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 9h16" />
    </svg>
  );
}

function SmallPinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 21s-6-5.2-6-10a6 6 0 0 1 12 0c0 4.8-6 10-6 10z" />
      <circle cx="12" cy="11" r="2" />
    </svg>
  );
}

function BookingsPanel() {
  const { trip, mode, addBooking, updateBooking, removeBooking } = useTrip();
  const [form, setForm] = useState(emptyBooking);

  const handleSubmit = (e) => {
    e.preventDefault();

    addBooking({
      ...form,
      date: form.startDate || form.date || ''
    });

    setForm(emptyBooking);
  };

  return (
    <section className="page-section">
      <section className="panel-card">
        <div className="panel-card__header">
          <h2 className="section-title">Prenotazioni</h2>
        </div>

        <div className="stack">
          {trip.bookings.map((booking) => (
            <article
              key={booking.id}
              className="booking-card"
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
                      <span>Tipo</span>
                      <select
                        value={booking.type}
                        onChange={(e) => updateBooking(booking.id, { type: e.target.value })}
                      >
                        {bookingTypeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label>
                      <span>Codice</span>
                      <input
                        type="text"
                        value={booking.code || ''}
                        onChange={(e) => updateBooking(booking.id, { code: e.target.value })}
                      />
                    </label>

                    <label className="wide">
                      <span>Titolo</span>
                      <input
                        type="text"
                        value={booking.title}
                        onChange={(e) => updateBooking(booking.id, { title: e.target.value })}
                      />
                    </label>

                    <label>
                      <span>Data inizio</span>
                      <input
                        type="date"
                        value={getBookingStartDate(booking)}
                        onChange={(e) =>
                          updateBooking(booking.id, {
                            startDate: e.target.value,
                            date: e.target.value
                          })
                        }
                      />
                    </label>

                    <label>
                      <span>Data fine</span>
                      <input
                        type="date"
                        value={booking.endDate || ''}
                        onChange={(e) => updateBooking(booking.id, { endDate: e.target.value })}
                      />
                    </label>

                    <label>
                      <span>Importo</span>
                      <input
                        type="number"
                        value={booking.amount ?? ''}
                        onChange={(e) =>
                          updateBooking(booking.id, {
                            amount: e.target.value === '' ? '' : Number(e.target.value)
                          })
                        }
                      />
                    </label>

                    <label className="wide">
                      <span>Luogo</span>
                      <input
                        type="text"
                        value={booking.location}
                        onChange={(e) => updateBooking(booking.id, { location: e.target.value })}
                      />
                    </label>

                    <label className="wide">
                      <span>Note</span>
                      <textarea
                        rows="3"
                        value={booking.notes}
                        onChange={(e) => updateBooking(booking.id, { notes: e.target.value })}
                      />
                    </label>
                  </div>

                  <div className="inline-actions">
                    <button
                      type="button"
                      className="mini-button danger"
                      onClick={() => removeBooking(booking.id)}
                    >
                      Elimina prenotazione
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
                      <BookingTypeIcon type={booking.type} />
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <strong
                        style={{
                          display: 'block',
                          fontSize: 14,
                          lineHeight: 1.35,
                          color: '#1f2937',
                          fontWeight: 800
                        }}
                      >
                        {booking.title || 'Prenotazione'}
                      </strong>

                      <div
                        style={{
                          marginTop: 2,
                          fontSize: 10,
                          fontWeight: 800,
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                          color: 'var(--muted)'
                        }}
                      >
                        {getTypeCodeLabel(booking.type)}
                      </div>
                    </div>

                    {booking.code ? (
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
                          Codice
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
                          {booking.code}
                        </div>
                      </div>
                    ) : (
                      <div />
                    )}
                  </div>

                  {(getBookingDateRange(booking) || booking.location || booking.notes?.trim()) && (
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
                      <BookingDetailRow
                        icon={<SmallCalendarIcon />}
                        label="Data:"
                        value={getBookingDateRange(booking)}
                      />

                      <BookingDetailRow
                        icon={<SmallPinIcon />}
                        label="Luogo:"
                        value={booking.location}
                      />

                      {booking.notes?.trim() ? (
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
                          {booking.notes}
                        </div>
                      ) : null}
                    </div>
                  )}

                  {booking.amount !== '' &&
                  booking.amount !== null &&
                  booking.amount !== undefined ? (
                    <div
                      style={{
                        marginTop: 10,
                        fontSize: 17,
                        fontWeight: 800,
                        color: 'var(--accent)'
                      }}
                    >
                      {formatCurrency(Number(booking.amount || 0), trip.meta.currency)}
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
            <h3>Aggiungi prenotazione</h3>
          </div>

          <form className="editor-card no-shadow" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label>
                <span>Tipo</span>
                <select
                  value={form.type}
                  onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
                >
                  {bookingTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Codice</span>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value }))}
                />
              </label>

              <label className="wide">
                <span>Titolo</span>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                />
              </label>

              <label>
                <span>Data inizio</span>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                      date: e.target.value
                    }))
                  }
                />
              </label>

              <label>
                <span>Data fine</span>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
                />
              </label>

              <label>
                <span>Importo</span>
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
                />
              </label>

              <label className="wide">
                <span>Luogo</span>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
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
              Aggiungi prenotazione
            </button>
          </form>
        </section>
      )}
    </section>
  );
}

export default BookingsPanel;