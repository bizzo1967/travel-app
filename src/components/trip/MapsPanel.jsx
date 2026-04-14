import { useEffect, useMemo, useState } from 'react';
import { useTrip } from '../../context/TripContext.jsx';
import { formatDate } from '../../utils/formatters.js';

const emptyRouteDraft = {
  mode: 'auto',
  stopsText: '',
  url: ''
};

function normalizeUrl(url) {
  const value = (url || '').trim();
  if (!value) return '';
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  return `https://${value}`;
}

function buildRouteDraft(route) {
  return {
    mode: route?.mode || 'auto',
    stopsText: Array.isArray(route?.stops) ? route.stops.join('\n') : '',
    url: route?.url || ''
  };
}

function getDayChipLabel(day, index) {
  const label = day?.label?.trim();
  if (label) return label;
  return `Giorno ${index + 1}`;
}

function getDaySelectLabel(day, index) {
  return `${getDayChipLabel(day, index)}${day?.date ? ` · ${formatDate(day.date)}` : ''}`;
}

function buildMapsWithLabels(routes) {
  let autoCount = 0;
  let walkCount = 0;

  return routes.map((route) => {
    if (route.mode === 'walk') {
      walkCount += 1;
      return { ...route, chipLabel: `Mappa a piedi ${walkCount}` };
    }

    autoCount += 1;
    return { ...route, chipLabel: `Mappa auto ${autoCount}` };
  });
}

