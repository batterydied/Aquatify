import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { getUserData } from '@/lib/apiCalls';
import { User } from '@/lib/interface';

interface UserContextType {
    userData: User | null;
    setUserData: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isLoaded } = useUser();
    const [userData, setUserData] = useState<User | null>(null);

    useEffect(() => {
        if (!isLoaded || !user) return;

        const fetchData = async () => {
            try {
                const data = await getUserData(user.emailAddresses[0].emailAddress);
                setUserData(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, [isLoaded, user]);

    return (
        <UserContext.Provider value={{ userData, setUserData }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserData = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserData must be used within a UserProvider');
    }
    return context;
};
