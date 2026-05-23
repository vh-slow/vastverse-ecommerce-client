import React from 'react';
import Link from 'next/link';

interface Breadcrumb {
    name: string;
    href?: string;
}

interface PageHeaderProps {
    title: string;
    breadcrumbs: Breadcrumb[];
}

export default function PageHeader({ title, breadcrumbs }: PageHeaderProps) {
    return (
        <section className="page-header bg-white">
            <div className="container flex justify-between items-center">
                <h1 className="page-title">{title}</h1>
                <nav className="breadcrumb">
                    {breadcrumbs.map((item, index) => (
                        <React.Fragment key={index}>
                            {item.href ? (
                                <Link href={item.href}>{item.name}</Link>
                            ) : (
                                <span className="active">{item.name}</span>
                            )}
                            {index < breadcrumbs.length - 1 && (
                                <span className="separator">/</span>
                            )}
                        </React.Fragment>
                    ))}
                </nav>
            </div>
        </section>
    );
}
