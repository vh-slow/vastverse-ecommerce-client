'use client';

import React from 'react';

interface PartnerItem {
    id: number;
    name: string;
    image: string;
    link?: string;
}

const partners: PartnerItem[] = [
    {
        id: 1,
        name: 'Partner 1',
        image: '/images/partner/1.png',
    },
    {
        id: 2,
        name: 'Partner 2',
        image: '/images/partner/2.png',
    },
    {
        id: 3,
        name: 'Partner 3',
        image: '/images/partner/3.png',
    },
    {
        id: 4,
        name: 'Partner 4',
        image: '/images/partner/4.png',
    },
    {
        id: 5,
        name: 'Partner 5',
        image: '/images/partner/5.png',
    },
    {
        id: 6,
        name: 'Partner 6',
        image: '/images/partner/6.png',
    },
    {
        id: 7,
        name: 'Partner 7',
        image: '/images/partner/7.png',
    },
    {
        id: 8,
        name: 'Partner 8',
        image: '/images/partner/8.png',
    },
    {
        id: 9,
        name: 'Partner 9',
        image: '/images/partner/9.png',
    },
    {
        id: 10,
        name: 'Partner 10',
        image: '/images/partner/10.png',
    },
    {
        id: 11,
        name: 'Partner 11',
        image: '/images/partner/11.png',
    },
];

const renderPartners = () => {
    return partners.map((partner) => (
        <a
            key={partner.id}
            href={partner.link || '#'}
            className="flex-shrink-0"
        >
            <img
                src={partner.image}
                alt={partner.name}
                className="
                    h-8
                    md:h-10
                    object-contain
                    opacity-40
                    grayscale
                    hover:grayscale-0
                    hover:opacity-100
                    transition-all
                    duration-300
                    cursor-pointer
                "
            />
        </a>
    ));
};

export default function Supplier() {
    return (
        <section
            className="
                relative
                w-full
                py-10
                bg-[#070709]
                border-t
                border-white/5
                z-20
                overflow-hidden
                flex
                items-center
                gsap-fade-in
                gsap-hide
            "
        >
            {/* Left Gradient */}
            <div
                className="
                    absolute
                    left-0
                    top-0
                    bottom-0
                    w-24
                    md:w-48
                    bg-gradient-to-r
                    from-[#070709]
                    to-transparent
                    z-10
                    pointer-events-none
                "
            />

            {/* Right Gradient */}
            <div
                className="
                    absolute
                    right-0
                    top-0
                    bottom-0
                    w-24
                    md:w-48
                    bg-gradient-to-l
                    from-[#070709]
                    to-transparent
                    z-10
                    pointer-events-none
                "
            />

            {/* Marquee */}
            <div className="animate-marquee flex items-center w-max">
                {/* Loop 1 */}
                <div
                    className="
                        flex
                        items-center
                        gap-16
                        md:gap-32
                        px-8
                        md:px-16
                    "
                >
                    {renderPartners()}
                </div>
            </div>
        </section>
    );
}
