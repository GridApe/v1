'use client';

import React from 'react';

interface SliderProps {
    min: number;
    max: number;
    step?: number;
    value: number[];
    onValueChange: (value: number[]) => void;
    className?: string;
    disabled?: boolean;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
    ({ className, min, max, step = 1, value, onValueChange, disabled = false, ...props }, ref) => {
        return (
            <div className={`relative flex w-full touch-none select-none items-center ${className}`}>
                <div className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-200">
                    <div
                        className="absolute h-full bg-blue-600"
                        style={{ width: `${((value[0] - min) / (max - min)) * 100}%` }}
                    />
                </div>
                <input
                    ref={ref}
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value[0]}
                    disabled={disabled}
                    onChange={(e) => onValueChange([Number(e.target.value)])}
                    className="absolute w-full h-2 appearance-none bg-transparent cursor-pointer"
                    {...props}
                />
            </div>
        );
    }
);

Slider.displayName = 'Slider';

export { Slider };