import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ShieldAlert, TrendingUp, Users, MapPin, Building, Activity, RotateCcw } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import GlassPanel from '../../components/ui/GlassPanel';

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
            if (ageMap[a.age]) {
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
        High: '#F87171',
        Medium: '#FBBF24',
        Low: '#4ADE80',
        North: '#A78B71',
        South: '#60A5FA',
        East: '#F39C12',
        West: '#E74C3C',
        Central: '#9B59B6'
    };

    if (loading) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-transparent">
                <div className="w-8 h-8 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
            </div>
        );
    }

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-lg text-xs shadow-xl">
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color || '#fff' }} className="font-bold mb-1 last:mb-0">
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="h-full w-full relative overflow-y-auto overflow-x-hidden bg-transparent p-4 lg:p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="max-w-7xl mx-auto flex flex-col gap-8 pb-12"
            >
                {/* Header Section */}
                <GlassPanel className="w-full flex flex-col md:flex-row items-start md:items-center justify-between p-6 md:p-8 bg-black/40 border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[80px] pointer-events-none" />

                    <div className="relative z-10">
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase" style={{ fontFamily: 'var(--font-display)' }}>
                            NGO Oversight Portal
                        </h1>
                        <p className="text-gold uppercase text-xs tracking-widest mt-2 font-semibold">
                            Advanced Mental Health Surveillance System
                        </p>
                    </div>

                    {lastSaved && (
                        <div className="relative z-10 mt-6 md:mt-0 flex items-center gap-4">
                            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                                <Activity className="text-green-400" size={18} />
                                <div>
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">System Sync</p>
                                    <p className="text-sm font-semibold text-white">{lastSaved}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </GlassPanel>

                {/* KPI Cards */}
                <motion.section
                    className="grid grid-cols-2 lg:grid-cols-5 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                >
                    <GlassPanel className="p-6 bg-black/40 border-white/5 shadow-2xl flex flex-col justify-between hover:bg-black/60 transition-colors">
                        <span className="text-[10px] font-bold uppercase opacity-50 tracking-widest text-white">Total Users</span>
                        <span className="text-3xl font-black mt-2 text-white">{kpiStats.totalUsers}</span>
                    </GlassPanel>
                    <GlassPanel className="p-6 bg-black/40 border-white/5 shadow-2xl flex flex-col justify-between hover:bg-black/60 transition-colors">
                        <span className="text-[10px] font-bold uppercase opacity-50 tracking-widest text-white">Active Today</span>
                        <span className="text-3xl font-black mt-2 text-blue-400">{kpiStats.activeToday}</span>
                    </GlassPanel>
                    <GlassPanel className="p-6 bg-yellow-500/10 border-yellow-500/20 shadow-2xl flex flex-col justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-500/80">Medium Risk</span>
                        <span className="text-3xl font-black mt-2 text-yellow-400">{kpiStats.mediumRisk}</span>
                    </GlassPanel>
                    <GlassPanel className="p-6 bg-red-500/10 border-red-500/20 shadow-2xl flex flex-col justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-red-500/80">High Risk</span>
                        <span className="text-3xl font-black mt-2 text-red-400">{kpiStats.highRisk}</span>
                    </GlassPanel>
                    <GlassPanel className="p-6 bg-gold/10 border-gold/20 shadow-2xl flex flex-col justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gold/80">Alerts Triggered</span>
                        <span className="text-3xl font-black mt-2 text-gold">{kpiStats.totalAlerts}</span>
                    </GlassPanel>
                </motion.section>

                {/* Filter Toolbar */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <GlassPanel className="p-5 flex flex-wrap gap-6 items-center bg-black/40 border-white/5 shadow-2xl">
                        <div className="flex items-center gap-3">
                            <MapPin size={16} className="text-white/40" />
                            <span className="text-xs font-semibold uppercase text-white/50 tracking-widest">Area</span>
                            <select
                                className="bg-black/50 border border-white/10 rounded-lg py-1.5 px-3 text-sm font-medium text-white focus:outline-none focus:border-gold/50 cursor-pointer transition-colors"
                                value={filters.area}
                                onChange={(e) => setFilters({ ...filters, area: e.target.value })}
                            >
                                <option value="All" className="bg-[#0a0a0a]">All Areas</option>
                                <option value="North" className="bg-[#0a0a0a]">North</option>
                                <option value="South" className="bg-[#0a0a0a]">South</option>
                                <option value="East" className="bg-[#0a0a0a]">East</option>
                                <option value="West" className="bg-[#0a0a0a]">West</option>
                                <option value="Central" className="bg-[#0a0a0a]">Central</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-3 border-l border-white/10 pl-6">
                            <Building size={16} className="text-white/40" />
                            <span className="text-xs font-semibold uppercase text-white/50 tracking-widest">Org</span>
                            <select
                                className="bg-black/50 border border-white/10 rounded-lg py-1.5 px-3 text-sm font-medium text-white focus:outline-none focus:border-gold/50 cursor-pointer transition-colors"
                                value={filters.org}
                                onChange={(e) => setFilters({ ...filters, org: e.target.value })}
                            >
                                <option value="All" className="bg-[#0a0a0a]">All Organizations</option>
                                <option value="Oakwood High" className="bg-[#0a0a0a]">Oakwood High</option>
                                <option value="West Side MS" className="bg-[#0a0a0a]">West Side MS</option>
                                <option value="City Academy" className="bg-[#0a0a0a]">City Academy</option>
                                <option value="Skyline Prep" className="bg-[#0a0a0a]">Skyline Prep</option>
                                <option value="Green Valley" className="bg-[#0a0a0a]">Green Valley</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-3 border-l border-white/10 pl-6">
                            <Users size={16} className="text-white/40" />
                            <span className="text-xs font-semibold uppercase text-white/50 tracking-widest">Age</span>
                            <select
                                className="bg-black/50 border border-white/10 rounded-lg py-1.5 px-3 text-sm font-medium text-white focus:outline-none focus:border-gold/50 cursor-pointer transition-colors"
                                value={filters.age}
                                onChange={(e) => setFilters({ ...filters, age: e.target.value })}
                            >
                                <option value="All" className="bg-[#0a0a0a]">All Ages</option>
                                <option value="13-15" className="bg-[#0a0a0a]">13-15</option>
                                <option value="16-18" className="bg-[#0a0a0a]">16-18</option>
                            </select>
                        </div>
                        <button
                            onClick={() => setFilters({ area: 'All', org: 'All', age: 'All' })}
                            className="ml-auto flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/40 hover:text-gold transition-colors py-1 cursor-pointer"
                        >
                            <RotateCcw size={14} />
                            Reset
                        </button>
                    </GlassPanel>
                </motion.section>

                {/* Analytics Grid */}
                <motion.section
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    {/* Severity Distribution */}
                    <GlassPanel className="p-6 bg-black/40 border-white/5 shadow-2xl h-[400px] flex flex-col">
                        <h3 className="mb-6 flex items-center gap-2 font-semibold uppercase text-xs tracking-widest text-white/70">
                            <ShieldAlert size={16} className="text-red-400" /> Severity Index
                        </h3>
                        <div className="flex-1">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData.severityData}
                                        innerRadius={70}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="transparent"
                                    >
                                        {chartData.severityData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', fontWeight: '600' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </GlassPanel>

                    {/* Mood by Demographics */}
                    <GlassPanel className="p-6 bg-black/40 border-white/5 shadow-2xl h-[400px] flex flex-col">
                        <h3 className="mb-6 flex items-center gap-2 font-semibold uppercase text-xs tracking-widest text-white/70">
                            <Activity size={16} className="text-green-400" /> Avg Mood Demographics
                        </h3>
                        <div className="flex-1">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData.ageData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)', fontWeight: 600 }} dy={10} />
                                    <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)', fontWeight: 600 }} dx={-10} />
                                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} content={<CustomTooltip />} />
                                    <Bar dataKey="avgMood" fill="#a78b71" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </GlassPanel>

                    {/* Trends */}
                    <GlassPanel className="p-6 bg-black/40 border-white/5 shadow-2xl h-[400px] lg:col-span-3 xl:col-span-1 xl:h-[400px] flex flex-col">
                        <h3 className="mb-6 flex items-center gap-2 font-semibold uppercase text-xs tracking-widest text-white/70">
                            <TrendingUp size={16} className="text-blue-400" /> Regional Escalation Trends
                        </h3>
                        <div className="flex-1">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData.trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)', fontWeight: 600 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)', fontWeight: 600 }} dx={-10} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend wrapperStyle={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', fontWeight: '600' }} />
                                    {['North', 'South', 'East', 'West', 'Central'].map(area => (
                                        <Line
                                            key={area}
                                            type="monotone"
                                            dataKey={area}
                                            stroke={COLORS[area]}
                                            strokeWidth={3}
                                            dot={false}
                                            activeDot={{ r: 6, fill: COLORS[area], stroke: '#000', strokeWidth: 2 }}
                                        />
                                    ))}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </GlassPanel>
                </motion.section>

                {/* Escalation Table */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <GlassPanel className="p-0 overflow-hidden bg-black/40 border-white/5 shadow-2xl">
                        <div className="p-6 flex flex-row justify-between items-center border-b border-white/10 bg-white/5">
                            <h2 className="flex items-center gap-3 m-0 uppercase font-bold tracking-widest text-sm text-white">
                                <ShieldAlert size={18} className="text-red-400" /> Active Case Management
                            </h2>
                            <div className="flex flex-row gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                                <span className="text-[10px] font-semibold uppercase text-white/40">Filtered:</span>
                                <span className="text-[10px] font-bold text-white">{filteredAlerts.length} Cases</span>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-black/20 border-b border-white/5">
                                        <th className="p-4 font-semibold uppercase text-[10px] tracking-widest text-white/40">Reference</th>
                                        <th className="p-4 font-semibold uppercase text-[10px] tracking-widest text-white/40">User Context</th>
                                        <th className="p-4 font-semibold uppercase text-[10px] tracking-widest text-white/40">Trigger</th>
                                        <th className="p-4 font-semibold uppercase text-[10px] tracking-widest text-white/40 text-center">Intensity</th>
                                        <th className="p-4 font-semibold uppercase text-[10px] tracking-widest text-white/40">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAlerts.map((alert) => (
                                        <tr key={alert.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                            <td className="p-4 font-mono font-bold text-xs text-white/60 group-hover:text-gold transition-colors">{alert.id.toUpperCase()}</td>
                                            <td className="p-4">
                                                <div className="font-bold text-sm text-white/90">{alert.org}</div>
                                                <div className="text-[10px] text-white/40 font-semibold uppercase tracking-wider mt-1">{alert.area} • {alert.age}</div>
                                            </td>
                                            <td className="p-4 font-medium text-sm text-white/80">{alert.issue}</td>
                                            <td className="p-4 text-center">
                                                <span
                                                    className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-opacity-10 border"
                                                    style={{
                                                        color: COLORS[alert.intensity],
                                                        backgroundColor: `${COLORS[alert.intensity]}15`,
                                                        borderColor: `${COLORS[alert.intensity]}30`
                                                    }}
                                                >
                                                    {alert.intensity}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <select
                                                    value={alert.status}
                                                    onChange={(e) => handleStatusChange(alert.id, e.target.value)}
                                                    className="bg-black/40 border border-white/10 rounded-lg py-1.5 px-3 text-xs font-semibold uppercase tracking-wider focus:outline-none focus:border-gold/50 cursor-pointer transition-colors"
                                                    style={{
                                                        color: alert.status === 'Open' ? '#F87171' : alert.status === 'In Progress' ? '#FBBF24' : '#4ADE80'
                                                    }}
                                                >
                                                    <option value="Open" className="bg-[#0a0a0a] text-[#F87171]">Assess</option>
                                                    <option value="In Progress" className="bg-[#0a0a0a] text-[#FBBF24]">Treat</option>
                                                    <option value="Resolved" className="bg-[#0a0a0a] text-[#4ADE80]">Closed</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredAlerts.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="p-8 text-center text-white/40 text-sm">
                                                No active cases matched your filters.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </GlassPanel>
                </motion.section>
            </motion.div>
        </div>
    );
}
