import { useMemo, useState } from 'react';
import { useTrip } from '../../context/TripContext.jsx';
import { findCityName, formatCurrency, formatDate } from '../../utils/formatters.js';
import { getReportSections, getTripTotals } from '../../utils/report.js';

const DEFAULT_REPORT_OPTIONS = {
  cover: true,
  itinerary: true,
  flights: true,
  hotels: true,
  bookings: true,
  documents: true,
  costs: true
};

function formatDocType(type) {
  switch (type) {
    case 'pdf':
      return 'PDF';
    case 'image':
      return 'Immagine / QR';
    case 'email':
      return 'Email / conferma';
    case 'ticket':
      return 'Biglietto / prenotazione';
    default:
      return 'Documento';
  }
}

function formatFileSize(bytes = 0) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function TravelReport() {
  const { trip } = useTrip();
  const sections = getReportSections(trip);
  const totals = getTripTotals(trip);

  const [reportOptions, setReportOptions] = useState(DEFAULT_REPORT_OPTIONS);

  const visibleSectionCount = useMemo(
    () => Object.values(reportOptions).filter(Boolean).length,
    [reportOptions]
  );

  const hasDays = sections.days.length > 0;
  const hasFlights = sections.flights.length > 0;
  const hasHotels = sections.hotels.length > 0;
  const hasBookings = sections.bookings.length > 0;
  const hasDocuments = (trip.travelDocs?.length || 0) > 0;
  const hasAnyCosts =
    totals.hotelTotal > 0 ||
    totals.bookingTotal > 0 ||
    totals.flightTotal > 0 ||
    totals.costTotal > 0;

  const handleToggleOption = (key) => {
    setReportOptions((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSelectAll = () => {
    setReportOptions({
      cover: true,
      itinerary: true,
      flights: true,
      hotels: true,
      bookings: true,
      documents: true,
      costs: true
    });
  };

  const handleClearAll = () => {
    setReportOptions({
      cover: false,
      itinerary: false,
      flights: false,
      hotels: false,
      bookings: false,
      documents: false,
      costs: false
    });
  };

  const handlePrintReport = () => {
    window.print();
  };

  const optionGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 10
  };

  const checkboxLabelStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    padding: '10px 12px',
    border: '1px solid var(--border)',
    borderRadius: 10,
    background: '#fff',
    fontSize: 13,
    fontWeight: 600,
    lineHeight: 1.4
  };

  const actionRowStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12
  };

  const actionButtonStyle = {
    border: '1px solid var(--border)',
    background: '#fff',
    borderRadius: 10,
    padding: '10px 12px',
    fontSize: 13,
    fontWeight: 700,
    minHeight: 40
  };

  const primaryButtonStyle = {
    ...actionButtonStyle,
    background: 'var(--accent)',
    borderColor: 'var(--accent)',
    color: '#fff'
  };

  const helperTextStyle = {
    fontSize: 13,
    color: 'var(--muted)',
    lineHeight: 1.5
  };

  return (
    <section className="page-section report-page">
      <style>{`
        @media print {
          .report-config-card {
            display: none !important;
          }

          .report-page {
            padding: 0 !important;
            background: #fff !important;
          }

          .report-card.print-area {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `}</style>

      <section className="panel-card report-config-card" style={{ marginBottom: 12 }}>
        <div className="panel-card__header">
          <h2 className="section-title">Configura report</h2>
        </div>

        <div style={helperTextStyle}>
          Scegli le parti da includere nel documento finale del viaggio, poi usa
          il pulsante di stampa qui sotto.
        </div>

        <div style={{ marginTop: 12, ...optionGridStyle }}>
          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              checked={reportOptions.cover}
              onChange={() => handleToggleOption('cover')}
            />
            <span>Copertina</span>
          </label>

          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              checked={reportOptions.itinerary}
              onChange={() => handleToggleOption('itinerary')}
            />
            <span>Itinerario</span>
          </label>

          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              checked={reportOptions.flights}
              onChange={() => handleToggleOption('flights')}
            />
            <span>Voli</span>
          </label>

          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              checked={reportOptions.hotels}
              onChange={() => handleToggleOption('hotels')}
            />
            <span>Hotel</span>
          </label>

          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              checked={reportOptions.bookings}
              onChange={() => handleToggleOption('bookings')}
            />
            <span>Prenotazioni</span>
          </label>

          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              checked={reportOptions.documents}
              onChange={() => handleToggleOption('documents')}
            />
            <span>Documenti</span>
          </label>

          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              checked={reportOptions.costs}
              onChange={() => handleToggleOption('costs')}
            />
            <span>Costi</span>
          </label>
        </div>

        <div style={actionRowStyle}>
          <button type="button" onClick={handleSelectAll} style={actionButtonStyle}>
            Seleziona tutto
          </button>

          <button type="button" onClick={handleClearAll} style={actionButtonStyle}>
            Deseleziona tutto
          </button>

          <button
            type="button"
            onClick={handlePrintReport}
            style={primaryButtonStyle}
            disabled={visibleSectionCount === 0}
          >
            Stampa report
          </button>
        </div>

        <div style={{ ...helperTextStyle, marginTop: 10 }}>
          {visibleSectionCount > 0
            ? `${visibleSectionCount} sezioni selezionate.`
            : 'Seleziona almeno una sezione per creare il report.'}
        </div>
      </section>

      <section className="report-card print-area">
        {visibleSectionCount === 0 ? (
          <section className="panel-card">
            <h2 style={{ marginTop: 0 }}>Anteprima report</h2>
            <p className="muted-text" style={{ marginBottom: 0 }}>
              Nessuna sezione selezionata.
            </p>
          </section>
        ) : null}

        {reportOptions.cover ? (
          <>
            {trip.meta.coverImage ? (
              <div className="report-cover">
                <img src={trip.meta.coverImage} alt={trip.meta.name} />
              </div>
            ) : null}

            <div className="report-header">
              <div>
                <h1>{trip.meta.name}</h1>
                {trip.meta.subtitle ? <p>{trip.meta.subtitle}</p> : null}
                <p>
                  {formatDate(trip.meta.startDate)} → {formatDate(trip.meta.endDate)}
                </p>
                <p>{trip.meta.travelers}</p>
              </div>

              <div className="report-total">
                <span>Budget stimato</span>
                <strong>{formatCurrency(totals.estimatedTotal, trip.meta.currency)}</strong>
              </div>
            </div>
          </>
        ) : null}

        {reportOptions.itinerary ? (
          <div className="report-block">
            <h2>Itinerario</h2>

            {hasDays ? (
              sections.days.map((day) => (
                <div key={day.id} className="report-entry">
                  <h3>
                    {day.label} · {day.title}
                  </h3>
                  <p className="muted-text">
                    {formatDate(day.date)} · {findCityName(trip, day.cityId)}
                  </p>

                  {day.timeline?.length ? (
                    <ul className="report-list">
                      {day.timeline.map((item) => (
                        <li key={item.id}>
                          <strong>{item.time}</strong> — {item.title}
                          {item.description ? ` · ${item.description}` : ''}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="muted-text">Nessun evento inserito.</p>
                  )}
                </div>
              ))
            ) : (
              <div className="report-entry">
                <p>Nessun giorno inserito.</p>
              </div>
            )}
          </div>
        ) : null}

        {reportOptions.flights ? (
          <div className="report-block">
            <h2>Voli</h2>

            {hasFlights ? (
              sections.flights.map((flight) => (
                <div key={flight.id} className="report-entry">
                  <h3>
                    {flight.from} → {flight.to}
                  </h3>
                  <p>
                    {flight.date || '—'} · {flight.departure || '—'} - {flight.arrival || '—'}
                  </p>
                  <p>
                    {flight.airline || '—'} · {flight.flightNumber || '—'}
                  </p>
                </div>
              ))
            ) : (
              <div className="report-entry">
                <p>Nessun volo inserito.</p>
              </div>
            )}
          </div>
        ) : null}

        {reportOptions.hotels ? (
          <div className="report-block">
            <h2>Hotel</h2>

            {hasHotels ? (
              sections.hotels.map((hotel) => (
                <div key={hotel.id} className="report-entry">
                  <h3>{hotel.name || 'Hotel'}</h3>
                  <p>{findCityName(trip, hotel.cityId)}</p>
                  {hotel.address ? <p>{hotel.address}</p> : null}
                  <p>
                    {hotel.checkInDate || '—'} → {hotel.checkOutDate || '—'}
                  </p>
                  <p>{formatCurrency(hotel.price, trip.meta.currency)}</p>
                </div>
              ))
            ) : (
              <div className="report-entry">
                <p>Nessun hotel inserito.</p>
              </div>
            )}
          </div>
        ) : null}

        {reportOptions.bookings ? (
          <div className="report-block">
            <h2>Prenotazioni</h2>

            {hasBookings ? (
              sections.bookings.map((booking) => (
                <div key={booking.id} className="report-entry">
                  <h3>{booking.title || 'Prenotazione'}</h3>
                  <p>Codice: {booking.code || '—'}</p>
                  <p>Data: {booking.date || '—'}</p>
                  <p>Luogo: {booking.location || '—'}</p>
                </div>
              ))
            ) : (
              <div className="report-entry">
                <p>Nessuna prenotazione inserita.</p>
              </div>
            )}
          </div>
        ) : null}

        {reportOptions.documents ? (
          <div className="report-block">
            <h2>Documenti</h2>

            {hasDocuments ? (
              trip.travelDocs.map((doc) => (
                <div key={doc.id} className="report-entry">
                  <h3>{doc.title || 'Documento viaggio'}</h3>
                  <p>Tipo: {formatDocType(doc.type)}</p>
                  {doc.fileName ? <p>File: {doc.fileName}</p> : null}
                  {doc.fileType ? <p>Formato: {doc.fileType}</p> : null}
                  {doc.fileSize ? <p>Dimensione: {formatFileSize(doc.fileSize)}</p> : null}
                  {doc.text ? (
                    <p style={{ whiteSpace: 'pre-wrap' }}>{doc.text}</p>
                  ) : null}
                </div>
              ))
            ) : (
              <div className="report-entry">
                <p>Nessun documento salvato.</p>
              </div>
            )}
          </div>
        ) : null}

        {reportOptions.costs ? (
          <div className="report-block">
            <h2>Riepilogo costi</h2>

            {hasAnyCosts ? (
              <div className="report-summary-grid">
                <div className="metric-card">
                  <span>Hotel</span>
                  <strong>{formatCurrency(totals.hotelTotal, trip.meta.currency)}</strong>
                </div>
                <div className="metric-card">
                  <span>Prenotazioni</span>
                  <strong>{formatCurrency(totals.bookingTotal, trip.meta.currency)}</strong>
                </div>
                <div className="metric-card">
                  <span>Voli</span>
                  <strong>{formatCurrency(totals.flightTotal, trip.meta.currency)}</strong>
                </div>
                <div className="metric-card">
                  <span>Costi registrati</span>
                  <strong>{formatCurrency(totals.costTotal, trip.meta.currency)}</strong>
                </div>
              </div>
            ) : (
              <div className="report-entry">
                <p>Nessun costo registrato.</p>
              </div>
            )}
          </div>
        ) : null}
      </section>
    </section>
  );
}

export default TravelReport;