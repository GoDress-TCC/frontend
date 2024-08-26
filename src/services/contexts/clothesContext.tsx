import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Clothing } from '@/src/services/types/types';
import Api from '@/src/services/api';

interface ClothesContextProps {
    clothes: Clothing[];
    getClothes: () => void;
}

const ClothesContext = createContext<ClothesContextProps | undefined>(undefined);

export function ClothesProvider({ children }: { children: ReactNode }) {
    const [clothes, setClothes] = useState<Clothing[]>([]);

    const getClothes = async () => {
        await Api.get('/clothing')
            .then(response => {
                setClothes(response.data);
                console.log(clothes)
            })
            .catch(error => {
                console.log(error.response.data);
            })
    };

    useEffect(() => {
        getClothes();
    }, []);

    return (
        <ClothesContext.Provider value={{ clothes, getClothes }}>
            {children}
        </ClothesContext.Provider>
    );
}

export function useClothes() {
    const context = useContext(ClothesContext);
    if (context === undefined) {
        throw new Error('useClothes tem que ser usado com um ClothesProvider');
    }
    return context;
}
