import { celebrate, Joi } from 'celebrate';
import Product from '../../models/product.model';
import AppError from '../error/AppError';

const productCodeSchema = {
  productCode: Joi.string().min(5).max(50).required(),
};

const productSchema = {
  productCode: Joi.string().min(5).max(50).required(),
  productName: Joi.string().min(5).max(50).required(),
  productLine: Joi.string().required(),
  productScale: Joi.string().required(),
  productVendor: Joi.string().required(),
  productDescription: Joi.string().required(),
  quantityInStock: Joi.number().required(),
  buyPrice: Joi.string().required(),
  MSRP: Joi.string().required(),
};

const productSchemaQuery = {
  productCode: Joi.string().min(5).max(50).optional(),
  productName: Joi.string().min(5).max(50).optional(),
  productLine: Joi.string().optional(),
  productScale: Joi.string().optional(),
  productVendor: Joi.string().optional(),
  productDescription: Joi.string().optional(),
  quantityInStock: Joi.number().optional(),
  buyPrice: Joi.string().optional(),
  MSRP: Joi.string().optional(),
};

const productWithNoCodeSchema = {
  productName: Joi.string().min(5).max(50).required(),
  productLine: Joi.string().required(),
  productScale: Joi.string().required(),
  productVendor: Joi.string().required(),
  productDescription: Joi.string().required(),
  quantityInStock: Joi.number().required(),
  buyPrice: Joi.string().required(),
  MSRP: Joi.string().required(),
};

const checkInput = celebrate(
  {
    params: Joi.object().keys(),
    query: Joi.object().keys(),
    body: Joi.object().keys(productSchema),
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
    params: Joi.object().keys(productCodeSchema),
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

const checkQuery = celebrate(
  {
    params: Joi.object().keys(),
    query: Joi.object().keys(productSchemaQuery),
    body: Joi.object().keys(),
  },
  {
    abortEarly: false,
    convert: false,
    presence: 'required',
    escapeHtml: true,
  },
);

const checkNoCode = celebrate(
  {
    params: Joi.object().keys(),
    query: Joi.object().keys(),
    body: Joi.object().keys(productWithNoCodeSchema),
  },
  {
    abortEarly: false,
    convert: false,
    presence: 'required',
    escapeHtml: true,
  },
);

const checkDupProduct = async (req, res, next) => {
  try {
    const { productCode } = req.body;
    const productCheck = await Product.query().where({ productCode });
    if (productCheck.length) {
      throw new AppError('Product already exists', 400);
    }

    return next();
  } catch (error) {
    throw new AppError(
      error.message
        ? error.message
        : `ERROR @Product.Duplicate: Internal Server Error`,
      error.statusCode || 500,
    );
  }
};

export { checkIdInput, checkInput, checkDupProduct, checkQuery, checkNoCode };
