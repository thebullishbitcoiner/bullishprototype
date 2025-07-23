import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

// Use CORS middleware
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static('public'));

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Define a route for the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Define routes for all HTML pages to handle direct access
app.get('/lnurl-verify', (req, res) => {
    console.log('LNURL-verify route accessed');
    const filePath = path.join(__dirname, 'public', 'lnurl-verify.html');
    console.log('File path:', filePath);
    console.log('File exists:', fs.existsSync(filePath));
    res.sendFile(filePath);
});

app.get('/lnurl-verify.html', (req, res) => {
    console.log('LNURL-verify.html route accessed');
    const filePath = path.join(__dirname, 'public', 'lnurl-verify.html');
    console.log('File path:', filePath);
    console.log('File exists:', fs.existsSync(filePath));
    res.sendFile(filePath);
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
    console.log('Current directory:', __dirname);
    console.log('Public directory:', path.join(__dirname, 'public'));
    
    const publicDir = path.join(__dirname, 'public');
    fs.readdir(publicDir, (err, files) => {
        if (err) {
            console.error('Error reading public directory:', err);
        } else {
            console.log('Available files:', files);
        }
    });
    
    res.status(404).send(`Page not found: ${req.url}<br>Current directory: ${__dirname}<br>Public directory: ${path.join(__dirname, 'public')}`);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log(`Public directory: ${path.join(__dirname, 'public')}`);
    console.log('Available files in public directory:');
    fs.readdir(path.join(__dirname, 'public'), (err, files) => {
        if (err) {
            console.error('Error reading public directory:', err);
        } else {
            console.log(files);
        }
    });
});
