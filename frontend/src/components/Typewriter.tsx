'use client';

import { useState, useEffect } from 'react';

interface TypewriterProps {
    text: string;
    speed?: number;
    className?: string; // Classes para o texto
    cursorClassName?: string; // Classes para o cursor
    showCursor?: boolean;
    delay?: number; // Atraso antes de começar a digitar
}

export default function Typewriter({
    text,
    speed = 100,
    className = '',
    cursorClassName = '',
    showCursor = true,
    delay = 0
}: TypewriterProps) {
    const [displayedText, setDisplayedText] = useState('');
    const [hasStarted, setHasStarted] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setHasStarted(true);
        }, delay);

        return () => clearTimeout(timeout);
    }, [delay]);

    useEffect(() => {
        if (!hasStarted) return;

        let index = 0;
        const interval = setInterval(() => {
            if (index < text.length) {
                setDisplayedText((prev) => text.slice(0, index + 1));
                index++;
            } else {
                clearInterval(interval);
                setIsFinished(true);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [hasStarted, text, speed]);

    return (
        <span className={className}>
            {displayedText}
            {showCursor && !isFinished && (
                <span className={`animate-pulse ml-1 ${cursorClassName}`}>|</span>
            )}
        </span>
    );
}
