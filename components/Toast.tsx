"use client";

import React, { useEffect } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

interface ToastProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message?: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
}

export default function Toast({
    isOpen,
    onClose,
    title,
    message,
    type = 'success',
    duration = 3000,
}: ToastProps) {
    useEffect(() => {
        if (isOpen && duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isOpen, duration, onClose]);

    if (!isOpen) return null;

    const typeConfig = {
        success: {
            icon: <CheckCircle className="w-6 h-6" />,
            bgColor: "bg-green-500/10",
            borderColor: "border-green-500/20",
            textColor: "text-green-400",
            iconColor: "text-green-400",
        },
        error: {
            icon: <XCircle className="w-6 h-6" />,
            bgColor: "bg-red-500/10",
            borderColor: "border-red-500/20",
            textColor: "text-red-400",
            iconColor: "text-red-400",
        },
        warning: {
            icon: <AlertTriangle className="w-6 h-6" />,
            bgColor: "bg-yellow-500/10",
            borderColor: "border-yellow-500/20",
            textColor: "text-yellow-400",
            iconColor: "text-yellow-400",
        },
        info: {
            icon: <Info className="w-6 h-6" />,
            bgColor: "bg-blue-500/10",
            borderColor: "border-blue-500/20",
            textColor: "text-blue-400",
            iconColor: "text-blue-400",
        },
    };

    const config = typeConfig[type];

    return (
        <div className="fixed top-6 right-6 z-[70] animate-slideIn">
            <div className={`${config.bgColor} ${config.borderColor} border rounded-2xl p-4 shadow-2xl backdrop-blur-sm max-w-md`}>
                <div className="flex items-start space-x-3">
                    <div className={config.iconColor}>
                        {config.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className={`font-bold ${config.textColor} mb-1`}>{title}</h4>
                        {message && (
                            <p className="text-sm text-gray-400">{message}</p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-gray-800 transition-colors flex-shrink-0"
                    >
                        <X className="w-4 h-4 text-gray-400" />
                    </button>
                </div>
            </div>

            <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
        </div>
    );
}
