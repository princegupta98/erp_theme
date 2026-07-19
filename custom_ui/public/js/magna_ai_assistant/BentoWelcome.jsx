// magna_ai_assistant/BentoWelcome.jsx
import React from 'react';
import { motion } from 'framer-motion';

// Premium Lucide-React SVG Asset components for strict alignment
const ZapIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);

const BotIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
);

const GlobeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
);

const WrenchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 0-7.94-7.94l-6.91 6.91a2.12 2.12 0 0 0-.13 2.87l2.12 2.12a2.13 2.13 0 0 0 2.87-.13l6.91-6.91a6 6 0 0 0-7.94-7.94l3.76 3.76z"/></svg>
);

export default function BentoWelcome({ onCardClick }) {
    const cards = [
        { 
            title: "Build a Backend Integration", 
            desc: "Connect SQL databases, trigger microservices, and setup cloud schemas seamlessly.", 
            icon: <ZapIcon /> 
        },
        { 
            title: "Deploy Agentic Workflows", 
            desc: "Learn how to orchestrate automated scripts and multi-agent systems.", 
            icon: <BotIcon /> 
        },
        { 
            title: "Optimize Live ERP Pipeline", 
            desc: "Deploy fast web-sockets, host static assets, and track core telemetry.", 
            icon: <GlobeIcon /> 
        },
        { 
            title: "Magna Dev Tools Suite", 
            desc: "Explore advanced performance logs, CLI profiles, and runtime emulators.", 
            icon: <WrenchIcon /> 
        }
    ];

    return (
        <motion.div 
            initial="hidden" 
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
            style={{
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: '14px',
                width: '100%', 
                maxWidth: '640px', 
                margin: '0 auto'
            }}
        >
            {cards.map((card, idx) => (
                <motion.div
                    key={idx}
                    variants={{ 
                        hidden: { opacity: 0, y: 10 }, 
                        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } } 
                    }}
                    whileHover={{ 
                        y: -3, 
                        borderColor: '#0f172a', 
                        boxShadow: '0 12px 24px -10px rgba(15, 23, 42, 0.08)' 
                    }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => onCardClick(card.title)}
                    style={{
                        backgroundColor: '#ffffff', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px', 
                        padding: '18px', 
                        cursor: 'pointer',
                        textAlign: 'left', 
                        display: 'flex', 
                        flexDirection: 'column',
                        justifyContent: 'space-between', 
                        height: '136px', 
                        boxSizing: 'border-box',
                        transition: 'border-color 0.15s ease'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                        <h3 style={{ 
                            fontSize: '13.5px', 
                            fontWeight: '600', 
                            color: '#0f172a', 
                            margin: 0, 
                            letterSpacing: '-0.2px',
                            lineHeight: '1.4'
                        }}>
                            {card.title}
                        </h3>
                        <div style={{ 
                            backgroundColor: '#f8fafc', 
                            border: '1px solid #e2e8f0',
                            width: '28px', 
                            height: '28px', 
                            borderRadius: '8px',
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            flexShrink: 0
                        }}>
                            {card.icon}
                        </div>
                    </div>
                    <p style={{ 
                        fontSize: '11.5px', 
                        color: '#64748b', 
                        lineHeight: '1.5', 
                        margin: 0, 
                        fontWeight: '450' 
                    }}>
                        {card.desc}
                    </p>
                </motion.div>
            ))}
        </motion.div>
    );
}