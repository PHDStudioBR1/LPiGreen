import multer from 'multer';

const allowedMimes = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'application/pdf',
];

// Armazenamento em memória: arquivos vêm como Buffer para conversão em base64 e gravação no banco
const storage = multer.memoryStorage();

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
