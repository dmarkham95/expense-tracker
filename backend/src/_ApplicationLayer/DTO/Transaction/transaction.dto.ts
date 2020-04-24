import * as Joi from 'joi';
import { APIErrors } from '_Common/Exceptions/api.exceptions';

export class TransactionDto {

  id: string;
  amount: number;
  description: string;
  userId: string;

}


export const createTransactionDtoSchema = Joi.object().keys({
  amount: Joi.number()
      .required()
      .error(new APIErrors.JoiValidationError('Unknown amount')),
      description: Joi.string()
      .trim()
      .required()
      .error(new APIErrors.JoiValidationError('Unknown description')),
      userId: Joi.string()
      .trim()
      .required()
      .error(new APIErrors.JoiValidationError('Unknown userId')),
  });

  export const updateTransactionDtoSchema = Joi.object().keys({
    principleId: Joi.string()
    .trim()
    .required()
      .optional()
      .error(new APIErrors.JoiValidationError('TransactionId is a requried field')),
      Transaction: Joi.string()
      .trim()
      .required()
      .error(new APIErrors.JoiValidationError('Transaction is a requried field')),
      unitId: Joi.string()
      .trim()
      .required()
      .error(new APIErrors.JoiValidationError('UnitId is a requried field')),
    updatedBy: Joi.string()
      .trim()
      .required()
      .error(new APIErrors.JoiValidationError('UpdatedBy is a requried field')),
  });

  export const deleteTransactionDtoSchema = Joi.object().keys({
    id: Joi.string()
    .trim()
    .required()
      .optional()
      .error(new APIErrors.JoiValidationError('Unknown id')),
    amount: Joi.number()
        .required()
        .error(new APIErrors.JoiValidationError('Unknown amount')),
        description: Joi.string()
        .trim()
        .required()
        .error(new APIErrors.JoiValidationError('Unknown description')),
        userId: Joi.string()
        .trim()
        .required()
        .error(new APIErrors.JoiValidationError('Unknown userId')),
    });

