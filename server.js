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

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
