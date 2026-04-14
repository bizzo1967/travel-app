import { useState } from 'react';
import { useTrip } from '../../context/TripContext.jsx';
import { findCityName, formatCurrency } from '../../utils/formatters.js';

const emptyHotel = {
  name: '',
  cityId: '',
  address: '',
  checkInDate: '',
  checkOutDate: '',
  checkInTime: '',
  checkOutTime: '',
  breakfastIncluded: false,
  price: '',
  status: 'planned',
  image: '',
  notes: ''
};

function getHotelDateRange(hotel) {
  if (hotel.checkInDate && hotel.checkOutDate) {
    return `${hotel.checkInDate} → ${hotel.checkOutDate}`;
  }

  if (hotel.checkInDate) {
    return hotel.checkInDate;
  }

  if (hotel.checkOutDate) {
    return hotel.checkOutDate;
  }

  return '';
}

function HotelStatusBadge({ status }) {
  const isConfirmed = status === 'confirmed';

  return (
    <span
      style={{
        display: 'inline-flex',
        padding: '6px 10px',
        borderRadius: 999,
        background: isConfirmed ? '#e7efe0' : '#efe6db',
        color: isConfirmed ? '#4f6f3f' : '#6d5847',
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        fontWeight: 800
      }}
    >
      {isConfirmed ? 'Soggiorno confermato' : 'Da confermare'}
    </span>
  );
}

function HotelDetailRow({ label, value }) {
  if (!value) return null;

  return (
    <div
      style={{
        padding: '10px 12px',
        background: '#faf7f2',
        border: '1px solid var(--border)',
        borderRadius: 14,
        fontSize: 12,
        lineHeight: 1.45
      }}
    >
      <span style={{ fontWeight: 800 }}>{label}:</span> {value}
    </div>
  );
}

