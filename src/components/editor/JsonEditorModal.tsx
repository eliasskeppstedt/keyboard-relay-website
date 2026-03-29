import { useEffect } from 'react';
import JsonEditor from './JsonEditor';
import { useKeymapService } from '../../features/keymap';

interface JsonEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function JsonEditorModal({ isOpen, onClose }: JsonEditorModalProps) {
    const { remapStore, syncConfig } = useKeymapService();
    
    useEffect(() => {
        if (isOpen) {
            syncConfig();
        }
    }, [isOpen, syncConfig]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const mockData = {
        merged: (remapStore || {}) as Record<string, unknown>,
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-5xl h-full max-h-[85vh] flex flex-col bg-bg border border-border overflow-hidden rounded-[var(--radius-panel)]">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
                    <h2 className="text-lg font-mono text-text">JSON Editor</h2>
                    <button 
                        onClick={onClose}
                        className="text-muted hover:text-accent transition-colors outline-none cursor-pointer"
                        title="Close (Esc)"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                {/* Modal Body */}
                <div className="flex-1 overflow-hidden p-6 bg-bg flex flex-col">
                    <JsonEditor data={mockData} />
                </div>
            </div>
        </div>
    );
}
