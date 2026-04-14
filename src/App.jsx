import Header from './components/layout/Header.jsx';
import BottomNav from './components/layout/BottomNav.jsx';
import TripCover from './components/trip/TripCover.jsx';
import TripOverview from './components/trip/TripOverview.jsx';
import CitiesPanel from './components/trip/CitiesPanel.jsx';
import HotelsPanel from './components/trip/HotelsPanel.jsx';
import BookingsPanel from './components/trip/BookingsPanel.jsx';
import FlightsPanel from './components/trip/FlightsPanel.jsx';
import CostsPanel from './components/trip/CostsPanel.jsx';
import MapsPanel from './components/trip/MapsPanel.jsx';
import TravelDocsPanel from './components/trip/TravelDocsPanel.jsx';
import TravelReport from './components/trip/TravelReport.jsx';
import { useTrip } from './context/TripContext.jsx';

function App() {
  const { activeTab } = useTrip();

  const renderPanel = () => {
    switch (activeTab) {
      case 'cover':
        return <TripCover />;
      case 'overview':
        return <TripOverview />;
      case 'cities':
        return <CitiesPanel />;
      case 'maps':
        return <MapsPanel />;
      case 'flights':
        return <FlightsPanel />;
      case 'hotels':
        return <HotelsPanel />;
      case 'bookings':
        return <BookingsPanel />;
      case 'docs':
        return <TravelDocsPanel />;
      case 'costs':
        return <CostsPanel />;
      case 'report':
        return <TravelReport />;
      default:
        return <TripCover />;
    }
  };

  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">{renderPanel()}</main>
      <BottomNav />
    </div>
  );
}

export default App;