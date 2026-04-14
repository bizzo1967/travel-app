import { useEffect, useMemo, useState } from 'react';
import { useTrip } from '../../context/TripContext.jsx';
import { formatDate } from '../../utils/formatters.js';

function buildDayDraft(day) {
  return {
    label: day?.label || '',
    date: day?.date || '',
    title: day?.title || ''
  };
}

function buildEventDraft(eventItem = null) {
  return {
    startTime: eventItem?.startTime || eventItem?.time || '09:00',
    endTime: eventItem?.endTime || '',
    type: eventItem?.type || 'activity',
    title: eventItem?.title || '',
    description: eventItem?.description || '',
    details: eventItem?.details || ''
  };
}

function getEventTimeLabel(eventItem) {
  const start = eventItem.startTime || eventItem.time || '';
  const end = eventItem.endTime || '';
  if (start && end) return `${start} - ${end}`;
  return start || '—';
}

function isHotelForDay(hotel, day) {
  if (!day?.date) return false;

  const checkIn = hotel.checkInDate || '';
  const checkOut = hotel.checkOutDate || '';

  if (checkIn && checkOut) {
    return day.date >= checkIn && day.date < checkOut;
  }

  return false;
}

function getHotelsTextForDay(trip, day) {
  const hotels = trip.hotels.filter((hotel) => isHotelForDay(hotel, day));
  if (!hotels.length) return 'Nessun hotel';
  return hotels.map((hotel) => hotel.name).join(' · ');
}