function MapsPanel() {
  const {
    trip,
    mode,
    selectedDayId,
    setSelectedDayId,
    addMapRoute,
    updateMapRoute,
    removeMapRoute
  } = useTrip();

  const selectedDay =
    trip.days.find((day) => day.id === selectedDayId) || trip.days[0] || null;

  const mapsForSelectedDay = useMemo(() => {
    if (!selectedDay) return [];
    const filtered = trip.maps.filter((route) => route.dayId === selectedDay.id);
    return buildMapsWithLabels(filtered);
  }, [trip.maps, selectedDay]);

  const [selectedRouteId, setSelectedRouteId] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(emptyRouteDraft);

  const selectedRoute =
    mapsForSelectedDay.find((route) => route.id === selectedRouteId) ||
    mapsForSelectedDay[0] ||
    null;

  useEffect(() => {
    if (!mapsForSelectedDay.some((route) => route.id === selectedRouteId)) {
      setSelectedRouteId(mapsForSelectedDay[0]?.id || '');
    }
  }, [mapsForSelectedDay, selectedRouteId]);

  useEffect(() => {
    if (selectedRoute) {
      setDraft(buildRouteDraft(selectedRoute));
      setIsEditing(false);
    } else {
      setDraft(emptyRouteDraft);
      setIsEditing(false);
    }
  }, [selectedRouteId, selectedRoute]);

  const handleSelectDay = (dayId) => {
    setSelectedDayId(dayId);
    setSelectedRouteId('');
    setDraft(emptyRouteDraft);
    setIsEditing(false);
  };

  const handleCreateRoute = () => {
    if (!selectedDay) return;

    addMapRoute({
      dayId: selectedDay.id,
      mode: 'auto',
      stops: [],
      url: '',
      title: '',
      from: '',
      to: '',
      distance: '',
      duration: ''
    });
  };

  const handleStartEdit = () => {
    if (!selectedRoute) return;
    setDraft(buildRouteDraft(selectedRoute));
    setIsEditing(true);
  };

  const handleSaveRoute = () => {
    if (!selectedRoute) return;

    updateMapRoute(selectedRoute.id, {
      dayId: selectedDay?.id || '',
      mode: draft.mode,
      stops: draft.stopsText
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
      url: draft.url,
      title: '',
      from: '',
      to: '',
      distance: '',
      duration: ''
    });

    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    if (!selectedRoute) {
      setDraft(emptyRouteDraft);
      setIsEditing(false);
      return;
    }

    setDraft(buildRouteDraft(selectedRoute));
    setIsEditing(false);
  };

  const handleDeleteRoute = () => {
    if (!selectedRoute) return;
    removeMapRoute(selectedRoute.id);
    setSelectedRouteId('');
    setDraft(emptyRouteDraft);
    setIsEditing(false);
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
                onClick={() => handleSelectDay(day.id)}
              >
                <span className="chip-button__main">{getDayChipLabel(day, index)}</span>
                <span className="chip-button__sub">
                  {day.date ? formatDate(day.date) : 'Nessuna data'}
                </span>
              </button>
            ))}
          </div>

          {mode === 'organizer' && (
            <button type="button" className="primary-button" onClick={handleCreateRoute}>
              + Mappa
            </button>
          )}
        </div>

        {!selectedDay ? (
          <div className="empty-state-card">Nessun giorno disponibile.</div>
        ) : mapsForSelectedDay.length === 0 ? (
          mode === 'organizer' ? (
            <div className="empty-state-card">
              Nessuna mappa per questo giorno.
            </div>
          ) : null
        ) : (
          <div className="itinerary-day-card">
            <div className="chip-row chip-row--days" style={{ marginBottom: '14px' }}>
              {mapsForSelectedDay.map((route) => (
                <button
                  key={route.id}
                  type="button"
                  className={`chip-button chip-button--day ${selectedRoute?.id === route.id ? 'is-active' : ''}`}
                  onClick={() => setSelectedRouteId(route.id)}
                >
                  <span className="chip-button__main">{route.chipLabel}</span>
                </button>
              ))}
            </div>

            {selectedRoute && mode === 'organizer' && isEditing ? (
              <div className="editor-card itinerary-day-editor">
                <div className="form-grid">
                  <label className="wide">
                    <span>Giorno</span>
                    <select
                      value={selectedDay.id}
                      onChange={(e) => handleSelectDay(e.target.value)}
                    >
                      {trip.days.map((day, index) => (
                        <option key={day.id} value={day.id}>
                          {getDaySelectLabel(day, index)}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="wide">
                    <span>Modalità</span>
                    <div className="segment-control" style={{ marginTop: '6px' }}>
                      <button
                        type="button"
                        className={draft.mode === 'auto' ? 'is-active' : ''}
                        onClick={() => setDraft((prev) => ({ ...prev, mode: 'auto' }))}
                      >
                        Auto
                      </button>
                      <button
                        type="button"
                        className={draft.mode === 'walk' ? 'is-active' : ''}
                        onClick={() => setDraft((prev) => ({ ...prev, mode: 'walk' }))}
                      >
                        Piedi
                      </button>
                    </div>
                  </label>

                  <label className="wide">
                    <span>Fermate (una per riga)</span>
                    <textarea
                      rows="6"
                      value={draft.stopsText}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, stopsText: e.target.value }))
                      }
                    />
                  </label>

                  <label className="wide">
                    <span>URL Google Maps</span>
                    <input
                      type="text"
                      value={draft.url}
                      onChange={(e) => setDraft((prev) => ({ ...prev, url: e.target.value }))}
                    />
                  </label>
                </div>

                <div className="modal__actions">
                  <button type="button" className="primary-button" onClick={handleSaveRoute}>
                    Salva mappa
                  </button>

                  <button type="button" className="ghost-button" onClick={handleCancelEdit}>
                    Annulla
                  </button>
                </div>
              </div>
            ) : selectedRoute ? (
              <div className="stack">
                {selectedRoute.stops?.length ? (
                  <div className="detail-section">
                    <span>Fermate</span>

                    <div className="map-stops-list">
                      {selectedRoute.stops.map((stop, index) => (
                        <div key={`${selectedRoute.id}-${index}`} className="map-stop-row">
                          <div className="map-stop-number">{index + 1}</div>
                          <div className="map-stop-text">{stop}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {selectedRoute.url ? (
                  <div className="inline-actions">
                    <a
                      href={normalizeUrl(selectedRoute.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="primary-button button-link"
                    >
                      Apri Google Maps
                    </a>
                  </div>
                ) : null}

                {mode === 'organizer' ? (
                  <div className="inline-actions">
                    {!isEditing ? (
                      <button type="button" className="mini-button" onClick={handleStartEdit}>
                        Modifica
                      </button>
                    ) : null}

                    <button
                      type="button"
                      className="mini-button danger"
                      onClick={handleDeleteRoute}
                    >
                      Elimina
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        )}
      </section>
    </section>
  );
}

export default MapsPanel;