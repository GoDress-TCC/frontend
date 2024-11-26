import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Api from '@/src/services/api';
import { Event } from '../types/types';

interface EventsContextProps {
    events: Event[];
    getEvents: () => void;
}

const EventsContext = createContext<EventsContextProps | undefined>(undefined);

export function EventsProvider({ children }: { children: ReactNode }) {
    const [events, setEvents] = useState<Event[]>([]);

    const getEvents = async () => {
        await Api.get('/event')
            .then(response => {
                setEvents(response.data);
                console.log(events);  
            })
            .catch(error => {
                console.log(error.response.data);
            });
    };

    useEffect(() => {
        getEvents();
    }, []);

    return (
        <EventsContext.Provider value={{ events, getEvents }}>
            {children}
        </EventsContext.Provider>
    );
}

export function useEvents() {
    const context = useContext(EventsContext);
    if (context === undefined) {
        throw new Error('useEvents tem que ser usado com um EventsProvider');
    }
    return context;
}
