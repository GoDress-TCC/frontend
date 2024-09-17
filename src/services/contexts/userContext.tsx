import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Api from '@/src/services/api';
import { User } from '../types/types';

interface UserContextProps {
    user?: User;
    getUser: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User>();

    const getUser = async () => {
        await Api.get('/user')
            .then(response => {
                setUser(response.data.user)
                console.log(user)
            })
            .catch(error => {
                console.log(error.response.data);
            });
    };

    useEffect(() => {
        getUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, getUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser tem que ser usado com um UserProvider');
    }
    return context;
}
