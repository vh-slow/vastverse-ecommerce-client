'use client';

import React, { useEffect } from 'react';
import { initTeam } from '@/src/utils/portfolioScripts';

export interface TeamMember {
    id: number;
    number: string;
    name: string;
    role: string;
    image: string;
    alt: string;
}

export const teamData: TeamMember[] = [
    {
        id: 1,
        number: '01',
        name: 'You Xia',
        role: 'Founder & CEO',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800',
        alt: 'Vi Ngoc Hiep',
    },
    {
        id: 2,
        number: '02',
        name: 'Elena Rostova',
        role: 'Chief AI Officer',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
        alt: 'Elena',
    },
    {
        id: 3,
        number: '03',
        name: 'Marcus Chen',
        role: 'Lead Robotics Eng',
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800',
        alt: 'Marcus',
    },
    {
        id: 4,
        number: '04',
        name: 'Sarah Jenkins',
        role: 'Aerospace Director',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800',
        alt: 'Sarah',
    },
    {
        id: 5,
        number: '05',
        name: 'David Kim',
        role: 'Hardware Architect',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
        alt: 'David',
    },
];

export default function Team() {
    useEffect(() => {
        const cleanup = initTeam();
        return cleanup;
    }, []);

    return (
        <section
            id="team-section"
            className="
                relative
                w-full
                py-24
                bg-[#0a0a0c]
                z-20
                border-t
                border-white/5
                overflow-hidden
            "
        >
            {/* Header */}
            <div className="max-w-[90rem] mx-auto px-8 lg:px-16 mb-16 gsap-team-header gsap-hide">
                <span className="text-white uppercase tracking-widest text-xs font-bold mb-4 block">
                    our crew
                </span>

                <h2 className="text-4xl md:text-6xl font-bold leading-[1.1] tracking-tight mb-4">
                    the team
                    <span className="text-[#3c50e0]">.</span>
                </h2>

                <p className="text-gray-400 text-base md:text-lg max-w-xl leading-relaxed">
                    Phi hành đoàn tiên phong đằng sau những đột phá về công nghệ
                    không gian và tự động hóa.
                </p>
            </div>

            {/* Accordion */}
            <div
                className="
                    gsap-team-accordion
                    gsap-hide
                    max-w-[90rem]
                    mx-auto
                    px-8
                    lg:px-16
                    w-full
                    h-auto
                    md:h-[300px]
                    lg:h-[400px]
                    flex
                    flex-col
                    md:flex-row
                    gap-2
                    lg:gap-4
                "
            >
                {teamData.map((member) => (
                    <div
                        key={member.id}
                        className="
                            group
                            relative
                            flex-1
                            hover:flex-[2]
                            rounded-3xl
                            overflow-hidden
                            bg-[#121216]
                            transition-all
                            duration-[800ms]
                            ease-[cubic-bezier(0.25,1,0.5,1)]
                            cursor-pointer
                            border
                            border-white/5
                            min-h-[140px]
                            md:min-h-0
                        "
                    >
                        {/* Image */}
                        <img
                            src={member.image}
                            alt={member.alt}
                            className="
                                absolute
                                inset-0
                                w-full
                                h-full
                                object-cover
                                grayscale
                                opacity-50
                                group-hover:grayscale-0
                                group-hover:opacity-100
                                transition-all
                                duration-[800ms]
                            "
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent opacity-90" />

                        {/* Number */}
                        <div
                            className="
                                absolute
                                inset-0
                                flex
                                items-center
                                justify-center
                                opacity-100
                                group-hover:opacity-0
                                transition-opacity
                                duration-300
                            "
                        >
                            <span
                                className="
                                    text-white/30
                                    font-bold
                                    text-xl
                                    uppercase
                                    tracking-widest
                                    -rotate-90
                                    md:rotate-0
                                "
                            >
                                {member.number}
                            </span>
                        </div>

                        {/* Content */}
                        <div
                            className="
                                absolute
                                bottom-8
                                left-8
                                right-8
                                opacity-0
                                group-hover:opacity-100
                                transition-opacity
                                duration-[800ms]
                                delay-100
                                flex
                                justify-between
                                items-end
                            "
                        >
                            <div>
                                <div className="w-8 h-1 bg-[#3c50e0] mb-4" />

                                <h3
                                    className="
                                        text-2xl
                                        md:text-3xl
                                        font-bold
                                        text-white
                                        mb-2
                                        uppercase
                                        tracking-tight
                                        whitespace-nowrap
                                    "
                                >
                                    {member.name}
                                </h3>

                                <p
                                    className="
                                        text-[#3c50e0]
                                        text-xs
                                        font-bold
                                        tracking-widest
                                        uppercase
                                        whitespace-nowrap
                                    "
                                >
                                    {member.role}
                                </p>
                            </div>

                            <div
                                className="
                                    hidden
                                    lg:flex
                                    w-12
                                    h-12
                                    rounded-full
                                    border
                                    border-white/20
                                    backdrop-blur-md
                                    items-center
                                    justify-center
                                    group-hover:bg-[#3c50e0]
                                    transition-colors
                                "
                            >
                                <svg
                                    className="w-5 h-5 text-white transform -rotate-45"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
