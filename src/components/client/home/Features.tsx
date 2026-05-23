'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Features() {
    const { t } = useTranslation('client');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const features = t('shop.home.features', { returnObjects: true }) as Array<{
        title: string;
        subtitle: string;
        icon: string;
        alt: string;
    }>;
    return (
        <section className="features-section">
            <div className="container">
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-item">
                            <div className="feature-icon-wrapper">
                                <img
                                    src={feature.icon}
                                    alt={feature.alt}
                                    className="feature-icon"
                                />
                            </div>
                            <div className="feature-text">
                                <h3 className="feature-title">
                                    {feature.title}
                                </h3>
                                <p className="feature-subtitle">
                                    {feature.subtitle}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
