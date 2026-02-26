import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { config } from '../config.js';

const dir = config.uploadDir;
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.bin';
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`;
    cb(null, name);
  },
});

const allowedMimes = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'application/pdf',
];

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (allowedMimes.includes(file.mimetype)) return cb(null, true);
    cb(new Error('Tipo de arquivo não permitido'));
  },
});

export const uploadFields = upload.fields([
  { name: 'document_front', maxCount: 1 },
  { name: 'document_back', maxCount: 1 },
  { name: 'energy_bill', maxCount: 1 },
  { name: 'payment_proof', maxCount: 1 },
]);
