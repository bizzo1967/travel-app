import { useEffect, useMemo, useState } from 'react';
import { useTrip } from '../../context/TripContext.jsx';

const emptyCityDraft = {
  name: '',
  link1Label: '',
  link1Url: '',
  link2Label: '',
  link2Url: '',
  link3Label: '',
  link3Url: '',
  tips: ''
};

function normalizeUrl(url) {
  const value = (url || '').trim();
  if (!value) return '';
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  return `https://${value}`;
}

function buildCityDraft(city) {
  return {
    name: city?.name || '',
    link1Label: city?.link1Label || '',
    link1Url: city?.link1Url || '',
    link2Label: city?.link2Label || '',
    link2Url: city?.link2Url || '',
    link3Label: city?.link3Label || '',
    link3Url: city?.link3Url || '',
    tips: city?.tips || city?.notes || ''
  };
}

function CityLinks({ city }) {
  const links = [
    { label: city.link1Label, url: city.link1Url },
    { label: city.link2Label, url: city.link2Url },
    { label: city.link3Label, url: city.link3Url }
  ].filter((item) => item.label && item.url);

  if (!links.length) return null;

  return (
    <div className="inline-actions">
      {links.map((link, index) => (
        <a
          key={`${city.id}-link-${index}`}
          href={normalizeUrl(link.url)}
          target="_blank"
          rel="noopener noreferrer"
          className="primary-button button-link"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}

function CitiesPanel() {
  const { trip, mode, addCity, updateCity, removeCity } = useTrip();

  const [selectedCityId, setSelectedCityId] = useState(() => trip.cities[0]?.id || '');
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(emptyCityDraft);

  const selectedCity = useMemo(
    () => trip.cities.find((city) => city.id === selectedCityId) || trip.cities[0] || null,
    [trip.cities, selectedCityId]
  );

  useEffect(() => {
    if (!trip.cities.some((city) => city.id === selectedCityId)) {
      setSelectedCityId(trip.cities[0]?.id || '');
    }
  }, [trip.cities, selectedCityId]);

  useEffect(() => {
    if (selectedCity) {
      setDraft(buildCityDraft(selectedCity));
      setIsEditing(false);
    } else {
      setDraft(emptyCityDraft);
      setIsEditing(false);
    }
  }, [selectedCityId, selectedCity]);

  const handleCreateCity = () => {
    addCity({
      name: 'Nuova città',
      tips: ''
    });

    setTimeout(() => {
      const lastCity = trip.cities[trip.cities.length - 1];
      if (lastCity?.id) {
        setSelectedCityId(lastCity.id);
      }
    }, 0);
  };

  const handleSaveCity = () => {
    if (!selectedCity) return;

    updateCity(selectedCity.id, {
      name: draft.name,
      link1Label: draft.link1Label,
      link1Url: draft.link1Url,
      link2Label: draft.link2Label,
      link2Url: draft.link2Url,
      link3Label: draft.link3Label,
      link3Url: draft.link3Url,
      tips: draft.tips,
      notes: draft.tips
    });

    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setDraft(buildCityDraft(selectedCity));
    setIsEditing(false);
  };

  const handleDeleteCity = () => {
    if (!selectedCity) return;
    removeCity(selectedCity.id);
  };

  if (!trip.cities.length) {
    return (
      <section className="page-section">
        <section className="panel-card">
          <div className="panel-card__header">
            <h2 className="section-title">Città</h2>
          </div>

          <div className="empty-state-card">
            Nessuna città inserita.
          </div>

          {mode === 'organizer' && (
            <div className="inline-actions" style={{ marginTop: '14px' }}>
              <button type="button" className="primary-button" onClick={handleCreateCity}>
                + Aggiungi città
              </button>
            </div>
          )}
        </section>
      </section>
    );
  }

  return (
    <section className="page-section">
      <section className="panel-card">
        <div className="itinerary-topbar">
          <div className="chip-row chip-row--days">
            {trip.cities.map((city) => (
              <button
                key={city.id}
                type="button"
                className={`chip-button chip-button--day ${selectedCityId === city.id ? 'is-active' : ''}`}
                onClick={() => setSelectedCityId(city.id)}
              >
                <span className="chip-button__main">{city.name || 'Città'}</span>
              </button>
            ))}
          </div>

          {mode === 'organizer' && (
            <button type="button" className="primary-button" onClick={handleCreateCity}>
              + Città
            </button>
          )}
        </div>

        {selectedCity && (
          <div className="itinerary-day-card">
            <div className="itinerary-day-card__header">
              <div>
                <div className="itinerary-day-card__label">Città</div>
                <h2 className="itinerary-day-card__title">
                  {selectedCity.name || 'Nome città'}
                </h2>
              </div>

              {mode === 'organizer' && (
                <div className="inline-actions">
                  {!isEditing ? (
                    <button
                      type="button"
                      className="mini-button"
                      onClick={() => setIsEditing(true)}
                    >
                      Modifica
                    </button>
                  ) : null}

                  <button
                    type="button"
                    className="mini-button danger"
                    onClick={handleDeleteCity}
                  >
                    Elimina
                  </button>
                </div>
              )}
            </div>

            {mode === 'organizer' && isEditing ? (
              <div className="editor-card itinerary-day-editor">
                <div className="form-grid">
                  <label className="wide">
                    <span>Nome città</span>
                    <input
                      type="text"
                      value={draft.name}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="Es. Granada"
                    />
                  </label>

                  <label>
                    <span>Testo pulsante 1</span>
                    <input
                      type="text"
                      value={draft.link1Label}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, link1Label: e.target.value }))
                      }
                      placeholder="Es. Sito ufficiale"
                    />
                  </label>

                  <label>
                    <span>Link 1</span>
                    <input
                      type="text"
                      value={draft.link1Url}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, link1Url: e.target.value }))
                      }
                      placeholder="https://..."
                    />
                  </label>

                  <label>
                    <span>Testo pulsante 2</span>
                    <input
                      type="text"
                      value={draft.link2Label}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, link2Label: e.target.value }))
                      }
                      placeholder="Es. Mappa"
                    />
                  </label>

                  <label>
                    <span>Link 2</span>
                    <input
                      type="text"
                      value={draft.link2Url}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, link2Url: e.target.value }))
                      }
                      placeholder="https://..."
                    />
                  </label>

                  <label>
                    <span>Testo pulsante 3</span>
                    <input
                      type="text"
                      value={draft.link3Label}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, link3Label: e.target.value }))
                      }
                      placeholder="Es. Biglietti"
                    />
                  </label>

                  <label>
                    <span>Link 3</span>
                    <input
                      type="text"
                      value={draft.link3Url}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, link3Url: e.target.value }))
                      }
                      placeholder="https://..."
                    />
                  </label>

                  <label className="wide">
                    <span>Suggerimenti locali</span>
                    <textarea
                      rows="6"
                      value={draft.tips}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, tips: e.target.value }))
                      }
                      placeholder="Es. Ristoranti, colazioni, tapas, parcheggi, note utili..."
                    />
                  </label>
                </div>

                <div className="modal__actions">
                  <button type="button" className="primary-button" onClick={handleSaveCity}>
                    Salva città
                  </button>

                  <button type="button" className="ghost-button" onClick={handleCancelEdit}>
                    Annulla
                  </button>
                </div>
              </div>
            ) : (
              <div className="stack">
                <CityLinks city={selectedCity} />

                <div className="editor-card no-shadow">
                  <div className="detail-section">
                    <span>Suggerimenti locali</span>
                    <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                      {selectedCity.tips || selectedCity.notes || 'Nessun suggerimento inserito.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </section>
  );
}

export default CitiesPanel;