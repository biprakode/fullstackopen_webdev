const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3002; // Using 3002 to avoid persistent 3001 conflicts
const DB_PATH = path.join(__dirname, 'db.json');

// --- Helper Functions ---

// Function to read the database content
const readDB = () => {
    try {
        const rawData = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(rawData);
    } catch (error) {
        console.error("Failed to read/parse db.json:", error.message);
        // Return an empty structure if file is missing or corrupted
        return { persons: [] };
    }
};

// Function to write the database content
const writeDB = (data) => {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Failed to write to db.json:", error.message);
    }
};

// --- HTTP Request Handler ---

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    // 1. CORS Headers (Must be first for all responses)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle CORS preflight (OPTIONS)
    if (method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Routing only for the '/persons' endpoint
    if (url.startsWith('/persons')) {
        let db = readDB();
        
        if (method === 'GET') {
            const idMatch = url.match(/^\/persons\/(\d+)$/);
            if (idMatch) {
                // GET by ID: /persons/1
                const id = idMatch[1];
                const person = db.persons.find(p => p.id === id);
                if (person) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(person));
                } else {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('Person not found.');
                }
            } else if (url === '/persons') {
                // GET ALL: /persons
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(db.persons));
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found.');
            }
        } 
        
        // Handle methods that require a body (POST, PUT, DELETE)
        else if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
            let body = '';
            
            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', () => {
                try {
                    const idMatch = url.match(/^\/persons\/(\d+)$/);
                    let responseData = {};

                    if (method === 'POST') {
                        // POST: Create new person
                        const newPerson = JSON.parse(body);
                        const newId = String(db.persons.length > 0 ? Math.max(...db.persons.map(p => Number(p.id))) + 1 : 1);
                        const personWithId = { ...newPerson, id: newId };
                        db.persons.push(personWithId);
                        responseData = personWithId;
                        res.writeHead(201, { 'Content-Type': 'application/json' });

                    } else if (method === 'PUT' && idMatch) {
                        // PUT: Update existing person
                        const id = idMatch[1];
                        const updatedData = JSON.parse(body);
                        const index = db.persons.findIndex(p => p.id === id);
                        
                        if (index !== -1) {
                            db.persons[index] = { ...db.persons[index], ...updatedData };
                            responseData = db.persons[index];
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                        } else {
                            res.writeHead(404, { 'Content-Type': 'text/plain' });
                            return res.end('Person not found for update.');
                        }
                    
                    } else if (method === 'DELETE' && idMatch) {
                        // DELETE: Remove person
                        const id = idMatch[1];
                        const initialLength = db.persons.length;
                        db.persons = db.persons.filter(p => p.id !== id);
                        
                        if (db.persons.length < initialLength) {
                             res.writeHead(204); // No Content
                        } else {
                             res.writeHead(404, { 'Content-Type': 'text/plain' });
                             return res.end('Person not found for deletion.');
                        }

                    } else {
                        res.writeHead(400, { 'Content-Type': 'text/plain' });
                        return res.end('Invalid request.');
                    }

                    writeDB(db); // Save changes to disk
                    res.end(JSON.stringify(responseData));

                } catch (error) {
                    console.error("Processing Error:", error);
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end('Bad Request or Internal Server Error.');
                }
            });
        }
    } else {
        // 404 for all other paths
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Resource Not Found');
    }
});

// Start listening
server.listen(PORT, '0.0.0.0', () => {
    console.log(`\n✅ Phonebook API now running robustly on http://localhost:${PORT}/persons\n`);
    console.log('Stop server with Ctrl+C.');
});
