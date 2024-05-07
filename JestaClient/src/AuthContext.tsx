import React, { createContext, useContext, useState } from 'react';
import { UserInterface } from '../constants/Interfaces';
import Database from './Database';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
    isAuthenticated: boolean
    loggedUser: UserInterface | null
    login: (userData: UserInterface) => void
    logout: () => void
}

interface ChildProps {
    children: any
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<ChildProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [loggedUser, setLoggedUser] = useState<UserInterface | null>(null)

    const login = (user: UserInterface) => {
        setLoggedUser(user)
        setIsAuthenticated(true)
        try {
            AsyncStorage.setItem('user_email', user.email)
            AsyncStorage.setItem('user_password', user.password)
        } catch (error) {
            console.error(`AsyncStorage Error: ${error}`)
        }
    }

    const logout = async () => {
        await Database.signOut(loggedUser!.email)
        setLoggedUser(null)
        setIsAuthenticated(false)
        await AsyncStorage.clear()
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, loggedUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('AuthContext: Context error')
    }
    return context
}