"use client";

// Funtown Studio is mostly static/clean backgrounds with slight noise.
// We handled noise in globals.css. 
// This component can be used for occasional large floating shapes if we want, 
// but for now let's keep it minimal to match the reference clean look.

export const AnimatedBackground = () => {
    return (
        <div className="fixed inset-0 -z-10 bg-neo-white pointer-events-none overflow-hidden">
            {/* 
        We can add large slow moving shapes here later if we want more dynamism.
        For now, the grain overlay in globals.css does the heavy lifting for texture.
      */}
            <div className="absolute top-[-10%] left-[-10%] w-[50vh] h-[50vh] rounded-full bg-neo-yellow/10 blur-3xl animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60vh] h-[60vh] rounded-full bg-neo-blue/10 blur-3xl animate-pulse delay-1000" />
        </div>
    );
};
