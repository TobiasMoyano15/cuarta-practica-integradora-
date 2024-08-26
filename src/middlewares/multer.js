import multer from 'multer';
import fs from 'fs';
import path from 'path';
import __dirname from '../utils/filenameUtils.js';
import { logger } from '../utils/logger.js';

// const folders = {
//     profile: 'profiles',
//     products: 'products',
//     documents: 'documents'
// };

// const ensureDirectoryExists = (folderPath) => {
//     if (!fs.existsSync(folderPath)) {
//         fs.mkdirSync(folderPath, { recursive: true });
//     }
// };

// const storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         const folder = folders[file.fieldname];
//         const uploadFolder = `src/public/uploads/${req.params.uid}/${folder}`;
        
//         ensureDirectoryExists(uploadFolder);

//         callback(null, uploadFolder);
//     },
//     filename: (req, file, callback) => {
//         const suffix = req.body.suffix ? `-${req.body.suffix}` : '';
//         const uniqueFilename = `${Date.now()}-${file.originalname.split('.')[0]}${suffix}.${file.mimetype.split('/')[1]}`;
//         callback(null, uniqueFilename);
//     },
// });

// const uploader = multer({
//     storage,
//     onError: (err, next) => {
//         logger.error('Multer Error:', err);
//         next(err);
//     }
// }).fields([
//     { name: 'profile' },
//     { name: 'products' },
//     { name: 'documents' }
// ]);

// export default uploader;

const folders = {
    profile: 'profiles',
    products: 'products',
    documents: 'documents'
};

const ensureDirectoryExists = (folderPath) => {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const folder = folders[file.fieldname];
        const uploadFolder = `src/public/uploads/${req.params.uid}/${folder}`;
        
        ensureDirectoryExists(uploadFolder);

        callback(null, uploadFolder);
    },
    filename: (req, file, callback) => {
        
        const suffix = req.body.suffix ? `-${req.body.suffix}` : '';
        logger.info('Suffix received:', suffix); // Debugging line
        const fileExtension = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, fileExtension);
        const uniqueFilename = `${Date.now()}-${baseName}${suffix}${fileExtension}`;
        callback(null, uniqueFilename);
    },
});

const uploader = multer({
    storage,
    onError: (err, next) => {
        logger.error('Multer Error:', err);
        next(err);
    }
}).fields([
    { name: 'profile' },
    { name: 'products' },
    { name: 'documents' }
]);

export default uploader;