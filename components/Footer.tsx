'use client';

export const Footer = () => {
    return (
        <footer className="w-full py-6 px-6 border-t-2 border-neo-black bg-white flex justify-between items-center text-sm font-black z-40 mt-auto">
            <div className="flex items-center gap-2">
                <span>&copy; 2025 Q.E.D.</span>
            </div>

            <div className="absolute left-1/2 -translate-x-1/2">
                Made by MD
            </div>

            <div className="hidden md:block opacity-0">
                {/* Spacer to balance the absolute center */}
                &copy; 2025 Q.E.D.
            </div>
        </footer>
    );
};
