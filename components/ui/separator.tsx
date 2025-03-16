'use client';

import React from 'react';

interface SeparatorProps {
    className?: string;
    orientation?: 'horizontal' | 'vertical';
    decorative?: boolean;
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
    ({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => {
        return (
            <div
                ref={ref}
                role={decorative ? 'none' : 'separator'}
                aria-orientation={decorative ? undefined : orientation}
                className={`shrink-0 bg-gray-200 ${orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px'
                    } ${className || ''}`}
                {...props}
            />
        );
    }
);

Separator.displayName = 'Separator';

export { Separator };