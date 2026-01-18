import React from 'react';
import { createRoot } from 'react-dom/client';
import { Navbar } from '../components/Navbar.jsx';

// Render navbar immediately for faster perceived load
const navbarContainer = document.getElementById('navbar');
if (navbarContainer) {
    const navbarRoot = createRoot(navbarContainer);
    navbarRoot.render(<Navbar />);
}

// Then render the rest of the page
const mainContent = document.getElementById('main-content');
if (mainContent) {
    const mainRoot = createRoot(mainContent);
    mainRoot.render(
        <div dangerouslySetInnerHTML={{ __html: mainContent.innerHTML }} />
    );
}