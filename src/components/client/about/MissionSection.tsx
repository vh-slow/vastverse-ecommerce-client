export default function MissionSection() {
  return (
    <>
      <section className="py-12 lg:py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="aspect-w-4 aspect-h-3 rounded-xl overflow-hidden shadow-lg">
              <img src="/images/about/about-content-1.jpg" alt="Close-up of a modern laptop keyboard"
                className="w-full h-full object-cover" />
            </div>

            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-primary">Technology that inspires a better way of
                life.</h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                We&apos;re passionate about how technology can enhance and simplify modern living. Our mission is
                to curate a collection of smart, intuitive, and powerful devices that seamlessly integrate
                into your daily routine.
              </p>
              <div className="mt-8">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-primary">Customer Satisfaction</span>
                  <span className="text-sm font-medium text-primary">98%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '98%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-white">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-primary">Quality in every detail.</h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                From stunning display clarity to long-lasting battery life, we focus on the details that
                matter. Each product is tested and selected to ensure it meets our high standards of
                performance, durability, and design.
              </p>

              <div className="mt-8 space-y-6 border-t border-gray-200 pt-6">
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-blue-100 rounded-lg text-blue-600">
                    <i className="fa-solid fa-gem"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary">Premium Materials</h3>
                    <p className="mt-1 text-gray-600 text-sm">We select only the finest components to ensure
                      longevity and a premium feel.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-green-100 rounded-lg text-green-600">
                    <i className="fa-solid fa-microscope"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary">Rigorous Testing</h3>
                    <p className="mt-1 text-gray-600 text-sm">Each device undergoes extensive testing to
                      guarantee flawless performance.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-purple-100 rounded-lg text-purple-600">
                    <i className="fa-solid fa-compass-drafting"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary">User-Centric Design</h3>
                    <p className="mt-1 text-gray-600 text-sm">Our design philosophy places user experience
                      at the forefront of everything we create.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="aspect-w-4 aspect-h-3 rounded-xl overflow-hidden">
              <img src="/images/about/about-content-2.jpg"
                alt="A sleek and modern computer monitor on a clean desk"
                className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}