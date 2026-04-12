import { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    // Try to fetch current user profile using generic request if implemented
                    // Otherwise we just assume active and set token directly in apiClient
                    apiClient.setToken(token);
                    setIsLoggedIn(true);
                    setUser({ token }); // Real app: fetch user details
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
        setUser({ token: access_token });
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
