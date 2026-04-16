import { useRef, useState } from 'react';
import { useTrip } from '../../context/TripContext.jsx';
import { formatDate } from '../../utils/formatters.js';
import { downloadJsonFile, readJsonFile } from '../../utils/fileHandlers.js';

const ORGANIZER_PASSWORD = 'viaggio123';
const ADMIN_LOCK_STORAGE_KEY = 'travel_planner_admin_lock';

const PRINT_OPTIONS = [
  { key: 'overview', label: 'Itinerario' },
  { key: 'cities', label: 'Città' },
  { key: 'flights', label: 'Voli' },
  { key: 'hotels', label: 'Hotel' },
  { key: 'bookings', label: 'Prenotazioni' },
  { key: 'docs', label: 'Documenti' },
  { key: 'costs', label: 'Costi' },
  { key: 'report', label: 'Report' }
];

function TripCover() {
  const {
    trip,
    mode,
    setMode,
    activeTab,
    setActiveTab,
    updateMeta,
    replaceTrip,
    resetTrip
  } = useTrip();

  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const [showPrintMenu, setShowPrintMenu] = useState(false);
  const [adminLockEnabled, setAdminLockEnabled] = useState(
    () => window.localStorage.getItem(ADMIN_LOCK_STORAGE_KEY) === 'true'
  );

  const handleChooseImage = () => {
    imageInputRef.current?.click();
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

  const handleExport = () => {
    const rawName = (trip.meta?.name || 'trip').trim();
    const safeName = rawName.replace(/\s+/g, '-').toLowerCase() || 'trip';
    downloadJsonFile(`${safeName}.json`, trip);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await readJsonFile(file);
      replaceTrip(data);
      alert('Viaggio importato correttamente.');
    } catch (err) {
      alert(err?.message || 'Errore importazione');
    }

    event.target.value = '';
  };

  const handleModeToggle = () => {
    if (mode === 'organizer') {
      setMode('travel');
      return;
    }

    if (!adminLockEnabled) {
      setMode('organizer');
      return;
    }

    const typedPassword = window.prompt(
      'Inserimento dati (solo operatore)\nInserisci la password:'
    );

    if (typedPassword === null) return;

    if (typedPassword === ORGANIZER_PASSWORD) {
      setMode('organizer');
      return;
    }

    alert('Password errata.');
  };

  const handleToggleAdminLock = () => {
    const nextValue = !adminLockEnabled;
    setAdminLockEnabled(nextValue);
    window.localStorage.setItem(ADMIN_LOCK_STORAGE_KEY, String(nextValue));

    if (nextValue) {
      alert('Blocco admin attivato. Da ora l’accesso admin richiede password.');
    } else {
      alert('Blocco admin disattivato. Lo switch libero è di nuovo attivo.');
    }
  };

  const handleShowInfo = () => {
    alert(
      `Password modalità operatore: ${ORGANIZER_PASSWORD}\nBlocco admin: ${
        adminLockEnabled ? 'ATTIVO' : 'DISATTIVATO'
      }\n\nQuando il blocco è disattivato puoi passare liberamente tra utente e amministratore.`
    );
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      'Vuoi davvero cancellare tutti i dati del viaggio? Questa azione non si può annullare.'
    );

    if (!confirmed) return;

    resetTrip();
    setMode('travel');
  };

  const handlePrintSelect = (targetTab) => {
    setShowPrintMenu(false);

    const previousTab = activeTab;
    const previousMode = mode;

    const restoreAfterPrint = () => {
      window.removeEventListener('afterprint', restoreAfterPrint);
      setActiveTab(previousTab);
      setMode(previousMode);
    };

    window.addEventListener('afterprint', restoreAfterPrint);

    setMode('travel');
    setActiveTab(targetTab);

    setTimeout(() => {
      window.print();

      setTimeout(() => {
        window.removeEventListener('afterprint', restoreAfterPrint);
        setActiveTab(previousTab);
        setMode(previousMode);
      }, 800);
    }, 250);
  };

  const coverActionButtonStyle = {
    border: '1px solid var(--border)',
    background: '#fff',
    borderRadius: 10,
    padding: '8px 10px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    fontSize: 12,
    fontWeight: 700,
    whiteSpace: 'nowrap',
    minHeight: 38
  };

  const modalBackdropStyle = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.35)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    zIndex: 1000
  };

  const modalCardStyle = {
    width: '100%',
    maxWidth: 420,
    background: '#fff',
    borderRadius: 16,
    padding: 16,
    boxShadow: '0 12px 30px rgba(0,0,0,0.18)'
  };

  const modalGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 8,
    marginTop: 12
  };

  const modalButtonStyle = {
    border: '1px solid var(--border)',
    background: '#fff',
    borderRadius: 10,
    padding: '12px 10px',
    fontSize: 13,
    fontWeight: 700,
    minHeight: 44
  };

  return (
    <section className="page-section">
      <section
        className="panel-card"
        style={{ marginBottom: '12px', padding: '12px' }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 8
          }}
        >
          <button
            type="button"
            onClick={() => setShowPrintMenu(true)}
            style={coverActionButtonStyle}
          >
            <span aria-hidden="true">🖨</span>
            <span>Stampa</span>
          </button>

          {mode === 'organizer' ? (
            <button
              type="button"
              onClick={handleExport}
              style={coverActionButtonStyle}
            >
              <span aria-hidden="true">⤓</span>
              <span>Esporta</span>
            </button>
          ) : null}

          <button
            type="button"
            onClick={handleImportClick}
            style={coverActionButtonStyle}
          >
            <span aria-hidden="true">⤒</span>
            <span>Importa</span>
          </button>

          <button
            type="button"
            onClick={handleShowInfo}
            style={coverActionButtonStyle}
          >
            <span aria-hidden="true">ℹ️</span>
            <span>Info</span>
          </button>

          <button
            type="button"
            onClick={handleModeToggle}
            style={{
              ...coverActionButtonStyle,
              gridColumn: '1 / -1',
              background: 'var(--accent)',
              color: '#fff'
            }}
          >
            {mode === 'organizer' ? 'Torna al viaggio' : 'Admin'}
          </button>

          {mode === 'organizer' ? (
            <>
              <button
                type="button"
                onClick={handleToggleAdminLock}
                style={{
                  ...coverActionButtonStyle,
                  gridColumn: '1 / -1'
                }}
              >
                {adminLockEnabled ? '🔒 Blocco attivo (tocca per sbloccare)' : '🔓 Modalità modifica libera'}
              </button>

              <button
                type="button"
                onClick={handleReset}
                style={{
                  ...coverActionButtonStyle,
                  gridColumn: '1 / -1',
                  color: 'var(--danger, #b42318)',
                  borderColor: 'var(--danger, #b42318)'
                }}
              >
                <span aria-hidden="true">↺</span>
                <span>Reset</span>
              </button>
            </>
          ) : null}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          hidden
          onChange={handleImportChange}
        />
      </section>

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
                onChange={(e) =>
                  updateMeta({ currency: e.target.value.toUpperCase() })
                }
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
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />

              <p className="muted-text" style={{ marginTop: '10px' }}>
                Per usare una foto trovata online, salvala prima sul PC e poi
                caricala qui.
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

      {showPrintMenu ? (
        <div style={modalBackdropStyle} onClick={() => setShowPrintMenu(false)}>
          <div style={modalCardStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: 16, fontWeight: 800 }}>Scegli cosa stampare</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
              Tocca una sezione.
            </div>

            <div style={modalGridStyle}>
              {PRINT_OPTIONS.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  style={modalButtonStyle}
                  onClick={() => handlePrintSelect(option.key)}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowPrintMenu(false)}
              style={{
                ...modalButtonStyle,
                width: '100%',
                marginTop: 12
              }}
            >
              Annulla
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default TripCover;