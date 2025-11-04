const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.svg': 'image/svg+xml'
};

http.createServer((req, res) => {
    let filePath = req.url === '/' ? './index.html' : '.' + req.url;
    // SPA routes
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'text/html';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            fs.readFile('./index.html', (err, content) => {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
            });
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
}).listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});