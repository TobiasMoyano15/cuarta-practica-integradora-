import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// funcionalidad __dirname con type: "module" 
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(dirname(__filename), '..');

export default __dirname