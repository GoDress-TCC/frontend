import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Api from '@/src/services/api';
import { Outfit } from '../types/types';

interface OutfitsContextProps {
    outfits: Outfit[];
    getOutfits: () => void;
}

const OutfitsContext = createContext<OutfitsContextProps | undefined>(undefined);

export function OutfitsProvider({ children }: { children: ReactNode }) {
    const [outfits, setOutfits] = useState<Outfit[]>([]);

    const getOutfits = async () => {
        await Api.get('/outfit')
            .then(response => {
                setOutfits(response.data);
                console.log(outfits);  
            })
            .catch(error => {
                console.log(error.response.data);
            });
    };

    useEffect(() => {
        getOutfits();
    }, []);

    return (
        <OutfitsContext.Provider value={{ outfits, getOutfits }}>
            {children}
        </OutfitsContext.Provider>
    );
}

export function useOutfits() {
    const context = useContext(OutfitsContext);
    if (context === undefined) {
        throw new Error('useOutfits tem que ser usado com um OutfitsProvider');
    }
    return context;
}
