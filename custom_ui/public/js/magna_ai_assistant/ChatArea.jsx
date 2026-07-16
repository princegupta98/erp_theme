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
    return <span style={{ color: '#334155', fontWeight: '450' }}>{displayedText}</span>;
}

export default function ChatArea({ messages }) {
    const scrollBottomRef = useRef(null);

    useEffect(() => {
        scrollBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div style={{ flex: 1, overflowY: 'auto', padding: '40px 24px', backgroundColor: '#fafafa' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '800px', width: '100%', margin: '0 auto' }}>
                <AnimatePresence initial={false}>
                    {messages.map((msg, index) => {
                        const isUser = msg.sender === 'user';
                        const isLast = index === messages.length - 1;

                        return (
                            <motion.div 
                                key={index} layout
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                                style={{
                                    display: 'flex', gap: '20px', width: '100%',
                                    paddingBottom: '24px', borderBottom: '1px solid #f1f5f9'
                                }}
                            >
                                <div style={{
                                    width: '24px', height: '24px', borderRadius: '6px',
                                    border: '1px solid', borderColor: isUser ? '#e2e8f0' : '#0f172a',
                                    backgroundColor: isUser ? '#ffffff' : '#0f172a',
                                    color: isUser ? '#64748b' : '#ffffff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '10px', fontWeight: '700', flexShrink: 0, marginTop: '2px'
                                }}>
                                    {isUser ? 'U' : 'M'}
                                </div>

                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>
                                            {isUser ? 'Workspace Executive' : 'Magna System Agent'}
                                        </span>
                                        <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '4px', backgroundColor: isUser ? '#f1f5f9' : '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', fontWeight: '500' }}>
                                            {isUser ? 'Prompt' : 'Engine Execution'}
                                        </span>
                                    </div>

                                    <div style={{ fontSize: '14px', lineHeight: '1.7', color: '#1e293b', letterSpacing: '-0.05px', whiteSpace: 'pre-line' }}>
                                        {!isUser && isLast ? <StreamingText text={msg.text} /> : <span>{msg.text}</span>}
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