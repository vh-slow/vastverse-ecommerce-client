'use client';

import React, { useEffect } from 'react';

export default function Footer() {
    return (
        <footer className="p-6 text-sm flex justify-between items-center">
            <p className="text-gray-600">
                &copy; {new Date().getFullYear()} VastVerse Inc.
            </p>
            <div className="flex gap-4">
                <a href="#" className="text-gray-600 hover:text-blue-600">
                    Docs
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                    Support
                </a>
            </div>
        </footer>
    );
}
