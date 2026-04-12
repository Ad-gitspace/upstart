const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const CONTRIBUTIONS_DIR = path.join(__dirname, 'contributions');

// Ensure contributions directory exists
if (!fs.existsSync(CONTRIBUTIONS_DIR)) {
    fs.mkdirSync(CONTRIBUTIONS_DIR, { recursive: true });
}

// MIME types mapping
const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    // Handle API preflight request (CORS if needed, though we are on the same origin here)
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end();
        return;
    }

    // Handle contribute endpoint
    if (req.method === 'POST' && req.url === '/api/contribute') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const safeName = (data.Name || 'Unknown').replace(/[^a-z0-9]/gi, '_').toLowerCase();
                const filename = `${timestamp}_${safeName}.json`;
                const filePath = path.join(CONTRIBUTIONS_DIR, filename);

                fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
                    if (err) {
                        console.error('Error saving contribution:', err);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Failed to save contribution.' }));
                        return;
                    }

                    console.log(`Saved new contribution: ${filename}`);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Contribution received successfully.', filename }));
                });
            } catch (err) {
                console.error('Invalid JSON received:', err);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid data format.' }));
            }
        });
        return;
    }

    // Serve static files
    let requestUrl = req.url === '/' ? '/index.html' : req.url;
    // Remove query params if any
    requestUrl = requestUrl.split('?')[0];
    // Decode URI to handle spaces (%20) in file/folder names
    requestUrl = decodeURI(requestUrl);
    
    const filePath = path.join(__dirname, requestUrl);
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    // Prevent directory traversal
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });

});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`Contributions will be saved to ${CONTRIBUTIONS_DIR}`);
});
