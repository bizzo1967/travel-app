import { useRef } from 'react';
import { useTrip } from '../../context/TripContext.jsx';
import { downloadJsonFile, readJsonFile } from '../../utils/fileHandlers.js';
import { formatCurrency } from '../../utils/formatters.js';
import { getTripTotals } from '../../utils/report.js';

function Header() {
  const fileInputRef = useRef(null);

  const {
    trip,
    mode,
    setMode,
    replaceTrip,
    resetTrip
  } = useTrip();

  const totals = getTripTotals(trip);

  const handleExport = () => {
    const name =
      (trip.meta?.name || 'trip').replace(/\s+/g, '-').toLowerCase();

    downloadJsonFile(`${name}.json`, trip);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await readJsonFile(file);
      replaceTrip(data);
    } catch (err) {
      alert('Errore importazione');
    }

    e.target.value = '';
  };

  return (
    <header className="topbar">
      <div className="topbar__title">
        {trip.meta?.name || 'Travel Planner'}
      </div>

      <div className="topbar__mode">
        <button
          className={mode === 'travel' ? 'active' : ''}
          onClick={() => setMode('travel')}
        >
          Viaggio
        </button>

        <button
          className={mode === 'organizer' ? 'active' : ''}
          onClick={() => setMode('organizer')}
        >
          Edit
        </button>
      </div>

      <div className="topbar__budget">
        {formatCurrency(
          totals.estimatedTotal,
          trip.meta?.currency || 'EUR'
        )}
      </div>

      <div className="topbar__actions">
        {mode === 'organizer' ? (
          <>
            <button onClick={handleExport}>⤓</button>
            <button onClick={handleImportClick}>⤒</button>
            <button onClick={() => window.print()}>🖨</button>
            <button onClick={resetTrip}>↺</button>
          </>
        ) : (
          <button onClick={() => window.print()}>🖨</button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          hidden
          onChange={handleImportChange}
        />
      </div>
    </header>
  );
}

export default Header;