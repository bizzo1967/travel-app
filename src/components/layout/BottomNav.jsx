import { useTrip } from '../../context/TripContext.jsx';

function Icon({ children, active }) {
  return (
    <span
      style={{
        width: 20,
        height: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: active ? 'var(--accent)' : 'var(--muted)'
      }}
    >
      {children}
    </span>
  );
}

function BottomNav() {
  const { activeTab, setActiveTab } = useTrip();

  const tabs = [
    {
      key: 'cover',
      label: 'Cover',
      icon: (active) => (
        <Icon active={active}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="7" width="18" height="13" rx="2" />
            <path d="M8 7V5a4 4 0 0 1 8 0v2" />
          </svg>
        </Icon>
      )
    },
    {
      key: 'overview',
      label: 'Itin',
      icon: (active) => (
        <Icon active={active}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="6" cy="6" r="2" />
            <circle cx="18" cy="18" r="2" />
            <path d="M8 6h8M6 8v8M16 18h2" />
          </svg>
        </Icon>
      )
    },
    {
      key: 'cities',
      label: 'Città',
      icon: (active) => (
        <Icon active={active}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 21s-6-5-6-10a6 6 0 0 1 12 0c0 5-6 10-6 10z" />
            <circle cx="12" cy="11" r="2" />
          </svg>
        </Icon>
      )
    },
    {
      key: 'maps',
      label: 'Mappe',
      icon: (active) => (
        <Icon active={active}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="1 6 8 3 16 6 23 3 23 18 16 21 8 18 1 21 1 6" />
          </svg>
        </Icon>
      )
    },
    {
      key: 'flights',
      label: 'Voli',
      icon: (active) => (
        <Icon active={active}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 16l20-8-8 20-2-9-10-3z" />
          </svg>
        </Icon>
      )
    },
    {
      key: 'hotels',
      label: 'Hotel',
      icon: (active) => (
        <Icon active={active}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="7" width="18" height="13" rx="2" />
            <path d="M7 7V5h10v2" />
          </svg>
        </Icon>
      )
    },
    {
      key: 'bookings',
      label: 'Pren',
      icon: (active) => (
        <Icon active={active}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <path d="M8 10h8M8 14h5" />
          </svg>
        </Icon>
      )
    },
    {
      key: 'docs',
      label: 'Doc',
      icon: (active) => (
        <Icon active={active}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2z" />
            <path d="M14 2v6h6" />
          </svg>
        </Icon>
      )
    },
    {
      key: 'costs',
      label: 'Costi',
      icon: (active) => (
        <Icon active={active}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 1v22M17 5a4 4 0 0 0-8 0c0 4 8 4 8 8a4 4 0 0 1-8 0" />
          </svg>
        </Icon>
      )
    },
    {
      key: 'report',
      label: 'Report',
      icon: (active) => (
        <Icon active={active}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 20V4M10 20V10M16 20V6M22 20H2" />
          </svg>
        </Icon>
      )
    }
  ];

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            type="button"
            className={`bottom-nav__item ${isActive ? 'is-active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              minWidth: 56,
              padding: '8px 6px'
            }}
          >
            {tab.icon(isActive)}

            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: isActive ? 'var(--accent)' : 'var(--muted)'
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export default BottomNav;