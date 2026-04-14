import { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const decodeJwt = (token) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    };

    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    // Try to fetch current user profile using generic request if implemented
                    apiClient.setToken(token);
                    setIsLoggedIn(true);
                    const decoded = decodeJwt(token);
                    setUser({ token, id: decoded?.sub, is_admin: decoded?.is_admin || false }); // Store the subject (id) 
                } catch (error) {
                    logout();
                }
            }
            setIsLoading(false);
        };
        checkAuthStatus();
    }, []);

    const login = async (email, password) => {
        const response = await apiClient.login(email, password);
        const { access_token } = response;
        localStorage.setItem('access_token', access_token);
        apiClient.setToken(access_token);
        setIsLoggedIn(true);
        const decoded = decodeJwt(access_token);
        setUser({ token: access_token, id: decoded?.sub, is_admin: decoded?.is_admin || false });
    };

    const register = async (name, email, password) => {
        await apiClient.register(name, email, password);
        // Automatically login after registration
        await login(email, password);
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        apiClient.setToken(null);
        setIsLoggedIn(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