function TripOverview() {
  const {
    trip,
    mode,
    selectedDayId,
    setSelectedDayId,
    selectedDay,
    addDay,
    updateDay,
    removeDay,
    duplicateDay,
    addTimelineItem,
    updateTimelineItem,
    removeTimelineItem
  } = useTrip();

  const [dayEditorOpen, setDayEditorOpen] = useState(false);
  const [dayDraft, setDayDraft] = useState(buildDayDraft(selectedDay));

  const [eventModal, setEventModal] = useState({
    isOpen: false,
    mode: 'add',
    eventId: null
  });
  const [eventDraft, setEventDraft] = useState(buildEventDraft());

  const [detailsModal, setDetailsModal] = useState({
    isOpen: false,
    eventId: null,
    title: '',
    details: ''
  });

  const sortedEvents = useMemo(() => {
    if (!selectedDay) return [];
    return [...selectedDay.timeline].sort((a, b) =>
      (a.startTime || a.time || '99:99').localeCompare(b.startTime || b.time || '99:99')
    );
  }, [selectedDay]);

  useEffect(() => {
    setDayDraft(buildDayDraft(selectedDay));
    setDayEditorOpen(false);
  }, [selectedDayId, selectedDay]);

  if (!selectedDay) {
    return (
      <section className="panel-card">
        <p>Nessun giorno disponibile.</p>
      </section>
    );
  }

  const handleCreateDay = () => {
    const nextIndex = trip.days.length + 1;
    addDay({
      label: `Giorno ${nextIndex}`,
      date: '',
      title: ''
    });
  };

  const handleSaveDay = () => {
    updateDay(selectedDay.id, dayDraft);
    setDayEditorOpen(false);
  };

  const handleCancelDayEdit = () => {
    setDayDraft(buildDayDraft(selectedDay));
    setDayEditorOpen(false);
  };

  const openAddEventModal = () => {
    setEventDraft(buildEventDraft());
    setEventModal({
      isOpen: true,
      mode: 'add',
      eventId: null
    });
  };

  const openEditEventModal = (eventItem) => {
    setEventDraft(buildEventDraft(eventItem));
    setEventModal({
      isOpen: true,
      mode: 'edit',
      eventId: eventItem.id
    });
  };

  const closeEventModal = () => {
    setEventModal({
      isOpen: false,
      mode: 'add',
      eventId: null
    });
    setEventDraft(buildEventDraft());
  };

  const handleSaveEvent = () => {
    if (eventModal.mode === 'add') {
      addTimelineItem(selectedDay.id, eventDraft);
    } else if (eventModal.mode === 'edit' && eventModal.eventId) {
      updateTimelineItem(selectedDay.id, eventModal.eventId, eventDraft);
    }

    closeEventModal();
  };

  const handleDeleteEvent = () => {
    if (eventModal.mode === 'edit' && eventModal.eventId) {
      removeTimelineItem(selectedDay.id, eventModal.eventId);
      closeEventModal();
    }
  };

  const openDetailsModal = (eventItem) => {
    setDetailsModal({
      isOpen: true,
      eventId: eventItem.id,
      title: eventItem.title || 'Dettagli evento',
      details: eventItem.details || ''
    });
  };

  const closeDetailsModal = () => {
    setDetailsModal({
      isOpen: false,
      eventId: null,
      title: '',
      details: ''
    });
  };

  const handleSaveDetails = () => {
    if (detailsModal.eventId) {
      updateTimelineItem(selectedDay.id, detailsModal.eventId, {
        details: detailsModal.details
      });
    }
    closeDetailsModal();
  };

  const handleDeleteDetails = () => {
    if (detailsModal.eventId) {
      updateTimelineItem(selectedDay.id, detailsModal.eventId, {
        details: ''
      });
    }
    closeDetailsModal();
  };

  return (
    <section className="page-section">
      <section className="panel-card">
        <div className="itinerary-topbar">
          <div className="chip-row chip-row--days">
            {trip.days.map((day, index) => (
              <button
                key={day.id}
                type="button"
                className={`chip-button chip-button--day ${selectedDayId === day.id ? 'is-active' : ''}`}
                onClick={() => setSelectedDayId(day.id)}
              >
                <span className="chip-button__main">
                  {day.label || `Giorno ${index + 1}`}
                </span>
                <span className="chip-button__sub">
                  {getHotelsTextForDay(trip, day)}
                </span>
              </button>
            ))}
          </div>

          {mode === 'organizer' && (
            <button type="button" className="primary-button" onClick={handleCreateDay}>
              + Giorno
            </button>
          )}
        </div>

        <div className="itinerary-day-card">
          <div className="itinerary-day-card__header">
            <div>
              <div className="itinerary-day-card__label">
                {selectedDay.label || 'Giorno'}
              </div>
              <h2 className="itinerary-day-card__title">
                {selectedDay.title || 'Titolo giorno'}
              </h2>
              <div className="itinerary-day-card__date">
                {formatDate(selectedDay.date)}
              </div>
            </div>

            {mode === 'organizer' && (
              <div className="inline-actions">
                {!dayEditorOpen ? (
                  <button
                    type="button"
                    className="mini-button"
                    onClick={() => setDayEditorOpen(true)}
                  >
                    Modifica giorno
                  </button>
                ) : null}

                <button
                  type="button"
                  className="mini-button"
                  onClick={() => duplicateDay(selectedDay.id)}
                >
                  Duplica
                </button>

                <button
                  type="button"
                  className="mini-button danger"
                  onClick={() => removeDay(selectedDay.id)}
                >
                  Elimina
                </button>
              </div>
            )}
          </div>

          {mode === 'organizer' && dayEditorOpen && (
            <div className="editor-card itinerary-day-editor">
              <div className="form-grid">
                <label>
                  <span>Label giorno</span>
                  <input
                    type="text"
                    value={dayDraft.label}
                    onChange={(e) =>
                      setDayDraft((prev) => ({ ...prev, label: e.target.value }))
                    }
                    placeholder="Es. Giorno 1"
                  />
                </label>

                <label>
                  <span>Data</span>
                  <input
                    type="date"
                    value={dayDraft.date}
                    onChange={(e) =>
                      setDayDraft((prev) => ({ ...prev, date: e.target.value }))
                    }
                  />
                </label>

                <label className="wide">
                  <span>Titolo del giorno</span>
                  <input
                    type="text"
                    value={dayDraft.title}
                    onChange={(e) =>
                      setDayDraft((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Es. Frigiliana → Nerja → Granada"
                  />
                </label>
              </div>

              <div className="modal__actions">
                <button type="button" className="primary-button" onClick={handleSaveDay}>
                  Salva giorno
                </button>

                <button type="button" className="ghost-button" onClick={handleCancelDayEdit}>
                  Annulla
                </button>
              </div>
            </div>
          )}

          <div className="itinerary-events">
            {mode === 'organizer' && (
              <div className="itinerary-events__actions">
                <button type="button" className="primary-button" onClick={openAddEventModal}>
                  + Aggiungi evento
                </button>
              </div>
            )}

            {sortedEvents.length === 0 ? (
              <div className="empty-state-card">
                Nessun evento inserito per questo giorno.
              </div>
            ) : (
              <div className="timeline">
                {sortedEvents.map((eventItem) => (
                  <div key={eventItem.id} className="timeline-row">
                    <div className="timeline-line">
                      <span />
                    </div>

                    <div className="timeline-card">
                      <div className="timeline-card__time">
                        {getEventTimeLabel(eventItem)}
                      </div>

                      <div className="timeline-card__content">
                        <h4>{eventItem.title}</h4>
                        <p>{eventItem.description || 'Nessuna descrizione'}</p>
                      </div>

                      <div className="timeline-card__right">
                        {eventItem.details ? (
                          <button
                            type="button"
                            className="details-btn"
                            onClick={() => openDetailsModal(eventItem)}
                          >
                            DETTAGLI
                          </button>
                        ) : null}

                        {mode === 'organizer' ? (
                          <>
                            <button
                              type="button"
                              className="details-btn"
                              onClick={() => openEditEventModal(eventItem)}
                            >
                              MODIFICA
                            </button>

                            <button
                              type="button"
                              className="details-btn"
                              onClick={() => openDetailsModal(eventItem)}
                            >
                              {eventItem.details ? 'MOD. DETTAGLI' : '+ DETTAGLI'}
                            </button>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {eventModal.isOpen && (
        <div className="modal-bg" onClick={closeEventModal}>
          <div className="modal modal--large" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3>
                {eventModal.mode === 'add' ? 'Aggiungi evento' : 'Modifica evento'}
              </h3>
            </div>

            <div className="form-grid">
              <label>
                <span>Ora inizio</span>
                <input
                  type="time"
                  value={eventDraft.startTime}
                  onChange={(e) =>
                    setEventDraft((prev) => ({ ...prev, startTime: e.target.value }))
                  }
                />
              </label>

              <label>
                <span>Ora fine</span>
                <input
                  type="time"
                  value={eventDraft.endTime}
                  onChange={(e) =>
                    setEventDraft((prev) => ({ ...prev, endTime: e.target.value }))
                  }
                />
              </label>

              <label>
                <span>Tipo</span>
                <select
                  value={eventDraft.type}
                  onChange={(e) =>
                    setEventDraft((prev) => ({ ...prev, type: e.target.value }))
                  }
                >
                  <option value="activity">Attività</option>
                  <option value="flight">Volo</option>
                  <option value="hotel">Hotel</option>
                  <option value="car">Auto</option>
                  <option value="drive">Trasferimento</option>
                  <option value="walk">Passeggiata</option>
                </select>
              </label>

              <div />

              <label className="wide">
                <span>Titolo</span>
                <input
                  type="text"
                  value={eventDraft.title}
                  onChange={(e) =>
                    setEventDraft((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Es. Frigiliana"
                />
              </label>

              <label className="wide">
                <span>Descrizione veloce</span>
                <textarea
                  rows="2"
                  value={eventDraft.description}
                  onChange={(e) =>
                    setEventDraft((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Es. Visita del borgo e centro storico"
                />
              </label>
            </div>

            <div className="modal__actions">
              <button type="button" className="primary-button" onClick={handleSaveEvent}>
                Salva evento
              </button>

              {eventModal.mode === 'edit' ? (
                <button type="button" className="ghost-button danger" onClick={handleDeleteEvent}>
                  Elimina evento
                </button>
              ) : null}

              <button type="button" className="ghost-button" onClick={closeEventModal}>
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}

      {detailsModal.isOpen && (
        <div className="modal-bg" onClick={closeDetailsModal}>
          <div className="modal modal--large" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3>{detailsModal.title || 'Dettagli evento'}</h3>
            </div>

            {mode === 'organizer' ? (
              <>
                <label className="wide">
                  <span>Dettagli completi</span>
                  <textarea
                    rows="8"
                    value={detailsModal.details}
                    onChange={(e) =>
                      setDetailsModal((prev) => ({ ...prev, details: e.target.value }))
                    }
                    placeholder="Scrivi qui i dettagli estesi dell'evento"
                  />
                </label>

                <div className="modal__actions">
                  <button type="button" className="primary-button" onClick={handleSaveDetails}>
                    Salva dettagli
                  </button>

                  <button
                    type="button"
                    className="ghost-button danger"
                    onClick={handleDeleteDetails}
                  >
                    Elimina dettagli
                  </button>

                  <button type="button" className="ghost-button" onClick={closeDetailsModal}>
                    Chiudi
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="details-content">
                  {detailsModal.details || 'Nessun dettaglio disponibile.'}
                </div>

                <div className="modal__actions">
                  <button type="button" className="primary-button" onClick={closeDetailsModal}>
                    Chiudi
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default TripOverview;