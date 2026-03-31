import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

// Mock API Helpers
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const getStorage = (key, defaultVal) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultVal;
    } catch {
        return defaultVal;
    }
};
const setStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value));

// Default Data
const defaultMentorSlots = ["Monday 10:00 AM", "Wednesday 2:00 PM", "Friday 4:00 PM"];
const defaultAdminAlerts = [
    { id: 'usr-102', age: '16-18', org: 'Oakwood High', area: 'North', issue: 'Relationship', intensity: 'High', status: 'Open', date: new Date().toISOString().split('T')[0], mood: 2 },
    { id: 'usr-405', age: '13-15', org: 'West Side MS', area: 'South', issue: 'Parents', intensity: 'Medium', status: 'In Progress', date: new Date().toISOString().split('T')[0], mood: 3 },
    { id: 'usr-289', age: '16-18', org: 'Oakwood High', area: 'North', issue: 'Academics', intensity: 'High', status: 'In Progress', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], mood: 1 }
];
const defaultMentorSessions = [
    { id: 1, user: 'Alex', ageGroup: '16-18', time: 'Today, 2:00 PM', status: 'In Progress', link: 'https://meet.jit.si/neuralyn-session-alex', notes: '', isCompleted: false },
    { id: 2, user: 'Jamie', ageGroup: '13-15', time: 'Tomorrow, 10:00 AM', status: 'Scheduled', link: '', notes: '', isCompleted: false },
];

export const AppProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    
    // Global State
    const [userMoodData, setUserMoodData] = useState({});
    const [mentorSlots, setMentorSlots] = useState([]);
    const [mentorSessions, setMentorSessions] = useState([]);
    const [adminAlerts, setAdminAlerts] = useState([]);
    const [analytics, setAnalytics] = useState({ issueData: [], ageTrends: [] });

    // Load initial data
    const refreshData = async () => {
        setLoading(true);
        
        await delay(300); // Simulate network
        
        // 1. Moods
        let moods = getStorage('userMoodData', null);
        if (!moods) {
            moods = {};
            for (let i = 1; i < 15; i++) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                moods[date.toISOString().split('T')[0]] = Math.floor(Math.random() * 5) + 1;
            }
            setStorage('userMoodData', moods);
        }

        // 2. Others
        const slots = getStorage('mentorSlots', defaultMentorSlots);
        const sessions = getStorage('mentorSessions', defaultMentorSessions);
        const alerts = getStorage('adminAlerts', defaultAdminAlerts);

        // 3. Analytics (Derived from alerts)
        const issueCounts = {};
        const ageCounts = {};
        ['Parents', 'Peers', 'Relationship', 'Academics', 'Others'].forEach(cat => issueCounts[cat] = 10);
        ['13-15', '16-18'].forEach(age => ageCounts[age] = { alerts: 5, sessions: 20 });
        
        alerts.forEach(alert => {
            const issue = alert.issue;
            if(issueCounts[issue] !== undefined) issueCounts[issue] += 40;
            else issueCounts['Others'] += 40;
            const age = alert.age;
            if(ageCounts[age]) ageCounts[age].alerts += 15;
        });

        const analyticData = {
            issueData: Object.keys(issueCounts).map(k => ({ name: k, value: issueCounts[k] })),
            ageTrends: Object.keys(ageCounts).map(k => ({ name: k, alerts: ageCounts[k].alerts, sessions: ageCounts[k].sessions }))
        };

        setUserMoodData(moods);
        setMentorSlots(slots);
        setMentorSessions(sessions);
        setAdminAlerts(alerts);
        setAnalytics(analyticData);
        setLoading(false);
    };

    useEffect(() => {
        refreshData();
    }, []);

    // Actions
    const logMood = async (date, value) => {
        const newData = { ...userMoodData, [date]: value };
        setStorage('userMoodData', newData);
        setUserMoodData(newData);
    };

    const addMentorSlot = async (slot) => {
        const newSlots = [...mentorSlots, slot];
        setStorage('mentorSlots', newSlots);
        setMentorSlots(newSlots);
    };

    const removeMentorSlot = async (index) => {
        const newSlots = mentorSlots.filter((_, i) => i !== index);
        setStorage('mentorSlots', newSlots);
        setMentorSlots(newSlots);
    };

    const bookSlot = async (slot) => {
        const newSlots = mentorSlots.filter(s => s !== slot);
        setStorage('mentorSlots', newSlots);
        setMentorSlots(newSlots);
        // Could also add to mentorSessions here
    };

    const updateAdminAlertStatus = async (id, status) => {
        const newAlerts = adminAlerts.map(a => a.id === id ? { ...a, status } : a);
        setStorage('adminAlerts', newAlerts);
        setAdminAlerts(newAlerts);
        refreshData(); // Recalculate analytics
    };

    const triggerAdminAlert = async (alertData) => {
        const newAlert = {
            id: 'usr-' + Math.floor(Math.random() * 1000),
            age: '13-15',
            org: 'Demo Account',
            area: 'Unknown',
            issue: alertData.issue || 'Mental Health Alert',
            intensity: alertData.intensity || 'High',
            status: 'Open',
            date: new Date().toISOString().split('T')[0],
            mood: alertData.mood || 1
        };
        const newAlerts = [newAlert, ...adminAlerts];
        setStorage('adminAlerts', newAlerts);
        setAdminAlerts(newAlerts);
        refreshData();
    };

    const updateMentorSession = async (updatedSession) => {
        const newSessions = mentorSessions.map(s => s.id === updatedSession.id ? updatedSession : s);
        setStorage('mentorSessions', newSessions);
        setMentorSessions(newSessions);
    };

    const resetMockData = () => {
        localStorage.clear();
        window.location.reload();
    };

    return (
        <AppContext.Provider value={{
            loading,
            userMoodData, logMood,
            mentorSlots, addMentorSlot, removeMentorSlot, bookSlot,
            mentorSessions, updateMentorSession,
            adminAlerts, updateAdminAlertStatus, triggerAdminAlert,
            analytics,
            resetMockData
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
