import { DocumentValidationService } from './document-validation-service.js';

export const documentValidationService = new DocumentValidationService();

export { parseAndNormalizeModelResponse, documentAnalysisSchema, validationResultSchema } from './document-validation-service.js';

