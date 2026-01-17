# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

bullishPrototype is an experimental web application for Bitcoin and Lightning Network tools, featuring:
- Bitcoin payment integrations (TwentyUno widgets, Bitcoin Connect, LNURL-verify)
- Nostr protocol implementations (NDK, Nostr Wallet Connect, CLINK)
- QR code generation for Bitcoin addresses
- Dark theme with orange (#ff9900) accents throughout

## Development Commands

### Local Development
```bash
npm install                 # Install dependencies
npm run dev                 # Start Vite dev server on port 5173
npm run build              # Build for production (output to dist/)
npm run preview            # Preview production build
node server.js             # Start Express server on port 3001 (alternative dev server)
```

### Architecture Overview

**Build Tool**: Vite 5.x with ES modules
**Frontend**: Vanilla JavaScript with ES modules, Bootstrap 5.3.3
**Server**: Express.js (development/testing only, not for production)
**Deployment**: Vercel with custom routing configuration

#### File Structure
```
public/                         # All web-accessible files (Vite root)
├── index.html                  # Home page
├── twentyuno.html              # TwentyUno payment widgets
├── bitcoin-connect.html        # Bitcoin Connect demo
├── bitcoin-qr.html            # Bitcoin QR code generator
├── lnurl-verify.html          # Lightning invoice verification
├── ndk.html                   # Nostr Development Kit demo
├── clink.html                 # CLINK (Bitcoin Offers via Nostr)
├── nwc.html                   # Nostr Wallet Connect
├── nostr.html                 # Nostr tools
├── js/
│   ├── common.js              # Initializes navbar on all pages
│   ├── navbar.js              # Shared navigation component
│   ├── ndk-demo.js            # NDK functionality
│   ├── lnurl-verify.js        # LNURL verification logic
│   ├── clink.js               # CLINK SDK integration
│   ├── utils.js               # Shared utilities (Nostr key management)
│   └── script.js              # Legacy scripts
├── css/
│   └── dark-theme.css         # Custom dark theme overrides
├── bootstrap-5.3.3/           # Bundled Bootstrap (not from CDN)
└── images/                    # Static assets

vite.config.js                 # Multi-page app configuration
server.js                      # Express dev server (ports 3001)
vercel.json                    # Vercel deployment routes
```

#### Multi-Page Application Setup
The app uses Vite's multi-page configuration. All HTML pages are defined in `vite.config.js` rollupOptions.input. When adding new pages:
1. Create the HTML file in `public/`
2. Add the page to `vite.config.js` input object
3. Add route mapping in `vercel.json` (for clean URLs)
4. Add route in `server.js` if using Express

#### Navbar System
All pages include `<div id="navbar"></div>` which is populated by `navbar.js` via `common.js`. The navbar:
- Reads version from `package.json` using JSON import assertions
- Highlights the active page based on current URL
- Includes mobile hamburger menu functionality
- Uses centralized navigation links

#### Key Dependencies
- **@nostr-dev-kit/ndk**: Nostr protocol implementation
- **@getalby/lightning-tools**: Lightning Address and invoice handling
- **@shocknet/clink-sdk**: Bitcoin Offers over Nostr
- **Bootstrap 5.3.3**: UI framework (bundled, not CDN)
- **Vite**: Build tool and dev server

#### Styling System
- Base: Bootstrap 5.3.3 with `data-bs-theme="dark"`
- Custom: `css/dark-theme.css` overrides Bootstrap variables
- Colors: Black (#000000) background, white (#ffffff) text, orange (#ff9900) accents
- All form controls, cards, and components styled consistently dark

## Common Development Patterns

### Adding a New Page
1. Create `public/new-page.html` with standard structure:
```html
<!DOCTYPE html>
<html lang="en" data-bs-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link rel="stylesheet" href="bootstrap-5.3.3/css/bootstrap.min.css" />
  <link rel="stylesheet" href="css/dark-theme.css" />
  <title>Page Title - bullishPrototype</title>
</head>
<body>
  <div id="navbar"></div>
  <div class="container">
    <!-- Content here -->
  </div>
  <script src="bootstrap-5.3.3/js/bootstrap.bundle.min.js"></script>
  <script type="module" src="js/common.js"></script>
</body>
</html>
```

2. Update `vite.config.js`:
```javascript
input: {
  // ... existing entries
  newPage: resolve(__dirname, 'public/new-page.html')
}
```

3. Update `vercel.json` for clean URLs:
```json
{
  "src": "/new-page",
  "dest": "/new-page.html"
}
```

4. Add to navbar in `navbar.js`:
```javascript
<li class="nav-item"><a class="nav-link" href="new-page.html">New Page</a></li>
```

### Module Import Patterns
This codebase uses ES modules with import maps and CDN imports:
- NPM packages: Import from `node_modules` (e.g., `@nostr-dev-kit/ndk`)
- External CDN: Import from `https://esm.sh/` or `https://unpkg.com/`
- Local modules: Import from `./js/` with `.js` extension

### JSON Import Issue
**IMPORTANT**: `navbar.js` uses deprecated `assert { type: 'json' }` syntax for package.json imports. This may break in future Node.js versions. When modifying, consider:
- Using dynamic import with `await import('./package.json', { with: { type: 'json' } })`
- Or fetching package.json at build time via Vite plugin

### Lightning Network Integration
For Lightning functionality:
- Use `@getalby/lightning-tools` for LNURL and Lightning Address
- Invoice verification pattern is in `lnurl-verify.js`
- Standard flow: Create invoice → Display payment request → Verify payment → Show preimage

### Nostr Integration
- NDK instance created with explicit relay URLs (Damus, Nostr Band, Primal)
- Client private key management in `utils.js` (stored in localStorage)
- Event subscription pattern in `ndk-demo.js`
- CLINK offers use ephemeral keys for privacy

## Important Notes

### Hardcoded Values to Be Aware Of
- Lightning addresses: `thebullishbitcoiner@getalby.com` and `bullish@getalby.com` (in multiple files)
- NWC connection string in `nwc.html` (contains secrets)
- Default CLINK offer in `clink.js`
- Server port 3001 in `server.js`
- Vite dev server port 5173 in `vite.config.js`

### Security Considerations
- Private keys are generated client-side and stored in localStorage
- No server-side payment verification (trust client verification)
- NWC connection secrets are embedded in HTML (appropriate for demo, not production)
- No rate limiting on invoice creation

### Known Issues (from REFACTORING_SUGGESTIONS.md)
1. Typo in `bitcoin-qr.html` line 85: "YESTR" should be "YES"
2. Deprecated JSON import syntax in `navbar.js`
3. Large inline scripts in some HTML files (should be extracted)
4. No tests, linting, or type checking configured
5. Mix of CDN and npm package imports (consider standardizing)

### Deployment
- Production: Vercel (configured via `vercel.json`)
- Vercel handles static hosting and routing
- `server.js` is NOT used in production
- Build output goes to `dist/` directory

### Mobile Considerations
- All pages include `maximum-scale=1.0, user-scalable=no` viewport settings
- Hamburger menu implemented with custom JavaScript (not Bootstrap default)
- Mobile menu closes on: link click, close button click, or outside click
- Dark theme optimized for mobile viewing

## When Making Changes

### Adding Bitcoin/Lightning Features
- Follow existing patterns in `lnurl-verify.js` for invoice handling
- Use consistent error display (create alert divs, don't use `alert()`)
- Test with small amounts first
- Consider mobile UX (QR codes, copy buttons)

### Modifying Navbar
- Edit `navbar.js` for link changes
- Version number auto-updates from `package.json`
- Mobile menu logic is in `setupMobileMenu()` function
- Active page highlighting is automatic based on URL

### Styling Changes
- Override Bootstrap variables in `dark-theme.css`
- Maintain black background, white text, orange accent consistency
- Use `!important` sparingly (already used extensively for dark theme)
- Test on mobile (responsive design is critical)

### Adding Dependencies
- Prefer npm packages over CDN for better bundling
- Update `package.json` and run `npm install`
- Vite will bundle npm packages automatically
- For external scripts (like TwentyUno), use CDN script tags

## Testing
Currently no automated tests. When testing manually:
- Test all pages load correctly
- Verify navbar on each page
- Test mobile menu functionality
- Test Lightning invoice creation and verification
- Test Nostr event subscriptions
- Verify QR code generation
- Check console for errors

## Future Improvements
See `REFACTORING_SUGGESTIONS.md` for detailed list. High priority items:
- Fix JSON import deprecation warning
- Add environment variables for configurable values
- Extract inline JavaScript to separate modules
- Add ESLint and Prettier
- Create shared utilities for duplicated code
- Add proper error handling and validation
