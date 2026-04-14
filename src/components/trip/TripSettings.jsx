import { useRef } from 'react';
import { useTrip } from '../../context/TripContext.jsx';
import { downloadJsonFile, readJsonFile } from '../../utils/fileHandlers.js';

function TripSettings() {
  const fileInputRef = useRef(null);
  const {
    trip,
    updateMeta,
    replaceTrip,
    resetTrip
  } = useTrip();

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const parsed = await readJsonFile(file);
      replaceTrip(parsed);
      alert('Viaggio importato correttamente.');
    } catch (error) {
      alert(error.message || 'Errore durante l’importazione.');
    } finally {
      event.target.value = '';
    }
  };

  const handleExport = () => {
    const safeName =
      trip.meta.name.trim().replace(/\s+/g, '-').toLowerCase() || 'trip';
    downloadJsonFile(`${safeName}.json`, trip);
  };

  const handleReset = () => {
    const ok = window.confirm('Vuoi davvero ripristinare il viaggio iniziale?');
    if (ok) resetTrip();
  };

  return (
    <section className="page-section">
      <section className="panel-card">
        <div className="panel-card__header">
          <h2 className="section-title">Impostazioni viaggio</h2>
        </div>

        <div className="settings-grid">
          <label className="field-card field-card--wide">
            <span>Nome viaggio</span>
            <input
              type="text"
              value={trip.meta.name}
              onChange={(e) => updateMeta({ name: e.target.value })}
              placeholder="Es. Andalusia 2026"
            />
          </label>

          <label className="field-card">
            <span>Data inizio</span>
            <input
              type="date"
              value={trip.meta.startDate}
              onChange={(e) => updateMeta({ startDate: e.target.value })}
            />
          </label>

          <label className="field-card">
            <span>Data fine</span>
            <input
              type="date"
              value={trip.meta.endDate}
              onChange={(e) => updateMeta({ endDate: e.target.value })}
            />
          </label>

          <label className="field-card">
            <span>Viaggiatori</span>
            <input
              type="text"
              value={trip.meta.travelers}
              onChange={(e) => updateMeta({ travelers: e.target.value })}
              placeholder="Es. 2 adulti"
            />
          </label>

          <label className="field-card">
            <span>Valuta</span>
            <input
              type="text"
              value={trip.meta.currency}
              onChange={(e) => updateMeta({ currency: e.target.value.toUpperCase() })}
              placeholder="EUR"
            />
          </label>

          <label className="field-card field-card--wide">
            <span>URL foto copertina</span>
            <input
              type="text"
              value={trip.meta.coverImage || ''}
              onChange={(e) => updateMeta({ coverImage: e.target.value })}
              placeholder="Incolla qui il link dell'immagine"
            />
          </label>

          <label className="field-card field-card--wide">
            <span>Sottotitolo / descrizione breve</span>
            <input
              type="text"
              value={trip.meta.subtitle || ''}
              onChange={(e) => updateMeta({ subtitle: e.target.value })}
              placeholder="Es. Road trip tra Malaga e Granada"
            />
          </label>

          <label className="field-card field-card--wide">
            <span>Note viaggio</span>
            <textarea
              rows="5"
              value={trip.meta.notes}
              onChange={(e) => updateMeta({ notes: e.target.value })}
              placeholder="Note introduttive del viaggio"
            />
          </label>
        </div>
      </section>

      <section className="panel-card">
        <div className="panel-card__header">
          <h3>Gestione file</h3>
        </div>

        <div className="action-row">
          <button type="button" className="ghost-button" onClick={handleExport}>
            Esporta JSON
          </button>
          <button type="button" className="ghost-button" onClick={handleImportClick}>
            Importa JSON
          </button>
          <button type="button" className="ghost-button" onClick={() => window.print()}>
            Stampa
          </button>
          <button type="button" className="ghost-button danger" onClick={handleReset}>
            Reset viaggio
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
    </section>
  );
}

export default TripSettings;