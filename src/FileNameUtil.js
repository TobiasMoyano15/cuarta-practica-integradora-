import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import fs from 'node:fs'


// __dirname funcionality
const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename);