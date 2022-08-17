import { celebrate, Joi } from 'celebrate';
import AppError from '../error/AppError';
import ProductLine from '../../models/productLine.model';

const productLineCodeSchema = {
  productLine: Joi.string().required(),
};

const productLineSchema = {
  textDescription: Joi.string().min(5).max(50).allow(null),
  htmlDescription: Joi.string().min(3).max(50).allow(null),
  image: Joi.string().min(3).max(50).allow(null),
};

const paramProductLineSchema = {
  productLine: Joi.string().optional(),
  textDescription: Joi.string().min(5).max(50).allow(null).optional(),
  htmlDescription: Joi.string().min(3).max(50).allow(null).optional(),
  image: Joi.string().min(3).max(50).allow(null).optional(),
};

const productLineFullSchema = {
  productLine: Joi.string().required(),
  textDescription: Joi.string().min(5).max(50).allow(null),
  htmlDescription: Joi.string().min(3).max(50).allow(null),
  image: Joi.string().min(3).max(50).allow(null),
};

const checkInput = celebrate(
  {
    params: Joi.object().keys(),
    query: Joi.object().keys(),
    body: Joi.object().keys(productLineSchema),
  },
  {
    abortEarly: false,
    convert: false,
    presence: 'required',
    escapeHtml: true,
  },
);

const checkIdInput = celebrate(
  {
    params: Joi.object().keys(productLineCodeSchema),
    query: Joi.object().keys(),
    body: Joi.object().keys(),
  },
  {
    abortEarly: false,
    convert: false,
    presence: 'required',
    escapeHtml: true,
  },
);

const checkIdInputBody = celebrate(
  {
    params: Joi.object().keys(),
    query: Joi.object().keys(),
    body: Joi.object().keys(productLineFullSchema),
  },
  {
    abortEarly: false,
    convert: false,
    presence: 'required',
    escapeHtml: true,
  },
);

const checkQuery = celebrate(
  {
    params: Joi.object().keys(),
    query: Joi.object().keys(paramProductLineSchema),
    body: Joi.object().keys(),
  },
  {
    abortEarly: false,
    convert: false,
    presence: 'required',
    escapeHtml: true,
  },
);

const checkDupProductLine = async (req, res, next) => {
  try {
    const { productLine } = req.body;
    const productLineCheck = await ProductLine.query().where({ productLine });

    if (!productLineCheck.length) {
      return next();
    }

    throw new AppError('ProductLine already exists', 400);
  } catch (error) {
    throw new AppError(
      error.message
        ? error.message
        : `ERROR @Product.Duplicate: Internal Server Error`,
      error.statusCode || 500,
    );
  }
};

export {
  checkInput,
  checkIdInput,
  checkQuery,
  checkDupProductLine,
  checkIdInputBody,
};
