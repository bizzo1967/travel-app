import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  STORAGE_KEY,
  loadTripFromStorage,
  saveTripToStorage
} from '../utils/storage.js';
import {
  createDefaultTrip,
  normalizeTripData,
  uid,
  createDay,
  createTimelineItem,
  createCity,
  createHotel,
  createBooking,
  createFlight,
  createCost,
  createMapRoute
} from '../data/tripFactory.js';

const ADMIN_LOCK_KEY = 'travel-planner-admin-lock-v1';

const TripContext = createContext(null);

function createEmptyTrip() {
  return {
    meta: {
      id: uid('trip'),
      name: '',
      subtitle: '',
      startDate: '',
      endDate: '',
      currency: 'EUR',
      travelers: '',
      notes: '',
      coverImage: ''
    },
    cities: [],
    days: [],
    hotels: [],
    bookings: [],
    flights: [],
    costs: [],
    maps: [],
    travelDocs: []
  };
}

function ensureTripShape(data) {
  return {
    ...data,
    travelDocs: Array.isArray(data?.travelDocs) ? data.travelDocs : []
  };
}

function getInitialTrip() {
  const loaded = loadTripFromStorage();
  const baseTrip = loaded || createDefaultTrip();
  return ensureTripShape(baseTrip);
}

function getInitialAdminLock() {
  try {
    return window.localStorage.getItem(ADMIN_LOCK_KEY) === 'true';
  } catch {
    return false;
  }
}

function getEventSortValue(item) {
  return item.startTime || item.time || '99:99';
}

function sortTimeline(items = []) {
  return [...items].sort((a, b) =>
    getEventSortValue(a).localeCompare(getEventSortValue(b))
  );
}

