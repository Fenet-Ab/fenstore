"use client";

import React from "react";
import { AlertTriangle, CheckCircle, X } from "lucide-react";

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'success';
    loading?: boolean;
}

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = 'warning',
    loading = false,
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    const typeStyles = {
        danger: {
            icon: <AlertTriangle className="w-12 h-12 text-red-400" />,
            iconBg: "bg-red-500/10",
            iconBorder: "border-red-500/20",
            button: "bg-red-500 hover:bg-red-600",
            buttonShadow: "shadow-red-500/20",
        },
        warning: {
            icon: <AlertTriangle className="w-12 h-12 text-yellow-400" />,
            iconBg: "bg-yellow-500/10",
            iconBorder: "border-yellow-500/20",
            button: "bg-yellow-500 hover:bg-yellow-600",
            buttonShadow: "shadow-yellow-500/20",
        },
        success: {
            icon: <CheckCircle className="w-12 h-12 text-green-400" />,
            iconBg: "bg-green-500/10",
            iconBorder: "border-green-500/20",
            button: "bg-green-500 hover:bg-green-600",
            buttonShadow: "shadow-green-500/20",
        },
    };

    const style = typeStyles[type];

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-[#161616] border border-gray-800 rounded-3xl max-w-md w-full shadow-2xl animate-scaleIn">
                {/* Header */}
                <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Icon */}
                    <div className="flex justify-center">
                        <div className={`p-4 rounded-2xl ${style.iconBg} border ${style.iconBorder}`}>
                            {style.icon}
                        </div>
                    </div>

                    {/* Message */}
                    <p className="text-gray-300 text-center leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Actions */}
                <div className="p-6 border-t border-gray-800 flex items-center justify-end space-x-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-400 hover:text-white hover:bg-gray-800 transition-all border border-gray-800 disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-lg ${style.button} ${style.buttonShadow} disabled:opacity-50`}
                    >
                        {loading ? 'Processing...' : confirmText}
                    </button>
                </div>
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
        </div>
    );
}
