import React, { createContext, useContext, useState } from 'react';
import { userInteface } from '../constants/Interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserStatusDictionary } from '../constants/userStatusDictionary';
import Database from './Database';

interface AuthContextType {
    isAuthenticated: boolean;
    loggedUser: userInteface | null;
    login: (userData: userInteface) => void;
    logout: () => void;
}

interface ChildProps {
    children: any
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define your context provider
export const AuthProvider: React.FC<ChildProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loggedUser, setLoggedUser] = useState<userInteface | null>(null);

    const login = (user: userInteface) => {
        setLoggedUser(user)
        setIsAuthenticated(true);
        try {
            AsyncStorage.setItem('user_email', user.email)
            AsyncStorage.setItem('user_password', user.password)
        } catch (e) {
            console.log("AsyncStorage Error")
        }
    };

    const logout = async () => {
        Database.signOut(loggedUser!.email)
        setLoggedUser(null)
        setIsAuthenticated(false);
        await AsyncStorage.clear()
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, loggedUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};