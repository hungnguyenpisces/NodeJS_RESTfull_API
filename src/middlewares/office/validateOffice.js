import { celebrate, Joi } from 'celebrate';
import Office from '../../models/office.model';
import AppError from '../error/AppError';

const officeQueryOrUpdateSchema = {
  officeCode: Joi.string().max(10).optional(),
  city: Joi.string().max(50).optional(),
  phone: Joi.string().max(50).optional(),
  addressLine1: Joi.string().max(50).optional(),
  addressLine2: Joi.string().max(50).allow(null).optional(),
  state: Joi.string().max(50).allow(null).optional(),
  country: Joi.string().max(50).optional(),
  postalCode: Joi.string().max(15).optional(),
  territory: Joi.string().max(10).optional(),
};

const createOfficeValidate = celebrate(
  {
    body: Joi.object().keys({
      officeCode: Joi.string().max(10).required(),
      city: Joi.string().max(50).required(),
      phone: Joi.string().max(50).required(),
      addressLine1: Joi.string().max(50).required(),
      addressLine2: Joi.string().max(50).allow(null),
      state: Joi.string().max(50).allow(null),
      country: Joi.string().max(50).required(),
      postalCode: Joi.string().max(15).required(),
      territory: Joi.string().max(10).required(),
    }),
  },
  {
    abortEarly: false,
    convert: true,
    presence: 'required',
    escapeHtml: true,
  },
);

const updateOrParamOfficeValidate = celebrate(
  {
    params: Joi.object().keys({
      officeCode: Joi.string().required().max(10),
    }),
    body: Joi.object().keys(officeQueryOrUpdateSchema),
  },
  {
    abortEarly: false,
    convert: true,
    presence: 'required',
    escapeHtml: true,
  },
);

const queryOfficeValidate = celebrate(
  {
    query: Joi.object().keys(officeQueryOrUpdateSchema),
  },
  {
    abortEarly: false,
    convert: true,
    presence: 'required',
    escapeHtml: true,
  },
);

const checkDuplicateOffice = async (req, res, next) => {
  try {
    const { officeCode } = req.body;
    const office = await Office.query().findById(officeCode);
    if (office) {
      throw new AppError('officeCode is already exist', 400);
    }

    return next();
  } catch (error) {
    throw new AppError(
      error.message
        ? error.message
        : `ERROR @Office.Duplicate: Internal Server Error`,
      error.statusCode ? error.statusCode : 500,
    );
  }
};

export {
  createOfficeValidate,
  updateOrParamOfficeValidate,
  queryOfficeValidate,
  checkDuplicateOffice,
};
