import { HTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface NeoCardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'flat';
}

const NeoCard = forwardRef<HTMLDivElement, NeoCardProps>(
    ({ className, variant = 'default', ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'bg-neo-white border-2 border-neo-black p-6 md:p-8', // Consistent padding, larger on desktop
                    variant === 'default' && 'shadow-neo',
                    className
                )}
                {...props}
            />
        );
    }
);

NeoCard.displayName = 'NeoCard';

export { NeoCard };
