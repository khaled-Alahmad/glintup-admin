"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface NotificationProps {
    title: string;
    body: string;
    icon?: string;
    image?: string;
    onClose?: () => void;
    className?: string;
}

const Notification = ({
    title,
    body,
    icon = '/logo.png',
    image,
    onClose,
    className,
}: NotificationProps) => {
    // console.log(title, body, icon, image, onClose, className);

    return (
        <div
            className={cn(
                "fixed top-4 right-4 w-96 bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out transform translate-x-0 z-50",
                "animate-in slide-in-from-right",
                className
            )}
        >
            <div className="flex items-start p-4">
                {/* Icon */}
                {icon && (
                    <div className="flex-shrink-0">
                        <img
                            className="h-10 w-10 rounded-full"
                            src={icon}
                            alt="Notification icon"
                        />
                    </div>
                )}

                {/* Content */}
                <div className="ml-4 w-full">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-gray-900">{title}</h3>
                            <p className="mt-1 text-sm text-gray-500">{body}</p>
                        </div>

                        {/* Close button */}
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="ml-4 flex-shrink-0 rounded hover:bg-gray-100 p-1 transition-colors duration-200"
                            >
                                <X className="h-4 w-4 text-gray-400" />
                            </button>
                        )}
                    </div>

                    {/* Optional image */}
                    {image && (
                        <div className="mt-3">
                            <img
                                src={image}
                                alt="Notification image"
                                className="w-full h-auto rounded-md"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export { Notification };