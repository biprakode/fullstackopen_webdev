const http = require("http");
const fs = require("fs");

const PORT = 3002;
const DB_FILE = "./db.json";

function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ persons: [] }, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

function writeDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function getBody(req, cb) {
  let body = "";
  req.on("data", chunk => body += chunk);
  req.on("end", () => cb(body ? JSON.parse(body) : {}));
}

http.createServer((req , res) => {
    const {method , url} = req;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (method === "OPTIONS") return res.end();
    const match = url.match(/^\/persons\/?(\d+)?$/); // brain regex
    if (!match) {
        res.writeHead(404);
        return res.end("Not Found");
    }

    const id = match[1];
    const db = readDB();

    if (method == "GET") {
        if (id) {
            const person = db.persons.find(p => p.id == id);
            if (!person) {
                res.writeHead(404);
                return res.end("Not Found");
            }
            return res.end(JSON.stringify(person));
        }
        return res.end(JSON.stringify(db.persons))
    }

    if(method == "POST") {
        return getBody(req , data => {
            data.id = String(Date.now());
            db.persons.push(data);
            writeDB(data);
            res.writeHead(201);
            res.end(JSON.stringify(data));
        });
    }

    if (method === "PUT" && id) {
        return getBody(req, data => {
            const i = db.persons.findIndex(p => p.id == id);
            if (i === -1) {
                res.writeHead(404);
                return res.end("Not Found");
            }
            db.persons[i] = { ...db.persons[i], ...data };
            writeDB(db);
            res.end(JSON.stringify(db.persons[i]));
        });
    }

    if (method === "DELETE" && id) {
        db.persons = db.persons.filter(p => p.id != id);
        writeDB(db);
        res.writeHead(204);
        return res.end();
    }

    res.writeHead(400);
    res.end("Bad Request");
}).listen(PORT , () => {
    console.log("API running → http://localhost:${PORT}/persons")
});