import { useTrip } from '../../context/TripContext.jsx';

function Header() {
  const {
    trip,
    mode,
    isAdminAuthenticated,
    switchToUserView,
    switchToAdminView
  } = useTrip();

  const isOrganizerMode = mode === 'organizer';

  const handleToggleView = () => {
    if (isOrganizerMode) {
      switchToUserView();
    } else {
      switchToAdminView();
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

      {isAdminAuthenticated && (
        <button
          type="button"
          className="ghost-button"
          onClick={handleToggleView}
          style={{ whiteSpace: 'nowrap' }}
        >
          {isOrganizerMode ? 'Vedi come utente' : 'Torna a modifica'}
        </button>
      )}
    </header>
  );
}

export default Header;