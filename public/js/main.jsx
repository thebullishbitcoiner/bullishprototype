import React from 'react';
import { createRoot } from 'react-dom/client';
import { Navbar } from '../components/Navbar.jsx';

// Render navbar immediately for faster perceived load
const navbarContainer = document.getElementById('navbar');
if (navbarContainer) {
    const navbarRoot = createRoot(navbarContainer);
    navbarRoot.render(<Navbar />);
}

// Then render the rest of the page (skip when vanilla JS owns #main-content, e.g. LNURL-verify)
const mainContent = document.getElementById('main-content');
if (mainContent && !document.getElementById('invoiceForm')) {
    const mainRoot = createRoot(mainContent);
    mainRoot.render(
        <div dangerouslySetInnerHTML={{ __html: mainContent.innerHTML }} />
    );
}