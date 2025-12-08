"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NeoInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const NeoInput = forwardRef<HTMLInputElement, NeoInputProps>(
    ({ className, label, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-2 w-full">
                {label && (
                    <label className="text-neo-black font-bold uppercase text-sm tracking-wider">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        "w-full bg-white border-2 border-neo-black px-4 py-3 text-lg font-bold placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:shadow-neo transition-all duration-200",
                        className
                    )}
                    {...props}
                />
            </div>
        );
    }
);

NeoInput.displayName = "NeoInput";