function HotelsPanel() {
  const { trip, mode, addHotel, updateHotel, removeHotel } = useTrip();
  const [form, setForm] = useState(emptyHotel);

  const handleSubmit = (e) => {
    e.preventDefault();
    addHotel(form);
    setForm(emptyHotel);
  };

  return (
    <section className="page-section">
      <section className="panel-card">
        <div className="panel-card__header">
          <h2 className="section-title">I tuoi hotel</h2>
        </div>

        <div className="stack">
          {trip.hotels.map((hotel) => (
            <article
              key={hotel.id}
              className="hotel-card"
              style={{
                display: 'block',
                overflow: 'hidden',
                borderRadius: 24,
                boxShadow: mode === 'travel' ? 'var(--shadow)' : 'none'
              }}
            >
              <div
                className="hotel-card__image"
                style={{
                  minHeight: 180,
                  maxHeight: 220
                }}
              >
                {hotel.image ? (
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    style={{
                      width: '100%',
                      height: 220,
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div
                    className="image-placeholder"
                    style={{
                      minHeight: 180,
                      height: 220
                    }}
                  >
                    Nessuna immagine
                  </div>
                )}
              </div>

              <div className="hotel-card__content">
                {mode === 'organizer' ? (
                  <div className="editor-card no-shadow">
                    <div className="form-grid">
                      <label className="wide">
                        <span>Nome hotel</span>
                        <input
                          type="text"
                          value={hotel.name}
                          onChange={(e) => updateHotel(hotel.id, { name: e.target.value })}
                        />
                      </label>

                      <label>
                        <span>Città</span>
                        <select
                          value={hotel.cityId}
                          onChange={(e) => updateHotel(hotel.id, { cityId: e.target.value })}
                        >
                          <option value="">Seleziona</option>
                          {trip.cities.map((city) => (
                            <option key={city.id} value={city.id}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label>
                        <span>Stato</span>
                        <select
                          value={hotel.status}
                          onChange={(e) => updateHotel(hotel.id, { status: e.target.value })}
                        >
                          <option value="planned">Da confermare</option>
                          <option value="confirmed">Confermato</option>
                        </select>
                      </label>

                      <label className="wide">
                        <span>Indirizzo</span>
                        <input
                          type="text"
                          value={hotel.address}
                          onChange={(e) => updateHotel(hotel.id, { address: e.target.value })}
                        />
                      </label>

                      <label>
                        <span>Check-in data</span>
                        <input
                          type="date"
                          value={hotel.checkInDate}
                          onChange={(e) => updateHotel(hotel.id, { checkInDate: e.target.value })}
                        />
                      </label>

                      <label>
                        <span>Check-out data</span>
                        <input
                          type="date"
                          value={hotel.checkOutDate}
                          onChange={(e) => updateHotel(hotel.id, { checkOutDate: e.target.value })}
                        />
                      </label>

                      <label>
                        <span>Check-in ora</span>
                        <input
                          type="time"
                          value={hotel.checkInTime}
                          onChange={(e) => updateHotel(hotel.id, { checkInTime: e.target.value })}
                        />
                      </label>

                      <label>
                        <span>Check-out ora</span>
                        <input
                          type="time"
                          value={hotel.checkOutTime}
                          onChange={(e) => updateHotel(hotel.id, { checkOutTime: e.target.value })}
                        />
                      </label>

                      <label>
                        <span>Costo</span>
                        <input
                          type="number"
                          value={hotel.price ?? ''}
                          onChange={(e) =>
                            updateHotel(hotel.id, {
                              price: e.target.value === '' ? '' : Number(e.target.value)
                            })
                          }
                        />
                      </label>

                      <label>
                        <span>Immagine URL</span>
                        <input
                          type="text"
                          value={hotel.image}
                          onChange={(e) => updateHotel(hotel.id, { image: e.target.value })}
                        />
                      </label>

                      <label className="wide">
                        <span>Note</span>
                        <textarea
                          rows="3"
                          value={hotel.notes}
                          onChange={(e) => updateHotel(hotel.id, { notes: e.target.value })}
                        />
                      </label>
                    </div>

                    <label className="checkbox-row">
                      <input
                        type="checkbox"
                        checked={hotel.breakfastIncluded}
                        onChange={(e) =>
                          updateHotel(hotel.id, { breakfastIncluded: e.target.checked })
                        }
                      />
                      <span>Colazione inclusa</span>
                    </label>

                    <div className="inline-actions">
                      <button
                        type="button"
                        className="mini-button danger"
                        onClick={() => removeHotel(hotel.id)}
                      >
                        Elimina hotel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <HotelStatusBadge status={hotel.status} />

                    <h3
                      style={{
                        margin: '10px 0 4px',
                        fontSize: 22,
                        lineHeight: 1.12,
                        color: '#2b351e'
                      }}
                    >
                      {hotel.name || 'Hotel'}
                    </h3>

                    {hotel.cityId ? (
                      <p
                        className="hotel-city"
                        style={{
                          margin: '0 0 10px',
                          fontWeight: 700,
                          color: 'var(--accent)'
                        }}
                      >
                        {findCityName(trip, hotel.cityId)}
                      </p>
                    ) : null}

                    <div
                      style={{
                        display: 'grid',
                        gap: 10,
                        marginTop: 12
                      }}
                    >
                      <HotelDetailRow label="Date" value={getHotelDateRange(hotel)} />
                      <HotelDetailRow label="Indirizzo" value={hotel.address} />
                    </div>

                    <div
                      className="hotel-meta-grid"
                      style={{
                        marginTop: 12
                      }}
                    >
                      <div className="metric-card">
                        <span>Check-in</span>
                        <strong>{hotel.checkInTime || '—'}</strong>
                      </div>

                      <div className="metric-card">
                        <span>Check-out</span>
                        <strong>{hotel.checkOutTime || '—'}</strong>
                      </div>

                      <div className="metric-card">
                        <span>Colazione</span>
                        <strong>{hotel.breakfastIncluded ? 'Inclusa' : 'No'}</strong>
                      </div>

                      <div className="metric-card">
                        <span>Costo totale</span>
                        <strong>
                          {hotel.price !== '' && hotel.price !== null && hotel.price !== undefined
                            ? formatCurrency(Number(hotel.price || 0), trip.meta.currency)
                            : '—'}
                        </strong>
                      </div>
                    </div>

                    {hotel.notes?.trim() ? (
                      <div
                        className="detail-section"
                        style={{
                          marginTop: 12,
                          background: '#faf7f2',
                          borderRadius: 16
                        }}
                      >
                        <span>Note</span>
                        <p>{hotel.notes}</p>
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {mode === 'organizer' && (
        <section className="panel-card">
          <div className="panel-card__header">
            <h3>Aggiungi hotel</h3>
          </div>

          <form className="editor-card no-shadow" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label className="wide">
                <span>Nome hotel</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                />
              </label>

              <label>
                <span>Città</span>
                <select
                  value={form.cityId}
                  onChange={(e) => setForm((prev) => ({ ...prev, cityId: e.target.value }))}
                >
                  <option value="">Seleziona</option>
                  {trip.cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Stato</span>
                <select
                  value={form.status}
                  onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                >
                  <option value="planned">Da confermare</option>
                  <option value="confirmed">Confermato</option>
                </select>
              </label>

              <label className="wide">
                <span>Indirizzo</span>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                />
              </label>

              <label>
                <span>Check-in data</span>
                <input
                  type="date"
                  value={form.checkInDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, checkInDate: e.target.value }))}
                />
              </label>

              <label>
                <span>Check-out data</span>
                <input
                  type="date"
                  value={form.checkOutDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, checkOutDate: e.target.value }))}
                />
              </label>

              <label>
                <span>Check-in ora</span>
                <input
                  type="time"
                  value={form.checkInTime}
                  onChange={(e) => setForm((prev) => ({ ...prev, checkInTime: e.target.value }))}
                />
              </label>

              <label>
                <span>Check-out ora</span>
                <input
                  type="time"
                  value={form.checkOutTime}
                  onChange={(e) => setForm((prev) => ({ ...prev, checkOutTime: e.target.value }))}
                />
              </label>

              <label>
                <span>Costo</span>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                />
              </label>

              <label>
                <span>Immagine URL</span>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
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

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={form.breakfastIncluded}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, breakfastIncluded: e.target.checked }))
                }
              />
              <span>Colazione inclusa</span>
            </label>

            <button type="submit" className="primary-button">
              Aggiungi hotel
            </button>
          </form>
        </section>
      )}
    </section>
  );
}

export default HotelsPanel;