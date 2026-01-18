import React, { useState, useEffect } from 'react';
import pkg from '../../package.json' with { type: 'json' };

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState('');

    useEffect(() => {
        // Set active link based on current page
        const page = window.location.pathname.split('/').pop() || 'index.html';
        setCurrentPage(page);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        document.body.style.overflow = isMenuOpen ? '' : 'hidden';
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
        document.body.style.overflow = '';
    };

    const navItems = [
        { href: 'twentyuno.html', label: 'TwentyUno' },
        { href: 'bitcoin-connect.html', label: 'Bitcoin Connect' },
        { href: 'lnurl-verify.html', label: 'LNURL-verify' },
        { href: 'bitcoin-qr.html', label: 'Bitcoin QR' },
        { href: 'ndk.html', label: 'NDK' },
        { href: 'clink.html', label: 'CLINK' }
    ];

    return (
        <nav className="navbar bg-black w-100">
            <div className="container-fluid">
                <a className="navbar-brand" href="index.html">
                    bullishPrototype <small className="text-muted" style={{ fontSize: '0.6em' }}>v{pkg.version}</small>
                </a>
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    aria-controls="navbarSupportedContent" 
                    aria-expanded={isMenuOpen}
                    onClick={toggleMenu}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarSupportedContent">
                    <button className="close-btn" aria-label="Close menu" onClick={closeMenu}>×</button>
                    <ul className="navbar-nav mb-2 mb-lg-0">
                        {navItems.map(item => (
                            <li className="nav-item" key={item.href}>
                                <a 
                                    className={`nav-link ${currentPage === item.href ? 'active' : ''}`}
                                    href={item.href}
                                    onClick={closeMenu}
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
}