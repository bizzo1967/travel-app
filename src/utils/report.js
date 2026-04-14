export function getTripTotals(trip) {
  const hotelTotal = trip.hotels.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const bookingTotal = trip.bookings.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const flightTotal = trip.flights.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const costTotal = trip.costs.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return {
    hotelTotal,
    bookingTotal,
    flightTotal,
    costTotal,
    estimatedTotal: Math.max(costTotal, hotelTotal + flightTotal)
  };
}

export function getReportSections(trip) {
  return {
    days: trip.days,
    hotels: trip.hotels,
    bookings: trip.bookings,
    flights: trip.flights,
    costs: trip.costs,
    maps: trip.maps
  };
}