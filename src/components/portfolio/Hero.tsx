'use client';

import React, { useEffect } from 'react';
import { initHero } from '@/src/utils/portfolioScripts';

export default function Hero() {
    useEffect(() => {
        const cleanup = initHero();
        return cleanup;
    }, []);

    return (
        <div className="relative w-full h-screen flex items-center">
            {/* Background Video */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c]/90 via-[#0a0a0c]/60 to-transparent z-10"></div>
                <video
                    className="w-full h-full object-cover opacity-80"
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    <source
                        src="https://cdn.sanity.io/files/fdrwu6gi/production/93a92e0e883f2a72f1c9b9cf4dc2ffd415517b36.mp4"
                        type="video/mp4"
                    />
                </video>
            </div>

            {/* Main Content */}
            <div className="relative z-20 w-full max-w-[90rem] mx-auto px-8 lg:px-16 flex flex-col lg:flex-row justify-between items-center mt-10">
                <div className="w-full lg:w-3/5">
                    <div className="overflow-hidden mb-1">
                        <h1 className="gsap-slide-up gsap-hide text-4xl md:text-[4.5rem] font-semibold leading-[1.1] tracking-tight">
                            Tiên phong
                        </h1>
                    </div>
                    <div className="overflow-hidden mb-1">
                        <h1 className="gsap-slide-up gsap-hide text-4xl md:text-[4.5rem] font-medium text-gray-300 leading-[1.1] tracking-tight">
                            công nghệ Drone
                        </h1>
                    </div>
                    <div className="overflow-hidden mb-1">
                        <h1 className="gsap-slide-up gsap-hide text-4xl md:text-[4.5rem] font-medium text-gray-300 leading-[1.1] tracking-tight">
                            & Tự động hóa
                        </h1>
                    </div>
                    <div className="overflow-hidden mb-8">
                        <h1 className="gsap-slide-up gsap-hide text-4xl md:text-[4.5rem] font-medium text-gray-300 leading-[1.1] tracking-tight">
                            chinh phục không gian.
                        </h1>
                    </div>

                    <div className="gsap-slide-up gsap-hide mt-8">
                        <a
                            href="#explore"
                            className="inline-flex items-center gap-4 text-sm font-semibold tracking-widest uppercase hover:text-[#3c50e0] transition-colors group"
                        >
                            <span className="w-10 h-[1px] bg-white group-hover:bg-[#3c50e0] transition-colors"></span>
                            Khám phá sản phẩm
                        </a>
                    </div>
                </div>

                <div className="hidden lg:block w-full max-w-sm mt-20 z-30">
                    <div
                        id="hero-mini-slider"
                        className="gsap-fade-in gsap-hide relative bg-white/5 backdrop-blur-xl border border-white/10 p-4 pb-6 rounded-3xl shadow-2xl group overflow-hidden"
                    >
                        <div className="slider-track relative w-full h-[280px] overflow-hidden">
                            {/* Slide 1 */}
                            <a
                                href="#product-1"
                                className="slide-item absolute inset-0 w-full block cursor-pointer"
                            >
                                <div className="relative w-full h-48 bg-gray-900 rounded-2xl overflow-hidden mb-4">
                                    <img
                                        src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=600"
                                        alt="X-Drone Series"
                                        className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                    <span className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border border-white/10">
                                        Bán chạy
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg leading-tight mb-1">
                                        X-Drone Sentinel
                                    </h3>
                                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                                        Vận hành chính xác tuyệt đối trong mọi
                                        không gian với cảm biến Lidar đa hướng.
                                    </p>
                                </div>
                            </a>

                            {/* Slide 2 */}
                            <a
                                href="#product-2"
                                className="slide-item absolute inset-0 w-full block cursor-pointer"
                            >
                                <div className="relative w-full h-48 bg-gray-900 rounded-2xl overflow-hidden mb-4">
                                    <img
                                        src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600"
                                        alt="Titan Arm"
                                        className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                    <span className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md text-[#3c50e0] text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border border-white/10">
                                        Mới ra mắt
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg leading-tight mb-1">
                                        Titan Arm 6-Axis
                                    </h3>
                                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                                        Lắp ráp vi mạch tự động hóa với cánh tay
                                        cơ khí xoay 6 trục linh hoạt.
                                    </p>
                                </div>
                            </a>

                            {/* Slide 3 */}
                            <a
                                href="#product-3"
                                className="slide-item absolute inset-0 w-full block cursor-pointer"
                            >
                                <div className="relative w-full h-48 bg-gray-900 rounded-2xl overflow-hidden mb-4">
                                    <img
                                        src="https://images.unsplash.com/photo-1535378620166-273708d44e4c?auto=format&fit=crop&q=80&w=600"
                                        alt="LiDAR Optic"
                                        className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                    <span className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border border-white/10">
                                        Phụ kiện
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg leading-tight mb-1">
                                        LiDAR Optic Module
                                    </h3>
                                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                                        Cảm biến quang học siêu nhạy, vẽ bản đồ
                                        địa hình 3D theo thời gian thực.
                                    </p>
                                </div>
                            </a>
                        </div>

                        {/* Slider Controls */}
                        <div className="absolute top-[112px] -translate-y-1/2 left-0 w-full flex justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                            <button className="slider-prev w-9 h-9 flex items-center justify-center bg-black/60 hover:bg-[#3c50e0] text-white rounded-full backdrop-blur-xl transition-all pointer-events-auto border border-white/10 hover:scale-110 shadow-lg">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 19l-7-7 7-7"
                                    ></path>
                                </svg>
                            </button>
                            <button className="slider-next w-9 h-9 flex items-center justify-center bg-black/60 hover:bg-[#3c50e0] text-white rounded-full backdrop-blur-xl transition-all pointer-events-auto border border-white/10 hover:scale-110 shadow-lg">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 5l7 7-7 7"
                                    ></path>
                                </svg>
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="absolute bottom-2 left-6 right-6 h-[2px] bg-white/10 rounded-full overflow-hidden z-20">
                            <div className="slider-progress h-full bg-[#3c50e0] transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)]"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3 z-30 gsap-fade-in gsap-hide">
                <span className="text-[10px] uppercase tracking-[0.25em] text-gray-500 font-bold">
                    Scroll
                </span>
                <div className="w-[1px] h-16 bg-gradient-to-b from-gray-500 to-transparent"></div>
            </div>
        </div>
    );
}
