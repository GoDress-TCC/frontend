import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Category } from '@/src/services/types/types';
import Api from '@/src/services/api';

interface CatsContextProps {
    cats: Category[];
    getCats: () => void;
}

const CatsContext = createContext<CatsContextProps | undefined>(undefined);

export function CatsProvider({ children }: { children: ReactNode }) {
    const [cats, setCats] = useState<Category[]>([]);

    const getCats = async () => {
        await Api.get('/cat')
            .then(response => {
                setCats(response.data);
                console.log(cats)
            })
            .catch(error => {
                console.log(error.response.data);
            })
    };

    useEffect(() => {
        getCats();
    }, []);

    return (
        <CatsContext.Provider value={{ cats, getCats }}>
            {children}
        </CatsContext.Provider>
    );
}

export function useCats() {
    const context = useContext(CatsContext);
    if (context === undefined) {
        throw new Error('useCats tem que ser usado com um CatsProvider');
    }
    return context;
}
