import { useTrip } from '../../context/TripContext.jsx';

const ADMIN_LOCK_STORAGE_KEY = 'travel_planner_admin_lock';

function Header() {
  const { trip, mode, setMode } = useTrip();

  const adminLockEnabled =
    window.localStorage.getItem(ADMIN_LOCK_STORAGE_KEY) === 'true';

  const handleToggleMode = () => {
    if (mode === 'organizer') {
      setMode('travel');
    } else {
      setMode('organizer');
    }
  };

  return (
    <header
      className="topbar"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: '10px 12px'
      }}
    >
      <div
        className="topbar__title"
        style={{
          fontWeight: 800,
          fontSize: 16,
          minWidth: 0,
          flex: 1
        }}
      >
        {trip.meta?.name || 'Travel Planner'}
      </div>

      {!adminLockEnabled && (
        <button
          type="button"
          className="ghost-button"
          onClick={handleToggleMode}
          style={{ whiteSpace: 'nowrap' }}
        >
          {mode === 'organizer' ? 'Torna al viaggio' : 'Admin'}
        </button>
      )}
    </header>
  );
}

export default Header;