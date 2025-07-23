const express = require('express');
const cors = require('cors'); // Import the cors package
const path = require('path');
const app = express();
const port = 3001;

// Use CORS middleware
app.use(cors()); // This will enable CORS for all routes

// Serve static files from the "public" directory
app.use(express.static('public'));

// Define a route for the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Define routes for all HTML pages to handle direct access
app.get('/lnurl-verify', (req, res) => {
    console.log('LNURL-verify route accessed');
    res.sendFile(path.join(__dirname, 'public', 'lnurl-verify.html'));
});

app.get('/lnurl-verify.html', (req, res) => {
    console.log('LNURL-verify.html route accessed');
    res.sendFile(path.join(__dirname, 'public', 'lnurl-verify.html'));
});

app.get('/twentyuno', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'twentyuno.html'));
});

app.get('/bitcoin-connect', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'bitcoin-connect.html'));
});

app.get('/bitcoin-qr', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'bitcoin-qr.html'));
});

app.get('/ndk', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ndk.html'));
});

app.get('/nostr', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'nostr.html'));
});

app.get('/nwc', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'nwc.html'));
});

// Catch-all route for debugging
app.get('*', (req, res) => {
    console.log('404 - Requested URL:', req.url);
    console.log('Available files in public directory:');
    const fs = require('fs');
    const publicDir = path.join(__dirname, 'public');
    fs.readdir(publicDir, (err, files) => {
        if (err) {
            console.error('Error reading public directory:', err);
        } else {
            console.log('Files:', files);
        }
    });
    res.status(404).send('Page not found: ' + req.url);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
