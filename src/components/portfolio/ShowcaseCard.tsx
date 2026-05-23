import { BASE_URL } from '@/src/services';
import Link from 'next/link';

export const ShowcaseCard = ({ item }: any) => {
    return (
        <Link href={`/products/${item.slug}`}>
            <div
                className="
                    gsap-showcase-item
                    gsap-hide
                    group
                    relative
                    rounded-[2rem]
                    bg-[#121216]
                    overflow-hidden
                    aspect-square
                    cursor-pointer
                    border
                    border-white/5
                    hover:border-[#3c50e0]/50
                    transition-colors
                    duration-500
                "
            >
                <img
                    src={
                        item.mainImage?.startsWith('http')
                            ? item.mainImage
                            : `${BASE_URL}${item.mainImage}`
                    }
                    alt={item.title}
                    className="
                        absolute
                        inset-0
                        w-full
                        h-full
                        object-cover
                        opacity-70
                        group-hover:opacity-100
                        group-hover:scale-110
                        transition-transform
                        duration-700
                    "
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent opacity-90" />

                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                    <div>
                        <span className="text-[#3c50e0] text-[10px] font-bold uppercase tracking-wider mb-1 block">
                            {item.categoryName}
                        </span>

                        <h3 className="text-white font-bold text-xl">
                            {item.name}
                        </h3>
                    </div>

                    <div
                        className="
                            w-10
                            h-10
                            rounded-full
                            bg-white/10
                            backdrop-blur-md
                            flex
                            items-center
                            justify-center
                            opacity-0
                            group-hover:opacity-100
                            group-hover:bg-[#3c50e0]
                            transform
                            translate-y-4
                            group-hover:translate-y-0
                            transition-all
                            duration-300
                        "
                    >
                        <svg
                            className="w-4 h-4 text-white transform -rotate-45"
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
        </Link>
    );
};
