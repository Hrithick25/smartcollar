export const behaviorData = {
  current: {
    status: 'Anxious',
    confidence: 0.84,
    timestamp: '2025-09-20T11:30:00Z',
    heartRate: 145,
    analysis:
      'Elevated stress patterns detected. Heart rate 32% above baseline. Movement suggests restlessness. Recommend monitoring environmental triggers. Ultrasonic calming protocol activated 3 times.',
  },
  history: [
    { date: '2025-09-20', dominant: 'Calm', incidents: 2 },
    { date: '2025-09-19', dominant: 'Playful', incidents: 0 },
    { date: '2025-09-18', dominant: 'Neutral', incidents: 1 },
  ],
};

export const medicalRecords = {
  vaccinations: [
    { vaccine: 'Rabies', date: '2025-06-15', nextDue: '2026-06-15', provider: 'City Animal Hospital' },
    { vaccine: 'DHPP', date: '2025-08-10', nextDue: '2025-11-10', provider: 'Street Dog NGO' },
  ],
  medications: [
    { name: 'Ivermectin', dose: '6 mg', schedule: 'Monthly', next: '2025-10-01' },
    { name: 'Omega-3', dose: '500 mg', schedule: 'Daily', next: '2025-09-21' },
  ],
};
