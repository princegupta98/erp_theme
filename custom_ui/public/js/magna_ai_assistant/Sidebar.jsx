// magna_ai_assistant/Sidebar.jsx
import React from 'react';
import { motion } from 'framer-motion';

// Premium Lucide-Style SVG Icons (Strictly Pure SVGs, No Emojis)
const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
);

const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);

const PlusIcon = ({ color = "#0f172a" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
);

const MessageIcon = ({ color = "#64748b" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);

export default function Sidebar({ chatHistory, currentChatId, onSelectChat, onNewChat, isCollapsed, setIsCollapsed }) {
    return (
        <motion.div 
            animate={{ width: isCollapsed ? '78px' : '280px' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32, mass: 0.8 }}
            style={{
                borderRight: '1px solid rgba(15, 23, 42, 0.05)',
                padding: '24px 14px', display: 'flex', flexDirection: 'column',
                justifyContent: 'space-between', 
                // Premium Glassmorphic Frost Foundation
                backgroundColor: 'rgba(255, 255, 255, 0.35)', 
                backdropFilter: 'blur(20px) saturate(130%)',
                position: 'relative', overflow: 'hidden', height: '100%', boxSizing: 'border-box'
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                
                {/* Brand Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px', height: '32px', paddingLeft: '6px', position: 'relative' }}>
                    <motion.div 
                        whileHover={{ scale: 1.05, rotate: -2 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            width: '28px', height: '28px', borderRadius: '8px',
                            backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '12px', fontWeight: '800', color: '#ffffff', flexShrink: 0,
                            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)'
                        }}
                    >
                        M
                    </motion.div>
                    
                    {!isCollapsed && (
                        <motion.span 
                            initial={{ opacity: 0, x: -6 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            style={{ fontWeight: '700', fontSize: '14.5px', color: '#0f172a', letterSpacing: '-0.3px' }}
                        >
                            Magna Engine
                        </motion.span>
                    )}
                    
                    {/* Modern Control Toggle */}
                    <motion.button 
                        whileHover={{ backgroundColor: 'rgba(15, 23, 42, 0.05)', scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        style={{
                            position: 'absolute', right: isCollapsed ? '4px' : '0px', top: '2px', border: 'none', 
                            background: 'none', cursor: 'pointer', outline: 'none', padding: '6px', borderRadius: '8px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
                        }}
                    >
                        {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </motion.button>
                </div>

                {/* New Project Session Button */}
                <motion.button 
                    whileHover={{ 
                        scale: 1.015, 
                        backgroundColor: '#0f172a', 
                        color: '#ffffff',
                        boxShadow: '0 12px 24px -8px rgba(15, 23, 42, 0.25)'
                    }}
                    whileTap={{ scale: 0.985 }}
                    onClick={onNewChat}
                    style={{
                        width: '100%', height: '40px', 
                        backgroundColor: 'rgba(255, 255, 255, 0.65)',
                        border: '1px solid rgba(15, 23, 42, 0.08)', borderRadius: '12px',
                        display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'flex-start',
                        padding: isCollapsed ? '0' : '0 14px', gap: '10px', cursor: 'pointer',
                        fontWeight: '600', fontSize: '12.5px', color: '#0f172a', 
                        boxShadow: '0 2px 6px -1px rgba(15, 23, 42, 0.02)',
                        transition: 'color 0.15s, background-color 0.15s, border-color 0.15s'
                    }}
                >
                    <PlusIcon />
                    {!isCollapsed && <span>New Project Session</span>}
                </motion.button>

                {/* Active History Group Label */}
                {!isCollapsed && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.8px', marginTop: '28px', marginBottom: '10px', paddingLeft: '6px' }}
                    >
                        Active History
                    </motion.div>
                )}
                
                {/* Thread Navigation List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1, overflowY: 'auto', marginTop: isCollapsed ? '16px' : '0' }}>
                    {chatHistory.map((chat) => {
                        const isActive = currentChatId === chat.id;
                        return (
                            <motion.div
                                key={chat.id}
                                whileHover={{ x: isActive ? 0 : 3 }}
                                onClick={() => onSelectChat(chat.id)}
                                style={{
                                    display: 'flex', alignItems: 'center', padding: '10px 12px', borderRadius: '10px',
                                    cursor: 'pointer', fontSize: '13px', fontWeight: isActive ? '600' : '500',
                                    color: isActive ? '#0f172a' : '#64748b',
                                    // Premium Smooth White/Glass Transition Card
                                    backgroundColor: isActive ? '#ffffff' : 'transparent',
                                    border: '1px solid', 
                                    borderColor: isActive ? 'rgba(15, 23, 42, 0.08)' : 'transparent',
                                    boxShadow: isActive ? '0 10px 20px -8px rgba(15, 23, 42, 0.06), inset 0 1px 0px #ffffff' : 'none',
                                    whiteSpace: 'nowrap', justifyContent: isCollapsed ? 'center' : 'flex-start',
                                    position: 'relative',
                                    transition: 'background-color 0.25s, border-color 0.25s, color 0.25s'
                                }}
                            >
                                {/* Left Glow Indicator Line for Active Thread */}
                                {isActive && !isCollapsed && (
                                    <motion.div 
                                        layoutId="activeIndicator"
                                        style={{
                                            position: 'absolute', left: '-2px', top: '25%', bottom: '25%', width: '3px',
                                            borderRadius: '4px', background: 'linear-gradient(to bottom, #2563eb, #3b82f6)'
                                        }}
                                    />
                                )}

                                <div style={{ display: 'flex', alignItems: 'center', marginRight: isCollapsed ? '0' : '10px', flexShrink: 0 }}>
                                    <MessageIcon color={isActive ? '#2563eb' : '#64748b'} />
                                </div>
                                {!isCollapsed && (
                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {chat.title}
                                    </span>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Operator Profiler Card */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '16px', borderTop: '1px solid rgba(15, 23, 42, 0.06)', flexShrink: 0 }}>
                <motion.div 
                    whileHover={{ scale: 1.05 }}
                    style={{ 
                        width: '32px', height: '32px', borderRadius: '50%', 
                        backgroundColor: '#0f172a', color: '#ffffff', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        fontSize: '11px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(15, 23, 42, 0.12)'
                    }}
                >
                    OP
                </motion.div>
                {!isCollapsed && (
                    <motion.div 
                        initial={{ opacity: 0, x: -4 }} 
                        animate={{ opacity: 1, x: 0 }}
                        style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                    >
                        <span style={{ fontSize: '12.5px', fontWeight: '600', color: '#0f172a', letterSpacing: '-0.1px' }}>Operator Profile</span>
                        <span style={{ fontSize: '10.5px', color: '#64748b', fontWeight: '450' }}>root@magna.engine</span>
                    </motion.div>
                )}
            </div>

        </motion.div>
    );
}