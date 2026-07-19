// magna_ai_assistant/ChatArea.jsx
import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function StreamingText({ text, speed = 6, onComplete }) {
    const [displayedText, setDisplayedText] = useState('');
    useEffect(() => {
        let index = 0; setDisplayedText('');
        const interval = setInterval(() => {
            if (index < text.length) {
                setDisplayedText((prev) => prev + text.charAt(index));
                index++;
            } else {
                clearInterval(interval);
                if (onComplete) onComplete();
            }
        }, speed);
        return () => clearInterval(interval);
    }, [text, speed]);
    return <span style={{ color: '#0f172a', fontWeight: '450' }}>{displayedText}</span>;
}

export default function ChatArea({ messages }) {
    const scrollBottomRef = useRef(null);

    useEffect(() => {
        scrollBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 24px', backgroundColor: 'transparent' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px', width: '100%', margin: '0 auto' }}>
                <AnimatePresence initial={false}>
                    {messages.map((msg, index) => {
                        const isUser = msg.sender === 'user';
                        const isLast = index === messages.length - 1;

                        return (
                            <motion.div 
                                key={index} 
                                layout
                                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                                style={{
                                    display: 'flex',
                                    justifyContent: isUser ? 'flex-end' : 'flex-start',
                                    width: '100%'
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: isUser ? 'flex-end' : 'flex-start',
                                    maxWidth: '82%',
                                    gap: '6px'
                                }}>
                                    {/* Sender Meta Info */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 4px' }}>
                                        {!isUser && (
                                            <span style={{ 
                                                width: '6px', height: '6px', borderRadius: '50%', 
                                                backgroundColor: '#3b82f6', boxShadow: '0 0 8px #3b82f6' 
                                            }} />
                                        )}
                                        <span style={{ fontSize: '11.5px', fontWeight: '650', color: '#475569', letterSpacing: '-0.1px' }}>
                                            {isUser ? 'Workspace Executive' : 'Magna System Agent'}
                                        </span>
                                        <span style={{ 
                                            fontSize: '9.5px', padding: '1px 6px', borderRadius: '50px', 
                                            backgroundColor: isUser ? 'rgba(15, 23, 42, 0.05)' : 'rgba(59, 130, 246, 0.08)', 
                                            border: isUser ? '1px solid rgba(15, 23, 42, 0.04)' : '1px solid rgba(59, 130, 246, 0.12)', 
                                            color: isUser ? '#475569' : '#2563eb', fontWeight: '600' 
                                        }}>
                                            {isUser ? 'Prompt' : 'Engine Response'}
                                        </span>
                                    </div>

                                    {/* Message Glass Bubble Card */}
                                    <div style={{
                                        padding: '14px 18px',
                                        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                        // User: Crisp White/Slate Minimal Card | Bot: Premium Dynamic Translucent Glass
                                        backgroundColor: isUser ? '#ffffff' : 'rgba(255, 255, 255, 0.55)',
                                        backdropFilter: isUser ? 'none' : 'blur(20px)',
                                        border: isUser ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.6)',
                                        boxShadow: isUser 
                                            ? '0 4px 12px -2px rgba(15, 23, 42, 0.03), inset 0 1px 0px #ffffff' 
                                            : '0 8px 24px -6px rgba(15, 23, 42, 0.05), inset 0 1px 0px rgba(255, 255, 255, 0.8)',
                                        textAlign: 'left',
                                        position: 'relative'
                                    }}>
                                        <div style={{ 
                                            fontSize: '13.5px', 
                                            lineHeight: '1.6', 
                                            color: '#0f172a', // High-contrast crisp light text lock
                                            letterSpacing: '-0.1px', 
                                            whiteSpace: 'pre-line' 
                                        }}>
                                            {!isUser && isLast ? (
                                                <StreamingText text={msg.text} />
                                            ) : (
                                                <span style={{ fontWeight: '450' }}>{msg.text}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
                <div ref={scrollBottomRef} />
            </div>
        </div>
    );
}