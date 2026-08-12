import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';
import paymentAPI from '../api/paymentAPI';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [subscription, setSubscription] = useState(null);

    // Initialize auth state on mount
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    // User is logged in, fetch profile
                    const response = await authService.getProfile();
                    if (response.success) {
                        setUser(response.user);
                        setIsAuthenticated(true);

                        // Fetch subscription info
                        try {
                            const subResponse = await paymentAPI.getSubscription();
                            if (subResponse.success) {
                                setSubscription(subResponse.subscription);
                            }
                        } catch (error) {
                            console.error('Failed to fetch subscription:', error);
                        }
                    } else {
                        localStorage.removeItem('token');
                        setIsAuthenticated(false);
                    }
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                localStorage.removeItem('token');
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (email, password) => {
        try {
            setLoading(true);
            const response = await authService.login(email, password);
            if (response.success) {
                localStorage.setItem('token', response.token);
                setUser(response.user);
                setIsAuthenticated(true);

                // Fetch subscription info after login
                try {
                    const subResponse = await paymentAPI.getSubscription();
                    if (subResponse.success) {
                        setSubscription(subResponse.subscription);
                    }
                } catch (error) {
                    console.error('Failed to fetch subscription:', error);
                }

                return response;
            }
            throw new Error(response.message || 'Login failed');
        } catch (error) {
            setIsAuthenticated(false);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (name, email, password, securityQuestion, securityAnswer) => {
        try {
            setLoading(true);
            const response = await authService.register(name, email, password, securityQuestion, securityAnswer);
            if (response.success) {
                localStorage.setItem('token', response.token);
                setUser(response.user);
                setIsAuthenticated(true);

                // New users start with FREE plan
                setSubscription({
                    plan: 'FREE',
                    status: 'active',
                    startDate: new Date(),
                    endDate: null,
                    quizzesCreated: 0,
                    paymentHistory: []
                });

                return response;
            }
            throw new Error(response.message || 'Registration failed');
        } catch (error) {
            setIsAuthenticated(false);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
        setSubscription(null);
    };

    const updateUserPlan = async (newPlan) => {
        if (user) {
            setUser({ ...user, plan: newPlan });
        }
        // Refresh subscription info
        try {
            const response = await paymentAPI.getSubscription();
            if (response.success) {
                setSubscription(response.subscription);
            }
        } catch (error) {
            console.error('Failed to refresh subscription:', error);
        }
    };

    const refreshSubscription = async () => {
        try {
            const response = await paymentAPI.getSubscription();
            if (response.success) {
                setSubscription(response.subscription);
            }
        } catch (error) {
            console.error('Failed to refresh subscription:', error);
        }
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        subscription,
        login,
        register,
        logout,
        updateUserPlan,
        refreshSubscription
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
