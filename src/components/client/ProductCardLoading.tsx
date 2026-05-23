export default function ProductCardLoading() {
    return (
        <div className="product-card bg-white rounded-xl overflow-hidden animate-pulse">
            <div className="product-image-wrapper relative aspect-square bg-gray-200 flex items-center justify-center">
                <svg
                    className="h-20 w-20 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
            </div>
            <div className="product-info p-4 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-5 bg-gray-200 rounded w-1/2 mt-4 mb-1"></div>
            </div>
        </div>
    );
}
