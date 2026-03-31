import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ShieldAlert, TrendingUp, Users, MapPin, Building, Activity } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function NgoDashboard() {
    const { loading, adminAlerts, updateAdminAlertStatus } = useAppContext();
    const [lastSaved, setLastSaved] = useState(null);
    
    // Filtering State
    const [filters, setFilters] = useState({
        area: 'All',
        org: 'All',
        age: 'All'
    });

    const handleStatusChange = (id, newStatus) => {
        updateAdminAlertStatus(id, newStatus);
        setLastSaved(new Date().toLocaleTimeString());
    };

    const filteredAlerts = useMemo(() => {
        return adminAlerts.filter(alert => {
            const matchArea = filters.area === 'All' || alert.area === filters.area;
            const matchOrg = filters.org === 'All' || alert.org === filters.org;
            const matchAge = filters.age === 'All' || alert.age === filters.age;
            return matchArea && matchOrg && matchAge;
        });
    }, [adminAlerts, filters]);

    const chartData = useMemo(() => {
        const severityMap = { High: 0, Medium: 0, Low: 0 };
        filteredAlerts.forEach(a => severityMap[a.intensity]++);
        const severityData = Object.keys(severityMap).map(k => ({ name: k, value: severityMap[k] }));

        const ageMap = { '13-15': { sum: 0, count: 0 }, '16-18': { sum: 0, count: 0 } };
        filteredAlerts.forEach(a => {
            if(ageMap[a.age]) {
                ageMap[a.age].sum += a.mood;
                ageMap[a.age].count++;
            }
        });
        const ageData = Object.keys(ageMap).map(k => ({ 
            name: k, 
            avgMood: ageMap[k].count > 0 ? (ageMap[k].sum / ageMap[k].count).toFixed(1) : 0 
        }));

        const dates = [...new Set(adminAlerts.map(a => a.date))].sort();
        const trendData = dates.map(d => {
            const entry = { date: d };
            ['North', 'South', 'East', 'West', 'Central'].forEach(area => {
                entry[area] = filteredAlerts.filter(a => a.date === d && a.area === area).length;
            });
            return entry;
        });

        return { severityData, ageData, trendData };
    }, [filteredAlerts, adminAlerts]);

    const kpiStats = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        const mockBaseUsers = 450; 
        const uniqueAlertUsers = new Set(adminAlerts.map(a => a.id)).size;
        
        const activeToday = adminAlerts.filter(a => a.date === today).length + 24; 
        const highRisk = filteredAlerts.filter(a => a.intensity === 'High').length;
        const mediumRisk = filteredAlerts.filter(a => a.intensity === 'Medium').length;
        
        return {
            totalUsers: mockBaseUsers + uniqueAlertUsers,
            activeToday,
            highRisk,
            mediumRisk,
            totalAlerts: adminAlerts.length
        };
    }, [filteredAlerts, adminAlerts]);

    const COLORS = {
        High: '#ef4444',
        Medium: '#f59e0b',
        Low: '#10b981',
        North: '#8b5cf6',
        South: '#10b981',
        East: '#f59e0b',
        West: '#f97316',
        Central: '#3b82f6'
    };

    if (loading) return <div className="p-8 text-white font-semibold flex items-center justify-center h-full"><div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin"/></div>;

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background-primary p-3 border border-white/20 rounded-lg shadow-xl text-xs">
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }} className="font-bold">
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="flex flex-col gap-8 pb-12 px-6 pt-6 light-theme min-h-screen">
            <div className="flex flex-row justify-between items-end mb-2 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        NGO Oversight Portal <span className="text-2xl">🌐</span>
                    </h1>
                    <p className="text-white/40 font-semibold uppercase text-xs tracking-widest mt-2">Advanced Mental Health Surveillance System</p>
                </div>
                {lastSaved && <span className="text-[10px] uppercase font-bold text-white/50 bg-white/5 px-4 py-2 rounded-full border border-white/10 hidden md:block">System Sync: {lastSaved}</span>}
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white/5 p-5 rounded-2xl border border-white/10 flex flex-col justify-between hover:bg-white/10 transition-colors">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Total Users</span>
                    <span className="text-3xl font-bold mt-2 text-white">{kpiStats.totalUsers}</span>
                </div>
                <div className="bg-white/5 p-5 rounded-2xl border border-white/10 flex flex-col justify-between hover:bg-white/10 transition-colors">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Active Today</span>
                    <span className="text-3xl font-bold mt-2 text-blue-400">{kpiStats.activeToday}</span>
                </div>
                <div className="bg-yellow-500/10 p-5 rounded-2xl border border-yellow-500/20 flex flex-col justify-between transition-colors">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-500/80">Medium Risk</span>
                    <span className="text-3xl font-bold mt-2 text-yellow-500">{kpiStats.mediumRisk}</span>
                </div>
                <div className="bg-red-500/10 p-5 rounded-2xl border border-red-500/20 flex flex-col justify-between transition-colors">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-red-500/80">High Risk</span>
                    <span className="text-3xl font-bold mt-2 text-red-500">{kpiStats.highRisk}</span>
                </div>
                <div className="bg-accent/10 p-5 rounded-2xl border border-accent/20 flex flex-col justify-between transition-colors">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-accent/80">Alerts Triggered</span>
                    <span className="text-3xl font-bold mt-2 text-accent">{kpiStats.totalAlerts}</span>
                </div>
            </div>

            {/* Filter Toolbar */}
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-wrap gap-6 items-center">
                <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-white/40" />
                    <span className="text-[10px] font-bold uppercase text-white/60">Area</span>
                    <select 
                        className="bg-transparent border border-white/20 rounded px-2 py-1 text-xs text-white [&>option]:bg-background-primary focus:outline-none focus:border-accent cursor-pointer"
                        value={filters.area}
                        onChange={(e) => setFilters({...filters, area: e.target.value})}
                    >
                        <option value="All">All</option>
                        <option value="North">North</option>
                        <option value="South">South</option>
                        <option value="East">East</option>
                        <option value="West">West</option>
                        <option value="Central">Central</option>
                    </select>
                </div>
                <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                    <Building size={16} className="text-white/40" />
                    <span className="text-[10px] font-bold uppercase text-white/60">Org</span>
                    <select 
                        className="bg-transparent border border-white/20 rounded px-2 py-1 text-xs text-white [&>option]:bg-background-primary focus:outline-none focus:border-accent cursor-pointer"
                        value={filters.org}
                        onChange={(e) => setFilters({...filters, org: e.target.value})}
                    >
                        <option value="All">All</option>
                        <option value="Oakwood High">Oakwood High</option>
                        <option value="West Side MS">West Side MS</option>
                        <option value="City Academy">City Academy</option>
                        <option value="Skyline Prep">Skyline Prep</option>
                        <option value="Green Valley">Green Valley</option>
                    </select>
                </div>
                <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                    <Users size={16} className="text-white/40" />
                    <span className="text-[10px] font-bold uppercase text-white/60">Age</span>
                    <select 
                        className="bg-transparent border border-white/20 rounded px-2 py-1 text-xs text-white [&>option]:bg-background-primary focus:outline-none focus:border-accent cursor-pointer"
                        value={filters.age}
                        onChange={(e) => setFilters({...filters, age: e.target.value})}
                    >
                        <option value="All">All</option>
                        <option value="13-15">13-15</option>
                        <option value="16-18">16-18</option>
                    </select>
                </div>
                <button 
                    onClick={() => setFilters({ area: 'All', org: 'All', age: 'All' })}
                    className="ml-auto text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                    Clear Filters
                </button>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* 1. Severity Distribution (Pie) */}
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col h-[350px]">
                    <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50 mb-6">
                        <ShieldAlert size={16} className="text-red-400" /> Severity Index
                    </h3>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie 
                                    data={chartData.severityData} 
                                    innerRadius={50} 
                                    outerRadius={80} 
                                    paddingAngle={5} 
                                    dataKey="value"
                                    stroke="transparent"
                                >
                                    {chartData.severityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px', color: '#fff' }}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Mood by Age (Bar) */}
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col h-[350px]">
                    <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50 mb-6">
                        <Activity size={16} className="text-green-400" /> Average Mood by Demographic
                    </h3>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData.ageData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }}/>
                                <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} />
                                <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                                <Bar dataKey="avgMood" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. Trend by Area (Line) */}
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col h-[350px] xl:col-span-1 lg:col-span-2">
                    <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50 mb-6">
                        <TrendingUp size={16} className="text-blue-400" /> Regional Escalation
                    </h3>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData.trendData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} 
                                    tickFormatter={(val) => new Date(val).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ fontSize: '10px' }} />
                                {['North', 'South', 'East', 'West', 'Central'].map(area => (
                                    <Line 
                                        key={area} 
                                        type="monotone" 
                                        dataKey={area} 
                                        stroke={COLORS[area]} 
                                        strokeWidth={2} 
                                        dot={{ r: 3, strokeWidth: 0 }}
                                        activeDot={{ r: 5 }}
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Escalation Table */}
            <div className="bg-white/5 rounded-2xl border border-white/10 mt-2 overflow-hidden">
                <div className="flex flex-row justify-between items-center p-6 border-b border-white/10 bg-black/20">
                    <h2 className="flex items-center gap-3 m-0 text-sm font-bold text-white uppercase tracking-widest">
                        <ShieldAlert size={20} className="text-accent" /> Active Case Management
                    </h2>
                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                        <span className="text-[10px] font-bold uppercase opacity-60 text-white">Matches:</span>
                        <span className="text-[10px] font-bold text-white">{filteredAlerts.length}</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/10 border-b border-white/10 text-white/40">
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest">Ref</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest">Context</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest">Trigger Issue</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-center">Intensity</th>
                                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-right pr-6">Status Control</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredAlerts.map((alert) => (
                                <tr key={alert.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-4 font-mono text-xs text-white/70">{alert.id.toUpperCase()}</td>
                                    <td className="p-4">
                                        <div className="text-sm text-white font-medium">{alert.org}</div>
                                        <div className="text-[10px] text-white/40 font-semibold uppercase tracking-wider">{alert.area} • {alert.age}</div>
                                    </td>
                                    <td className="p-4 text-sm text-white/80 font-medium">{alert.issue}</td>
                                    <td className="p-4 text-center">
                                        <span 
                                            className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider" 
                                            style={{ backgroundColor: `${COLORS[alert.intensity]}20`, color: COLORS[alert.intensity], border: `1px solid ${COLORS[alert.intensity]}40` }}
                                        >
                                            {alert.intensity}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right pr-6">
                                        <select 
                                            value={alert.status} 
                                            onChange={(e) => handleStatusChange(alert.id, e.target.value)}
                                            className={`bg-transparent rounded px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider cursor-pointer outline-none focus:ring-1 transition-all ${
                                                alert.status === 'Open' ? 'text-red-400 border border-red-400/30 hover:bg-red-500/10 focus:ring-red-500/50' : 
                                                alert.status === 'In Progress' ? 'text-yellow-400 border border-yellow-400/30 hover:bg-yellow-500/10 focus:ring-yellow-500/50' : 
                                                'text-green-400 border border-green-400/30 hover:bg-green-500/10 focus:ring-green-500/50'
                                            } [&>option]:bg-background-primary [&>option]:text-white`}
                                        >
                                            <option value="Open">Assess</option>
                                            <option value="In Progress">Treat</option>
                                            <option value="Resolved">Closed</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                            {filteredAlerts.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-white/40 text-sm">No cases match the current filters.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
