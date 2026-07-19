// magna_ai_assistant/Sidebar.jsx
import React from 'react';
import { motion } from 'framer-motion';

// Premium Lucide-Style SVG Icons (Strictly Pure SVGs, No Emojis)
const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
);

const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);

const PlusIcon = ({ color = "#334155" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
);

const MessageIcon = ({ color = "#64748b" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);

export default function Sidebar({ chatHistory, currentChatId, onSelectChat, onNewChat, isCollapsed, setIsCollapsed }) {
    return (
        <motion.div 
            animate={{ width: isCollapsed ? '76px' : '280px' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32, mass: 0.8 }}
            style={{
                borderRight: '1px solid rgba(0, 0, 0, 0.06)',
                padding: '24px 16px', display: 'flex', flexDirection: 'column',
                justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.4)',
                position: 'relative', overflow: 'hidden'
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                
                {/* Brand Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', height: '32px', paddingLeft: '4px', position: 'relative' }}>
                    <div style={{
                        width: '28px', height: '28px', borderRadius: '8px',
                        backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', fontWeight: '800', color: '#ffffff', flexShrink: 0
                    }}>M</div>
                    
                    {!isCollapsed && (
                        <motion.span 
                            initial={{ opacity: 0, x: -5 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            style={{ fontWeight: '700', fontSize: '15px', color: '#0f172a', letterSpacing: '-0.3px' }}
                        >
                            Magna Engine
                        </motion.span>
                    )}
                    
                    {/* Modern Clean Arrow Control Toggle */}
                    <motion.button 
                        whileHover={{ backgroundColor: 'rgba(0,0,0,0.04)', scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        style={{
                            position: 'absolute', right: isCollapsed ? '-4px' : '0px', top: '2px', border: 'none', 
                            background: 'none', cursor: 'pointer', outline: 'none', padding: '4px', borderRadius: '6px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'right 0.2s'
                        }}
                    >
                        {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </motion.button>
                </div>

                {/* Action Trigger Block */}
                <motion.button 
                    whileHover={{ scale: 1.01, backgroundColor: '#0f172a', color: '#ffffff', borderColor: '#0f172a' }}
                    whileTap={{ scale: 0.99 }}
                    onClick={onNewChat}
                    style={{
                        width: '100%', height: '38px', background: 'transparent',
                        border: '1px solid #e2e8f0', borderRadius: '10px',
                        display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'flex-start',
                        padding: isCollapsed ? '0' : '0 14px', gap: '10px', cursor: 'pointer',
                        fontWeight: '600', fontSize: '13px', color: '#334155', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                >
                    <PlusIcon />
                    {!isCollapsed && <span>New Project Session</span>}
                </motion.button>

                {/* Thread Navigation List */}
                {!isCollapsed && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', marginTop: '28px', marginBottom: '12px', paddingLeft: '4px' }}
                    >
                        Active History
                    </motion.div>
                )}
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflowY: 'auto', marginTop: isCollapsed ? '20px' : '0' }}>
                    {chatHistory.map((chat) => {
                        const isActive = currentChatId === chat.id;
                        return (
                            <motion.div
                                key={chat.id}
                                whileHover={{ x: isActive ? 0 : 3, backgroundColor: isActive ? '#ffffff' : 'rgba(0,0,0,0.02)' }}
                                onClick={() => onSelectChat(chat.id)}
                                style={{
                                    display: 'flex', alignItems: 'center', padding: '10px 12px', borderRadius: '8px',
                                    cursor: 'pointer', fontSize: '13px', fontWeight: isActive ? '600' : '500',
                                    color: isActive ? '#0f172a' : '#64748b',
                                    backgroundColor: isActive ? '#ffffff' : 'transparent',
                                    border: '1px solid', borderColor: isActive ? '#e2e8f0' : 'transparent',
                                    boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.03)' : 'none',
                                    whiteSpace: 'nowrap', justifyContent: isCollapsed ? 'center' : 'flex-start'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', marginRight: isCollapsed ? '0' : '10px', flexShrink: 0 }}>
                                    <MessageIcon color={isActive ? '#0f172a' : '#64748b'} />
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

            {/* Operator Profiler Block */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.06)', flexShrink: 0 }}>
                <div style={{ 
                    width: '32px', height: '32px', borderRadius: '50%', 
                    backgroundColor: '#0f172a', color: '#ffffff', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    fontSize: '11px', fontWeight: 'bold' 
                }}>
                    OP
                </div>
                {!isCollapsed && (
                    <motion.div 
                        initial={{ opacity: 0, x: -5 }} 
                        animate={{ opacity: 1, x: 0 }}
                        style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                    >
                        <span style={{ fontSize: '12.5px', fontWeight: '600', color: '#0f172a' }}>Operator Profile</span>
                        <span style={{ fontSize: '10.5px', color: '#64748b' }}>root@magna.engine</span>
                    </motion.div>
                )}
            </div>

        </motion.div>
    );
}