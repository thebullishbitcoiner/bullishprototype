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
                        <li style={{ 
                            listStyle: 'none',
                            padding: '0',
                            backgroundColor: 'transparent'
                        }}>
                            <span style={{
                                display: 'block',
                                height: '2px',
                                width: '50%',
                                backgroundColor: '#ff9900',
                                margin: '1rem auto'
                            }}></span>
                        </li>
                        <li className="nav-item">
                            <a 
                                className="nav-link d-flex align-items-center justify-content-center"
                                href="https://github.com/thebullishbitcoiner/bullishprototype"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={closeMenu}
                                title="View on GitHub"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}