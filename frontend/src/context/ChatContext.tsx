'use client';

import React, { createContext, useContext, useState } from 'react';

interface ChatContextType {
    activeFriend: any | null;
    isOpen: boolean;
    isMinimized: boolean;
    openChat: (friend: any) => void;
    closeChat: () => void;
    toggleMinimize: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
    const [activeFriend, setActiveFriend] = useState<any | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    const openChat = (friend: any) => {
        setActiveFriend(friend);
        setIsOpen(true);
        setIsMinimized(false);
    };

    const closeChat = () => {
        setIsOpen(false);
        setActiveFriend(null);
    };

    const toggleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    return (
        <ChatContext.Provider value={{ activeFriend, isOpen, isMinimized, openChat, closeChat, toggleMinimize }}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
}
