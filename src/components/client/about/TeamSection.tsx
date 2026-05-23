export default function TeamSection() {
    const teamMembers = [
        { name: 'John Doe', title: 'CEO & Founder', image: 'https://placehold.co/128x128/e0e7ff/3730a3?text=CEO' },
        { name: 'Jane Smith', title: 'Chief Technology Officer', image: 'https://placehold.co/128x128/e0f2fe/0891b2?text=CTO' },
        { name: 'Cody Fisher', title: 'Lead Developer', image: 'https://placehold.co/128x128/dcfce7/16a34a?text=Lead' },
        { name: 'Robert Fox', title: 'UX/UI Designer', image: 'https://placehold.co/128x128/fef3c7/f59e0b?text=UX' },
    ];

    return (
        <section className="py-12 lg:py-16 bg-gray-50">
            <div className="container max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-primary">Meet Our Team</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">The talented individuals behind VastVerse&apos;s
                        success</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {teamMembers.map((member, index) => (
                        <div className="team-card" key={index}>
                            <div className="relative w-32 h-32 mx-auto">
                                <img src={member.image} alt={member.name}
                                    className="w-full h-full rounded-full object-cover border-4 border-white shadow-md" />
                            </div>
                            <h3 className="mt-4 text-xl font-semibold text-primary">{member.name}</h3>
                            <p className="text-blue-600 font-medium">{member.title}</p>
                            <div className="mt-4 flex justify-center gap-4 text-gray-400">
                                <a href="#" className="hover:text-blue-600 transition-colors"><i
                                    className="fa-brands fa-twitter"></i></a>
                                <a href="#" className="hover:text-blue-600 transition-colors"><i
                                    className="fa-brands fa-linkedin-in"></i></a>
                                <a href="#" className="hover:text-blue-600 transition-colors"><i
                                    className="fa-brands fa-github"></i></a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}