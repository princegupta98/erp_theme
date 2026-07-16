// chatbot_widget.bundle.jsx
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import AssistantPortal from './magna_ai_assistant/AssistantPortal';

function MagnaAICopilotApp() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <AnimatePresence>
                {!isOpen && (
                    <motion.div 
                        id="magna-edge-toggle-tab"
                        onClick={() => setIsOpen(true)}
                        initial={{ x: 80, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 80, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 240, damping: 22, delay: 0.5 }}
                        whileHover={{ x: -4, backgroundColor: '#000000' }}
                        whileTap={{ scale: 0.96 }}
                        style={{
                            position: 'fixed', right: 0, top: '50%',
                            transform: 'translateY(-50%)',
                            backgroundColor: '#0f172a', color: '#ffffff',
                            padding: '16px 10px', borderRadius: '12px 0 0 12px',
                            cursor: 'pointer', zIndex: 999999,
                            boxShadow: '0 20px 40px -10px rgba(15,23,42,0.3)',
                            writingMode: 'vertical-rl', textOrientation: 'mixed',
                            fontSize: '11px', fontFamily: 'Inter, -apple-system, sans-serif',
                            fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase',
                            display: 'flex', alignItems: 'center', gap: '8px', userSelect: 'none'
                        }}
                    >
                        <span style={{ transform: 'rotate(90deg)', fontSize: '12px' }}>✦</span>
                        Magna Engine
                    </motion.div>
                )}
            </AnimatePresence>

            <AssistantPortal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
}

$(document).on('app_ready', function() {
    if (document.getElementById('magna-ai-copilot-container')) return;

    const cssText = `
        <style>
            .magna-glow-input {
                transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
            }
            .magna-glow-input:focus-within {
                border-color: #0f172a !important;
                box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.08) !important;
            }
            #magna-ai-copilot-container *::-webkit-scrollbar {
                width: 5px; height: 5px;
            }
            #magna-ai-copilot-container *::-webkit-scrollbar-track {
                background: transparent;
            }
            #magna-ai-copilot-container *::-webkit-scrollbar-thumb {
                background: #e2e8f0; border-radius: 99px;
            }
            #magna-ai-copilot-container *::-webkit-scrollbar-thumb:hover {
                background: #cbd5e1;
            }
        </style>
    `;
    $('head').append(cssText);

    const container = document.createElement('div');
    container.id = 'magna-ai-copilot-container';
    document.body.appendChild(container);

    const root = ReactDOM.createRoot(container);
    root.render(<MagnaAICopilotApp />);
});