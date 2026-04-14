import { initialTrip } from './initialTrip.js';

export function uid(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}-${Date.now().toString(36)}`;
}

export function createDay(payload = {}) {
  return {
    id: uid('day'),
    label: payload.label || 'Nuovo Giorno',
    date: payload.date || '',
    title: payload.title || 'Nuova tappa',
    cityId: payload.cityId || '',
    timeline: Array.isArray(payload.timeline) ? payload.timeline : []
  };
}

export function createTimelineItem(payload = {}) {
  const startTime = payload.startTime || payload.time || '09:00';

  return {
    id: uid('event'),
    startTime,
    endTime: payload.endTime || '',
    type: payload.type || 'activity',
    title: payload.title || 'Nuovo evento',
    description: payload.description || '',
    details: payload.details || ''
  };
}

export function createCity(payload = {}) {
  return {
    id: uid('city'),
    name: payload.name || '',
    country: payload.country || '',
    notes: payload.notes || ''
  };
}

export function createHotel(payload = {}) {
  return {
    id: uid('hotel'),
    name: payload.name || '',
    cityId: payload.cityId || '',
    address: payload.address || '',
    checkInDate: payload.checkInDate || '',
    checkOutDate: payload.checkOutDate || '',
    checkInTime: payload.checkInTime || '',
    checkOutTime: payload.checkOutTime || '',
    breakfastIncluded: Boolean(payload.breakfastIncluded),
    price: Number(payload.price || 0),
    status: payload.status || 'planned',
    image: payload.image || '',
    notes: payload.notes || ''
  };
}

export function createBooking(payload = {}) {
  return {
    id: uid('booking'),
    type: payload.type || 'booking',
    title: payload.title || '',
    code: payload.code || '',
    date: payload.date || '',
    location: payload.location || '',
    amount: Number(payload.amount || 0),
    notes: payload.notes || ''
  };
}

export function createFlight(payload = {}) {
  return {
    id: uid('flight'),
    from: payload.from || '',
    to: payload.to || '',
    date: payload.date || '',
    departure: payload.departure || '',
    arrival: payload.arrival || '',
    airline: payload.airline || '',
    flightNumber: payload.flightNumber || '',
    price: Number(payload.price || 0),
    notes: payload.notes || ''
  };
}

export function createCost(payload = {}) {
  return {
    id: uid('cost'),
    title: payload.title || '',
    category: payload.category || 'other',
    amount: Number(payload.amount || 0),
    date: payload.date || '',
    notes: payload.notes || ''
  };
}

export function createMapRoute(payload = {}) {
  return {
    id: uid('map'),
    dayId: payload.dayId || '',
    title: payload.title || '',
    mode: payload.mode || 'auto',
    from: payload.from || '',
    to: payload.to || '',
    distance: payload.distance || '',
    duration: payload.duration || '',
    url: payload.url || '',
    stops: Array.isArray(payload.stops) ? payload.stops : []
  };
}

function normalizeTimelineItem(item = {}) {
  return {
    id: item.id || uid('event'),
    startTime: item.startTime || item.time || '09:00',
    endTime: item.endTime || '',
    type: item.type || 'activity',
    title: item.title || '',
    description: item.description || '',
    details: item.details || ''
  };
}

export function normalizeTripData(data) {
  const trip = typeof data === 'object' && data ? data : {};

  return {
    meta: {
      id: trip.meta?.id || uid('trip'),
      name: trip.meta?.name || 'Nuovo Viaggio',
      subtitle: trip.meta?.subtitle || '',
      startDate: trip.meta?.startDate || '',
      endDate: trip.meta?.endDate || '',
      currency: trip.meta?.currency || 'EUR',
      travelers: trip.meta?.travelers || '',
      notes: trip.meta?.notes || '',
      coverImage: trip.meta?.coverImage || ''
    },
    cities: Array.isArray(trip.cities) ? trip.cities : [],
    days: Array.isArray(trip.days)
      ? trip.days.map((day) => ({
          ...day,
          timeline: Array.isArray(day.timeline)
            ? day.timeline.map(normalizeTimelineItem)
            : []
        }))
      : [],
    hotels: Array.isArray(trip.hotels) ? trip.hotels : [],
    bookings: Array.isArray(trip.bookings) ? trip.bookings : [],
    flights: Array.isArray(trip.flights) ? trip.flights : [],
    costs: Array.isArray(trip.costs) ? trip.costs : [],
    maps: Array.isArray(trip.maps) ? trip.maps : []
  };
}

export function createDefaultTrip() {
  return normalizeTripData(structuredClone(initialTrip));
}