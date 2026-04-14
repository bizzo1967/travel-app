export const STORAGE_KEY = 'travel-planner-trip-v1';

export function loadTripFromStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('Errore caricamento localStorage', error);
    return null;
  }
}

export function saveTripToStorage(trip) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trip));
  } catch (error) {
    console.error('Errore salvataggio localStorage', error);
  }
}