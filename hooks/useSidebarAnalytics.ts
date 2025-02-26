'use client';

import { useState, useEffect } from 'react';

interface SidebarAnalytics {
    emailSent: number;
    emailLimit: number | string;
    contacts: number;
    contactLimit: number | string;
    campaigns: number;
    campaignLimit: number | string;
    isOnTrial?: boolean;
    trialDaysLeft?: number;
}

export const useSidebarAnalytics = () => {
    const [analytics, setAnalytics] = useState<SidebarAnalytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch('/api/user/sidebar-analytics', {
                    credentials: 'include',
                });
                if (!response.ok) {
                    if (response.status === 401) {
                        // Handle unauthorized - token might be expired
                        setAnalytics(null);
                        throw new Error('Your session has expired. Please log in again.');
                    }
                    throw new Error('Failed to fetch analytics');
                }

                const result = await response.json();

                if (result.status === 'success') {
                    setAnalytics(result.data);
                } else {
                    throw new Error(result.message || 'Failed to fetch analytics');
                }
            } catch (err) {
                console.error('Error fetching sidebar analytics:', err);
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    return { analytics, loading, error };
};