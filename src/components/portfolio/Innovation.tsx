'use client';

import React, { useEffect } from 'react';

import { initInnovation } from '@/src/utils/portfolioScripts';

export interface InnovationItem {
    id: number;
    title: string;
    subtitle: string;
    video: string;
    primaryAction: string;
    secondaryAction?: string;
}

export const innovationData: InnovationItem[] = [
    {
        id: 1,
        subtitle: 'Shot on',
        title: 'DJI Mavic 4 Pro',
        video: 'https://cdn.sanity.io/files/fdrwu6gi/production/93a92e0e883f2a72f1c9b9cf4dc2ffd415517b36.mp4',
        primaryAction: 'Learn More',
        secondaryAction: 'Buy Now',
    },
    {
        id: 2,
        subtitle: 'Precision Engineering',
        title: 'Titan Arm 6-Axis',
        video: 'https://cdn.sanity.io/files/fdrwu6gi/production/93a92e0e883f2a72f1c9b9cf4dc2ffd415517b36.mp4',
        primaryAction: 'Explore Tech',
    },
    {
        id: 3,
        subtitle: 'The Future',
        title: 'Hệ thống LiDAR 8K',
        video: 'https://cdn.sanity.io/files/fdrwu6gi/production/93a92e0e883f2a72f1c9b9cf4dc2ffd415517b36.mp4',
        primaryAction: 'View Details',
    },
];

export default function Innovation() {
    useEffect(() => {
        const cleanup = initInnovation();

        return cleanup;
    }, []);

    return (
        <section
            id="innovation-showcase"
            className="
                relative
                w-full
                py-16
                bg-[#0a0a0c]
                z-20
                border-t
                border-white/5
                overflow-hidden
            "
        >
            {/* Header */}
            <div className="gsap-innovation-header gsap-hide w-full text-center mb-10 relative z-40">
                <h2 className="text-3xl md:text-4xl font-medium text-white tracking-wide max-w-xl mx-auto">
                    Standing at the Forefront of Innovation
                </h2>
            </div>

            {/* Slider */}
            <div
                id="main-innovation-slider"
                className="
                    relative
                    w-full
                    h-[50vh]
                    md:h-[80vh]
                    min-h-[450px]
                    overflow-hidden
                    group
                "
            >
                {/* Slides */}
                {innovationData.map((item, index) => (
                    <div
                        key={item.id}
                        className="
                            innovation-slide
                            absolute
                            top-0
                            left-1/2
                            w-[85vw]
                            md:w-[75vw]
                            h-full
                            transition-all
                            duration-[1000ms]
                            ease-[cubic-bezier(0.25,1,0.5,1)]
                        "
                    >
                        <div className="relative w-full h-full overflow-hidden shadow-2xl">
                            {/* Overlay */}
                            <div
                                className="
                                    absolute
                                    inset-0
                                    bg-gradient-to-b
                                    from-black/60
                                    via-black/10
                                    to-black/40
                                    z-10
                                    pointer-events-none
                                "
                            />

                            {/* Video */}
                            <video
                                className="absolute inset-0 w-full h-full object-cover"
                                muted
                                playsInline
                                loop
                            >
                                <source src={item.video} type="video/mp4" />
                            </video>

                            {/* Content */}
                            <div
                                className={`
                                    absolute
                                    top-[15%]
                                    md:top-20
                                    left-0
                                    w-full
                                    text-center
                                    z-20
                                    slide-content
                                    transition-opacity
                                    duration-700
                                    ${index !== 0 ? 'opacity-0' : ''}
                                `}
                            >
                                <h4 className="text-white/90 text-lg md:text-2xl font-medium drop-shadow-md">
                                    {item.subtitle}
                                </h4>

                                <h2
                                    className="
                                        text-white
                                        text-3xl
                                        md:text-5xl
                                        font-bold
                                        mt-1
                                        drop-shadow-lg
                                        tracking-wide
                                    "
                                >
                                    {item.title}
                                </h2>

                                {/* Actions */}
                                <div className="flex justify-center gap-6 mt-4 text-sm font-medium">
                                    <a
                                        href="#"
                                        className="
                                            text-white
                                            hover:text-gray-300
                                            drop-shadow-md
                                            transition-colors
                                            flex
                                            items-center
                                            gap-1
                                        "
                                    >
                                        {item.primaryAction}

                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </a>

                                    {item.secondaryAction && (
                                        <a
                                            href="#"
                                            className="
                                                text-white
                                                hover:text-gray-300
                                                drop-shadow-md
                                                transition-colors
                                                flex
                                                items-center
                                                gap-1
                                            "
                                        >
                                            {item.secondaryAction}

                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Prev */}
                <button
                    className="
                        inno-prev
                        absolute
                        left-2
                        md:left-[5vw]
                        top-1/2
                        -translate-y-1/2
                        text-white/60
                        hover:text-white
                        transition-all
                        opacity-0
                        group-hover:opacity-100
                        z-50
                        p-2
                        md:p-4
                        cursor-pointer
                        drop-shadow-lg
                    "
                >
                    <svg
                        className="w-6 h-6 md:w-10 md:h-10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </button>

                {/* Next */}
                <button
                    className="
                        inno-next
                        absolute
                        right-2
                        md:right-[5vw]
                        top-1/2
                        -translate-y-1/2
                        text-white/60
                        hover:text-white
                        transition-all
                        opacity-0
                        group-hover:opacity-100
                        z-50
                        p-2
                        md:p-4
                        cursor-pointer
                        drop-shadow-lg
                    "
                >
                    <svg
                        className="w-6 h-6 md:w-10 md:h-10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </button>

                {/* Progress */}
                <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
                    <div id="inno-progress-segments" className="flex gap-3" />
                </div>
            </div>
        </section>
    );
}
