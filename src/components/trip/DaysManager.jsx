import { useEffect, useMemo, useState } from 'react';
import { useTrip } from '../../context/TripContext.jsx';
import { findCityName, formatDate } from '../../utils/formatters.js';

function buildDraft(day) {
  return {
    label: day?.label || '',
    date: day?.date || '',
    title: day?.title || '',
    cityId: day?.cityId || ''
  };
}

function DaysManager() {
  const {
    trip,
    selectedDayId,
    setSelectedDayId,
    addDay,
    updateDay,
    removeDay,
    duplicateDay
  } = useTrip();

  const selectedDay = useMemo(
    () => trip.days.find((day) => day.id === selectedDayId) || trip.days[0] || null,
    [trip.days, selectedDayId]
  );

  const [draft, setDraft] = useState(buildDraft(selectedDay));
  const [newDay, setNewDay] = useState({
    label: `Giorno ${trip.days.length}`,
    date: '',
    title: '',
    cityId: ''
  });

  useEffect(() => {
    setDraft(buildDraft(selectedDay));
  }, [selectedDayId, selectedDay]);

  const handleSaveDay = () => {
    if (!selectedDay) return;
    updateDay(selectedDay.id, draft);
  };

  const handleResetDay = () => {
    setDraft(buildDraft(selectedDay));
  };

  const handleAddDay = (e) => {
    e.preventDefault();
    addDay(newDay);
    setNewDay({
      label: `Giorno ${trip.days.length + 1}`,
      date: '',
      title: '',
      cityId: ''
    });
  };

  if (!selectedDay) {
    return (
      <section className="panel-card">
        <p>Nessun giorno disponibile.</p>
      </section>
    );
  }

  return (
    <section className="panel-card">
      <div className="panel-card__header">
        <h3>Gestione giorni</h3>
      </div>

      <div className="stack">
        {trip.days.map((day, index) => (
          <div
            key={day.id}
            className={`day-manager-card ${selectedDayId === day.id ? 'is-active' : ''}`}
          >
            <div className="day-manager-card__top">
              <button
                type="button"
                className="day-manager-card__select"
                onClick={() => setSelectedDayId(day.id)}
              >
                <div className="day-manager-card__title-row">
                  <strong>{day.title || `Giorno ${index}`}</strong>
                  <span>{formatDate(day.date)}</span>
                </div>

                <div className="day-manager-card__subtitle">
                  {day.label || `Day ${index}`} · {findCityName(trip, day.cityId)}
                </div>
              </button>

              <div className="inline-actions">
                <button
                  type="button"
                  className="mini-button"
                  onClick={() => duplicateDay(day.id)}
                >
                  Duplica
                </button>

                <button
                  type="button"
                  className="mini-button danger"
                  onClick={() => removeDay(day.id)}
                >
                  Elimina
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="editor-card day-editor-card">
        <div className="editor-card__top">
          <strong>Modifica giorno selezionato</strong>
        </div>

        <div className="form-grid">
          <label>
            <span>Label giorno</span>
            <input
              type="text"
              value={draft.label}
              onChange={(e) => setDraft((prev) => ({ ...prev, label: e.target.value }))}
              placeholder="Es. Giorno 1"
            />
          </label>

          <label>
            <span>Data</span>
            <input
              type="date"
              value={draft.date}
              onChange={(e) => setDraft((prev) => ({ ...prev, date: e.target.value }))}
            />
          </label>

          <label className="wide">
            <span>Titolo del giorno</span>
            <input
              type="text"
              value={draft.title}
              onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Es. Malaga centro e tramonto"
            />
          </label>

          <label className="wide">
            <span>Città principale</span>
            <select
              value={draft.cityId}
              onChange={(e) => setDraft((prev) => ({ ...prev, cityId: e.target.value }))}
            >
              <option value="">Seleziona città</option>
              {trip.cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="inline-actions">
          <button type="button" className="primary-button" onClick={handleSaveDay}>
            Salva giorno
          </button>

          <button type="button" className="ghost-button" onClick={handleResetDay}>
            Annulla modifiche
          </button>
        </div>
      </div>

      <form className="editor-card" onSubmit={handleAddDay}>
        <div className="editor-card__top">
          <strong>Aggiungi giorno</strong>
        </div>

        <div className="form-grid">
          <label>
            <span>Label giorno</span>
            <input
              type="text"
              value={newDay.label}
              onChange={(e) => setNewDay((prev) => ({ ...prev, label: e.target.value }))}
              placeholder="Es. Giorno 2"
            />
          </label>

          <label>
            <span>Data</span>
            <input
              type="date"
              value={newDay.date}
              onChange={(e) => setNewDay((prev) => ({ ...prev, date: e.target.value }))}
            />
          </label>

          <label className="wide">
            <span>Titolo del giorno</span>
            <input
              type="text"
              value={newDay.title}
              onChange={(e) => setNewDay((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Es. Granada e Alhambra"
            />
          </label>

          <label className="wide">
            <span>Città principale</span>
            <select
              value={newDay.cityId}
              onChange={(e) => setNewDay((prev) => ({ ...prev, cityId: e.target.value }))}
            >
              <option value="">Seleziona città</option>
              {trip.cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button type="submit" className="primary-button">
          Crea giorno
        </button>
      </form>
    </section>
  );
}

export default DaysManager;