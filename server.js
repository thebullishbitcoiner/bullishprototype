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

const distDir = path.join(__dirname, 'dist');
const publicDir = path.join(__dirname, 'public');
const staticDir = fs.existsSync(distDir) ? distDir : publicDir;

// Serve static files (prefer Vite build output)
app.use(express.static(staticDir));

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Define a route for the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(staticDir, 'index.html'));
});

// Define routes for all HTML pages to handle direct access
app.get('/lnurl-verify', (req, res) => {
    console.log('LNURL-verify route accessed');
    const filePath = path.join(staticDir, 'lnurl-verify.html');
    console.log('File path:', filePath);
    console.log('File exists:', fs.existsSync(filePath));
    res.sendFile(filePath);
});

app.get('/lnurl-verify.html', (req, res) => {
    console.log('LNURL-verify.html route accessed');
    const filePath = path.join(staticDir, 'lnurl-verify.html');
    console.log('File path:', filePath);
    console.log('File exists:', fs.existsSync(filePath));
    res.sendFile(filePath);
});

app.get('/twentyuno', (req, res) => {
    res.sendFile(path.join(staticDir, 'twentyuno.html'));
});

app.get('/bitcoin-connect', (req, res) => {
    res.sendFile(path.join(staticDir, 'bitcoin-connect.html'));
});

app.get('/bitcoin-qr', (req, res) => {
    res.sendFile(path.join(staticDir, 'bitcoin-qr.html'));
});

app.get('/ndk', (req, res) => {
    res.sendFile(path.join(staticDir, 'ndk.html'));
});

app.get('/nostr', (req, res) => {
    res.sendFile(path.join(staticDir, 'nostr.html'));
});

app.get('/nwc', (req, res) => {
    res.sendFile(path.join(staticDir, 'nwc.html'));
});

// Catch-all route for debugging
app.get('*', (req, res) => {
    console.log('404 - Requested URL:', req.url);
    console.log('Current directory:', __dirname);
    console.log('Static directory:', staticDir);
    
    fs.readdir(staticDir, (err, files) => {
        if (err) {
            console.error('Error reading static directory:', err);
        } else {
            console.log('Available files:', files);
        }
    });
    
    res.status(404).send(`Page not found: ${req.url}<br>Current directory: ${__dirname}<br>Static directory: ${staticDir}`);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log(`Static directory: ${staticDir}`);
    console.log('Available files in static directory:');
    fs.readdir(staticDir, (err, files) => {
        if (err) {
            console.error('Error reading static directory:', err);
        } else {
            console.log(files);
        }
    });
});
