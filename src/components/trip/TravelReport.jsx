import { useTrip } from '../../context/TripContext.jsx';
import { findCityName, formatCurrency, formatDate } from '../../utils/formatters.js';
import { getReportSections, getTripTotals } from '../../utils/report.js';

function TravelReport() {
  const { trip } = useTrip();
  const sections = getReportSections(trip);
  const totals = getTripTotals(trip);

  return (
    <section className="page-section report-page">
      <section className="report-card print-area">
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

        <div className="report-block">
          <h2>Itinerario</h2>
          {sections.days.map((day) => (
            <div key={day.id} className="report-entry">
              <h3>
                {day.label} · {day.title}
              </h3>
              <p className="muted-text">
                {formatDate(day.date)} · {findCityName(trip, day.cityId)}
              </p>
              <ul className="report-list">
                {day.timeline.map((item) => (
                  <li key={item.id}>
                    <strong>{item.time}</strong> — {item.title} · {item.description}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="report-block">
          <h2>Hotel</h2>
          {sections.hotels.map((hotel) => (
            <div key={hotel.id} className="report-entry">
              <h3>{hotel.name}</h3>
              <p>{findCityName(trip, hotel.cityId)}</p>
              <p>{hotel.address}</p>
              <p>
                {hotel.checkInDate} → {hotel.checkOutDate}
              </p>
              <p>{formatCurrency(hotel.price, trip.meta.currency)}</p>
            </div>
          ))}
        </div>

        <div className="report-block">
          <h2>Prenotazioni</h2>
          {sections.bookings.map((booking) => (
            <div key={booking.id} className="report-entry">
              <h3>{booking.title}</h3>
              <p>Codice: {booking.code || '—'}</p>
              <p>Data: {booking.date || '—'}</p>
              <p>Luogo: {booking.location || '—'}</p>
            </div>
          ))}
        </div>

        <div className="report-block">
          <h2>Voli</h2>
          {sections.flights.map((flight) => (
            <div key={flight.id} className="report-entry">
              <h3>
                {flight.from} → {flight.to}
              </h3>
              <p>
                {flight.date} · {flight.departure} - {flight.arrival}
              </p>
              <p>
                {flight.airline} · {flight.flightNumber}
              </p>
            </div>
          ))}
        </div>

        <div className="report-block">
          <h2>Mappe</h2>
          {sections.maps.map((route) => (
            <div key={route.id} className="report-entry">
              <h3>{route.title}</h3>
              <p>
                {route.mode === 'walk' ? 'A piedi' : 'Auto'} · {route.distance} · {route.duration}
              </p>
              <ul className="report-list">
                {(route.stops || []).map((stop, index) => (
                  <li key={`${route.id}-${index}`}>{stop}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="report-block">
          <h2>Riepilogo costi</h2>
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
        </div>
      </section>
    </section>
  );
}

export default TravelReport;