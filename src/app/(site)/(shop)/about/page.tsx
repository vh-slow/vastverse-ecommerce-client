import AboutHeroSection from '@/src/components/client/about/HeroSection';
import MissionSection from '@/src/components/client/about/MissionSection';
import TeamSection from '@/src/components/client/about/TeamSection';
import PageHeader from '@/src/components/client/PageHeader';
import React from 'react';

export default function AboutUsPage() {
    const breadcrumbs = [{ name: 'Home', href: '/' }, { name: 'About Us' }];

    return (
        <>
            <PageHeader title="About Us" breadcrumbs={breadcrumbs} />

            <AboutHeroSection />
            <MissionSection />
            <TeamSection />

            <section className="py-12 lg:py-16 bg-white">
                <div className="container max-w-5xl mx-auto px-4">
                    <div className="bg-blue-600 rounded-xl p-12 text-center text-white shadow-lg shadow-blue-200">
                        <h2 className="text-3xl lg:text-4xl font-bold">
                            Join Our Team
                        </h2>
                        <p className="mt-4 max-w-2xl mx-auto">
                            We&apos;re always looking for talented individuals
                            who are passionate about technology. If you&apos;re
                            ready to make an impact, we&apos;d love to hear from
                            you.
                        </p>
                        <a
                            href="#"
                            className="mt-8 inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            View Open Positions
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
