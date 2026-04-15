import { useTrip } from '../../context/TripContext.jsx';

function Header() {
  const { trip } = useTrip();

  return (
    <header
      className="topbar"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 12px'
      }}
    >
      <div
        className="topbar__title"
        style={{
          fontWeight: 800,
          fontSize: 16
        }}
      >
        {trip.meta?.name || 'Travel Planner'}
      </div>
    </header>
  );
}

export default Header;