export function TripProvider({ children }) {
  const [trip, setTrip] = useState(getInitialTrip);
  const [mode, setModeState] = useState('travel');
  const [activeTab, setActiveTab] = useState('cover');
  const [selectedDayId, setSelectedDayId] = useState(() => getInitialTrip().days[0]?.id || '');
  const [adminLock, setAdminLock] = useState(getInitialAdminLock);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    saveTripToStorage(trip);
  }, [trip]);

  useEffect(() => {
    try {
      window.localStorage.setItem(ADMIN_LOCK_KEY, String(adminLock));
    } catch {}
  }, [adminLock]);

  useEffect(() => {
    if (!trip.days.some((day) => day.id === selectedDayId)) {
      setSelectedDayId(trip.days[0]?.id || '');
    }
  }, [trip.days, selectedDayId]);

  useEffect(() => {
    if (!isAdminAuthenticated && mode === 'organizer') {
      setModeState('travel');
    }
  }, [isAdminAuthenticated, mode]);

  const selectedDay =
    trip.days.find((day) => day.id === selectedDayId) || trip.days[0] || null;

  const setMode = (nextMode) => {
    if (nextMode === 'organizer' && !isAdminAuthenticated) return;
    setModeState(nextMode);
  };

  const startAdminSession = () => {
    setIsAdminAuthenticated(true);
    setModeState('organizer');
  };

  const endAdminSession = () => {
    setIsAdminAuthenticated(false);
    setModeState('travel');
  };

  const switchToUserView = () => {
    setModeState('travel');
  };

  const switchToAdminView = () => {
    if (!isAdminAuthenticated) return;
    setModeState('organizer');
  };

  const enableAdminLock = () => {
    setAdminLock(true);
    setIsAdminAuthenticated(false);
    setModeState('travel');
  };

  const disableAdminLock = () => {
    setAdminLock(false);
  };

  const updateMeta = (patch) => {
    setTrip((prev) => ({
      ...prev,
      meta: { ...prev.meta, ...patch }
    }));
  };

  const replaceTrip = (newTrip) => {
    const normalized = ensureTripShape(normalizeTripData(newTrip));
    setTrip(normalized);
    setSelectedDayId(normalized.days[0]?.id || '');
  };

  const resetTrip = () => {
    const confirmed = window.confirm(
      'Sei sicuro? Tutti i dati del viaggio verranno eliminati.'
    );

    if (!confirmed) return;

    const emptyTrip = createEmptyTrip();
    setTrip(emptyTrip);
    setSelectedDayId('');
    setActiveTab('cover');
    setIsAdminAuthenticated(false);
    setModeState('travel');
    window.localStorage.removeItem(STORAGE_KEY);
  };

  const addDay = (payload) => {
    const newDay = createDay(payload);
    setTrip((prev) => ({
      ...prev,
      days: [...prev.days, newDay]
    }));
    setSelectedDayId(newDay.id);
  };

  const updateDay = (dayId, patch) => {
    setTrip((prev) => ({
      ...prev,
      days: prev.days.map((day) =>
        day.id === dayId ? { ...day, ...patch } : day
      )
    }));
  };

  const removeDay = (dayId) => {
    setTrip((prev) => ({
      ...prev,
      days: prev.days.filter((day) => day.id !== dayId),
      maps: prev.maps.filter((item) => item.dayId !== dayId)
    }));
  };

  const duplicateDay = (dayId) => {
    const original = trip.days.find((day) => day.id === dayId);
    if (!original) return;

    const copy = {
      ...original,
      id: uid('day'),
      timeline: original.timeline.map((item) => ({
        ...item,
        id: uid('event')
      }))
    };

    setTrip((prev) => ({
      ...prev,
      days: [...prev.days, copy]
    }));

    setSelectedDayId(copy.id);
  };

  const addTimelineItem = (dayId, payload) => {
    const item = createTimelineItem(payload);

    setTrip((prev) => ({
      ...prev,
      days: prev.days.map((day) =>
        day.id === dayId
          ? { ...day, timeline: sortTimeline([...day.timeline, item]) }
          : day
      )
    }));
  };

  const updateTimelineItem = (dayId, itemId, patch) => {
    setTrip((prev) => ({
      ...prev,
      days: prev.days.map((day) =>
        day.id === dayId
          ? {
              ...day,
              timeline: sortTimeline(
                day.timeline.map((item) =>
                  item.id === itemId ? { ...item, ...patch } : item
                )
              )
            }
          : day
      )
    }));
  };

  const removeTimelineItem = (dayId, itemId) => {
    setTrip((prev) => ({
      ...prev,
      days: prev.days.map((day) =>
        day.id === dayId
          ? {
              ...day,
              timeline: day.timeline.filter((item) => item.id !== itemId)
            }
          : day
      )
    }));
  };

  const addCity = (payload) => {
    const city = createCity(payload);
    setTrip((prev) => ({
      ...prev,
      cities: [...prev.cities, city]
    }));
  };

  const updateCity = (cityId, patch) => {
    setTrip((prev) => ({
      ...prev,
      cities: prev.cities.map((city) =>
        city.id === cityId ? { ...city, ...patch } : city
      )
    }));
  };

  const removeCity = (cityId) => {
    setTrip((prev) => ({
      ...prev,
      cities: prev.cities.filter((city) => city.id !== cityId)
    }));
  };

  const addHotel = (payload) => {
    const hotel = createHotel(payload);
    setTrip((prev) => ({
      ...prev,
      hotels: [...prev.hotels, hotel]
    }));
  };

  const updateHotel = (hotelId, patch) => {
    setTrip((prev) => ({
      ...prev,
      hotels: prev.hotels.map((hotel) =>
        hotel.id === hotelId ? { ...hotel, ...patch } : hotel
      )
    }));
  };

  const removeHotel = (hotelId) => {
    setTrip((prev) => ({
      ...prev,
      hotels: prev.hotels.filter((hotel) => hotel.id !== hotelId)
    }));
  };

  const addBooking = (payload) => {
    const booking = createBooking(payload);
    setTrip((prev) => ({
      ...prev,
      bookings: [...prev.bookings, booking]
    }));
  };

  const updateBooking = (bookingId, patch) => {
    setTrip((prev) => ({
      ...prev,
      bookings: prev.bookings.map((booking) =>
        booking.id === bookingId ? { ...booking, ...patch } : booking
      )
    }));
  };

  const removeBooking = (bookingId) => {
    setTrip((prev) => ({
      ...prev,
      bookings: prev.bookings.filter((booking) => booking.id !== bookingId)
    }));
  };

  const addFlight = (payload) => {
    const flight = createFlight(payload);
    setTrip((prev) => ({
      ...prev,
      flights: [...prev.flights, flight]
    }));
  };

  const updateFlight = (flightId, patch) => {
    setTrip((prev) => ({
      ...prev,
      flights: prev.flights.map((flight) =>
        flight.id === flightId ? { ...flight, ...patch } : flight
      )
    }));
  };

  const removeFlight = (flightId) => {
    setTrip((prev) => ({
      ...prev,
      flights: prev.flights.filter((flight) => flight.id !== flightId)
    }));
  };

  const addCost = (payload) => {
    const cost = createCost(payload);
    setTrip((prev) => ({
      ...prev,
      costs: [...prev.costs, cost]
    }));
  };

  const updateCost = (costId, patch) => {
    setTrip((prev) => ({
      ...prev,
      costs: prev.costs.map((cost) =>
        cost.id === costId ? { ...cost, ...patch } : cost
      )
    }));
  };

  const removeCost = (costId) => {
    setTrip((prev) => ({
      ...prev,
      costs: prev.costs.filter((cost) => cost.id !== costId)
    }));
  };

  const addMapRoute = (payload) => {
    const route = createMapRoute(payload);
    setTrip((prev) => ({
      ...prev,
      maps: [...prev.maps, route]
    }));
  };

  const updateMapRoute = (routeId, patch) => {
    setTrip((prev) => ({
      ...prev,
      maps: prev.maps.map((route) =>
        route.id === routeId ? { ...route, ...patch } : route
      )
    }));
  };

  const removeMapRoute = (routeId) => {
    setTrip((prev) => ({
      ...prev,
      maps: prev.maps.filter((route) => route.id !== routeId)
    }));
  };

  const addTravelDoc = (payload) => {
    const travelDoc = {
      id: uid('doc'),
      title: payload.title || '',
      type: payload.type || 'text',
      text: payload.text || '',
      fileName: payload.fileName || '',
      fileType: payload.fileType || '',
      fileSize: payload.fileSize || 0,
      fileDataUrl: payload.fileDataUrl || '',
      createdAt: new Date().toISOString()
    };

    setTrip((prev) => ({
      ...prev,
      travelDocs: [...prev.travelDocs, travelDoc]
    }));
  };

  const updateTravelDoc = (docId, patch) => {
    setTrip((prev) => ({
      ...prev,
      travelDocs: prev.travelDocs.map((doc) =>
        doc.id === docId ? { ...doc, ...patch } : doc
      )
    }));
  };

  const removeTravelDoc = (docId) => {
    setTrip((prev) => ({
      ...prev,
      travelDocs: prev.travelDocs.filter((doc) => doc.id !== docId)
    }));
  };

  const value = useMemo(
    () => ({
      trip,
      mode,
      setMode,
      adminLock,
      isAdminAuthenticated,
      startAdminSession,
      endAdminSession,
      switchToUserView,
      switchToAdminView,
      enableAdminLock,
      disableAdminLock,
      activeTab,
      setActiveTab,
      selectedDayId,
      setSelectedDayId,
      selectedDay,
      updateMeta,
      replaceTrip,
      resetTrip,
      addDay,
      updateDay,
      removeDay,
      duplicateDay,
      addTimelineItem,
      updateTimelineItem,
      removeTimelineItem,
      addCity,
      updateCity,
      removeCity,
      addHotel,
      updateHotel,
      removeHotel,
      addBooking,
      updateBooking,
      removeBooking,
      addFlight,
      updateFlight,
      removeFlight,
      addCost,
      updateCost,
      removeCost,
      addMapRoute,
      updateMapRoute,
      removeMapRoute,
      addTravelDoc,
      updateTravelDoc,
      removeTravelDoc
    }),
    [trip, mode, adminLock, isAdminAuthenticated, activeTab, selectedDayId, selectedDay]
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrip() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used inside TripProvider');
  }
  return context;
}