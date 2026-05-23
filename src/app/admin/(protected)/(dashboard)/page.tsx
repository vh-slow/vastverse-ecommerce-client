'use client';

import Header from '@/src/components/admin/Header';
import React, { useEffect, useState, useCallback } from 'react';

export default function AdminDashboardPage() {
    const breadcrumbs = [
        { name: 'Admin', href: '/admin' },
        { name: 'Dashboard' },
    ];

    return (
        <>
            <Header title="Tổng quan Hệ thống" breadcrumbs={breadcrumbs} />
        </>
    );
}
