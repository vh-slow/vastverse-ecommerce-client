export default function AboutHeroSection() {
    return (
        <section className="py-8 lg:py-10 bg-white">
            <div className="container max-w-5xl mx-auto px-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-center text-primary mb-12">
                    We believe that quality
                    <br />
                    technology should be accessible to everyone
                </h2>

                <div className="aspect-[5/2] w-full rounded-xl shadow-lg overflow-hidden mb-10 lg:mb-12">
                    <img
                        src="/images/about/hero-img.jpg"
                        alt="Robotic arm in a modern technology warehouse"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Feature 1 */}
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fa-solid fa-microchip text-2xl"></i>
                        </div>
                        <h4 className="text-xl font-semibold text-primary mb-2">
                            Cutting-edge Tech
                        </h4>
                        <p className="text-gray-600 leading-relaxed">
                            We provide the latest gadgets and innovations from
                            top brands worldwide.
                        </p>
                    </div>
                    {/* Feature 2 */}
                    <div className="text-center">
                        <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fa-solid fa-shield-halved text-2xl"></i>
                        </div>
                        <h4 className="text-xl font-semibold text-primary mb-2">
                            Authentic Products
                        </h4>
                        <p className="text-gray-600 leading-relaxed">
                            All products are 100% genuine, sourced directly from
                            manufacturers and authorized distributors.
                        </p>
                    </div>
                    {/* Feature 3 */}
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fa-solid fa-truck-fast text-2xl"></i>
                        </div>
                        <h4 className="text-xl font-semibold text-primary mb-2">
                            Delivery to your door
                        </h4>
                        <p className="text-gray-600 leading-relaxed">
                            Fast, reliable, and secure delivery, bringing
                            technology right to your doorstep.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
