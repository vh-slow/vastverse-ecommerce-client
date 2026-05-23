'use client';

import { initFooter } from '@/src/utils/portfolioScripts';
import React, { useEffect } from 'react';

export default function Footer() {
    useEffect(() => {
        const cleanup = initFooter();
        return cleanup;
    }, []);

    return (
        <footer className="relative w-full bg-[#0a0a0c] pt-20 pb-10 border-t border-white/10 z-20 overflow-hidden gsap-footer-fade">
            <div className="max-w-[90rem] mx-auto px-8 lg:px-16 grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
                <div className="md:col-span-4">
                    <a
                        href="/"
                        className="flex items-center cursor-pointer group mb-6"
                    >
                        <img
                            src="/images/logo.png"
                            alt="VastVerse Logo Icon"
                            className="w-10 h-10 object-contain transition-all duration-300 group-hover:scale-105"
                        />
                        <span className="font-bold text-3xl tracking-tight ml-2 text-white group-hover:text-gray-200 transition-colors">
                            VastVerse
                        </span>
                    </a>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6 pr-4">
                        Hệ sinh thái công nghệ tự động hóa, Drones và Cánh tay
                        Robotics tiên phong. Sáng tạo giải pháp thông minh tối
                        ưu hóa mọi quy trình.
                    </p>
                    <div className="flex flex-col gap-3">
                        <p className="text-gray-400 text-sm flex items-center gap-3">
                            <svg
                                className="w-4 h-4 text-[#3c50e0]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                            </svg>
                            +84 999 888 777
                        </p>
                        <p className="text-gray-400 text-sm flex items-center gap-3">
                            <svg
                                className="w-4 h-4 text-[#3c50e0]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                            contact@vastverse.vn
                        </p>
                    </div>
                </div>

                {/* Cột 2: Sản phẩm & Giải pháp (Mockup Links) */}
                <div className="md:col-span-2">
                    <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-6">
                        Products
                    </h4>
                    <ul className="flex flex-col gap-4">
                        <li>
                            <a
                                href="#"
                                className="text-gray-400 text-sm hover:text-[#3c50e0] transition-colors"
                            >
                                X-Drone Series
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="text-gray-400 text-sm hover:text-[#3c50e0] transition-colors"
                            >
                                Titan Arm 6-Axis
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="text-gray-400 text-sm hover:text-[#3c50e0] transition-colors"
                            >
                                LiDAR Systems
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="text-gray-400 text-sm hover:text-[#3c50e0] transition-colors"
                            >
                                Automation AI
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="text-gray-400 text-sm hover:text-[#3c50e0] transition-colors"
                            >
                                Accessories
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Cột 3: Công ty (Mockup Links) */}
                <div className="md:col-span-3">
                    <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-6">
                        Company
                    </h4>
                    <ul className="flex flex-col gap-4">
                        <li>
                            <a
                                href="#"
                                className="text-gray-400 text-sm hover:text-[#3c50e0] transition-colors"
                            >
                                Về chúng tôi
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="text-gray-400 text-sm hover:text-[#3c50e0] transition-colors"
                            >
                                Đội ngũ kỹ sư
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="text-gray-400 text-sm hover:text-[#3c50e0] transition-colors"
                            >
                                Cơ hội nghề nghiệp
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="text-gray-400 text-sm hover:text-[#3c50e0] transition-colors"
                            >
                                Trở thành đối tác
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="text-gray-400 text-sm hover:text-[#3c50e0] transition-colors"
                            >
                                Tin tức & Sự kiện
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Cột 4: Vị trí Trụ sở (Được ghép từ snippet San Francisco gốc) */}
                <div className="md:col-span-3">
                    <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-6">
                        San Francisco
                    </h4>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                        100 Innovation Blvd,
                        <br />
                        Silicon Valley,
                        <br />
                        CA 94043, USA
                    </p>

                    <div className="relative w-full h-24 border border-white/10 rounded-xl overflow-hidden group cursor-pointer bg-[#121216]">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#3c50e0] rounded-full shadow-[0_0_15px_#3c50e0]">
                            <div className="w-full h-full rounded-full animate-ping bg-[#3c50e0]"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/60 transition-opacity duration-300">
                            <span className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                Get Directions
                                <svg
                                    className="w-3 h-3"
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
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sub-footer / Bản quyền */}
            <div className="max-w-[90rem] mx-auto px-8 lg:px-16 flex flex-col md:flex-row justify-between items-center border-t border-white/5 pt-8">
                <p className="text-gray-500 text-sm mb-4 md:mb-0">
                    &copy; {new Date().getFullYear()} VastVerse Technologies.
                    All rights reserved.
                </p>
                <div className="flex gap-6">
                    <a
                        href="#"
                        className="text-gray-500 hover:text-white transition-colors text-sm font-medium"
                    >
                        Privacy Policy
                    </a>
                    <a
                        href="#"
                        className="text-gray-500 hover:text-white transition-colors text-sm font-medium"
                    >
                        Terms of Service
                    </a>
                </div>
            </div>
        </footer>
    );
}
