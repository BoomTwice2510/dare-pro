import { useState, useEffect } from 'react';

export interface DareEvent {
  id: string;
  type: 'dare_created' | 'dare_accepted' | 'proof_submitted' | 'dare_resolved' | 'dispute_raised';
  actor: string;
  dareId: number;
  amount?: number;
  timestamp: number;
  description: string;
}

const MOCK_EVENTS: Omit<DareEvent, 'id' | 'timestamp'>[] = [
  {
    type: 'dare_created',
    actor: '0x742d35Cc6634C0532925a3b844Bc0e704ed4bd52',
    dareId: 1,
    amount: 2.5,
    description: 'Created a new dare',
  },
  {
    type: 'dare_accepted',
    actor: '0x1234567890abcdef1234567890abcdef12345678',
    dareId: 1,
    description: 'Accepted the dare',
  },
  {
    type: 'proof_submitted',
    actor: '0x742d35Cc6634C0532925a3b844Bc0e704ed4bd52',
    dareId: 1,
    description: 'Submitted proof',
  },
  {
    type: 'dare_created',
    actor: '0xabcdef1234567890abcdef1234567890abcdef12',
    dareId: 2,
    amount: 5.0,
    description: 'Created a new dare',
  },
  {
    type: 'dare_accepted',
    actor: '0x9876543210fedcba9876543210fedcba98765432',
    dareId: 2,
    description: 'Accepted the dare',
  },
  {
    type: 'dare_resolved',
    actor: '0x742d35Cc6634C0532925a3b844Bc0e704ed4bd52',
    dareId: 1,
    description: 'Dare resolved - Winner determined',
  },
  {
    type: 'dare_created',
    actor: '0xfedcba9876543210fedcba9876543210fedcba98',
    dareId: 3,
    amount: 1.2,
    description: 'Created a new dare',
  },
  {
    type: 'dispute_raised',
    actor: '0x9876543210fedcba9876543210fedcba98765432',
    dareId: 2,
    description: 'Dispute raised for resolution',
  },
];

function generateRandomEvent(): Omit<DareEvent, 'id' | 'timestamp'> {
  const randomMock = MOCK_EVENTS[Math.floor(Math.random() * MOCK_EVENTS.length)];
  return {
    ...randomMock,
    dareId: Math.floor(Math.random() * 100) + 1,
  };
}

function generateEventId(): string {
  return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function useLiveDareEvents(autoRefreshInterval: number = 3000) {
  const [events, setEvents] = useState<DareEvent[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize with some mock events
    if (!isInitialized) {
      const initialEvents: DareEvent[] = MOCK_EVENTS.slice(0, 5).map((mockEvent, index) => ({
        ...mockEvent,
        id: generateEventId(),
        timestamp: Date.now() - (5 - index) * 60000, // Stagger timestamps
      }));
      setEvents(initialEvents);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;

    // Simulate WebSocket-like updates
    const interval = setInterval(() => {
      const newEvent: DareEvent = {
        ...generateRandomEvent(),
        id: generateEventId(),
        timestamp: Date.now(),
      };

      setEvents(prevEvents => {
        // Keep only the latest 20 events
        const updated = [newEvent, ...prevEvents];
        return updated.slice(0, 20);
      });
    }, autoRefreshInterval);

    return () => clearInterval(interval);
  }, [isInitialized, autoRefreshInterval]);

  return events;
}
