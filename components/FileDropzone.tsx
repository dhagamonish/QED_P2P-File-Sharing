'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File as FileIcon, X } from 'lucide-react';
import { NeoCard } from './ui/NeoCard';
import { NeoButton } from './ui/NeoButton';

interface FileDropzoneProps {
    onFilesSelected: (files: File[]) => void;
}

export const FileDropzone = ({ onFilesSelected }: FileDropzoneProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            setSelectedFiles((prev) => [...prev, ...files]);
            onFilesSelected(files);
        }
    }, [onFilesSelected]);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            setSelectedFiles((prev) => [...prev, ...files]);
            onFilesSelected(files);
        }
    }, [onFilesSelected]);

    const removeFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="w-full max-w-xl mx-auto space-y-6">
            <motion.div
                animate={{ scale: isDragging ? 1.02 : 1 }}
                className="relative"
            >
                <NeoCard
                    variant="default"
                    className={`
            border-dashed border-4 min-h-[300px] flex flex-col items-center justify-center text-center cursor-pointer transition-colors
            ${isDragging ? 'bg-neo-blue/20 border-neo-blue' : 'hover:bg-gray-50'}
          `}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('file-input')?.click()}
                >
                    <input
                        type="file"
                        id="file-input"
                        multiple
                        className="hidden"
                        onChange={handleFileInput}
                    />

                    <div className="p-6 bg-neo-main rounded-full border-2 border-neo-black shadow-neo-sm mb-6">
                        <Upload className="w-10 h-10" />
                    </div>

                    <h3 className="text-2xl font-black mb-2">DROP FILES HERE</h3>
                    <p className="font-bold text-gray-500">or click to browse</p>
                </NeoCard>
            </motion.div>

            <AnimatePresence>
                {selectedFiles.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        <h4 className="font-black text-lg">Selected Files ({selectedFiles.length})</h4>
                        {selectedFiles.map((file, i) => (
                            <NeoCard key={`${file.name}-${i}`} variant="flat" className="flex items-center justify-between p-3">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <FileIcon className="w-6 h-6 shrink-0" />
                                    <div className="truncate">
                                        <p className="font-bold truncate">{file.name}</p>
                                        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeFile(i)}
                                    className="p-1 hover:bg-red-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-red-500" />
                                </button>
                            </NeoCard>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
