'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function Footer() {
    const { t } = useTranslation('client');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const quickLinks = t('shop.footer.quickLinks', {
        returnObjects: true,
    }) as Array<{ label: string; href: string }>;

    const supportLinks = t('shop.footer.supportLinks', {
        returnObjects: true,
    }) as Array<{ label: string; href: string }>;

    const offices = t('shop.footer.offices', {
        returnObjects: true,
    }) as string[];

    return (
        <footer>
            {/* FOOTER TOP */}
            <div className="footer-top">
                <div className="footer-shape-1"></div>
                <div className="footer-shape-2"></div>
                <div className="container">
                    <div className="footer-grid">
                        {/* COLUMN 1: Logo & Store Locations */}
                        <div className="footer-col">
                            <Link href="/" className="footer-logo">
                                <img
                                    src="/images/logo.png"
                                    alt="Logo"
                                    className="logo-img"
                                />
                                <span className="logo-text">VastVerse</span>
                            </Link>
                            <h4 className="footer-col-title store-title">
                                {t('shop.footer.store_locations')}
                            </h4>
                            <ul className="store-list">
                                {offices.map((office, index) => (
                                    <li key={index}>
                                        <strong>
                                            {String(index + 1).padStart(2, '0')}
                                            .
                                        </strong>{' '}
                                        {office}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* COLUMN 2: Quick Links */}
                        <div className="footer-col">
                            <h4 className="footer-col-title">
                                {t('shop.footer.quick_links')}
                            </h4>
                            <ul className="footer-links">
                                {quickLinks.map((link, index) => (
                                    <li key={index}>
                                        <Link href={link.href}>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* COLUMN 3: Customer Support */}
                        <div className="footer-col">
                            <h4 className="footer-col-title">
                                {t('shop.footer.customer_support')}
                            </h4>
                            <ul className="footer-links">
                                {supportLinks.map((link, index) => (
                                    <li key={index}>
                                        <Link href={link.href}>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* COLUMN 4: Newsletter */}
                        <div className="footer-col">
                            <h4 className="footer-col-title">
                                {t('shop.footer.newsletter_title')}
                            </h4>
                            <p className="newsletter-text">
                                {t('shop.footer.newsletter_desc')}
                            </p>
                            <form
                                className="newsletter-form"
                                onSubmit={(e) => e.preventDefault()}
                            >
                                <input
                                    type="email"
                                    placeholder={t(
                                        'shop.footer.email_placeholder'
                                    )}
                                    required
                                />
                                <button type="submit">
                                    {t('shop.footer.subscribe')}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* FOOTER BOTTOM */}
            <div className="footer-bottom">
                <div className="container footer-bottom-flex">
                    <p className="copyright">
                        &copy; {new Date().getFullYear()}{' '}
                        {t('shop.footer.copyright')}
                    </p>

                    <div className="payment-methods">
                        <img
                            src="/images/payment/payment-01.svg"
                            alt="PayPal"
                            title="PayPal"
                        />
                        <img
                            src="/images/payment/payment-02.svg"
                            alt="Visa"
                            title="Visa"
                        />
                        <img
                            src="/images/payment/payment-03.svg"
                            alt="Mastercard"
                            title="Mastercard"
                        />
                        <img
                            src="/images/payment/payment-04.svg"
                            alt="American Express"
                            title="American Express"
                        />
                        <img
                            src="/images/payment/payment-05.svg"
                            alt="Discover"
                            title="Discover"
                        />
                    </div>

                    <div className="social-links">
                        <span>{t('shop.footer.follow_us')}</span>
                        <a href="#" title="Facebook">
                            <i className="fa-brands fa-facebook-f"></i>
                        </a>
                        <a href="#" title="Twitter">
                            <i className="fa-brands fa-twitter"></i>
                        </a>
                        <a href="#" title="Instagram">
                            <i className="fa-brands fa-instagram"></i>
                        </a>
                        <a href="#" title="LinkedIn">
                            <i className="fa-brands fa-linkedin-in"></i>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
