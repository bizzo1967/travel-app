import { useRef } from 'react';
import { useTrip } from '../../context/TripContext.jsx';
import { formatDate } from '../../utils/formatters.js';
import { downloadJsonFile, readJsonFile } from '../../utils/fileHandlers.js';

const ORGANIZER_PASSWORD = 'viaggio123';

function TripCover() {
  const {
    trip,
    mode,
    adminLock,
    isAdminAuthenticated,
    startAdminSession,
    endAdminSession,
    switchToUserView,
    switchToAdminView,
    enableAdminLock,
    disableAdminLock,
    setActiveTab,
    updateMeta,
    replaceTrip,
    resetTrip
  } = useTrip();

  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const isOrganizerMode = mode === 'organizer';

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

  const handleStartAdminSession = () => {
    if (!adminLock) {
      startAdminSession();
      return;
    }

    const typedPassword = window.prompt(
      'Accesso operatore protetto.\nInserisci la password:'
    );

    if (typedPassword === null) return;

    if (typedPassword === ORGANIZER_PASSWORD) {
      startAdminSession();
      return;
    }

    alert('Password errata.');
  };

  const handleTogglePassword = () => {
    if (adminLock) {
      disableAdminLock();
      alert('Richiesta password disattivata.');
    } else {
      enableAdminLock();
      alert('Richiesta password attivata.');
    }
  };

  const handleShowInfo = () => {
    alert(
      `Sessione operatore: ${isAdminAuthenticated ? 'attiva' : 'non attiva'}\nVista corrente: ${
        isOrganizerMode ? 'modifica' : 'utente'
      }\nRichiesta password: ${adminLock ? 'attiva' : 'disattiva'}\n\nPassword operatore: ${ORGANIZER_PASSWORD}`
    );
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      'Vuoi davvero cancellare tutti i dati del viaggio? Questa azione non si può annullare.'
    );

    if (!confirmed) return;

    resetTrip();
    endAdminSession();
  };

  const handleOpenReport = () => {
    setActiveTab('report');
  };

  const sectionCardStyle = {
    padding: 12,
    borderRadius: 14,
    background: '#fff',
    border: '1px solid var(--border)'
  };

  const topCardsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 12,
    marginBottom: 12
  };

  const sectionTitleStyle = {
    fontSize: 14,
    fontWeight: 800,
    marginBottom: 8
  };

  const helperTextStyle = {
    fontSize: 13,
    color: 'var(--muted)',
    lineHeight: 1.5
  };

  const badgeRowStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8
  };

  const badgeBaseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 10px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700
  };

  const primaryButtonStyle = {
    width: '100%',
    border: '1px solid var(--accent)',
    background: 'var(--accent)',
    color: '#fff',
    borderRadius: 12,
    padding: '12px 14px',
    fontSize: 14,
    fontWeight: 800,
    minHeight: 44
  };

  const secondaryWideButtonStyle = {
    width: '100%',
    border: '1px solid var(--border)',
    background: '#fff',
    color: 'var(--text)',
    borderRadius: 12,
    padding: '12px 14px',
    fontSize: 14,
    fontWeight: 800,
    minHeight: 44
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 8
  };

  const actionButtonStyle = {
    border: '1px solid var(--border)',
    background: '#fff',
    borderRadius: 10,
    padding: '10px 10px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    fontSize: 12,
    fontWeight: 700,
    whiteSpace: 'nowrap',
    minHeight: 40
  };

  const dangerButtonStyle = {
    ...actionButtonStyle,
    width: '100%',
    color: 'var(--danger, #b42318)',
    borderColor: 'var(--danger, #b42318)'
  };

  return (
    <section className="page-section">
      <div style={topCardsGridStyle}>
        <section style={sectionCardStyle}>
          <div style={sectionTitleStyle}>Stato</div>

          <div style={{ fontSize: 15, fontWeight: 800 }}>
            {isAdminAuthenticated
              ? isOrganizerMode
                ? 'Sessione operatore attiva - vista modifica'
                : 'Sessione operatore attiva - vista utente'
              : 'Utilizzatore normale'}
          </div>

          <div style={badgeRowStyle}>
            <span
              style={{
                ...badgeBaseStyle,
                background: isAdminAuthenticated
                  ? 'rgba(127, 90, 240, 0.12)'
                  : 'rgba(15, 23, 42, 0.06)',
                color: 'var(--text)'
              }}
            >
              {isAdminAuthenticated ? '🔐 Sessione operatore attiva' : '👀 Vista utilizzatore'}
            </span>

            <span
              style={{
                ...badgeBaseStyle,
                background: adminLock
                  ? 'rgba(180, 35, 24, 0.10)'
                  : 'rgba(34, 197, 94, 0.10)',
                color: 'var(--text)'
              }}
            >
              {adminLock ? '🔒 Password attiva' : '🔓 Password disattiva'}
            </span>
          </div>

          <div style={{ ...helperTextStyle, marginTop: 8 }}>
            {isAdminAuthenticated
              ? 'Puoi passare liberamente tra vista modifica e vista utente da tutte le schede.'
              : 'Fuori dalla cover non vengono mostrati i controlli operatore.'}
          </div>
        </section>

        <section style={sectionCardStyle}>
          <div style={sectionTitleStyle}>Accesso operatore</div>

          {!isAdminAuthenticated ? (
            <>
              <button
                type="button"
                onClick={handleStartAdminSession}
                style={primaryButtonStyle}
              >
                Entra come operatore
              </button>

              <div style={{ ...helperTextStyle, marginTop: 8 }}>
                {adminLock
                  ? 'Per entrare nella sessione operatore serve la password.'
                  : 'Accesso operatore libero: puoi entrare senza password.'}
              </div>
            </>
          ) : (
            <div style={{ display: 'grid', gap: 8 }}>
              <button
                type="button"
                onClick={() => {
                  if (isOrganizerMode) switchToUserView();
                  else switchToAdminView();
                }}
                style={secondaryWideButtonStyle}
              >
                {isOrganizerMode ? 'Vedi come utilizzatore' : 'Torna a modifica'}
              </button>

              <button
                type="button"
                onClick={endAdminSession}
                style={secondaryWideButtonStyle}
              >
                Esci da sessione operatore
              </button>

              <div style={helperTextStyle}>
                Finché la sessione operatore resta attiva, puoi cambiare vista in tutte le schede.
              </div>
            </div>
          )}
        </section>
      </div>

      <section style={{ ...sectionCardStyle, marginBottom: 12 }}>
        <div style={sectionTitleStyle}>Strumenti viaggio</div>

        <div style={gridStyle}>
          <button
            type="button"
            onClick={handleOpenReport}
            style={{
              ...actionButtonStyle,
              gridColumn: '1 / -1'
            }}
          >
            <span aria-hidden="true">📄</span>
            <span>Apri report</span>
          </button>

          <button
            type="button"
            onClick={handleImportClick}
            style={actionButtonStyle}
          >
            <span aria-hidden="true">⤒</span>
            <span>Importa</span>
          </button>

          {isAdminAuthenticated ? (
            <button
              type="button"
              onClick={handleExport}
              style={actionButtonStyle}
            >
              <span aria-hidden="true">⤓</span>
              <span>Esporta</span>
            </button>
          ) : null}

          <button
            type="button"
            onClick={handleShowInfo}
            style={actionButtonStyle}
          >
            <span aria-hidden="true">ℹ️</span>
            <span>Info</span>
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          hidden
          onChange={handleImportChange}
        />
      </section>

      {isAdminAuthenticated ? (
        <section style={{ ...sectionCardStyle, marginBottom: 12 }}>
          <div style={sectionTitleStyle}>Sicurezza operatore</div>

          <button
            type="button"
            onClick={handleTogglePassword}
            style={{
              ...actionButtonStyle,
              width: '100%'
            }}
          >
            {adminLock ? 'Disattiva richiesta password' : 'Attiva richiesta password'}
          </button>

          <div style={{ ...helperTextStyle, marginTop: 8 }}>
            {adminLock
              ? 'La prossima volta, per entrare nella sessione operatore, servirà la password.'
              : 'La prossima volta potrai entrare nella sessione operatore senza password.'}
          </div>
        </section>
      ) : null}

      {isAdminAuthenticated ? (
        <section style={{ ...sectionCardStyle, marginBottom: 12 }}>
          <div style={sectionTitleStyle}>Pericolo</div>

          <button
            type="button"
            onClick={handleReset}
            style={dangerButtonStyle}
          >
            <span aria-hidden="true">↺</span>
            <span>Reset viaggio</span>
          </button>

          <div style={{ ...helperTextStyle, marginTop: 8 }}>
            Cancella tutti i dati del viaggio. Operazione non annullabile.
          </div>
        </section>
      ) : null}

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

      {isOrganizerMode && (
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
    </section>
  );
}

export default TripCover;