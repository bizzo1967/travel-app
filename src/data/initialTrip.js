export const initialTrip = {
  meta: {
    id: 'andalusia-2026',
    name: 'Andalusia 2026',
    subtitle: 'Road trip tra Malaga e Granada',
    startDate: '2026-05-06',
    endDate: '2026-05-10',
    currency: 'EUR',
    travelers: '2 adulti',
    notes: 'Un viaggio pensato per essere semplice da consultare, con tappe, hotel, prenotazioni e mappe raccolti in un unico posto.',
    coverImage:
      'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?auto=format&fit=crop&w=1400&q=80'
  },
  cities: [
    {
      id: 'city-malaga',
      name: 'Malaga',
      country: 'Spagna',
      notes:
        'Città di arrivo. Centro storico compatto, ottima base per la prima sera.'
    },
    {
      id: 'city-granada',
      name: 'Granada',
      country: 'Spagna',
      notes:
        'Tappa centrale del viaggio. Alhambra e camminate panoramiche.'
    }
  ],
  days: [
    {
      id: 'day-1',
      label: 'Giorno 0',
      date: '2026-05-06',
      title: 'Arrivo a Malaga',
      cityId: 'city-malaga',
      timeline: [
        {
          id: 'event-1',
          time: '20:30',
          type: 'flight',
          title: 'Arrivo a Malaga',
          description: 'Atterraggio e ritiro bagagli.'
        },
        {
          id: 'event-2',
          time: '21:00',
          type: 'car',
          title: 'Ritiro Auto',
          description: 'Presso All In Car Hire Malaga.'
        },
        {
          id: 'event-3',
          time: '21:30',
          type: 'hotel',
          title: 'Check-in Hotel',
          description: 'Holiday Inn Express Malaga Aeroporto.'
        }
      ]
    },
    {
      id: 'day-2',
      label: 'Giorno 1',
      date: '2026-05-07',
      title: 'Trasferimento a Granada',
      cityId: 'city-granada',
      timeline: [
        {
          id: 'event-4',
          time: '09:00',
          type: 'drive',
          title: 'Partenza per Granada',
          description: 'Check-out e partenza in auto.'
        },
        {
          id: 'event-5',
          time: '12:30',
          type: 'hotel',
          title: 'Check-in Hotel Casa Palacete Tablas',
          description: 'Sistemazione in centro.'
        },
        {
          id: 'event-6',
          time: '18:00',
          type: 'walk',
          title: 'Passeggiata serale',
          description: 'Centro storico e cena.'
        }
      ]
    }
  ],
  hotels: [
    {
      id: 'hotel-1',
      name: 'Holiday Inn Express Malaga Aeroporto',
      cityId: 'city-malaga',
      address: 'Avenida de Velazquez 294, Malaga',
      checkInDate: '2026-05-06',
      checkOutDate: '2026-05-07',
      checkInTime: '14:00',
      checkOutTime: '12:00',
      breakfastIncluded: true,
      price: 102,
      status: 'confirmed',
      image:
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80',
      notes: 'Ideale per la prima notte vicino all’aeroporto.'
    },
    {
      id: 'hotel-2',
      name: 'Hotel Casa Palacete Tablas',
      cityId: 'city-granada',
      address: 'C. Tablas 7, Centro, Granada',
      checkInDate: '2026-05-07',
      checkOutDate: '2026-05-09',
      checkInTime: '15:00',
      checkOutTime: '11:00',
      breakfastIncluded: false,
      price: 198,
      status: 'confirmed',
      image:
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
      notes: 'Palazzo storico nel centro di Granada.'
    }
  ],
  bookings: [
    {
      id: 'booking-1',
      type: 'hotel',
      title: 'Holiday Inn Express Malaga - Aeroporto',
      code: '49999649',
      date: '2026-05-06',
      location: 'Avenida de Velazquez 294, Malaga',
      amount: 102,
      notes:
        'Check-in 14:00 / Check-out 12:00. Colazione inclusa.'
    },
    {
      id: 'booking-2',
      type: 'car',
      title: 'All In Car Hire Malaga',
      code: '189981',
      date: '2026-05-06',
      location: 'Aeroporto di Malaga',
      amount: 135,
      notes: 'Ritiro auto alle 21:00. Assicurazione inclusa.'
    },
    {
      id: 'booking-3',
      type: 'hotel',
      title: 'Casa Palacete Tablas',
      code: 'A582D83D0',
      date: '2026-05-07',
      location: 'C. Tablas 7, Granada',
      amount: 198,
      notes: 'Prenotazione per 2 notti.'
    }
  ],
  flights: [
    {
      id: 'flight-1',
      from: 'Milano',
      to: 'Malaga',
      date: '2026-05-06',
      departure: '17:50',
      arrival: '20:30',
      airline: 'Ryanair',
      flightNumber: 'FR 4512',
      price: 120,
      notes: 'Bagaglio a mano incluso.'
    }
  ],
  costs: [
    {
      id: 'cost-1',
      title: 'Hotel Malaga',
      category: 'hotel',
      amount: 102,
      date: '2026-05-06',
      notes: ''
    },
    {
      id: 'cost-2',
      title: 'Noleggio auto',
      category: 'transport',
      amount: 135,
      date: '2026-05-06',
      notes: ''
    },
    {
      id: 'cost-3',
      title: 'Hotel Granada',
      category: 'hotel',
      amount: 198,
      date: '2026-05-07',
      notes: ''
    },
    {
      id: 'cost-4',
      title: 'Volo andata',
      category: 'flight',
      amount: 120,
      date: '2026-05-06',
      notes: ''
    }
  ],
  maps: [
    {
      id: 'map-1',
      dayId: 'day-1',
      title: 'Aeroporto Malaga → Hotel',
      mode: 'auto',
      from: 'Aeroporto Malaga',
      to: 'Holiday Inn Express Malaga Aeroporto',
      distance: '5 km',
      duration: '10 min',
      url: 'https://www.google.com/maps',
      stops: ['Aeroporto Malaga', 'Hotel']
    },
    {
      id: 'map-2',
      dayId: 'day-2',
      title: 'Salita al Punto di Incontro Alhambra',
      mode: 'walk',
      from: 'Hotel Casa Palacete Tablas',
      to: 'Biglietteria / Meeting Point',
      distance: '2,1 km',
      duration: '28 min',
      url: 'https://www.google.com/maps',
      stops: [
        'Hotel Casa Palacete Tablas',
        'Plaza Nueva',
        'Puerta de las Granadas',
        'Puerta de la Justicia',
        'Biglietteria'
      ]
    }
  ]
};