'use client';

import React from 'react';

export default function BackToTop() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <button
            id="backToTopBtn"
            className="back-to-top-btn btn-secondary"
            title="Go to top"
            onClick={scrollToTop}
        >
            <i className="fa-solid fa-arrow-up"></i>
        </button>
    );
}
