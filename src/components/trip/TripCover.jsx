import { useRef } from 'react';
import { useTrip } from '../../context/TripContext.jsx';
import { formatDate } from '../../utils/formatters.js';

function TripCover() {
  const { trip, mode, updateMeta } = useTrip();
  const fileInputRef = useRef(null);

  const handleChooseImage = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      updateMeta({ coverImage: reader.result });
    };

    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleRemoveImage = () => {
    updateMeta({ coverImage: '' });
  };

  return (
    <section className="page-section">
      <section className="cover-card">
        <div className="cover-card__image-wrap">
          {trip.meta.coverImage ? (
            <img
              src={trip.meta.coverImage}
              alt={trip.meta.name}
              className="cover-card__image"
            />
          ) : (
            <div className="cover-card__placeholder">
              Nessuna foto copertina caricata
            </div>
          )}

          <div className="cover-card__overlay">
            <div className="cover-card__content">
              <div className="cover-card__eyebrow">Travel Planner</div>
              <h1>{trip.meta.name}</h1>

              {trip.meta.subtitle ? (
                <p
                  className="cover-card__subtitle"
                  style={{ fontSize: '18px', fontWeight: 600 }}
                >
                  {trip.meta.subtitle}
                </p>
              ) : null}

              <div className="cover-card__meta">
                <span>{formatDate(trip.meta.startDate)}</span>
                <span>→</span>
                <span>{formatDate(trip.meta.endDate)}</span>
              </div>

              <div className="cover-card__participants">
                {trip.meta.travelers || 'Partecipanti non inseriti'}
              </div>

              {trip.meta.notes ? (
                <p
                  className="cover-card__notes"
                  style={{ fontSize: '15px', lineHeight: 1.6 }}
                >
                  {trip.meta.notes}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {mode === 'organizer' && (
        <section className="panel-card">
          <div className="panel-card__header">
            <h2 className="section-title">Modifica copertina</h2>
          </div>

          <div className="settings-grid">
            <label className="field-card field-card--wide">
              <span>Nome viaggio</span>
              <input
                type="text"
                value={trip.meta.name || ''}
                onChange={(e) => updateMeta({ name: e.target.value })}
              />
            </label>

            <label className="field-card">
              <span>Data inizio</span>
              <input
                type="date"
                value={trip.meta.startDate || ''}
                onChange={(e) => updateMeta({ startDate: e.target.value })}
              />
            </label>

            <label className="field-card">
              <span>Data fine</span>
              <input
                type="date"
                value={trip.meta.endDate || ''}
                onChange={(e) => updateMeta({ endDate: e.target.value })}
              />
            </label>

            <label className="field-card">
              <span>Partecipanti</span>
              <input
                type="text"
                value={trip.meta.travelers || ''}
                onChange={(e) => updateMeta({ travelers: e.target.value })}
                placeholder="Es. 2 adulti"
              />
            </label>

            <label className="field-card">
              <span>Valuta</span>
              <input
                type="text"
                value={trip.meta.currency || ''}
                onChange={(e) => updateMeta({ currency: e.target.value.toUpperCase() })}
              />
            </label>

            <label className="field-card field-card--wide">
              <span>Sottotitolo</span>
              <input
                type="text"
                value={trip.meta.subtitle || ''}
                onChange={(e) => updateMeta({ subtitle: e.target.value })}
                placeholder="Es. Road trip tra Malaga e Granada"
              />
            </label>

            <div className="field-card field-card--wide">
              <span>Foto copertina</span>

              <div className="inline-actions">
                <button
                  type="button"
                  className="primary-button"
                  onClick={handleChooseImage}
                >
                  Carica foto dal PC
                </button>

                {trip.meta.coverImage ? (
                  <button
                    type="button"
                    className="ghost-button danger"
                    onClick={handleRemoveImage}
                  >
                    Rimuovi foto
                  </button>
                ) : null}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />

              <p className="muted-text" style={{ marginTop: '10px' }}>
                Per usare una foto trovata online, salvala prima sul PC e poi caricala qui.
              </p>
            </div>

            <label className="field-card field-card--wide">
              <span>Note introduttive</span>
              <textarea
                rows="5"
                value={trip.meta.notes || ''}
                onChange={(e) => updateMeta({ notes: e.target.value })}
              />
            </label>
          </div>
        </section>
      )}
    </section>
  );
}

export default TripCover;