import React from 'react';
import { Navbar } from './Navbar.jsx';

export function Layout({ children }) {
    return (
        <>
            <Navbar />
            {children}
        </>
    );
}