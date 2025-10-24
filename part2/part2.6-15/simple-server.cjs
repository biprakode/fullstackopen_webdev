const http = require('http');
const fs = require('fs');
const path = require('path'); // Used to resolve file paths

const port = 3001;
const dbPath = path.join(__dirname, 'db.json');

const server = createServer((req, res) => {
    // 1. Set CORS Headers for ALL requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle CORS preflight requests (OPTIONS method)
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // 2. Handle GET Requests (Fetching data)
    if (req.url === '/persons' && req.method === 'GET') {
        try {
            const data = readFileSync(dbPath, 'utf8');
            const db = JSON.parse(data);
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            // Send only the 'persons' array
            res.end(JSON.stringify(db.persons));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error reading or parsing db.json');
        }
        return;
    }

    // 3. Handle POST Requests (Adding new data)
    if (req.url === '/persons' && req.method === 'POST') {
        let body = '';
        
        // Read the request body data stream
        req.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });

        req.on('end', () => {
            try {
                const newPerson = JSON.parse(body);

                // Read existing data
                const rawData = readFileSync(dbPath, 'utf8');
                const db = JSON.parse(rawData);

                // Assign a simple, unique ID (Crucial for a mock server)
                const newId = String(Date.now()); // Simple unique ID
                const personWithId = { ...newPerson, id: newId };

                // Add to the persons array
                db.persons.push(personWithId);

                // Write the entire updated object back to db.json (Persistence)
                writeFileSync(dbPath, JSON.stringify(db, null, 2));

                // Send the new object back as the response
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(personWithId));

            } catch (err) {
                console.error("POST Error:", err);
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Invalid request body or server error.');
            }
        });
        return;
    }

    // 4. Handle 404 Not Found
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
});

server.listen(port, () => {
    console.log(`Simple static server running on http://localhost:${port}`);
});