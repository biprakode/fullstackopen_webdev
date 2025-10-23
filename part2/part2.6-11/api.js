import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // Required for ESM pathing

// Define __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read and parse the db.json file
const dataPath = path.join(__dirname, 'db.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// This exposes the data for GET requests
export default data;    